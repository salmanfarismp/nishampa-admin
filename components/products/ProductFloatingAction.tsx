"use client";

import React from "react";

interface ProductFloatingActionProps {
  onAddClick: () => void;
}

export function ProductFloatingAction({ onAddClick }: ProductFloatingActionProps) {
  return (
    <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] right-4 z-40">
      <button
        onClick={onAddClick}
        type="button"
        aria-label="Add new product"
        className="h-12 px-5 bg-primary text-on-primary rounded-full flex items-center gap-2 shadow-lg hover:bg-primary/90 active:scale-95 transition-all select-none cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span className="text-[13px] font-semibold tracking-wide">
          Add Product
        </span>
      </button>
    </div>
  );
}
