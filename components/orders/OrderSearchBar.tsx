"use client";

import React from "react";

interface OrderSearchBarProps {
  query: string;
  onChange: (value: string) => void;
}

export const OrderSearchBar: React.FC<OrderSearchBarProps> = ({ query, onChange }) => {
  return (
    <div className="relative flex items-center w-full">
      {/* Search Icon */}
      <div className="absolute left-3 flex items-center justify-center text-text-subtle pointer-events-none">
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
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>

      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by order # or customer..."
        className="w-full h-10 pl-9 pr-9 bg-surface-container-lowest text-on-surface placeholder:text-text-subtle text-[13px] rounded-lg border border-border-default/60 focus:border-border-strong focus:outline-none transition-all shadow-xs"
        autoComplete="off"
        spellCheck="false"
      />

      {/* Clear Button (when query is entered) */}
      {query.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 w-5 h-5 flex items-center justify-center text-text-subtle hover:text-on-surface rounded-full active:scale-95 transition-all cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};
