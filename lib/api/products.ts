import { createClient } from "@/utils/supabase/client";
import { ProductJoined, ProductCategoryRow, ColorRow, ProductBadge } from "@/types/database";
import { ProductItem } from "@/components/products/types";
import { mapProductJoinedToItem, mapCategoryRowToOption, AdminCategoryOption } from "./mappers";
import { optimizeImage } from "@/lib/utils/imageOptimizer";

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

export async function getColors(): Promise<ColorRow[]> {
  const { data, error } = await supabase
    .from("Color")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch colors:", error);
    return [];
  }

  return (data as ColorRow[]) || [];
}

export async function uploadProductImageFile(
  file: File,
  productId: string,
  prefix: string
): Promise<string> {
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "production";
  
  // 1. Optimize image (1080px max-width, 0.8 quality WebP/JPEG) inspired by nearbyshops-app
  let fileToUpload = file;
  try {
    fileToUpload = await optimizeImage(file, { maxWidth: 1080, quality: 0.8 });
  } catch (optErr) {
    console.warn("Image optimization fallback to original:", optErr);
  }

  const fileExt = fileToUpload.name.split(".").pop()?.toLowerCase() || "webp";
  const safeName = fileToUpload.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 30);
  const filePath = `products/${productId}/${prefix}_${Date.now()}_${safeName}.${fileExt}`;

  // 2. Upload with 1-year immutable edge caching (cacheControl: "31536000")
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, fileToUpload, {
      cacheControl: "31536000",
      upsert: true,
      contentType: fileToUpload.type || undefined,
    });

  if (error) {
    console.error(`Failed to upload ${filePath}:`, error);
    throw error;
  }

  return filePath;
}

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
  images?: File[]; // Ordered list of up to 5 images (index 0 = Hero)
  heroImage?: File | null;
  galleryImages?: (File | null)[];
}

export async function createProduct(input: CreateProductInput): Promise<ProductItem> {
  // 1. Insert product row (slug is generated in backend automatically)
  const newRow: Record<string, unknown> = {
    name: input.name,
    subtitle: input.subtitle?.trim() || null,
    description: input.description?.trim() || null,
    price: input.price,
    original_price: input.originalPrice ?? null,
    category: input.categoryId ?? null,
    badge: input.badge || null,
    has_hanging_kit: input.hasHangingKit ?? false,
    is_active: input.isActive ?? true,
  };

  if (input.sku?.trim()) {
    newRow.ref_id = input.sku.trim();
  }

  const { data: insertedProduct, error: insertError } = await supabase
    .from("Product")
    .insert([newRow])
    .select("id, name")
    .single();

  if (insertError || !insertedProduct) {
    console.error("Failed to create product:", insertError);
    throw insertError || new Error("Failed to insert product record");
  }

  const productId = insertedProduct.id;

  // 2. Upload Product Images (Sequential list or fallback to hero/gallery fields)
  try {
    const imagesToUpload = input.images && input.images.length > 0
      ? input.images
      : [input.heroImage, ...(input.galleryImages || [])].filter((f): f is File => Boolean(f));

    if (imagesToUpload.length > 0) {
      const uploadPromises = imagesToUpload.map(async (file, index) => {
        const isPrimary = index === 0;
        const prefix = isPrimary ? "hero" : `gallery_${index}`;
        const imagePath = await uploadProductImageFile(file, productId, prefix);

        return {
          product_id: productId,
          img_url: imagePath,
          alt: isPrimary ? input.name : `${input.name} view ${index}`,
          display_order: index,
          is_primary: isPrimary,
        };
      });

      const productImagesToInsert = await Promise.all(uploadPromises);
      await supabase.from("ProductImage").insert(productImagesToInsert);
    }

    // 3. Associate Colors if selected
    if (input.colorIds && input.colorIds.length > 0) {
      const colorRows = input.colorIds.map((colorId) => ({
        product_id: productId,
        color_id: colorId,
      }));
      await supabase.from("ProductColor").insert(colorRows);
    }
  } catch (secondaryError) {
    console.error("Warning: secondary asset upload failed:", secondaryError);
  }

  // 5. Query and return the full product with all joins
  const { data: fullProduct, error: fetchError } = await supabase
    .from("Product")
    .select(`
      *,
      ProductCategory(*),
      ProductImage(*),
      ProductColor(*, Color(*))
    `)
    .eq("id", productId)
    .single();

  if (fetchError || !fullProduct) {
    console.error("Failed to fetch created product:", fetchError);
    throw fetchError || new Error("Failed to reload created product");
  }

  return mapProductJoinedToItem(fullProduct as unknown as ProductJoined);
}
