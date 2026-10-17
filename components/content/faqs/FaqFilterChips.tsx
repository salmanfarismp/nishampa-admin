"use client";

import React from "react";
import { FaqFilter } from "../types";

interface FaqFilterChipsProps {
  activeFilter: FaqFilter;
  onSelectFilter: (filter: FaqFilter) => void;
  counts: {
    all: number;
    published: number;
    draft: number;
  };
}

export const FaqFilterChips: React.FC<FaqFilterChipsProps> = ({
  activeFilter,
  onSelectFilter,
  counts,
}) => {
  const chips: Array<{
    key: FaqFilter;
    label: string;
    count?: number;
  }> = [
    { key: "all", label: "All", count: counts.all },
    { key: "published", label: "Published", count: counts.published },
    { key: "draft", label: "Drafts", count: counts.draft },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none -mx-1 px-1">
      {chips.map((chip) => {
        const isActive = activeFilter === chip.key;
        return (
          <button
            key={chip.key}
            type="button"
            onClick={() => onSelectFilter(chip.key)}
            className={`px-3 py-1.5 rounded-full font-mono text-[11px] font-medium whitespace-nowrap transition-all duration-150 cursor-pointer active:scale-95 flex items-center gap-1 ${
              isActive
                ? "bg-primary text-on-primary shadow-xs font-semibold"
                : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"
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
  );
};
