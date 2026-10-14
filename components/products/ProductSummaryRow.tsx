"use client";

import React from "react";
import { SortOption } from "./types";

interface ProductSummaryRowProps {
  count: number;
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Sorted by Newest",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  stock_asc: "Stock: Low to High",
};

export function ProductSummaryRow({
  count,
  currentSort,
  onSortChange,
}: ProductSummaryRowProps) {
  const cycleSort = () => {
    const sequence: SortOption[] = ["newest", "price_asc", "price_desc", "stock_asc"];
    const currentIndex = sequence.indexOf(currentSort);
    const nextIndex = (currentIndex + 1) % sequence.length;
    onSortChange(sequence[nextIndex]);
  };

  return (
    <div className="flex items-center justify-between mb-2 px-0.5 select-none">
      {/* Catalog Products Count */}
      <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
        CATALOG PRODUCTS ({count.toLocaleString()})
      </span>

      {/* Interactive Sort Option */}
      <button
        onClick={cycleSort}
        type="button"
        className="text-[12px] text-on-surface-variant hover:text-on-surface flex items-center gap-1 font-medium active:scale-95 transition-all cursor-pointer"
        title="Change sort order"
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
          <path d="M3 6h18M6 12h12m-9 6h6" />
        </svg>
        <span>{SORT_LABELS[currentSort]}</span>
      </button>
    </div>
  );
}
