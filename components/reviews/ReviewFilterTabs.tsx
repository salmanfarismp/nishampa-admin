"use client";

import React from "react";
import { ReviewFilterTab, ReviewCounts } from "./types";

interface ReviewFilterTabsProps {
  activeTab: ReviewFilterTab;
  onTabChange: (tab: ReviewFilterTab) => void;
  counts: ReviewCounts;
}

export const ReviewFilterTabs: React.FC<ReviewFilterTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
}) => {
  const tabs: { id: ReviewFilterTab; label: string; count: number }[] = [
    { id: "all", label: "All", count: counts.all },
    { id: "pending", label: "Pending", count: counts.pending },
    { id: "flagged", label: "Flagged", count: counts.flagged },
  ];

  return (
    <div className="flex p-0.5 bg-surface-container rounded-xl select-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[12px] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98] ${
              isActive
                ? "bg-surface-container-lowest text-on-surface font-semibold shadow-xs"
                : "text-on-surface-variant hover:text-on-surface font-medium"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full font-mono text-[10px] leading-none transition-colors ${
                isActive
                  ? "bg-primary text-on-primary font-semibold"
                  : "bg-surface-container-highest text-on-surface-variant"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
