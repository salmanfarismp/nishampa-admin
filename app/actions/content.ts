"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/utils/supabase/admin";
import { assertAdmin } from "@/lib/auth/assertAdmin";
import { GalleryRow, FaqRow, ServiceReviewRow } from "@/types/database";

/**
 * Server Action: Fetches all gallery records from public."Gallery"
 * Strictly guarded by assertAdmin() and runs with createAdminClient() to bypass RLS.
 */
export async function getGalleryItemsAction(): Promise<GalleryRow[]> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from("Gallery")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch Gallery records:", error);
    throw new Error(`Failed to fetch gallery records: ${error.message}`);
  }

  return (data as unknown as GalleryRow[]) || [];
}

/** Legacy alias for backwards compatibility */
export const getLifeStyleImagesAction = getGalleryItemsAction;

/**
 * Server Action: Uploads an image file to Supabase storage ("production" bucket, "gallery/" prefix)
 * and creates a corresponding record in public."Gallery".
 */
export async function uploadGalleryItemAction(
  formData: FormData
): Promise<GalleryRow> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No valid image file provided.");
  }

  const tag = (formData.get("tag") as string)?.trim() || null;
  const title = (formData.get("title") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;

  const bucket =
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "prod";

  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpeg";
  const safeName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 30);
  const filePath = `gallery/${Date.now()}_${safeName}.${fileExt}`;

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
    console.error("Storage upload failed for gallery item:", uploadError);
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  // Insert into Gallery table
  const { data: inserted, error: insertError } = await adminClient
    .from("Gallery")
    .insert({
      img_url: filePath,
      tag,
      title,
      description,
    })
    .select()
    .single();

  if (insertError) {
    console.error("Failed to insert Gallery record:", insertError);
    // Cleanup uploaded storage file if DB insert fails
    await adminClient.storage.from(bucket).remove([filePath]);
    throw new Error(`Database insert failed: ${insertError.message}`);
  }

  revalidatePath("/content");
  return inserted as GalleryRow;
}

/** Legacy alias for backwards compatibility */
export const uploadLifeStyleImageAction = uploadGalleryItemAction;

/**
 * Server Action: Updates text metadata (tag, title, description) of a gallery record in public."Gallery".
 */
export async function updateGalleryItemAction(
  id: number,
  data: {
    tag?: string | null;
    title?: string | null;
    description?: string | null;
  }
): Promise<GalleryRow> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const updatePayload: Record<string, unknown> = {};
  if (data.tag !== undefined) updatePayload.tag = data.tag?.trim() || null;
  if (data.title !== undefined) updatePayload.title = data.title?.trim() || null;
  if (data.description !== undefined) updatePayload.description = data.description?.trim() || null;

  const { data: updated, error } = await adminClient
    .from("Gallery")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Failed to update Gallery (${id}):`, error);
    throw new Error(`Failed to update gallery record: ${error.message}`);
  }

  revalidatePath("/content");
  return updated as GalleryRow;
}

/**
 * Server Action: Deletes a gallery record and removes its storage file.
 */
export async function deleteGalleryItemAction(
  id: number,
  storagePath?: string | null
): Promise<void> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("Gallery")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Failed to delete Gallery (${id}):`, error);
    throw new Error(`Failed to delete gallery record: ${error.message}`);
  }

  // Optionally clean up storage object if relative path
  if (storagePath && !storagePath.startsWith("http://") && !storagePath.startsWith("https://")) {
    const bucket =
      process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "prod";
    const cleanPath = storagePath.startsWith("/") ? storagePath.slice(1) : storagePath;
    try {
      await adminClient.storage.from(bucket).remove([cleanPath]);
    } catch (storageErr) {
      console.warn("Storage cleanup warning:", storageErr);
    }
  }

  revalidatePath("/content");
}

/** Legacy alias for backwards compatibility */
export const deleteLifeStyleImageAction = deleteGalleryItemAction;

/**
 * Server Action: Bulk deletes multiple gallery records by ID and removes storage files.
 */
export async function deleteGalleryItemsAction(
  ids: number[]
): Promise<void> {
  if (ids.length === 0) return;

  await assertAdmin();
  const adminClient = createAdminClient();

  // Retrieve storage file paths before deleting records
  const { data: rowsToDelete } = await adminClient
    .from("Gallery")
    .select("img_url")
    .in("id", ids);

  const { error } = await adminClient
    .from("Gallery")
    .delete()
    .in("id", ids);

  if (error) {
    console.error("Failed to bulk delete Gallery records:", error);
    throw new Error(`Failed to delete gallery records: ${error.message}`);
  }

  // Cleanup storage objects
  if (rowsToDelete && rowsToDelete.length > 0) {
    const bucket =
      process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "prod";
    const cleanPaths = rowsToDelete
      .map((r) => r.img_url)
      .filter((p): p is string => Boolean(p && !p.startsWith("http://") && !p.startsWith("https://")))
      .map((p) => (p.startsWith("/") ? p.slice(1) : p));

    if (cleanPaths.length > 0) {
      try {
        await adminClient.storage.from(bucket).remove(cleanPaths);
      } catch (storageErr) {
        console.warn("Bulk storage cleanup warning:", storageErr);
      }
    }
  }

  revalidatePath("/content");
}

/** Legacy alias for backwards compatibility */
export const deleteLifeStyleImagesAction = deleteGalleryItemsAction;

/**
 * Server Action: Fetches all FAQ items from public."Faq"
 */
export async function getFaqsAction(): Promise<FaqRow[]> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from("Faq")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Failed to fetch Faq records:", error);
    throw new Error(`Failed to fetch FAQs: ${error.message}`);
  }

  return (data as unknown as FaqRow[]) || [];
}

/**
 * Server Action: Creates a new FAQ item in public."Faq"
 */
export async function createFaqAction(payload: {
  question: string;
  answer: string;
  is_active: boolean;
}): Promise<FaqRow> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from("Faq")
    .insert({
      question: payload.question.trim(),
      answer: payload.answer.trim(),
      is_active: payload.is_active,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to insert Faq record:", error);
    throw new Error(`Database insert failed: ${error.message}`);
  }

  revalidatePath("/content");
  return data as unknown as FaqRow;
}

/**
 * Server Action: Updates an existing FAQ item in public."Faq"
 */
export async function updateFaqAction(
  id: number,
  payload: {
    question?: string;
    answer?: string;
    is_active?: boolean;
  }
): Promise<FaqRow> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const updates: Record<string, unknown> = {};
  if (payload.question !== undefined) updates.question = payload.question.trim();
  if (payload.answer !== undefined) updates.answer = payload.answer.trim();
  if (payload.is_active !== undefined) updates.is_active = payload.is_active;

  const { data, error } = await adminClient
    .from("Faq")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Failed to update Faq record (${id}):`, error);
    throw new Error(`Database update failed: ${error.message}`);
  }

  revalidatePath("/content");
  return data as unknown as FaqRow;
}

/**
 * Server Action: Deletes an FAQ item from public."Faq"
 */
export async function deleteFaqAction(id: number): Promise<void> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const { error } = await adminClient.from("Faq").delete().eq("id", id);

  if (error) {
    console.error(`Failed to delete Faq record (${id}):`, error);
    throw new Error(`Database delete failed: ${error.message}`);
  }

  revalidatePath("/content");
}

/**
 * Server Action: Fetches all Service Reviews from public."ServiceReview"
 */
export async function getServiceReviewsAction(): Promise<ServiceReviewRow[]> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from("ServiceReview")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Failed to fetch ServiceReview records:", error);
    throw new Error(`Failed to fetch service reviews: ${error.message}`);
  }

  return (data as unknown as ServiceReviewRow[]) || [];
}

/**
 * Server Action: Creates a new Service Review in public."ServiceReview"
 */
export async function createServiceReviewAction(payload: {
  comment?: string | null;
  name?: string | null;
  occupation?: string | null;
  place?: string | null;
}): Promise<ServiceReviewRow> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from("ServiceReview")
    .insert({
      comment: payload.comment?.trim() || null,
      name: payload.name?.trim() || null,
      occupation: payload.occupation?.trim() || null,
      place: payload.place?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to insert ServiceReview record:", error);
    throw new Error(`Database insert failed: ${error.message}`);
  }

  revalidatePath("/content");
  return data as unknown as ServiceReviewRow;
}

/**
 * Server Action: Updates an existing Service Review in public."ServiceReview"
 */
export async function updateServiceReviewAction(
  id: number,
  payload: {
    comment?: string | null;
    name?: string | null;
    occupation?: string | null;
    place?: string | null;
  }
): Promise<ServiceReviewRow> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const updates: Record<string, unknown> = {};
  if (payload.comment !== undefined) updates.comment = payload.comment?.trim() || null;
  if (payload.name !== undefined) updates.name = payload.name?.trim() || null;
  if (payload.occupation !== undefined) updates.occupation = payload.occupation?.trim() || null;
  if (payload.place !== undefined) updates.place = payload.place?.trim() || null;

  const { data, error } = await adminClient
    .from("ServiceReview")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Failed to update ServiceReview record (${id}):`, error);
    throw new Error(`Database update failed: ${error.message}`);
  }

  revalidatePath("/content");
  return data as unknown as ServiceReviewRow;
}

/**
 * Server Action: Deletes a Service Review from public."ServiceReview"
 */
export async function deleteServiceReviewAction(id: number): Promise<void> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("ServiceReview")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Failed to delete ServiceReview record (${id}):`, error);
    throw new Error(`Database delete failed: ${error.message}`);
  }

  revalidatePath("/content");
}
