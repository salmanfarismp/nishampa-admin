"use client";

import React from "react";
import { ContentStatusFilter } from "../types";

interface GalleryActionBarProps {
  totalCount: number;
  isSelecting: boolean;
  selectedCount: number;
  activeFilter?: ContentStatusFilter;
  counts?: {
    all: number;
    active: number;
    draft: number;
  };
  onFilterChange?: (filter: ContentStatusFilter) => void;
  onToggleSelectMode: () => void;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
}

export const GalleryActionBar: React.FC<GalleryActionBarProps> = ({
  totalCount,
  isSelecting,
  selectedCount,
  activeFilter = "all",
  counts,
  onFilterChange,
  onToggleSelectMode,
  onSelectAll,
  onDeleteSelected,
}) => {
  const filterChips: { key: ContentStatusFilter; label: string; count?: number }[] = counts
    ? [
        { key: "all", label: "All", count: counts.all },
        { key: "active", label: "Active", count: counts.active },
        { key: "draft", label: "Drafts", count: counts.draft },
      ]
    : [];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2 bg-surface-container-lowest p-2.5 rounded-xl border border-border-default/40 shadow-2xs">
        {/* Title & Count Badge */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[14px] font-semibold text-on-surface">
            Workshops & Speaking
          </span>
          <span className="px-1.5 py-0.5 rounded-full bg-surface-container font-mono text-[11px] text-on-surface-variant font-medium">
            {totalCount}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {isSelecting ? (
            <>
              <button
                type="button"
                onClick={onSelectAll}
                className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-medium active:scale-95 transition-all cursor-pointer"
              >
                Select All
              </button>

              {selectedCount > 0 && (
                <button
                  type="button"
                  onClick={onDeleteSelected}
                  className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[12px] font-medium active:scale-95 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
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
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                  <span>Delete ({selectedCount})</span>
                </button>
              )}

              <button
                type="button"
                onClick={onToggleSelectMode}
                className="px-2.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-[12px] font-medium active:scale-95 transition-all cursor-pointer"
              >
                Done
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onToggleSelectMode}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container hover:bg-surface-container-high active:scale-95 text-on-surface rounded-lg text-[13px] font-medium transition-all cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-on-surface"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              <span>Select</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips row (when not in select mode) */}
      {!isSelecting && filterChips.length > 0 && onFilterChange && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar select-none">
          {filterChips.map((chip) => {
            const isActive = activeFilter === chip.key;
            return (
              <button
                key={chip.key}
                type="button"
                onClick={() => onFilterChange(chip.key)}
                className={`px-3 py-1.5 rounded-full font-mono text-[11px] font-medium whitespace-nowrap transition-all duration-150 cursor-pointer active:scale-95 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-primary text-on-primary shadow-xs font-semibold"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-border-default/40"
                }`}
              >
                <span>{chip.label}</span>
                {typeof chip.count === "number" && (
                  <span
                    className={`text-[10px] ${
                      isActive ? "text-white/80" : "text-on-surface-variant/80"
                    }`}
                  >
                    ({chip.count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
