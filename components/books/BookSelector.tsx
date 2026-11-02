"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { BookItem } from "./types";
import { resolveMediaUrl } from "@/lib/utils/media";

interface BookSelectorProps {
  books: BookItem[];
  selectedBook: BookItem | null;
  onSelectBook: (book: BookItem) => void;
  reviewCount: number;
  averageRating: number | null;
}

export const BookSelector: React.FC<BookSelectorProps> = ({
  books,
  selectedBook,
  onSelectBook,
  reviewCount,
  averageRating,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  if (!selectedBook) return null;

  const resolvedCover = selectedBook.coverUrl
    ? resolveMediaUrl(selectedBook.coverUrl)
    : "";

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/30 shadow-2xs select-none transition-all"
    >
      {/* Label and switcher trigger */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant font-semibold flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h10" />
            <path d="M6 10h10" />
          </svg>
          Active Book
        </span>

        {books.length > 1 && (
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container border border-border-default/60 text-[11px] font-medium text-on-surface transition-colors cursor-pointer"
          >
            <span>Switch Book ({books.length})</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-3.5 h-3.5 text-on-surface-variant transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        )}
      </div>

      {/* Selected Book Presentation Card */}
      <div className="flex items-start gap-3.5">
        {/* Book Cover Thumbnail */}
        <div className="relative w-16 h-22 sm:w-20 sm:h-28 rounded-xl bg-surface-container-low border border-border-default/50 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-xs">
          {resolvedCover ? (
            <Image
              src={resolvedCover}
              alt={selectedBook.name}
              fill
              sizes="(max-width: 640px) 64px, 80px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-1 text-center bg-surface-container-high/40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-on-surface-variant/40 mb-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
              </svg>
              <span className="text-[9px] font-mono text-on-surface-variant/50 line-clamp-1">
                No Cover
              </span>
            </div>
          )}
        </div>

        {/* Book Details */}
        <div className="flex flex-col min-w-0 flex-1 justify-between self-stretch">
          <div>
            <h2 className="text-[17px] sm:text-[18px] font-semibold text-on-surface leading-tight line-clamp-2">
              {selectedBook.name}
            </h2>
            {selectedBook.nameMl && (
              <p className="text-[13px] text-on-surface-variant font-medium mt-0.5 line-clamp-1">
                {selectedBook.nameMl}
              </p>
            )}
            {selectedBook.description && (
              <p className="text-[12px] text-on-surface-variant/80 line-clamp-2 mt-1 leading-relaxed">
                {selectedBook.description}
              </p>
            )}
          </div>

          {/* Badges / Metrics Row */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            {selectedBook.language && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-container text-[11px] font-medium text-on-surface-variant">
                {selectedBook.language}
              </span>
            )}
            {selectedBook.pagesApprox && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-container text-[11px] font-mono text-on-surface-variant">
                {selectedBook.pagesApprox} pages
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-semibold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {reviewCount} {reviewCount === 1 ? "Review" : "Reviews"}
            </span>

            {averageRating != null && averageRating > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-semibold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 fill-amber-500 text-amber-500"
                  viewBox="0 0 24 24"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {averageRating.toFixed(1)} / 5
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Book Switcher Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-surface-container-lowest border border-border-default rounded-2xl shadow-xl p-2 z-30 max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/70 border-b border-border-subtle">
            Select Book to Manage Reviews
          </div>
          <div className="flex flex-col gap-1 mt-1">
            {books.map((b) => {
              const isCurrent = b.id === selectedBook.id;
              const cover = b.coverUrl ? resolveMediaUrl(b.coverUrl) : "";
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    onSelectBook(b);
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                    isCurrent
                      ? "bg-surface-container text-primary font-semibold"
                      : "hover:bg-surface-container-low text-on-surface"
                  }`}
                >
                  <div className="relative w-8 h-11 rounded-md bg-surface-container-low border border-border-default/40 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={b.name}
                        fill
                        sizes="32px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="text-[10px] font-bold text-on-surface-variant">
                        {b.name[0]}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[13px] truncate">{b.name}</span>
                    {b.nameMl && (
                      <span className="text-[11px] text-on-surface-variant truncate">
                        {b.nameMl}
                      </span>
                    )}
                  </div>

                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

