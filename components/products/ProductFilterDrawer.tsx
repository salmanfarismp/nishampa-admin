"use client";

import React, { useState } from "react";
import { FilterState } from "./types";

interface ProductFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilter: FilterState;
  onApplyFilter: (newFilter: FilterState) => void;
}

const MAX_FILTER_CEILING = 60000;

export function ProductFilterDrawer({
  isOpen,
  onClose,
  currentFilter,
  onApplyFilter,
}: ProductFilterDrawerProps) {
  const [localStatus, setLocalStatus] = useState<FilterState["status"]>(
    currentFilter.status
  );
  const [maxPrice, setMaxPrice] = useState<number>(
    currentFilter.maxPrice ?? MAX_FILTER_CEILING
  );

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilter({
      ...currentFilter,
      status: localStatus,
      maxPrice: maxPrice < MAX_FILTER_CEILING ? maxPrice : undefined,
    });
    onClose();
  };

  const handleReset = () => {
    setLocalStatus("all");
    setMaxPrice(MAX_FILTER_CEILING);
    onApplyFilter({
      ...currentFilter,
      status: "all",
      maxPrice: undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-canvas rounded-t-2xl border-t border-border-default shadow-xl z-10 px-4 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] animate-in slide-in-from-bottom duration-200">
        <div className="w-10 h-1 bg-border-default rounded-full mx-auto mb-3" />

        <div className="flex items-center justify-between pb-3 border-b border-border-default">
          <h3 className="text-sm font-semibold text-text-primary">
            Filter Catalog
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-surface-hover flex items-center justify-center text-text-secondary hover:text-text-primary active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Filter Body */}
        <div className="py-4 flex flex-col gap-4">
          {/* Status Filter */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary block mb-2">
              Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["all", "active", "draft"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setLocalStatus(st)}
                  type="button"
                  className={`h-9 rounded-lg text-xs font-medium capitalize border transition-all active:scale-95 cursor-pointer ${
                    localStatus === st
                      ? "bg-primary text-on-primary border-primary"
                      : "bg-surface-subtle text-text-primary border-border-default hover:bg-surface-hover"
                  }`}
                >
                  {st === "all" ? "All" : st}
                </button>
              ))}
            </div>
          </div>

          {/* Price Ceiling Range */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                Max Price
              </label>
              <span className="font-mono text-xs font-semibold text-text-primary tabular-nums">
                {maxPrice >= MAX_FILTER_CEILING
                  ? "Any Price"
                  : `Under ₹${maxPrice.toLocaleString("en-IN")}`}
              </span>
            </div>
            <input
              type="range"
              min={2000}
              max={MAX_FILTER_CEILING}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-primary h-1.5 bg-surface-hover rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-secondary mt-1">
              <span>₹2,000</span>
              <span>₹60,000+</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-border-default">
          <button
            onClick={handleReset}
            type="button"
            className="flex-1 h-10 rounded-lg border border-border-default bg-canvas text-xs font-semibold text-text-secondary hover:text-text-primary active:scale-95 transition-all cursor-pointer"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            type="button"
            className="flex-1 h-10 rounded-lg bg-primary text-on-primary text-xs font-semibold active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
