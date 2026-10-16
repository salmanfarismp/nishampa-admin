"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ProductItem, ProductCategory, SortOption, FilterState } from "@/components/products/types";
import { ProductSearchBar } from "@/components/products/ProductSearchBar";
import { CategoryFilterPills } from "@/components/products/CategoryFilterPills";
import { ProductSummaryRow } from "@/components/products/ProductSummaryRow";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFloatingAction } from "@/components/products/ProductFloatingAction";
import { ProductActionSheet } from "@/components/products/ProductActionSheet";
import { ProductFilterDrawer } from "@/components/products/ProductFilterDrawer";
import { NewProductDrawer } from "@/components/products/NewProductDrawer";
import { EditProductDrawer } from "@/components/products/EditProductDrawer";
import {
  getProducts,
  getCategories,
  updateProductStatus,
  deleteProduct,
  createProduct,
  updateProduct,
  getColors,
  CreateProductInput,
  UpdateProductInput,
} from "@/lib/api/products";
import { AdminCategoryOption } from "@/lib/api/mappers";
import { ColorRow } from "@/types/database";

export default function ProductsScreen() {
  // Catalog State
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<AdminCategoryOption[]>([]);
  const [colors, setColors] = useState<ColorRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionPending, setIsActionPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("all");
  const [currentSort, setCurrentSort] = useState<SortOption>("newest");
  const [filterState, setFilterState] = useState<FilterState>({
    status: "all",
    category: "all",
  });

  // Modals & Sheets State
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isNewProductDrawerOpen, setIsNewProductDrawerOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductItem | null>(null);
  const [isEditProductDrawerOpen, setIsEditProductDrawerOpen] = useState(false);

  // Fetch initial catalog data from Supabase
  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const [fetchedProducts, fetchedCategories, fetchedColors] = await Promise.all([
          getProducts(),
          getCategories(),
          getColors(),
        ]);
        if (!cancelled) {
          setProducts(fetchedProducts);
          setCategories(fetchedCategories);
          setColors(fetchedColors);
          setIsLoading(false);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          console.error("Error loading products from Supabase:", err);
          setError(
            err instanceof Error
              ? err.message
              : "Unable to connect to Supabase. Please check your network and credentials."
          );
          setIsLoading(false);
        }
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRetry = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedProducts, fetchedCategories, fetchedColors] = await Promise.all([
        getProducts(),
        getCategories(),
        getColors(),
      ]);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
      setColors(fetchedColors);
    } catch (err: unknown) {
      console.error("Error reloading products from Supabase:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to Supabase. Please check your network and credentials."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // 1. Category Filter (by slug or db id)
        if (selectedCategory !== "all") {
          const matchSlug = p.category === selectedCategory;
          const matchId = p.categoryId && String(p.categoryId) === selectedCategory;
          if (!matchSlug && !matchId) return false;
        }

        // 2. Status Filter (is_active boolean)
        if (filterState.status === "active" && !p.is_active) return false;
        if (filterState.status === "draft" && p.is_active) return false;

        // 3. Max Price Filter
        if (filterState.maxPrice !== undefined && p.price > filterState.maxPrice) {
          return false;
        }

        // 4. Search Filter (Title, SKU, Category, Description)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchCat = p.categoryName ? p.categoryName.toLowerCase().includes(q) : false;
          const matchDesc = p.description ? p.description.toLowerCase().includes(q) : false;
          if (!matchTitle && !matchSku && !matchCat && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (currentSort) {
          case "price_asc":
            return a.price - b.price;
          case "price_desc":
            return b.price - a.price;
          case "name_asc":
            return a.title.localeCompare(b.title);
          case "newest":
          default:
            return 0; // retain database ordering (created_at desc)
        }
      });
  }, [products, selectedCategory, filterState, searchQuery, currentSort]);

  // Handlers for Product Actions
  const handleEditProduct = (prod: ProductItem) => {
    setProductToEdit(prod);
    setIsEditProductDrawerOpen(true);
  };

  const handleMoreProduct = (prod: ProductItem) => {
    setSelectedProduct(prod);
    setIsActionSheetOpen(true);
  };

  const handleToggleStatus = async (productId: string) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;

    const nextStatus = !target.is_active;

    // Optimistic update
    setProducts((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, is_active: nextStatus } : item
      )
    );
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct((prev) => (prev ? { ...prev, is_active: nextStatus } : null));
    }

    try {
      setIsActionPending(true);
      await updateProductStatus(productId, nextStatus);
    } catch (err) {
      console.error("Failed to update status in Supabase:", err);
      // Revert optimistic update
      setProducts((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, is_active: target.is_active } : item
        )
      );
      if (selectedProduct && selectedProduct.id === productId) {
        setSelectedProduct(target);
      }
      alert("Failed to update product status. Please try again.");
    } finally {
      setIsActionPending(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const backup = [...products];
    // Optimistic update
    setProducts((prev) => prev.filter((item) => item.id !== productId));
    setSelectedProduct(null);

    try {
      setIsActionPending(true);
      await deleteProduct(productId);
    } catch (err) {
      console.error("Failed to delete product in Supabase:", err);
      // Revert optimistic delete
      setProducts(backup);
      alert("Failed to delete product. Please check database permissions.");
    } finally {
      setIsActionPending(false);
    }
  };

  const handleDuplicateProduct = async (prod: ProductItem) => {
    try {
      setIsActionPending(true);
      const cloned = await createProduct({
        name: `${prod.title} (Copy)`,
        price: prod.price,
        categoryId: prod.categoryId,
        isActive: false, // duplicate as draft
        sku: `${prod.sku}-COPY`,
        description: prod.description,
      });
      setProducts((prev) => [cloned, ...prev]);
    } catch (err) {
      console.error("Failed to clone product in Supabase:", err);
      // Fallback local clone if insert restricted
      const localClone: ProductItem = {
        ...prod,
        id: `local-copy-${Date.now()}`,
        sku: `${prod.sku}-COPY`,
        title: `${prod.title} (Copy)`,
        is_active: false,
      };
      setProducts((prev) => [localClone, ...prev]);
    } finally {
      setIsActionPending(false);
    }
  };

  const handleAddProduct = async (input: CreateProductInput) => {
    try {
      setIsActionPending(true);
      const newProd = await createProduct(input);
      setProducts((prev) => [newProd, ...prev]);
    } catch (err: unknown) {
      console.error("Failed to create product in Supabase:", err);
      const msg = err instanceof Error ? err.message : "Check database permissions or network.";
      alert(`Failed to save product to Supabase: ${msg}`);
    } finally {
      setIsActionPending(false);
    }
  };

  const handleUpdateProduct = async (input: UpdateProductInput) => {
    try {
      setIsActionPending(true);
      const updated = await updateProduct(input);
      setProducts((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      if (selectedProduct && selectedProduct.id === updated.id) {
        setSelectedProduct(updated);
      }
    } catch (err: unknown) {
      console.error("Failed to update product in Supabase:", err);
      const msg = err instanceof Error ? err.message : "Check database permissions or network.";
      alert(`Failed to update product in Supabase: ${msg}`);
    } finally {
      setIsActionPending(false);
    }
  };

  // Active filter badge counter
  const activeFilterCount =
    (filterState.status !== "all" ? 1 : 0) +
    (filterState.maxPrice !== undefined ? 1 : 0);

  return (
    <div className="flex flex-col w-full pb-16">
      {/* 1. Search Bar with Filter Trigger */}
      <ProductSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterClick={() => setIsFilterDrawerOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      {/* 2. Horizontally Scrollable Category Pills */}
      <CategoryFilterPills
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        totalCount={products.length}
        categories={categories}
      />

      {/* 3. Catalog Products Count & Sort Header */}
      <ProductSummaryRow
        count={filteredProducts.length}
        currentSort={currentSort}
        onSortChange={setCurrentSort}
      />

      {/* 4. Product Cards List or Loading Skeletons */}
      <div className="flex flex-col gap-2.5" id="product-list">
        {isLoading ? (
          // Loading Skeletons
          Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest rounded-xl p-3 border border-surface-container flex items-center justify-between animate-pulse"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-14 h-14 rounded-lg bg-surface-container shrink-0" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-3 bg-surface-container rounded w-24" />
                  <div className="h-4 bg-surface-container rounded w-44" />
                  <div className="h-3.5 bg-surface-container rounded w-16" />
                </div>
              </div>
              <div className="w-14 h-8 bg-surface-container rounded-lg shrink-0 ml-2" />
            </div>
          ))
        ) : error ? (
          // Error Display with Retry
          <div className="flex flex-col items-center justify-center p-8 bg-surface-container-lowest rounded-xl border border-[#fecaca] text-center mt-2">
            <div className="w-10 h-10 rounded-full bg-[#fef2f2] text-[#dc2626] flex items-center justify-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-[13px] font-semibold text-text-primary">
              Failed to load catalog
            </p>
            <p className="text-[11px] text-text-secondary mt-1 max-w-xs">
              {error}
            </p>
            <button
              onClick={handleRetry}
              type="button"
              className="mt-3 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-[12px] font-medium active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onEdit={handleEditProduct}
              onMore={handleMoreProduct}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-surface-container-lowest rounded-xl border border-surface-container text-center mt-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-on-surface-variant/40 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-[13px] font-semibold text-on-surface">
              No products found
            </p>
            <p className="text-[11px] text-on-surface-variant mt-0.5">
              Try adjusting your search query or filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setFilterState({ status: "all", category: "all" });
              }}
              type="button"
              className="mt-3 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface text-[11px] font-medium active:scale-95 transition-all cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* 5. Floating Action Button (+ Add Product) */}
      <ProductFloatingAction onAddClick={() => setIsNewProductDrawerOpen(true)} />

      {/* 6. Mobile Bottom Action Sheet */}
      <ProductActionSheet
        product={selectedProduct}
        isOpen={isActionSheetOpen}
        onClose={() => setIsActionSheetOpen(false)}
        onToggleStatus={handleToggleStatus}
        onDeleteProduct={handleDeleteProduct}
        onDuplicateProduct={handleDuplicateProduct}
        onEditProduct={handleEditProduct}
        isUpdating={isActionPending}
      />

      {/* 7. Filter Slide-Up Drawer */}
      <ProductFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        currentFilter={filterState}
        onApplyFilter={setFilterState}
      />

      {/* 8. New Product Creation Drawer */}
      <NewProductDrawer
        isOpen={isNewProductDrawerOpen}
        onClose={() => setIsNewProductDrawerOpen(false)}
        onAddProduct={handleAddProduct}
        categories={categories}
        colors={colors}
        isSubmitting={isActionPending}
      />

      {/* 9. Edit Product Drawer */}
      <EditProductDrawer
        product={productToEdit}
        isOpen={isEditProductDrawerOpen}
        onClose={() => {
          setIsEditProductDrawerOpen(false);
          setProductToEdit(null);
        }}
        onUpdateProduct={handleUpdateProduct}
        categories={categories}
        colors={colors}
        isSubmitting={isActionPending}
      />
    </div>
  );
}
