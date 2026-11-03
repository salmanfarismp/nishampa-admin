"use client";

import React, { useState } from "react";
import { BookReviewItem } from "./types";

interface BookReviewActionSheetProps {
  review: BookReviewItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (review: BookReviewItem) => void;
  onToggleStatus: (review: BookReviewItem) => void;
  onDelete: (review: BookReviewItem) => void;
}

export const BookReviewActionSheet: React.FC<BookReviewActionSheetProps> = ({
  review,
  isOpen,
  onClose,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !review) return null;

  const handleClose = () => {
    setConfirmDelete(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-review-actions-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200"
    >
      <div className="fixed inset-0" onClick={handleClose} aria-hidden="true" />

      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-5 flex flex-col gap-3 shadow-2xl animate-in slide-in-from-bottom duration-250 z-10 border-t border-border-default/60 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
        {/* Grab Handle */}
        <div className="w-10 h-1 bg-surface-container-highest rounded-full mx-auto -mt-1 mb-1" />

        {/* Review Preview Header */}
        <div className="pb-2 border-b border-surface-container flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider">
              Review Actions
            </span>
            <p
              id="book-review-actions-title"
              className="text-[15px] font-semibold text-on-surface line-clamp-1 mt-0.5"
            >
              {review.name || "Reader Review"}
            </p>
            {review.displaySubtitle && (
              <p className="text-[12px] text-on-surface-variant truncate">
                {review.displaySubtitle}
              </p>
            )}
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] font-medium flex-shrink-0 mt-1 ${
              review.is_active
                ? "bg-surface-container text-on-surface"
                : "bg-surface-container-highest text-secondary"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                review.is_active ? "bg-primary" : "bg-secondary"
              }`}
            />
            {review.is_active ? "Active" : "Draft"}
          </span>
        </div>

        {/* Actions List */}
        <div className="flex flex-col gap-2">
          {/* Edit */}
          <button
            type="button"
            onClick={() => {
              handleClose();
              onEdit(review);
            }}
            className="w-full h-11 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center gap-3 text-left text-[13px] font-medium text-on-surface transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-on-surface-variant"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
            <span>Edit Review Details</span>
          </button>

          {/* Toggle Status (Active / Draft) */}
          <button
            type="button"
            onClick={() => {
              handleClose();
              onToggleStatus(review);
            }}
            className="w-full h-11 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center gap-3 text-left text-[13px] font-medium text-on-surface transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-on-surface-variant"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12h20" />
              <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" />
              <path d="m16 8-4-4-4 4" />
              <path d="M12 4v16" />
            </svg>
            <span>
              {review.is_active ? "Switch to Draft" : "Publish Review"}
            </span>
          </button>

          {/* Delete Action with inline confirm */}
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="w-full h-11 px-3 rounded-xl bg-error-container/20 hover:bg-error-container/40 flex items-center gap-3 text-left text-[13px] font-medium text-error transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-error"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
              <span>Delete Book Review</span>
            </button>
          ) : (
            <div className="p-3 bg-error-container/20 border border-error/30 rounded-xl flex flex-col gap-2 animate-in fade-in duration-150">
              <p className="text-[12px] text-error font-medium">
                Are you sure you want to delete this review? This action cannot be undone.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 h-9 rounded-lg bg-surface-container text-[12px] font-medium text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    onDelete(review);
                  }}
                  className="flex-1 h-9 rounded-lg bg-error hover:bg-error/90 text-on-error text-[12px] font-medium transition-colors cursor-pointer"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

