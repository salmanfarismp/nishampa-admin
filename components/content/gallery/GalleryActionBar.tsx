"use client";

import React from "react";

interface GalleryActionBarProps {
  totalCount: number;
  isSelecting: boolean;
  selectedCount: number;
  onToggleSelectMode: () => void;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
}

export const GalleryActionBar: React.FC<GalleryActionBarProps> = ({
  totalCount,
  isSelecting,
  selectedCount,
  onToggleSelectMode,
  onSelectAll,
  onDeleteSelected,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 bg-surface-container-lowest p-2.5 rounded-xl border border-border-default/40 shadow-2xs">
      {/* Title & Count Badge */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-[14px] font-semibold text-on-surface">
          Brand Assets
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
            {/* Checklist icon matching screen.png */}
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
  );
};
