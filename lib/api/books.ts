import { BookRow, BookReviewRow } from "@/types/database";
import { BookItem, BookReviewItem } from "@/components/books/types";
import {
  getBooksAction,
  getBookReviewsAction,
  createBookReviewAction,
  updateBookReviewAction,
  deleteBookReviewAction,
} from "@/app/actions/books";

/**
 * Formats an ISO date string into human-friendly relative or date display.
 */
export function formatUploadedDate(isoDate: string): string {
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
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return "Recently";
  }
}

/**
 * Formats occupation and place comma-separated.
 */
export function formatReviewSubtitle(
  occupation?: string | null,
  place?: string | null
): string {
  const occ = occupation?.trim() || "";
  const plc = place?.trim() || "";
  if (occ && plc) return `${occ}, ${plc}`;
  if (occ) return occ;
  if (plc) return plc;
  return "";
}

/**
 * Maps a database BookRow to a UI BookItem.
 */
export function mapBookRowToItem(row: BookRow): BookItem {
  return {
    id: row.id,
    name: row.name || "Untitled Book",
    nameMl: row.name_ml || null,
    description: row.sm_description || null,
    pagesApprox: row.pages_approx || null,
    language: row.language || null,
    coverUrl: row.cover_url || null,
    createdAt: formatUploadedDate(row.created_at),
  };
}

/**
 * Maps a database BookReviewRow to a UI BookReviewItem.
 */
export function mapBookReviewRowToItem(row: BookReviewRow): BookReviewItem {
  return {
    id: String(row.id),
    rawId: row.id,
    bookId: row.book_id || 0,
    stars: row.stars != null ? Number(row.stars) : null,
    comment: row.comment || "",
    name: row.name || "",
    occupation: row.occupation || "",
    place: row.place || "",
    createdAt: formatUploadedDate(row.created_at),
    displaySubtitle: formatReviewSubtitle(row.occupation, row.place),
    is_active: Boolean(row.is_active ?? true),
  };
}

/**
 * Fetches all books from Supabase and converts to UI BookItems.
 */
export async function getBooks(): Promise<BookItem[]> {
  const rows = await getBooksAction();
  return rows.map(mapBookRowToItem);
}

/**
 * Fetches all reviews for a book from Supabase and converts to BookReviewItems.
 */
export async function getBookReviews(
  bookId: number
): Promise<BookReviewItem[]> {
  const rows = await getBookReviewsAction(bookId);
  return rows.map(mapBookReviewRowToItem);
}

/**
 * Creates a new book review in Supabase.
 */
export async function createBookReview(data: {
  book_id: number;
  name?: string | null;
  stars?: number | null;
  occupation?: string | null;
  place?: string | null;
  comment?: string | null;
  is_active?: boolean;
}): Promise<BookReviewItem> {
  const row = await createBookReviewAction({
    book_id: data.book_id,
    name: data.name,
    stars: data.stars,
    occupation: data.occupation,
    place: data.place,
    comment: data.comment,
    is_active: data.is_active,
  });
  return mapBookReviewRowToItem(row);
}

/**
 * Updates a book review in Supabase.
 */
export async function updateBookReview(
  id: string,
  data: {
    name?: string | null;
    stars?: number | null;
    occupation?: string | null;
    place?: string | null;
    comment?: string | null;
    is_active?: boolean;
  }
): Promise<BookReviewItem> {
  const numId = Number(id);
  if (isNaN(numId)) {
    throw new Error(`Invalid BookReview ID: ${id}`);
  }

  const row = await updateBookReviewAction(numId, {
    name: data.name,
    stars: data.stars,
    occupation: data.occupation,
    place: data.place,
    comment: data.comment,
    is_active: data.is_active,
  });
  return mapBookReviewRowToItem(row);
}

/**
 * Toggles a book review's active/draft status.
 */
export async function toggleBookReviewStatus(
  id: string,
  currentStatus: boolean
): Promise<BookReviewItem> {
  return updateBookReview(id, { is_active: !currentStatus });
}

/**
 * Deletes a book review by ID.
 */
export async function deleteBookReview(id: string): Promise<void> {
  const numId = Number(id);
  if (isNaN(numId)) {
    throw new Error(`Invalid BookReview ID: ${id}`);
  }
  await deleteBookReviewAction(numId);
}

