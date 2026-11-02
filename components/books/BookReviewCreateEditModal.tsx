"use client";

import React, { useState } from "react";
import { BookReviewItem, BookItem } from "./types";
import { formatReviewSubtitle } from "@/lib/api/books";

interface BookReviewCreateEditModalProps {
  isOpen: boolean;
  book: BookItem | null;
  reviewToEdit: BookReviewItem | null;
  onClose: () => void;
  onSave: (reviewData: {
    id?: string;
    book_id: number;
    name: string;
    stars: number | null;
    occupation: string;
    place: string;
    comment: string;
  }) => void;
}

interface FormContentProps {
  book: BookItem | null;
  reviewToEdit: BookReviewItem | null;
  onClose: () => void;
  onSave: (reviewData: {
    id?: string;
    book_id: number;
    name: string;
    stars: number | null;
    occupation: string;
    place: string;
    comment: string;
  }) => void;
}

const BookReviewFormContent: React.FC<FormContentProps> = ({
  book,
  reviewToEdit,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(reviewToEdit?.name ?? "");
  const [stars, setStars] = useState<number>(reviewToEdit?.stars ?? 5);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [occupation, setOccupation] = useState(reviewToEdit?.occupation ?? "");
  const [place, setPlace] = useState(reviewToEdit?.place ?? "");
  const [comment, setComment] = useState(reviewToEdit?.comment ?? "");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) {
      setError("Please select a book first.");
      return;
    }
    if (!name.trim()) {
      setError("Reviewer name is required.");
      return;
    }
    if (!comment.trim()) {
      setError("Review comment / testimonial is required.");
      return;
    }

    onSave({
      id: reviewToEdit?.id,
      book_id: book.id,
      name: name.trim(),
      stars,
      occupation: occupation.trim(),
      place: place.trim(),
      comment: comment.trim(),
    });
    onClose();
  };

  const previewSubtitle = formatReviewSubtitle(occupation, place);
  const activeRating = hoveredStar !== null ? hoveredStar : stars;

  return (
    <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-t-3xl p-5 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-bottom duration-250 z-10 border-t border-border-default/60 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] max-h-[90vh] overflow-y-auto">
      {/* Grab Handle */}
      <div className="w-10 h-1 bg-surface-container-highest rounded-full mx-auto -mt-1 mb-1 flex-shrink-0" />

      {/* Modal Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 6h10" />
            </svg>
          </div>
          <div>
            <h3
              id="book-review-modal-title"
              className="text-[17px] font-semibold text-on-surface"
            >
              {reviewToEdit ? "Edit Book Review" : "New Book Review"}
            </h3>
            <p className="text-[12px] text-on-surface-variant truncate max-w-[280px] xs:max-w-xs">
              For: <span className="font-semibold text-on-surface">{book?.name}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-[12px] border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {/* Star Rating Picker */}
        <div className="flex flex-col gap-1.5 bg-surface-container-low/70 p-3 rounded-xl border border-border-default/40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Rating
            </span>
            <span className="text-[12px] font-mono text-on-surface font-semibold">
              {activeRating} of 5 Stars
            </span>
          </div>

          <div className="flex items-center gap-1.5 pt-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setStars(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                aria-label={`Rate ${star} star`}
                className="p-1 hover:scale-115 active:scale-95 transition-all cursor-pointer rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-6 h-6 ${
                    star <= activeRating
                      ? "fill-amber-400 text-amber-400"
                      : "fill-surface-container-high text-surface-container-high"
                  }`}
                  viewBox="0 0 24 24"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Reviewer Name */}
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
            Reviewer Name <span className="text-red-500">*</span>
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Dr. Ayesha Rahman or Faisal K."
            className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-[13px] text-on-surface placeholder:text-on-surface-variant/50 border border-border-default/50 focus:border-border-strong focus:outline-none focus:bg-surface-container-lowest transition-colors"
          />
        </label>

        {/* 2-Column: Occupation & Place */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Occupation
            </span>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="e.g. Author or Professor"
              className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-[13px] text-on-surface placeholder:text-on-surface-variant/50 border border-border-default/50 focus:border-border-strong focus:outline-none focus:bg-surface-container-lowest transition-colors"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Place / Location
            </span>
            <input
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="e.g. Calicut or Doha"
              className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-[13px] text-on-surface placeholder:text-on-surface-variant/50 border border-border-default/50 focus:border-border-strong focus:outline-none focus:bg-surface-container-lowest transition-colors"
            />
          </label>
        </div>

        {/* Live Subtitle Format Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-low/70 rounded-xl text-[12px] text-on-surface-variant border border-border-default/40">
          <span className="text-on-surface-variant/70 font-medium">Website display:</span>
          <span className="font-semibold text-on-surface">
            {previewSubtitle ? previewSubtitle : "—"}
          </span>
          {previewSubtitle && (
            <span className="text-[11px] text-on-surface-variant/60 ml-auto font-mono">
              (comma-separated)
            </span>
          )}
        </div>

        {/* Review / Comment Textarea */}
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
            Review / Testimonial <span className="text-red-500">*</span>
          </span>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter the reader's review, thoughts, or testimonial..."
            className="w-full p-3 bg-surface-container-low rounded-xl text-[13px] text-on-surface placeholder:text-on-surface-variant/50 border border-border-default/50 focus:border-border-strong focus:outline-none focus:bg-surface-container-lowest resize-none transition-colors"
          />
        </label>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px] font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary-container active:scale-[0.98] text-on-primary text-[13px] font-medium transition-all cursor-pointer shadow-xs"
          >
            {reviewToEdit ? "Update Review" : "Save Review"}
          </button>
        </div>
      </form>
    </div>
  );
};

export const BookReviewCreateEditModal: React.FC<
  BookReviewCreateEditModalProps
> = ({ isOpen, book, reviewToEdit, onClose, onSave }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-review-modal-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <BookReviewFormContent
        key={reviewToEdit?.id ?? "new-review"}
        book={book}
        reviewToEdit={reviewToEdit}
        onClose={onClose}
        onSave={onSave}
      />
    </div>
  );
};

