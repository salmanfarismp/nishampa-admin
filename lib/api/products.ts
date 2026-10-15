import {
  getAdminProductsAction,
  getAdminCategoriesAction,
  getAdminColorsAction,
  updateProductStatusAction,
  deleteProductAction,
  createProductAction,
} from "@/app/actions/products";
import { ProductItem } from "@/components/products/types";
import { AdminCategoryOption } from "./mappers";
import { ColorRow, ProductBadge } from "@/types/database";
import { optimizeImage } from "@/lib/utils/imageOptimizer";

export interface CreateProductInput {
  name: string;
  subtitle?: string;
  description?: string;
  price: number;
  originalPrice?: number | null;
  categoryId?: number | null;
  badge?: ProductBadge;
  hasHangingKit?: boolean;
  isActive?: boolean;
  sku?: string;
  colorIds?: number[];
  images?: File[];
  heroImage?: File | null;
  galleryImages?: (File | null)[];
}

/**
 * Fetch all products for admin management via secure Server Action.
 */
export async function getProducts(): Promise<ProductItem[]> {
  return await getAdminProductsAction();
}

/**
 * Fetch all categories for admin assignment via secure Server Action.
 */
export async function getCategories(): Promise<AdminCategoryOption[]> {
  return await getAdminCategoriesAction();
}

/**
 * Fetch all colors for admin assignment via secure Server Action.
 */
export async function getColors(): Promise<ColorRow[]> {
  return await getAdminColorsAction();
}

/**
 * Update product status via secure Server Action with service role privileges.
 */
export async function updateProductStatus(
  productId: string,
  isActive: boolean
): Promise<boolean> {
  const result = await updateProductStatusAction(productId, isActive);
  return result.success;
}

/**
 * Permanently delete a product via secure Server Action with service role privileges.
 */
export async function deleteProduct(productId: string): Promise<boolean> {
  const result = await deleteProductAction(productId);
  return result.success;
}

/**
 * Create a new product:
 * 1. Optimizes images client-side (1080px WebP) to save bandwidth.
 * 2. Bundles data and media assets into FormData.
 * 3. Submits via secure Server Action (app/actions/products.ts) using Service Role Key.
 */
export async function createProduct(
  input: CreateProductInput
): Promise<ProductItem> {
  const formData = new FormData();

  formData.append("name", input.name);
  if (input.subtitle) formData.append("subtitle", input.subtitle);
  if (input.description) formData.append("description", input.description);
  formData.append("price", String(input.price));
  if (input.originalPrice !== undefined && input.originalPrice !== null) {
    formData.append("originalPrice", String(input.originalPrice));
  }
  if (input.categoryId !== undefined && input.categoryId !== null) {
    formData.append("categoryId", String(input.categoryId));
  }
  if (input.badge) formData.append("badge", input.badge);
  formData.append("hasHangingKit", String(Boolean(input.hasHangingKit)));
  formData.append("isActive", String(input.isActive ?? true));
  if (input.sku) formData.append("sku", input.sku);

  if (input.colorIds && input.colorIds.length > 0) {
    formData.append("colorIds", JSON.stringify(input.colorIds));
  }

  // Aggregate images
  const rawImages =
    input.images && input.images.length > 0
      ? input.images
      : [input.heroImage, ...(input.galleryImages || [])].filter(
          (f): f is File => Boolean(f)
        );

  // Client-side image optimization before transport
  for (const rawFile of rawImages) {
    let optimized = rawFile;
    try {
      optimized = await optimizeImage(rawFile, {
        maxWidth: 1080,
        quality: 0.8,
      });
    } catch (e) {
      console.warn("Client image optimization failed, using original:", e);
    }
    formData.append("images", optimized);
  }

  return await createProductAction(formData);
}
