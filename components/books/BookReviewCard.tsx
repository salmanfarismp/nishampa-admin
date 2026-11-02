"use client";

import React from "react";
import { BookReviewItem } from "./types";

interface BookReviewCardProps {
  review: BookReviewItem;
  onOpenMenu: (review: BookReviewItem) => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "BR";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_PALETTES = [
  { bg: "bg-amber-100 dark:bg-amber-950/60", text: "text-amber-800 dark:text-amber-200" },
  { bg: "bg-blue-100 dark:bg-blue-950/60", text: "text-blue-800 dark:text-blue-200" },
  { bg: "bg-emerald-100 dark:bg-emerald-950/60", text: "text-emerald-800 dark:text-emerald-200" },
  { bg: "bg-purple-100 dark:bg-purple-950/60", text: "text-purple-800 dark:text-purple-200" },
  { bg: "bg-rose-100 dark:bg-rose-950/60", text: "text-rose-800 dark:text-rose-200" },
];

export const BookReviewCard: React.FC<BookReviewCardProps> = ({
  review,
  onOpenMenu,
}) => {
  const initials = getInitials(review.name || "Reader");
  const paletteIndex = Math.abs(
    (review.rawId || review.id.charCodeAt(0) || 0) % AVATAR_PALETTES.length
  );
  const palette = AVATAR_PALETTES[paletteIndex];

  const starsCount = review.stars != null ? Math.min(5, Math.max(0, review.stars)) : null;

  return (
    <article className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-2xs border border-outline-variant/30 flex flex-col gap-3 transition-all duration-200 select-none">
      {/* Top Header: Avatar, Name + Subtitle, Stars, Timestamp, and Action Menu */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl ${palette.bg} ${palette.text} flex items-center justify-center font-bold text-xs tracking-wider flex-shrink-0`}
            aria-hidden="true"
          >
            {initials}
          </div>

          <div className="flex flex-col min-w-0">
            <h3 className="text-[15px] font-semibold text-on-surface truncate leading-tight">
              {review.name || "Anonymous Reader"}
            </h3>

            {review.displaySubtitle ? (
              <p className="text-[12px] text-on-surface-variant font-normal truncate mt-0.5">
                {review.displaySubtitle}
              </p>
            ) : (
              <p className="text-[12px] text-on-surface-variant/60 italic font-normal mt-0.5">
                No occupation/place set
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {review.createdAt && (
            <span className="font-mono text-[11px] text-on-surface-variant/70 hidden xs:inline-block">
              {review.createdAt}
            </span>
          )}

          <button
            type="button"
            onClick={() => onOpenMenu(review)}
            aria-label={`Actions for review by ${review.name}`}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
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
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Star Rating Display */}
      {starsCount != null && (
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5" aria-label={`Rating: ${starsCount} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                xmlns="http://www.w3.org/2000/svg"
                className={`w-3.5 h-3.5 ${
                  star <= starsCount
                    ? "fill-amber-400 text-amber-400"
                    : "fill-surface-container-high text-surface-container-high"
                }`}
                viewBox="0 0 24 24"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <span className="text-[11px] font-mono text-on-surface-variant font-medium ml-1">
            {starsCount}.0
          </span>
        </div>
      )}

      {/* Comment Body */}
      <div className="relative bg-surface-container-low/60 rounded-xl p-3.5 border border-border-default/40">
        <p className="text-[13.5px] text-on-surface leading-relaxed whitespace-pre-line italic">
          &ldquo;{review.comment}&rdquo;
        </p>
      </div>

      {/* Footer Meta */}
      <div className="flex items-center justify-between text-[11px] text-on-surface-variant/60 pt-0.5">
        <span className="font-mono">ID: #{review.rawId || review.id}</span>
        {review.createdAt && (
          <span className="font-mono xs:hidden">{review.createdAt}</span>
        )}
      </div>
    </article>
  );
};

