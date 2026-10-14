"use client";

import React, { useState } from "react";
import { Review } from "./types";

interface ReviewReplyDrawerProps {
  isOpen: boolean;
  review: Review | null;
  onClose: () => void;
  onSubmitReply: (reviewId: string, replyText: string) => void;
}

export const ReviewReplyDrawer: React.FC<ReviewReplyDrawerProps> = ({
  isOpen,
  review,
  onClose,
  onSubmitReply,
}) => {
  const [replyText, setReplyText] = useState("");

  if (!isOpen || !review) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSubmitReply(review.id, replyText.trim());
    setReplyText("");
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl border-t sm:border border-border-default shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Handle */}
        <div className="w-full flex justify-center pt-2 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-border-default" />
        </div>

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-surface-subtle">
          <div>
            <h3 className="text-[14px] font-semibold text-on-surface">
              Reply to {review.author}
            </h3>
            <p className="text-[11px] text-on-surface-variant truncate">
              {review.product.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close reply drawer"
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Customer Review Quote */}
        <div className="p-4 border-b border-border-subtle bg-surface-container-low/50">
          <p className="text-[12px] text-on-surface-variant italic line-clamp-3">
            &ldquo;{review.comment}&rdquo;
          </p>
        </div>

        {/* Reply Form */}
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-on-surface-variant font-mono">
              Official Merchant Response
            </label>
            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Hi ${review.author}, thank you for your feedback...`}
              className="w-full p-3 bg-surface-container-lowest border border-border-default rounded-xl text-on-surface placeholder:text-on-surface-variant/70 text-[13px] outline-none focus:border-border-strong focus:bg-surface-bright resize-none shadow-2xs"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1 pb-safe">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-lg border border-border-default bg-surface-container text-on-surface-variant text-[12px] font-medium hover:text-on-surface active:scale-95 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="h-9 px-4 rounded-lg bg-primary text-on-primary text-[12px] font-semibold active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            >
              Post Public Reply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
