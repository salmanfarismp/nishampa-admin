"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { ProductItem } from "./types";

interface DeleteProductModalProps {
  isOpen: boolean;
  product: ProductItem | null;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteProductModal({
  isOpen,
  product,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteProductModalProps) {
  // Close on ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !product) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-product-title"
      aria-describedby="delete-product-description"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none transition-opacity animate-in fade-in duration-200"
    >
      {/* Click outside backdrop */}
      <div
        className="fixed inset-0"
        onClick={isDeleting ? undefined : onClose}
        aria-hidden="true"
      />

      {/* Centered Modal Card */}
      <div className="relative w-full max-w-[360px] sm:max-w-[390px] bg-surface-container-lowest rounded-2xl border border-surface-container shadow-2xl p-5 sm:p-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-150 z-10">
        {/* Soft Red Danger Icon Badge */}
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3.5 ring-8 ring-red-50/60">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </div>

        {/* Title */}
        <h3
          id="delete-product-title"
          className="text-[17px] font-semibold text-on-surface"
        >
          Delete Product?
        </h3>

        {/* Description */}
        <p
          id="delete-product-description"
          className="text-[13px] text-on-surface-variant leading-relaxed mt-1"
        >
          Are you sure you want to delete{" "}
          <span className="font-semibold text-on-surface">
            &ldquo;{product.title}&rdquo;
          </span>
          ? This will remove this item from the catalog.
        </p>

        {/* Product Details Snippet */}
        <div className="w-full bg-surface-container-low rounded-xl p-2.5 flex items-center gap-3 border border-border-default/60 my-4 text-left">
          <div className="w-11 h-11 rounded-lg bg-surface-container overflow-hidden flex-shrink-0 relative border border-border-default">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.title}
                width={44}
                height={44}
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-on-surface-variant/40 font-mono">
                SWING
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-on-surface truncate">
              {product.title}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                {product.sku}
              </span>
              <span className="text-[11px] text-on-surface-variant font-medium">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 h-10 px-4 rounded-xl border border-border-default bg-surface-container-lowest text-on-surface font-semibold text-[13px] hover:bg-surface-container active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 h-10 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-[13px] active:scale-[0.98] transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <svg
                  className="animate-spin h-3.5 w-3.5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Deleting...</span>
              </>
            ) : (
              "Delete Product"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
