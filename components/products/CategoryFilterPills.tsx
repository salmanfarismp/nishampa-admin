"use client";

import React from "react";
import { ProductCategory } from "./types";

export interface CategoryPillItem {
  id: string;
  label: string;
}

interface CategoryFilterPillsProps {
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  totalCount: number;
  categories?: CategoryPillItem[];
}

export function CategoryFilterPills({
  selectedCategory,
  onSelectCategory,
  totalCount,
  categories = [],
}: CategoryFilterPillsProps) {
  const allCategories: CategoryPillItem[] = [
    { id: "all", label: "All" },
    ...categories,
  ];

  return (
    <section className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 mb-3 select-none">
      {allCategories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const displayLabel = cat.id === "all" ? `All (${totalCount.toLocaleString()})` : cat.label;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            type="button"
            className={`flex-shrink-0 h-8 px-3.5 rounded-full text-[12px] font-medium flex items-center transition-all active:scale-95 cursor-pointer whitespace-nowrap ${
              isSelected
                ? "bg-primary text-on-primary shadow-xs"
                : "bg-surface-container-low text-on-surface hover:bg-surface-container"
            }`}
          >
            {displayLabel}
          </button>
        );
      })}
    </section>
  );
}
