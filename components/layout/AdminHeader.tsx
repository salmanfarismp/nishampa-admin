"use client";

import React from "react";

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-canvas/95 backdrop-blur-md border-b border-border-default px-4 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] pb-3 flex items-center justify-between select-none">
      {/* Brand & Monogram matching screen.png */}
      <div className="flex items-center gap-2 min-w-0">
        <h1 className="text-[18px] font-semibold tracking-tight text-on-surface truncate">
          Westernswings
        </h1>
      </div>

      {/* Header Actions matching screen.png */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* User Account Button matching screen.png */}
        <button
          aria-label="User Account"
          className="w-10 h-10 rounded-full bg-surface-container-low border border-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-all cursor-pointer shadow-xs"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
      </div>
    </header>
  );
}
