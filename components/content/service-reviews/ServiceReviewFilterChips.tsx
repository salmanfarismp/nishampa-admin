"use client";

import React from "react";
import { ContentStatusFilter } from "../types";

interface ServiceReviewFilterChipsProps {
  activeFilter: ContentStatusFilter;
  onSelectFilter: (filter: ContentStatusFilter) => void;
  counts: {
    all: number;
    active: number;
    draft: number;
  };
}

export const ServiceReviewFilterChips: React.FC<ServiceReviewFilterChipsProps> = ({
  activeFilter,
  onSelectFilter,
  counts,
}) => {
  const chips: Array<{
    key: ContentStatusFilter;
    label: string;
    count?: number;
  }> = [
    { key: "all", label: "All", count: counts.all },
    { key: "active", label: "Active", count: counts.active },
    { key: "draft", label: "Drafts", count: counts.draft },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar select-none -mx-1 px-1">
      {chips.map((chip) => {
        const isActive = activeFilter === chip.key;
        return (
          <button
            key={chip.key}
            type="button"
            onClick={() => onSelectFilter(chip.key)}
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
  );
};

