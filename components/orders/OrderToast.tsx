"use client";

import React from "react";

interface OrderToastProps {
  message: string | null;
  isVisible: boolean;
}

export const OrderToast: React.FC<OrderToastProps> = ({ message, isVisible }) => {
  return (
    <div
      aria-live="polite"
      className={`fixed top-16 left-4 right-4 max-w-md mx-auto z-50 flex items-center justify-between px-3.5 py-2.5 bg-primary text-on-primary rounded-xl shadow-xl transition-all duration-300 pointer-events-none ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "-translate-y-8 opacity-0 scale-95"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-surface-bright flex-shrink-0"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.74-5.25Z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-[13px] font-medium tracking-tight truncate">
          {message}
        </span>
      </div>
      <span className="font-mono text-[11px] text-surface-variant font-medium uppercase tracking-wider pl-2 flex-shrink-0">
        Done
      </span>
    </div>
  );
};
