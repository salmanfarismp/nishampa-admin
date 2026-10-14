"use client";

import React from "react";

interface ProductSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
  activeFilterCount?: number;
}

export function ProductSearchBar({
  searchQuery,
  onSearchChange,
  onFilterClick,
  activeFilterCount = 0,
}: ProductSearchBarProps) {
  return (
    <section className="flex items-center gap-2 mb-2 select-none">
      {/* Search Input Container */}
      <div className="relative flex-1 flex items-center">
        {/* Leading Search Icon */}
        <span className="absolute left-3 text-on-surface-variant/70 pointer-events-none flex items-center justify-center">
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
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>

        {/* Search Input Field */}
        <input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          type="text"
          placeholder="Search catalog, SKU, barcode..."
          className="w-full h-10 pl-9 pr-9 bg-surface-container-lowest text-on-surface rounded-xl text-[13px] border border-surface-container/60 shadow-xs placeholder:text-on-surface-variant/60 focus:outline-none focus:border-border-strong transition-colors"
        />

        {/* Trailing Clear or Barcode Icon */}
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            type="button"
            className="absolute right-2.5 p-1 rounded-md text-on-surface-variant/60 hover:text-on-surface active:scale-95 transition-all cursor-pointer"
            title="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5"
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
        )}
      </div>

      {/* Filter Action Button */}
      <button
        onClick={onFilterClick}
        type="button"
        className="h-10 px-3 bg-surface-container-lowest text-on-surface rounded-xl flex items-center gap-1.5 shadow-xs border border-surface-container/60 font-medium text-[12px] hover:bg-surface-container active:scale-95 transition-all cursor-pointer flex-shrink-0"
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
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="17" y1="16" x2="23" y2="16" />
        </svg>
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="w-1.5 h-1.5 rounded-full bg-primary ml-0.5" />
        )}
      </button>
    </section>
  );
}
