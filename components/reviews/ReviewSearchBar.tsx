"use client";

import React from "react";

interface ReviewSearchBarProps {
  query: string;
  onChange: (query: string) => void;
  onClear: () => void;
}

export const ReviewSearchBar: React.FC<ReviewSearchBarProps> = ({
  query,
  onChange,
  onClear,
}) => {
  return (
    <div className="relative w-full">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/70 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-[18px] h-[18px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search reviews or products..."
        className="w-full h-10 bg-surface-container-lowest border border-border-default/60 rounded-xl pl-9 pr-9 text-on-surface placeholder:text-on-surface-variant/70 text-[13px] outline-none focus:border-border-strong focus:bg-surface-bright shadow-xs transition-colors"
      />

      {query && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-on-surface rounded-md transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5"
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
      )}
    </div>
  );
};
