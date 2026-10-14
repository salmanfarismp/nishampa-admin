import { createClient } from "@/utils/supabase/client";
import { ProductJoined, ProductCategoryRow, ProductRow } from "@/types/database";
import { ProductItem } from "@/components/products/types";
import { mapProductJoinedToItem, mapCategoryRowToOption, AdminCategoryOption } from "./mappers";

const supabase = createClient();

export async function getProducts(): Promise<ProductItem[]> {
  const { data, error } = await supabase
    .from("Product")
    .select(`
      *,
      ProductCategory(*),
      ProductImage(*),
      ProductColor(*, Color(*))
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }

  const rows = (data as unknown as ProductJoined[]) || [];
  return rows.map(mapProductJoinedToItem);
}

export async function getCategories(): Promise<AdminCategoryOption[]> {
  const { data, error } = await supabase
    .from("ProductCategory")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }

  const rows = (data as unknown as ProductCategoryRow[]) || [];
  return rows.map(mapCategoryRowToOption);
}

export async function updateProductStatus(
  productId: string,
  isActive: boolean
): Promise<boolean> {
  const { error } = await supabase
    .from("Product")
    .update({ is_active: isActive })
    .eq("id", productId);

  if (error) {
    console.error(`Failed to update product (${productId}) status:`, error);
    throw error;
  }

  return true;
}

export async function deleteProduct(productId: string): Promise<boolean> {
  const { error } = await supabase
    .from("Product")
    .delete()
    .eq("id", productId);

  if (error) {
    console.error(`Failed to delete product (${productId}):`, error);
    throw error;
  }

  return true;
}

export interface CreateProductInput {
  name: string;
  price: number;
  categoryId?: number | null;
  isActive?: boolean;
  slug?: string;
  sku?: string;
  description?: string;
}

export async function createProduct(input: CreateProductInput): Promise<ProductItem> {
  const generatedSlug =
    input.slug?.trim() ||
    input.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
      "-" +
      Math.floor(1000 + Math.random() * 9000);

  const newRow: Partial<ProductRow> = {
    name: input.name,
    price: input.price,
    category: input.categoryId ?? null,
    is_active: input.isActive ?? true,
    slug: generatedSlug,
    description: input.description || null,
    ref_id: input.sku || null,
  };

  const { data, error } = await supabase
    .from("Product")
    .insert([newRow])
    .select(`
      *,
      ProductCategory(*),
      ProductImage(*),
      ProductColor(*, Color(*))
    `)
    .single();

  if (error) {
    console.error("Failed to create product:", error);
    throw error;
  }

  return mapProductJoinedToItem(data as unknown as ProductJoined);
}
