"use client";

import React from "react";

interface ReviewToastProps {
  message: string | null;
  isVisible: boolean;
  onDismiss: () => void;
}

export const ReviewToast: React.FC<ReviewToastProps> = ({
  message,
  isVisible,
  onDismiss,
}) => {
  return (
    <div
      aria-live="polite"
      className={`fixed top-16 left-4 right-4 max-w-md mx-auto z-50 flex items-center justify-between p-3 bg-primary text-on-primary rounded-xl shadow-xl transition-all duration-200 ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100 pointer-events-auto"
          : "-translate-y-6 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 pr-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-[18px] h-[18px] text-white flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="m9 11 3 3L22 4" />
        </svg>
        <span className="text-[13px] font-medium tracking-tight truncate">
          {message}
        </span>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="text-on-primary/80 hover:text-white p-1 rounded-md transition-opacity cursor-pointer flex-shrink-0"
      >
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
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};
