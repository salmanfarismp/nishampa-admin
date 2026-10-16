"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/utils/supabase/admin";
import { assertAdmin } from "@/lib/auth/assertAdmin";
import { LifeStyleImageRow } from "@/types/database";

/**
 * Server Action: Fetches all lifestyle images from public."LifeStyleImage"
 * Strictly guarded by assertAdmin() and runs with createAdminClient() to bypass RLS.
 */
export async function getLifeStyleImagesAction(): Promise<LifeStyleImageRow[]> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from("LifeStyleImage")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch LifeStyleImage records:", error);
    throw new Error(`Failed to fetch lifestyle images: ${error.message}`);
  }

  return (data as unknown as LifeStyleImageRow[]) || [];
}

/**
 * Server Action: Uploads an image file to Supabase storage ("production" bucket, "lifestyle/" prefix)
 * and creates a corresponding record in public."LifeStyleImage".
 */
export async function uploadLifeStyleImageAction(
  formData: FormData
): Promise<LifeStyleImageRow> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No valid image file provided.");
  }

  const bucket =
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "production";

  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpeg";
  const safeName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 30);
  const filePath = `lifestyle/${Date.now()}_${safeName}.${fileExt}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await adminClient.storage
    .from(bucket)
    .upload(filePath, buffer, {
      contentType: file.type || "image/jpeg",
      cacheControl: "31536000",
      upsert: true,
    });

  if (uploadError) {
    console.error("Storage upload failed for lifestyle image:", uploadError);
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  // Insert into LifeStyleImage table
  const { data: inserted, error: insertError } = await adminClient
    .from("LifeStyleImage")
    .insert({ img_url: filePath })
    .select()
    .single();

  if (insertError) {
    console.error("Failed to insert LifeStyleImage record:", insertError);
    // Cleanup uploaded storage file if DB insert fails
    await adminClient.storage.from(bucket).remove([filePath]);
    throw new Error(`Database insert failed: ${insertError.message}`);
  }

  revalidatePath("/content");
  return inserted as LifeStyleImageRow;
}

/**
 * Server Action: Deletes a lifestyle image record and removes its storage file.
 */
export async function deleteLifeStyleImageAction(
  id: number,
  storagePath?: string | null
): Promise<void> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("LifeStyleImage")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Failed to delete LifeStyleImage (${id}):`, error);
    throw new Error(`Failed to delete lifestyle image: ${error.message}`);
  }

  // Optionally clean up storage object if relative path
  if (storagePath && !storagePath.startsWith("http://") && !storagePath.startsWith("https://")) {
    const bucket =
      process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "production";
    const cleanPath = storagePath.startsWith("/") ? storagePath.slice(1) : storagePath;
    try {
      await adminClient.storage.from(bucket).remove([cleanPath]);
    } catch (storageErr) {
      console.warn("Storage cleanup warning:", storageErr);
    }
  }

  revalidatePath("/content");
}

/**
 * Server Action: Bulk deletes multiple lifestyle image records by ID.
 */
export async function deleteLifeStyleImagesAction(
  ids: number[]
): Promise<void> {
  if (ids.length === 0) return;

  await assertAdmin();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("LifeStyleImage")
    .delete()
    .in("id", ids);

  if (error) {
    console.error("Failed to bulk delete LifeStyleImage records:", error);
    throw new Error(`Failed to delete lifestyle images: ${error.message}`);
  }

  revalidatePath("/content");
}
