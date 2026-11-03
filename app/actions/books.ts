"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/utils/supabase/admin";
import { assertAdmin } from "@/lib/auth/assertAdmin";
import { BookRow, BookReviewRow } from "@/types/database";

/**
 * Server Action: Fetches all books from public."Book"
 */
export async function getBooksAction(): Promise<BookRow[]> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from("Book")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Failed to fetch books:", error);
    throw new Error(`Failed to fetch books: ${error.message}`);
  }

  return (data as unknown as BookRow[]) || [];
}

/**
 * Server Action: Fetches all reviews for a specific book from public."BookReview"
 */
export async function getBookReviewsAction(
  bookId: number
): Promise<BookReviewRow[]> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from("BookReview")
    .select("*")
    .eq("book_id", bookId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Failed to fetch reviews for book ${bookId}:`, error);
    throw new Error(`Failed to fetch book reviews: ${error.message}`);
  }

  return (data as unknown as BookReviewRow[]) || [];
}

/**
 * Server Action: Creates a new review for a book in public."BookReview"
 */
export async function createBookReviewAction(payload: {
  book_id: number;
  name?: string | null;
  stars?: number | null;
  occupation?: string | null;
  place?: string | null;
  comment?: string | null;
  is_active?: boolean;
}): Promise<BookReviewRow> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from("BookReview")
    .insert({
      book_id: payload.book_id,
      name: payload.name?.trim() || null,
      stars: payload.stars != null ? Math.round(Number(payload.stars)) : null,
      occupation: payload.occupation?.trim() || null,
      place: payload.place?.trim() || null,
      comment: payload.comment?.trim() || null,
      is_active: payload.is_active !== undefined ? Boolean(payload.is_active) : true,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to insert BookReview record:", error);
    throw new Error(`Database insert failed: ${error.message}`);
  }

  revalidatePath("/books");
  return data as unknown as BookReviewRow;
}

/**
 * Server Action: Updates an existing review in public."BookReview"
 */
export async function updateBookReviewAction(
  id: number,
  payload: {
    name?: string | null;
    stars?: number | null;
    occupation?: string | null;
    place?: string | null;
    comment?: string | null;
    is_active?: boolean;
  }
): Promise<BookReviewRow> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const updates: Record<string, unknown> = {};
  if (payload.name !== undefined) updates.name = payload.name?.trim() || null;
  if (payload.stars !== undefined) {
    updates.stars =
      payload.stars != null ? Math.round(Number(payload.stars)) : null;
  }
  if (payload.occupation !== undefined) {
    updates.occupation = payload.occupation?.trim() || null;
  }
  if (payload.place !== undefined) updates.place = payload.place?.trim() || null;
  if (payload.comment !== undefined) {
    updates.comment = payload.comment?.trim() || null;
  }
  if (payload.is_active !== undefined) {
    updates.is_active = Boolean(payload.is_active);
  }

  const { data, error } = await adminClient
    .from("BookReview")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Failed to update BookReview record (${id}):`, error);
    throw new Error(`Database update failed: ${error.message}`);
  }

  revalidatePath("/books");
  return data as unknown as BookReviewRow;
}

/**
 * Server Action: Deletes a review from public."BookReview"
 */
export async function deleteBookReviewAction(id: number): Promise<void> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("BookReview")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Failed to delete BookReview record (${id}):`, error);
    throw new Error(`Database delete failed: ${error.message}`);
  }

  revalidatePath("/books");
}

