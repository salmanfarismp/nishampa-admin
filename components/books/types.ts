import { BookRow, BookReviewRow } from "@/types/database";

export type BookReviewStatusFilter = "all" | "active" | "draft";

export interface BookItem {
  id: number;
  name: string;
  nameMl: string | null;
  description: string | null;
  pagesApprox: number | null;
  language: string | null;
  coverUrl: string | null;
  createdAt: string;
}

export interface BookReviewItem {
  id: string;
  rawId: number;
  bookId: number;
  stars: number | null;
  comment: string;
  name: string;
  occupation: string;
  place: string;
  createdAt: string;
  displaySubtitle: string;
  is_active: boolean;
}

export type { BookRow, BookReviewRow };

