"use client";

import React from "react";
import { FaqItem } from "../types";

interface FaqActionSheetProps {
  faq: FaqItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (faq: FaqItem) => void;
  onToggleStatus: (faq: FaqItem) => void;
  onDuplicate: (faq: FaqItem) => void;
  onDelete: (faq: FaqItem) => void;
}

export const FaqActionSheet: React.FC<FaqActionSheetProps> = ({
  faq,
  isOpen,
  onClose,
  onEdit,
  onToggleStatus,
  onDuplicate,
  onDelete,
}) => {
  if (!isOpen || !faq) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="faq-actions-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-5 flex flex-col gap-3 shadow-2xl animate-in slide-in-from-bottom duration-250 z-10 border-t border-border-default/60 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
        {/* Grab Handle */}
        <div className="w-10 h-1 bg-surface-container-highest rounded-full mx-auto -mt-1 mb-1" />

        {/* Question Preview */}
        <div className="pb-1 border-b border-surface-container">
          <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider">
            FAQ Actions
          </span>
          <p
            id="faq-actions-title"
            className="text-[14px] font-semibold text-on-surface line-clamp-1 mt-0.5"
          >
            {faq.question}
          </p>
        </div>

        {/* Action List */}
        <div className="flex flex-col gap-1.5">
          {/* Edit */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(faq);
            }}
            className="w-full h-11 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center gap-3 text-left text-[13px] font-medium text-on-surface transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-on-surface-variant"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
            <span>Edit Question & Answer</span>
          </button>

          {/* Toggle Status */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onToggleStatus(faq);
            }}
            className="w-full h-11 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center gap-3 text-left text-[13px] font-medium text-on-surface transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-on-surface-variant"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12h20" />
              <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" />
              <path d="m16 8-4-4-4 4" />
              <path d="M12 4v16" />
            </svg>
            <span>
              {faq.status === "published"
                ? "Revert to Draft Status"
                : "Publish to Storefront"}
            </span>
          </button>

          {/* Duplicate */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onDuplicate(faq);
            }}
            className="w-full h-11 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center gap-3 text-left text-[13px] font-medium text-on-surface transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-on-surface-variant"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
            <span>Duplicate Item</span>
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onDelete(faq);
            }}
            className="w-full h-11 px-3 rounded-xl bg-red-50 hover:bg-red-100 flex items-center gap-3 text-left text-[13px] font-medium text-red-600 transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-red-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            <span>Delete FAQ</span>
          </button>
        </div>

        {/* Cancel Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px] font-medium transition-colors cursor-pointer mt-1"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
