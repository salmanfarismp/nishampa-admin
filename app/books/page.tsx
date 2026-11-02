"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { BookItem, BookReviewItem } from "@/components/books/types";
import {
  getBooks,
  getBookReviews,
  createBookReview,
  updateBookReview,
  deleteBookReview,
} from "@/lib/api/books";
import { BookSelector } from "@/components/books/BookSelector";
import { BookReviewCard } from "@/components/books/BookReviewCard";
import { BookReviewSearchBar } from "@/components/books/BookReviewSearchBar";
import { BookReviewCreateEditModal } from "@/components/books/BookReviewCreateEditModal";
import { BookReviewActionSheet } from "@/components/books/BookReviewActionSheet";
import { BookReviewFloatingActionButton } from "@/components/books/BookReviewFloatingActionButton";
import { BookReviewToast } from "@/components/books/BookReviewToast";
import { BookEmptyState } from "@/components/books/BookEmptyState";

export default function BooksPage() {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [reviews, setReviews] = useState<BookReviewItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [booksError, setBooksError] = useState<string | null>(null);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  // Modal / Drawer state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState<BookReviewItem | null>(null);
  const [activeReviewMenu, setActiveReviewMenu] = useState<BookReviewItem | null>(
    null
  );

  // Toast feedback state with active timer ref
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerToast = useCallback((msg: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMessage(msg);
    setIsToastVisible(true);
    toastTimerRef.current = setTimeout(() => {
      setIsToastVisible(false);
    }, 3200);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // Fetch reviews for a specific book
  const loadReviewsForBook = useCallback(async (bookId: number) => {
    setIsLoadingReviews(true);
    setReviewsError(null);
    try {
      const items = await getBookReviews(bookId);
      setReviews(items);
    } catch (err: unknown) {
      console.error(`Failed to fetch reviews for book ${bookId}:`, err);
      setReviewsError(
        err instanceof Error
          ? err.message
          : "Unable to load reviews for this book."
      );
    } finally {
      setIsLoadingReviews(false);
    }
  }, []);

  // Initial load: Fetch books, default select first book, load its reviews
  useEffect(() => {
    let cancelled = false;

    async function init() {
      setIsLoadingBooks(true);
      setBooksError(null);
      try {
        const fetchedBooks = await getBooks();
        if (cancelled) return;

        setBooks(fetchedBooks);
        setIsLoadingBooks(false);

        if (fetchedBooks.length > 0) {
          const firstBook = fetchedBooks[0];
          setSelectedBook(firstBook);
          // Load reviews for the first book
          loadReviewsForBook(firstBook.id);
        }
      } catch (err: unknown) {
        if (cancelled) return;
        console.error("Failed to fetch books:", err);
        setBooksError(
          err instanceof Error
            ? err.message
            : "Failed to load books from database."
        );
        setIsLoadingBooks(false);
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [loadReviewsForBook]);

  // Handle switching selected book
  const handleSelectBook = (book: BookItem) => {
    if (selectedBook?.id === book.id) return;
    setSelectedBook(book);
    setSearchQuery("");
    loadReviewsForBook(book.id);
  };

  // Compute average rating for active reviews
  const averageRating = useMemo(() => {
    const rated = reviews.filter((r) => r.stars != null && r.stars > 0);
    if (rated.length === 0) return null;
    const sum = rated.reduce((acc, r) => acc + (r.stars || 0), 0);
    return sum / rated.length;
  }, [reviews]);

  // Filter reviews by search query
  const filteredReviews = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return reviews;

    return reviews.filter((r) => {
      const matchName = r.name.toLowerCase().includes(q);
      const matchComment = r.comment.toLowerCase().includes(q);
      const matchOcc = r.occupation.toLowerCase().includes(q);
      const matchPlace = r.place.toLowerCase().includes(q);
      return matchName || matchComment || matchOcc || matchPlace;
    });
  }, [reviews, searchQuery]);

  // CRUD Handlers
  const handleSaveReview = async (reviewData: {
    id?: string;
    book_id: number;
    name: string;
    stars: number | null;
    occupation: string;
    place: string;
    comment: string;
  }) => {
    try {
      if (reviewData.id) {
        // Update review
        const updated = await updateBookReview(reviewData.id, reviewData);
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewData.id ? updated : r))
        );
        triggerToast(`Updated review by ${reviewData.name}`);
      } else {
        // Create review
        const created = await createBookReview(reviewData);
        setReviews((prev) => [created, ...prev]);
        triggerToast(`Added new review for ${selectedBook?.name}`);
      }
    } catch (err: unknown) {
      console.error("Failed to save book review:", err);
      triggerToast(
        err instanceof Error ? err.message : "Failed to save review."
      );
    }
  };

  const handleDeleteReview = async (review: BookReviewItem) => {
    try {
      await deleteBookReview(review.id);
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
      triggerToast(`Deleted review by ${review.name || "Reader"}`);
    } catch (err: unknown) {
      console.error("Failed to delete book review:", err);
      triggerToast(
        err instanceof Error ? err.message : "Failed to delete review."
      );
    }
  };

  const handleOpenEdit = (review: BookReviewItem) => {
    setReviewToEdit(review);
    setIsModalOpen(true);
  };

  const handleOpenNewReview = () => {
    setReviewToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full space-y-4 pb-20 select-none">
      {/* Toast Notification Micro-interaction */}
      <BookReviewToast
        message={toastMessage}
        isVisible={isToastVisible}
        onDismiss={() => setIsToastVisible(false)}
      />

      {/* Page Header */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-on-surface">
            Books & Reviews
          </h1>
          <p className="text-[12px] text-on-surface-variant mt-0.5">
            Admin-curated reviews & testimonials for published books
          </p>
        </div>

        {selectedBook && (
          <button
            type="button"
            onClick={handleOpenNewReview}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-[12px] font-medium transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add Review</span>
          </button>
        )}
      </div>

      {/* Loading Skeleton for Books */}
      {isLoadingBooks ? (
        <div className="w-full h-36 bg-surface-container-low rounded-2xl animate-pulse border border-outline-variant/30" />
      ) : booksError ? (
        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-red-200 text-center">
          <p className="text-[13px] text-red-600 font-medium">{booksError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-3 px-3 py-1.5 rounded-lg bg-surface-container text-[12px] font-medium text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            Retry Loading Books
          </button>
        </div>
      ) : books.length === 0 ? (
        <BookEmptyState
          icon="books"
          title="No Books Found"
          description="There are currently no books in the database to manage reviews for."
        />
      ) : (
        <>
          {/* Active Book Selector & Overview Card */}
          <BookSelector
            books={books}
            selectedBook={selectedBook}
            onSelectBook={handleSelectBook}
            reviewCount={reviews.length}
            averageRating={averageRating}
          />

          {/* Reviews Stream Section */}
          <section
            id="book-reviews-section"
            className="flex flex-col gap-3 pt-1"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-[14px] font-semibold text-on-surface uppercase tracking-wider font-mono">
                Reviews Stream ({filteredReviews.length})
              </h2>

              {selectedBook && reviews.length > 0 && (
                <button
                  type="button"
                  onClick={handleOpenNewReview}
                  className="sm:hidden inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline cursor-pointer"
                >
                  + Add Review
                </button>
              )}
            </div>

            {/* Search Bar */}
            <BookReviewSearchBar
              query={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery("")}
            />

            {/* Reviews Stream Content */}
            <div className="flex flex-col gap-3" id="bookReviewsContainer">
              {isLoadingReviews ? (
                <div className="flex flex-col gap-2.5 animate-pulse">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="h-28 bg-surface-container-low rounded-2xl border border-outline-variant/30"
                    />
                  ))}
                </div>
              ) : reviewsError ? (
                <div className="flex flex-col items-center justify-center p-6 text-center bg-surface-container-lowest rounded-2xl border border-red-200">
                  <p className="text-[13px] text-red-600 font-medium">
                    {reviewsError}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      selectedBook && loadReviewsForBook(selectedBook.id)
                    }
                    className="mt-3 px-3 py-1.5 rounded-lg bg-surface-container text-[12px] font-medium text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <BookReviewCard
                    key={review.id}
                    review={review}
                    onOpenMenu={(item) => setActiveReviewMenu(item)}
                  />
                ))
              ) : (
                <BookEmptyState
                  icon={searchQuery ? "search" : "reviews"}
                  title={
                    searchQuery
                      ? "No Matching Reviews"
                      : `No Reviews for ${selectedBook?.name}`
                  }
                  description={
                    searchQuery
                      ? `No reviews matched "${searchQuery}". Try a different keyword.`
                      : "No customer or editorial reviews have been added for this book yet."
                  }
                  actionLabel={
                    searchQuery ? "Clear Search" : "+ Add First Review"
                  }
                  onAction={
                    searchQuery
                      ? () => setSearchQuery("")
                      : handleOpenNewReview
                  }
                />
              )}
            </div>
          </section>
        </>
      )}

      {/* Floating Action Button for mobile */}
      <BookReviewFloatingActionButton
        onClick={handleOpenNewReview}
        disabled={!selectedBook || isLoadingBooks}
      />

      {/* Create / Edit Modal Sheet */}
      <BookReviewCreateEditModal
        isOpen={isModalOpen}
        book={selectedBook}
        reviewToEdit={reviewToEdit}
        onClose={() => {
          setIsModalOpen(false);
          setReviewToEdit(null);
        }}
        onSave={handleSaveReview}
      />

      {/* Review Action Sheet (Edit / Delete) */}
      <BookReviewActionSheet
        isOpen={Boolean(activeReviewMenu)}
        review={activeReviewMenu}
        onClose={() => setActiveReviewMenu(null)}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteReview}
      />
    </div>
  );
}

