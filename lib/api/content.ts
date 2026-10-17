import {
  getLifeStyleImagesAction,
  uploadLifeStyleImageAction,
  deleteLifeStyleImageAction,
  deleteLifeStyleImagesAction,
  getFaqsAction,
  createFaqAction,
  updateFaqAction,
  deleteFaqAction,
} from "@/app/actions/content";
import { LifeStyleImageRow, FaqRow } from "@/types/database";
import { GalleryAsset, FaqItem, FaqStatus } from "@/components/content/types";
import { resolveMediaUrl } from "@/lib/utils/media";

/**
 * Formats an ISO date string into human-friendly relative or date display.
 */
function formatUploadedDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "Recently";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Recently";
  }
}

/**
 * Maps a database LifeStyleImageRow to a UI GalleryAsset.
 */
export function mapLifeStyleImageToGalleryAsset(
  row: LifeStyleImageRow
): GalleryAsset {
  const rawPath = row.img_url || "";
  const publicUrl = resolveMediaUrl(rawPath);

  // Extract a readable name from path, e.g. "lifestyle/ly4.jpeg" -> "ly4"
  const fileName = rawPath
    ? rawPath.split("/").pop()?.replace(/\.[^/.]+$/, "") || ""
    : "";

  return {
    id: String(row.id),
    url: publicUrl,
    rawPath,
    alt: fileName ? `Lifestyle photo (${fileName})` : `Lifestyle photo #${row.id}`,
    tag: "Lifestyle Gallery",
    uploadedAt: formatUploadedDate(row.created_at),
    createdAt: row.created_at,
    dimensions: "2400 × 2400",
    fileSize: "Optimized",
  };
}

/**
 * Fetches all lifestyle images from Supabase and converts to GalleryAsset items.
 */
export async function getLifeStyleImages(): Promise<GalleryAsset[]> {
  const rows = await getLifeStyleImagesAction();
  return rows.map(mapLifeStyleImageToGalleryAsset);
}

/**
 * Uploads a lifestyle image file and returns the newly created GalleryAsset.
 */
export async function uploadLifeStyleImage(file: File): Promise<GalleryAsset> {
  const formData = new FormData();
  formData.append("file", file);

  const row = await uploadLifeStyleImageAction(formData);
  return mapLifeStyleImageToGalleryAsset(row);
}

/**
 * Deletes a lifestyle image by string ID.
 */
export async function deleteLifeStyleImage(
  id: string,
  rawPath?: string
): Promise<void> {
  const numId = Number(id);
  if (isNaN(numId)) {
    throw new Error(`Invalid asset ID: ${id}`);
  }
  await deleteLifeStyleImageAction(numId, rawPath);
}

/**
 * Bulk deletes lifestyle images by string IDs.
 */
export async function deleteLifeStyleImages(ids: string[]): Promise<void> {
  const numIds = ids.map((id) => Number(id)).filter((n) => !isNaN(n));
  if (numIds.length === 0) return;
  await deleteLifeStyleImagesAction(numIds);
}

/**
 * Maps a database FaqRow to a UI FaqItem.
 */
export function mapFaqRowToFaqItem(row: FaqRow): FaqItem {
  return {
    id: String(row.id),
    rawId: row.id,
    question: row.question || "",
    answer: row.answer || "",
    status: row.is_active ? "published" : "draft",
    updatedAt: formatUploadedDate(row.created_at),
    createdAt: row.created_at,
  };
}

/**
 * Fetches all FAQ items from Supabase and converts to FaqItem.
 */
export async function getFaqs(): Promise<FaqItem[]> {
  const rows = await getFaqsAction();
  return rows.map(mapFaqRowToFaqItem);
}

/**
 * Creates a new FAQ item in Supabase.
 */
export async function createFaq(data: {
  question: string;
  answer: string;
  status: FaqStatus;
}): Promise<FaqItem> {
  const row = await createFaqAction({
    question: data.question,
    answer: data.answer,
    is_active: data.status === "published",
  });
  return mapFaqRowToFaqItem(row);
}

/**
 * Updates an FAQ item in Supabase.
 */
export async function updateFaq(
  id: string,
  data: {
    question?: string;
    answer?: string;
    status?: FaqStatus;
  }
): Promise<FaqItem> {
  const numId = Number(id);
  if (isNaN(numId)) {
    throw new Error(`Invalid FAQ ID: ${id}`);
  }

  const row = await updateFaqAction(numId, {
    question: data.question,
    answer: data.answer,
    is_active:
      data.status !== undefined ? data.status === "published" : undefined,
  });
  return mapFaqRowToFaqItem(row);
}

/**
 * Toggles an FAQ item's status between published and draft.
 */
export async function toggleFaqStatus(
  id: string,
  currentStatus: FaqStatus
): Promise<FaqItem> {
  const nextStatus: FaqStatus =
    currentStatus === "published" ? "draft" : "published";
  return updateFaq(id, { status: nextStatus });
}

/**
 * Deletes an FAQ item by string ID.
 */
export async function deleteFaq(id: string): Promise<void> {
  const numId = Number(id);
  if (isNaN(numId)) {
    throw new Error(`Invalid FAQ ID: ${id}`);
  }
  await deleteFaqAction(numId);
}
