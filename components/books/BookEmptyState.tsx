"use client";

import React from "react";

interface BookEmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: "books" | "reviews" | "search";
}

export const BookEmptyState: React.FC<BookEmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon = "reviews",
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-surface-container-lowest rounded-2xl border border-dashed border-border-default/80 mt-2 select-none">
      <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-3">
        {icon === "books" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h10" />
            <path d="M6 10h10" />
          </svg>
        )}
        {icon === "reviews" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 9h8" />
            <path d="M8 13h6" />
          </svg>
        )}
        {icon === "search" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        )}
      </div>

      <h3 className="text-[15px] font-semibold text-on-surface">{title}</h3>
      <p className="text-[12px] text-on-surface-variant max-w-xs mt-1 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-[12px] font-medium transition-all cursor-pointer shadow-2xs active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

