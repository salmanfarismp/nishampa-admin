"use client";

import React from "react";

interface FaqFloatingActionButtonProps {
  onClick: () => void;
}

export const FaqFloatingActionButton: React.FC<FaqFloatingActionButtonProps> = ({
  onClick,
}) => {
  return (
    <div className="fixed bottom-[4.75rem] right-4 z-30 max-w-md pointer-events-none">
      <button
        type="button"
        onClick={onClick}
        aria-label="Add new FAQ question"
        className="pointer-events-auto w-14 h-14 rounded-2xl bg-primary text-on-primary shadow-xl hover:bg-primary-container active:scale-95 transition-all flex items-center justify-center cursor-pointer border border-white/10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 stroke-current"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
};
