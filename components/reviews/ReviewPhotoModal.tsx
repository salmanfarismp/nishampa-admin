"use client";

import React from "react";
import Image from "next/image";

interface ReviewPhotoModalProps {
  isOpen: boolean;
  photoUrl: string | null;
  authorName?: string;
  productName?: string;
  onClose: () => void;
}

export const ReviewPhotoModal: React.FC<ReviewPhotoModalProps> = ({
  isOpen,
  photoUrl,
  authorName,
  productName,
  onClose,
}) => {
  if (!isOpen || !photoUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-surface-container-lowest rounded-2xl overflow-hidden shadow-2xl border border-border-default flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-surface-subtle">
          <div className="min-w-0 pr-2">
            <h4 className="text-[13px] font-semibold text-on-surface truncate">
              {authorName ? `${authorName}'s Photo` : "Review Photo"}
            </h4>
            {productName && (
              <p className="text-[11px] text-on-surface-variant truncate">
                {productName}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close photo preview"
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface active:scale-95 transition-all cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Image Display */}
        <div className="relative w-full aspect-square bg-surface-container flex items-center justify-center overflow-hidden">
          <Image
            src={photoUrl}
            alt={authorName ? `Review photo by ${authorName}` : "Customer review photo"}
            fill
            sizes="(max-width: 640px) 100vw, 384px"
            className="object-contain"
            priority
          />
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-surface-subtle border-t border-border-subtle flex items-center justify-between text-[11px] text-on-surface-variant">
          <span className="font-mono">Verified Customer Media</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-primary text-on-primary rounded-lg font-medium text-[12px] active:scale-95 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
