"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/utils/supabase/admin";
import { assertAdmin } from "@/lib/auth/assertAdmin";
import {
  ProductJoined,
  ProductCategoryRow,
  ColorRow,
  ProductBadge,
} from "@/types/database";
import { ProductItem } from "@/components/products/types";
import {
  mapProductJoinedToItem,
  mapCategoryRowToOption,
  AdminCategoryOption,
} from "@/lib/api/mappers";

/**
 * Server Action: Fetches all products (both active and inactive) for admin management.
 * Strictly guarded by assertAdmin() and runs with createAdminClient() to bypass RLS.
 */
export async function getAdminProductsAction(): Promise<ProductItem[]> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from("Product")
    .select(`
      *,
      ProductCategory(*),
      ProductImage(*),
      ProductColor(*, Color(*))
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch admin products:", error);
    throw new Error(`Failed to fetch catalog: ${error.message}`);
  }

  const rows = (data as unknown as ProductJoined[]) || [];
  return rows.map(mapProductJoinedToItem);
}

/**
 * Server Action: Fetches category options for administrative assignment.
 */
export async function getAdminCategoriesAction(): Promise<AdminCategoryOption[]> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
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

/**
 * Server Action: Fetches master color list for product variant tagging.
 */
export async function getAdminColorsAction(): Promise<ColorRow[]> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from("Color")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch colors:", error);
    return [];
  }

  return (data as ColorRow[]) || [];
}

/**
 * Server Action: Toggles product visibility / active status.
 */
export async function updateProductStatusAction(
  productId: string,
  isActive: boolean
): Promise<{ success: boolean }> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("Product")
    .update({ is_active: isActive })
    .eq("id", productId);

  if (error) {
    console.error(`Failed to update product (${productId}) status:`, error);
    throw new Error(`Failed to update product status: ${error.message}`);
  }

  revalidatePath("/products");
  return { success: true };
}

/**
 * Server Action: Permanently deletes a product and its associations.
 */
export async function deleteProductAction(
  productId: string
): Promise<{ success: boolean }> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("Product")
    .delete()
    .eq("id", productId);

  if (error) {
    console.error(`Failed to delete product (${productId}):`, error);
    throw new Error(`Failed to delete product: ${error.message}`);
  }

  revalidatePath("/products");
  return { success: true };
}

/**
 * Server Action: Creates a new product, processes storage uploads, and tags colors.
 */
export async function createProductAction(
  formData: FormData
): Promise<ProductItem> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const name = (formData.get("name") as string)?.trim();
  if (!name) {
    throw new Error("Product title is required.");
  }

  const priceStr = formData.get("price") as string;
  const price = parseFloat(priceStr);
  if (isNaN(price)) {
    throw new Error("Valid product price is required.");
  }

  const subtitle = (formData.get("subtitle") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const originalPriceStr = formData.get("originalPrice") as string;
  const originalPrice = originalPriceStr ? parseFloat(originalPriceStr) : null;
  const categoryIdStr = formData.get("categoryId") as string;
  const categoryId = categoryIdStr ? parseInt(categoryIdStr, 10) : null;
  const badge = (formData.get("badge") as ProductBadge) || null;
  const hasHangingKit = formData.get("hasHangingKit") === "true";
  const isActive = formData.get("isActive") !== "false";
  const sku = (formData.get("sku") as string)?.trim() || null;

  const colorIdsJson = formData.get("colorIds") as string;
  let colorIds: number[] = [];
  if (colorIdsJson) {
    try {
      colorIds = JSON.parse(colorIdsJson);
    } catch {
      colorIds = [];
    }
  }

  // 1. Insert product record
  const newRow: Record<string, unknown> = {
    name,
    subtitle,
    description,
    price,
    original_price: originalPrice,
    category: categoryId,
    badge,
    has_hanging_kit: hasHangingKit,
    is_active: isActive,
  };

  if (sku) {
    newRow.ref_id = sku;
  }

  const { data: insertedProduct, error: insertError } = await adminClient
    .from("Product")
    .insert([newRow])
    .select("id, name")
    .single();

  if (insertError || !insertedProduct) {
    console.error("Failed to insert product record:", insertError);
    throw new Error(`Failed to create product record: ${insertError?.message}`);
  }

  const productId = insertedProduct.id;
  const bucket =
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "production";

  // 2. Upload images to Supabase Storage with admin credentials
  try {
    const rawImages = formData.getAll("images");
    const imageFiles: File[] = rawImages.filter(
      (item): item is File =>
        item instanceof File &&
        typeof item.size === "number" &&
        item.size > 0
    );

    if (imageFiles.length > 0) {
      const uploadPromises = imageFiles.map(async (file, index) => {
        const isPrimary = index === 0;
        const prefix = isPrimary ? "hero" : `gallery_${index}`;
        const fileExt =
          file.name.split(".").pop()?.toLowerCase() || "webp";
        const safeName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[^a-zA-Z0-9_-]/g, "_")
          .slice(0, 30);
        const filePath = `products/${productId}/${prefix}_${Date.now()}_${safeName}.${fileExt}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { error: uploadError } = await adminClient.storage
          .from(bucket)
          .upload(filePath, buffer, {
            contentType: file.type || "image/webp",
            cacheControl: "31536000",
            upsert: true,
          });

        if (uploadError) {
          console.error(`Storage upload failed for ${filePath}:`, uploadError);
          return null;
        }

        return {
          product_id: productId,
          img_url: filePath,
          alt: isPrimary ? name : `${name} view ${index}`,
          display_order: index,
          is_primary: isPrimary,
        };
      });

      const uploadedResults = await Promise.all(uploadPromises);
      const productImagesToInsert = uploadedResults.filter(
        (img): img is NonNullable<typeof img> => Boolean(img)
      );

      if (productImagesToInsert.length > 0) {
        const { error: imgInsertError } = await adminClient
          .from("ProductImage")
          .insert(productImagesToInsert);

        if (imgInsertError) {
          console.error("Failed to insert ProductImage records:", imgInsertError);
        }
      }
    }

    // 3. Associate Colors if provided
    if (colorIds.length > 0) {
      const colorRows = colorIds.map((colorId) => ({
        product_id: productId,
        color_id: colorId,
      }));

      const { error: colorInsertError } = await adminClient
        .from("ProductColor")
        .insert(colorRows);

      if (colorInsertError) {
        console.error("Failed to insert ProductColor records:", colorInsertError);
      }
    }
  } catch (secondaryError) {
    console.error("Warning: asset upload or association error:", secondaryError);
  }

  // 4. Query full product with joins for response
  const { data: fullProduct, error: fetchError } = await adminClient
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
    console.error("Failed to reload created product:", fetchError);
    throw new Error("Product was created but failed to reload details.");
  }

  revalidatePath("/products");
  return mapProductJoinedToItem(fullProduct as unknown as ProductJoined);
}

/**
 * Server Action: Updates an existing product, synchronizes colors, and reconciles images.
 */
export async function updateProductAction(
  formData: FormData
): Promise<ProductItem> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const productId = (formData.get("productId") as string)?.trim();
  if (!productId) {
    throw new Error("Product ID is required for update.");
  }

  const name = (formData.get("name") as string)?.trim();
  if (!name) {
    throw new Error("Product title is required.");
  }

  const priceStr = formData.get("price") as string;
  const price = parseFloat(priceStr);
  if (isNaN(price)) {
    throw new Error("Valid product price is required.");
  }

  const subtitle = (formData.get("subtitle") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const originalPriceStr = formData.get("originalPrice") as string;
  const originalPrice = originalPriceStr ? parseFloat(originalPriceStr) : null;
  const categoryIdStr = formData.get("categoryId") as string;
  const categoryId = categoryIdStr ? parseInt(categoryIdStr, 10) : null;
  const badge = (formData.get("badge") as ProductBadge) || null;
  const hasHangingKit = formData.get("hasHangingKit") === "true";
  const isActive = formData.get("isActive") !== "false";

  // Parse color IDs
  const colorIdsJson = formData.get("colorIds") as string;
  let colorIds: number[] = [];
  if (colorIdsJson) {
    try {
      colorIds = JSON.parse(colorIdsJson);
    } catch {
      colorIds = [];
    }
  }

  // Parse image reconciliation arrays
  const keptImagesJson = formData.get("keptImages") as string;
  let keptImages: { id: number; displayOrder: number; isPrimary: boolean }[] = [];
  if (keptImagesJson) {
    try {
      keptImages = JSON.parse(keptImagesJson);
    } catch {
      keptImages = [];
    }
  }

  const deletedImageIdsJson = formData.get("deletedImageIds") as string;
  let deletedImageIds: number[] = [];
  if (deletedImageIdsJson) {
    try {
      deletedImageIds = JSON.parse(deletedImageIdsJson);
    } catch {
      deletedImageIds = [];
    }
  }

  const newImagesOrderJson = formData.get("newImagesOrder") as string;
  let newImagesOrder: { tempIndex: number; displayOrder: number; isPrimary: boolean }[] = [];
  if (newImagesOrderJson) {
    try {
      newImagesOrder = JSON.parse(newImagesOrderJson);
    } catch {
      newImagesOrder = [];
    }
  }

  // 1. Update Product table record
  const updatePayload: Record<string, unknown> = {
    name,
    subtitle,
    description,
    price,
    original_price: originalPrice,
    category: categoryId,
    badge,
    has_hanging_kit: hasHangingKit,
    is_active: isActive,
  };

  const { error: updateError } = await adminClient
    .from("Product")
    .update(updatePayload)
    .eq("id", productId);

  if (updateError) {
    console.error(`Failed to update product (${productId}):`, updateError);
    throw new Error(`Failed to update product: ${updateError.message}`);
  }

  const bucket =
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "production";

  // 2. Synchronize associated Colors
  try {
    await adminClient.from("ProductColor").delete().eq("product_id", productId);

    if (colorIds.length > 0) {
      const colorRows = colorIds.map((cid) => ({
        product_id: productId,
        color_id: cid,
      }));
      const { error: colorInsertError } = await adminClient
        .from("ProductColor")
        .insert(colorRows);

      if (colorInsertError) {
        console.error("Failed to insert updated colors:", colorInsertError);
      }
    }
  } catch (colorErr) {
    console.error("Warning: color association error during product update:", colorErr);
  }

  // 3. Reconcile Images
  try {
    // 3a. Delete removed images from ProductImage table
    if (deletedImageIds.length > 0) {
      const { error: delImgError } = await adminClient
        .from("ProductImage")
        .delete()
        .in("id", deletedImageIds);

      if (delImgError) {
        console.error("Failed to delete old images:", delImgError);
      }
    }

    // 3b. Update display_order and is_primary for kept existing images
    for (const kept of keptImages) {
      const { error: keptUpdateError } = await adminClient
        .from("ProductImage")
        .update({
          display_order: kept.displayOrder,
          is_primary: kept.isPrimary,
        })
        .eq("id", kept.id);

      if (keptUpdateError) {
        console.error(`Failed to update existing image order (${kept.id}):`, keptUpdateError);
      }
    }

    // 3c. Upload new images and insert ProductImage records
    const rawNewImages = formData.getAll("newImages");
    const newImageFiles: File[] = rawNewImages.filter(
      (item): item is File =>
        item instanceof File &&
        typeof item.size === "number" &&
        item.size > 0
    );

    if (newImageFiles.length > 0) {
      const uploadPromises = newImageFiles.map(async (file, idx) => {
        const orderMeta = newImagesOrder[idx] || {
          displayOrder: keptImages.length + idx,
          isPrimary: keptImages.length === 0 && idx === 0,
        };

        const prefix = orderMeta.isPrimary ? "hero" : `gallery_${orderMeta.displayOrder}`;
        const fileExt = file.name.split(".").pop()?.toLowerCase() || "webp";
        const safeName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[^a-zA-Z0-9_-]/g, "_")
          .slice(0, 30);
        const filePath = `products/${productId}/${prefix}_${Date.now()}_${safeName}.${fileExt}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { error: uploadError } = await adminClient.storage
          .from(bucket)
          .upload(filePath, buffer, {
            contentType: file.type || "image/webp",
            cacheControl: "31536000",
            upsert: true,
          });

        if (uploadError) {
          console.error(`Storage upload failed for ${filePath}:`, uploadError);
          return null;
        }

        return {
          product_id: productId,
          img_url: filePath,
          alt: orderMeta.isPrimary ? name : `${name} view ${orderMeta.displayOrder}`,
          display_order: orderMeta.displayOrder,
          is_primary: orderMeta.isPrimary,
        };
      });

      const uploadResults = await Promise.all(uploadPromises);
      const newRecords = uploadResults.filter(
        (img): img is NonNullable<typeof img> => Boolean(img)
      );

      if (newRecords.length > 0) {
        const { error: newImgInsertError } = await adminClient
          .from("ProductImage")
          .insert(newRecords);

        if (newImgInsertError) {
          console.error("Failed to insert new ProductImage records:", newImgInsertError);
        }
      }
    }
  } catch (imageErr) {
    console.error("Warning: image reconciliation error during product update:", imageErr);
  }

  // 4. Fetch full updated product with joins
  const { data: fullProduct, error: fetchError } = await adminClient
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
    console.error("Failed to reload updated product:", fetchError);
    throw new Error("Product was updated but failed to reload details.");
  }

  revalidatePath("/products");
  return mapProductJoinedToItem(fullProduct as unknown as ProductJoined);
}
