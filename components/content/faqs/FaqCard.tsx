"use client";

import React, { useState } from "react";
import { FaqItem } from "../types";

interface FaqCardProps {
  faq: FaqItem;
  onOpenMenu: (faq: FaqItem) => void;
}

export const FaqCard: React.FC<FaqCardProps> = ({
  faq,
  onOpenMenu,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const isPublished = faq.status === "published";

  return (
    <article
      className="bg-surface-container-lowest rounded-2xl p-4 shadow-2xs border border-outline-variant/30 flex flex-col gap-2 transition-all duration-200 select-none"
    >
      {/* Card Header: Status Badge & Options Menu */}
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-medium ${
            isPublished
              ? "bg-surface-container text-on-surface"
              : "bg-surface-container-highest text-secondary"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isPublished ? "bg-primary" : "bg-secondary"
            }`}
          />
          {isPublished ? "Published" : "Draft"}
        </span>

        <div className="flex items-center gap-1">
          {/* Quick Category indicator */}
          <span className="font-mono text-[10px] text-on-surface-variant/80 uppercase tracking-wider mr-1">
            {faq.category}
          </span>

          <button
            type="button"
            onClick={() => onOpenMenu(faq)}
            aria-label={`Options for "${faq.question}"`}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            {/* More vertical dots icon matching screen.png */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Question Headline */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-left w-full cursor-pointer group"
      >
        <h2 className="text-[15px] font-semibold text-on-surface leading-snug group-hover:text-primary transition-colors">
          {faq.question}
        </h2>
      </button>

      {/* Answer Paragraph */}
      {isExpanded && (
        <p className="text-[13px] text-on-surface-variant leading-relaxed animate-in fade-in duration-150">
          {faq.answer}
        </p>
      )}
    </article>
  );
};
