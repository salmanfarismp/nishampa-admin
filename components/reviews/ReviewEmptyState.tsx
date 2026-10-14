"use client";

import React from "react";

interface ReviewEmptyStateProps {
  onReset?: () => void;
  message?: string;
  description?: string;
}

export const ReviewEmptyState: React.FC<ReviewEmptyStateProps> = ({
  onReset,
  message = "Queue Cleared",
  description = "All incoming customer reviews have been moderated and published.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-3 bg-surface-container-lowest border border-border-default/60 rounded-2xl shadow-2xs animate-in fade-in duration-300">
      <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary shadow-xs">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </div>

      <div className="space-y-1">
        <h3 className="text-[16px] font-semibold text-on-surface tracking-tight">
          {message}
        </h3>
        <p className="text-[13px] text-on-surface-variant max-w-[260px] leading-relaxed mx-auto">
          {description}
        </p>
      </div>

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-2 px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-[12px] font-semibold active:scale-95 transition-all cursor-pointer shadow-2xs"
        >
          Reset Demo Reviews
        </button>
      )}
    </div>
  );
};
