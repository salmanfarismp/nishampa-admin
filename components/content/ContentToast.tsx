"use client";

import React from "react";

interface ContentToastProps {
  message: string | null;
  isVisible: boolean;
  onDismiss: () => void;
}

export const ContentToast: React.FC<ContentToastProps> = ({
  message,
  isVisible,
  onDismiss,
}) => {
  if (!isVisible || !message) return null;

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed top-16 left-4 right-4 z-50 max-w-sm mx-auto flex items-center justify-between p-3 rounded-xl bg-primary text-on-primary shadow-lg border border-white/10 animate-in fade-in slide-in-from-top-2 duration-200 select-none"
    >
      <div className="flex items-center gap-2.5 min-w-0 pr-2">
        <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5 text-on-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <span className="text-[13px] font-medium leading-tight truncate">
          {message}
        </span>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="text-on-primary/70 hover:text-on-primary active:scale-95 transition-opacity p-1 cursor-pointer flex-shrink-0"
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
    </aside>
  );
};
