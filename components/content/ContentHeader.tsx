"use client";

import React from "react";
import { ContentTab } from "./types";

interface ContentHeaderProps {
  activeTab: ContentTab;
  onTabChange: (tab: ContentTab) => void;
  galleryCount: number;
  faqCount: number;
}

export const ContentHeader: React.FC<ContentHeaderProps> = ({
  activeTab,
  onTabChange,
  galleryCount,
  faqCount,
}) => {
  return (
    <div className="flex flex-col gap-2.5 pt-0.5 pb-2">
      {/* Title & Analytics Trigger */}
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-semibold tracking-tight text-on-surface">
          Store Content
        </h1>

       
      </div>

      {/* Segmented Control Switcher matching screen.png */}
      <div
        role="tablist"
        aria-label="Content views"
        className="grid grid-cols-2 p-1 bg-surface-container-high rounded-xl select-none"
      >
        {/* Gallery Tab Switcher */}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "gallery"}
          aria-controls="gallery-panel"
          onClick={() => onTabChange("gallery")}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-[13px] font-medium transition-all duration-150 cursor-pointer ${
            activeTab === "gallery"
              ? "bg-surface-container-lowest text-on-surface shadow-xs font-semibold"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          <span>Gallery</span>
          <span
            className={`px-1.5 py-0.2 rounded-full font-mono text-[11px] leading-tight transition-colors ${
              activeTab === "gallery"
                ? "bg-surface-container text-on-surface font-semibold"
                : "bg-surface-container/60 text-on-surface-variant"
            }`}
          >
            {galleryCount}
          </span>
        </button>

        {/* FAQs Tab Switcher */}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "faqs"}
          aria-controls="faqs-panel"
          onClick={() => onTabChange("faqs")}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-[13px] font-medium transition-all duration-150 cursor-pointer ${
            activeTab === "faqs"
              ? "bg-surface-container-lowest text-on-surface shadow-xs font-semibold"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
          <span>FAQs</span>
          <span
            className={`px-1.5 py-0.2 rounded-full font-mono text-[11px] leading-tight transition-colors ${
              activeTab === "faqs"
                ? "bg-surface-container text-on-surface font-semibold"
                : "bg-surface-container/60 text-on-surface-variant"
            }`}
          >
            {faqCount}
          </span>
        </button>
      </div>
    </div>
  );
};
