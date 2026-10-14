"use client";

import React from "react";
import Image from "next/image";
import { ProductItem } from "./types";

interface ProductActionSheetProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleStatus: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onDuplicateProduct: (product: ProductItem) => void;
  isUpdating?: boolean;
}

export function ProductActionSheet({
  product,
  isOpen,
  onClose,
  onToggleStatus,
  onDeleteProduct,
  onDuplicateProduct,
  isUpdating = false,
}: ProductActionSheetProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center select-none">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-Up Bottom Drawer Sheet */}
      <div className="relative w-full max-w-md bg-canvas rounded-t-2xl border-t border-border-default shadow-xl z-10 px-4 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
        {/* Grab Handle */}
        <div className="w-10 h-1 bg-border-default rounded-full mx-auto mb-3" />

        {/* Product Preview Header */}
        <div className="flex items-center gap-3 pb-3.5 border-b border-border-default">
          <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden flex-shrink-0 relative border border-border-default">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.title}
                width={48}
                height={48}
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-surface-container flex items-center justify-center text-xs text-on-surface-variant/40">
                SWING
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-mono text-[11px] text-text-secondary">
                {product.sku}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] font-medium ${
                  product.is_active
                    ? "bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]"
                    : "bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]"
                }`}
              >
                <span
                  className={`w-1 h-1 rounded-full ${
                    product.is_active ? "bg-[#16a34a]" : "bg-[#71717a]"
                  }`}
                />
                {product.is_active ? "Active" : "Draft"}
              </span>
            </div>
            <h4 className="text-[14px] font-semibold text-text-primary truncate">
              {product.title}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="font-mono text-[12px] text-text-primary font-semibold">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
              {product.categoryName && (
                <span className="text-[11px] text-text-secondary">
                  • {product.categoryName}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-surface-hover flex items-center justify-center text-text-secondary hover:text-text-primary active:scale-95"
            aria-label="Close sheet"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Colors Row if available */}
        {product.colors && product.colors.length > 0 && (
          <div className="pt-3 pb-1 border-b border-border-default">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
              Available Finishes ({product.colors.length})
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {product.colors.map((c) => (
                <div
                  key={c.id}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-subtle border border-border-default text-[11px] text-text-primary"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Operations List */}
        <div className="py-3 flex flex-col gap-2.5">
          {/* 1. Toggle Status (is_active boolean) */}
          <button
            disabled={isUpdating}
            onClick={() => {
              onToggleStatus(product.id);
            }}
            type="button"
            className="w-full flex items-center justify-between p-3 rounded-xl bg-canvas border border-border-default hover:bg-surface-hover active:scale-[0.99] transition-all text-left cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  product.is_active
                    ? "bg-[#f0fdf4] text-[#16a34a]"
                    : "bg-[#f4f4f5] text-[#71717a]"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-medium text-text-primary">
                  {product.is_active ? "Status: Active" : "Status: Draft"}
                </p>
                <p className="text-[11px] text-text-secondary">
                  Tap to switch to {product.is_active ? "Draft" : "Active"}
                </p>
              </div>
            </div>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                product.is_active
                  ? "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]"
                  : "bg-[#f4f4f5] text-[#71717a] border-[#e4e4e7]"
              }`}
            >
              {isUpdating ? "Saving..." : "Toggle"}
            </span>
          </button>

          {/* 2. Duplicate Product */}
          <button
            onClick={() => {
              onDuplicateProduct(product);
              onClose();
            }}
            type="button"
            className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-canvas border border-border-default hover:bg-surface-hover active:scale-[0.99] transition-all text-left cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-surface-subtle text-text-secondary flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-primary">
                Duplicate Catalog Item
              </p>
              <p className="text-[11px] text-text-secondary">
                Clone as new product draft
              </p>
            </div>
          </button>

          {/* 3. Delete Product */}
          <button
            disabled={isUpdating}
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete "${product.title}"?`)) {
                onDeleteProduct(product.id);
                onClose();
              }
            }}
            type="button"
            className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-canvas border border-[#fecaca] hover:bg-[#fef2f2] active:scale-[0.99] transition-all text-left cursor-pointer text-[#dc2626] disabled:opacity-50"
          >
            <div className="w-7 h-7 rounded-lg bg-[#fef2f2] text-[#dc2626] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#dc2626]">
                Delete Product
              </p>
              <p className="text-[11px] text-[#dc2626]/70">
                Permanently remove from catalog
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
