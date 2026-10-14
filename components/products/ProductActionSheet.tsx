"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductItem } from "./types";

interface ProductActionSheetProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onToggleStatus: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onDuplicateProduct: (product: ProductItem) => void;
}

export function ProductActionSheet({
  product,
  isOpen,
  onClose,
  onUpdateStock,
  onToggleStatus,
  onDeleteProduct,
  onDuplicateProduct,
}: ProductActionSheetProps) {
  const [pulse, setPulse] = useState(false);

  if (!isOpen || !product) return null;

  const handleStockChange = (delta: number) => {
    const updated = Math.max(0, product.stockCount + delta);
    onUpdateStock(product.id, updated);
    setPulse(true);
    setTimeout(() => setPulse(false), 200);
  };

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
              <div className="w-full h-full bg-surface-container flex items-center justify-center text-xs">
                IMG
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
            <p className="font-mono text-[12px] text-text-primary mt-0.5 font-medium">
              ${product.price.toFixed(2)}
            </p>
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

        {/* Quick Operations List */}
        <div className="py-3 flex flex-col gap-3">
          {/* 1. Quick Stock Count Adjustment */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle border border-border-default">
            <div>
              <p className="text-[13px] font-medium text-text-primary">
                Inventory Stock
              </p>
              <p className="text-[11px] text-text-secondary">
                Warehouse fulfillment units
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStockChange(-1)}
                type="button"
                className="w-8 h-8 rounded-lg bg-canvas border border-border-default flex items-center justify-center text-text-primary font-bold active:scale-95 transition-all cursor-pointer shadow-xs"
                title="Decrease stock"
              >
                -
              </button>
              <span
                className={`font-mono text-[14px] font-semibold w-9 text-center tabular-nums transition-transform ${
                  pulse ? "scale-125 text-primary" : ""
                }`}
              >
                {product.stockCount}
              </span>
              <button
                onClick={() => handleStockChange(1)}
                type="button"
                className="w-8 h-8 rounded-lg bg-canvas border border-border-default flex items-center justify-center text-text-primary font-bold active:scale-95 transition-all cursor-pointer shadow-xs"
                title="Increase stock"
              >
                +
              </button>
            </div>
          </div>

          {/* 2. Toggle Status (is_active boolean) */}
          <button
            onClick={() => {
              onToggleStatus(product.id);
            }}
            type="button"
            className="w-full flex items-center justify-between p-3 rounded-xl bg-canvas border border-border-default hover:bg-surface-hover active:scale-[0.99] transition-all text-left cursor-pointer"
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
              Toggle
            </span>
          </button>

          {/* 3. Duplicate Product */}
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

          {/* 4. Delete Product */}
          <button
            onClick={() => {
              onDeleteProduct(product.id);
              onClose();
            }}
            type="button"
            className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-canvas border border-[#fecaca] hover:bg-[#fef2f2] active:scale-[0.99] transition-all text-left cursor-pointer text-[#dc2626]"
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
