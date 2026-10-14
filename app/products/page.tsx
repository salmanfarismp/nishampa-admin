"use client";

import React, { useState, useMemo } from "react";
import { ProductItem, ProductCategory, SortOption, FilterState } from "@/components/products/types";
import { INITIAL_PRODUCTS } from "@/components/products/mockData";
import { ProductSearchBar } from "@/components/products/ProductSearchBar";
import { CategoryFilterPills } from "@/components/products/CategoryFilterPills";
import { ProductSummaryRow } from "@/components/products/ProductSummaryRow";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFloatingAction } from "@/components/products/ProductFloatingAction";
import { ProductActionSheet } from "@/components/products/ProductActionSheet";
import { ProductFilterDrawer } from "@/components/products/ProductFilterDrawer";
import { NewProductDrawer } from "@/components/products/NewProductDrawer";

export default function ProductsScreen() {
  // Catalog State
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
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

  // Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // 1. Category Filter
        if (selectedCategory !== "all" && p.category !== selectedCategory) {
          return false;
        }

        // 2. Status Filter (is_active boolean)
        if (filterState.status === "active" && !p.is_active) return false;
        if (filterState.status === "draft" && p.is_active) return false;

        // 3. Max Price Filter
        if (filterState.maxPrice !== undefined && p.price > filterState.maxPrice) {
          return false;
        }

        // 4. Search Filter (Title, SKU, Barcode)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchBarcode = p.barcode ? p.barcode.includes(q) : false;
          if (!matchTitle && !matchSku && !matchBarcode) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (currentSort) {
          case "price_asc":
            return a.price - b.price;
          case "price_desc":
            return b.price - a.price;
          case "stock_asc":
            return a.stockCount - b.stockCount;
          case "newest":
          default:
            return 0; // retain exact curated catalog order matching screen.png
        }
      });
  }, [products, selectedCategory, filterState, searchQuery, currentSort]);

  // Handlers for Product Actions
  const handleEditProduct = (prod: ProductItem) => {
    setSelectedProduct(prod);
    setIsActionSheetOpen(true);
  };

  const handleMoreProduct = (prod: ProductItem) => {
    setSelectedProduct(prod);
    setIsActionSheetOpen(true);
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, stockCount: newStock } : item
      )
    );
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct((prev) => (prev ? { ...prev, stockCount: newStock } : null));
    }
  };

  const handleToggleStatus = (productId: string) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, is_active: !item.is_active } : item
      )
    );
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct((prev) =>
        prev ? { ...prev, is_active: !prev.is_active } : null
      );
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== productId));
    setSelectedProduct(null);
  };

  const handleDuplicateProduct = (prod: ProductItem) => {
    const cloned: ProductItem = {
      ...prod,
      id: `prod-${Date.now()}`,
      sku: `${prod.sku}-COPY`,
      title: `${prod.title} (Copy)`,
      is_active: false, // cloned items default to draft
    };
    setProducts((prev) => [cloned, ...prev]);
  };

  const handleAddProduct = (newProd: ProductItem) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  // Active filter badge counter
  const activeFilterCount =
    (filterState.status !== "all" ? 1 : 0) +
    (filterState.maxPrice !== undefined ? 1 : 0);

  return (
    <div className="flex flex-col w-full pb-16">
      {/* 1. Search Bar with Barcode Icon & Filter Trigger */}
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
      />

      {/* 3. Catalog Products Count & Sort Header */}
      <ProductSummaryRow
        count={filteredProducts.length}
        currentSort={currentSort}
        onSortChange={setCurrentSort}
      />

      {/* 4. Product Cards List */}
      <div className="flex flex-col gap-2.5" id="product-list">
        {filteredProducts.length > 0 ? (
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
        onUpdateStock={handleUpdateStock}
        onToggleStatus={handleToggleStatus}
        onDeleteProduct={handleDeleteProduct}
        onDuplicateProduct={handleDuplicateProduct}
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
      />
    </div>
  );
}
