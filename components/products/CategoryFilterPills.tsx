"use client";

import React from "react";
import { ProductCategory } from "./types";

interface CategoryFilterPillsProps {
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  totalCount: number;
  categoryCounts?: Partial<Record<ProductCategory, number>>;
}

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "apparel", label: "Apparel" },
  { id: "footwear", label: "Footwear" },
  { id: "accessories", label: "Accessories" },
  { id: "home_living", label: "Home & Living" },
];

export function CategoryFilterPills({
  selectedCategory,
  onSelectCategory,
  totalCount,
}: CategoryFilterPillsProps) {
  return (
    <section className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 mb-3 select-none">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const displayLabel = cat.id === "all" ? `All (${totalCount.toLocaleString()})` : cat.label;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            type="button"
            className={`flex-shrink-0 h-8 px-3.5 rounded-full text-[12px] font-medium flex items-center transition-all active:scale-95 cursor-pointer ${
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
