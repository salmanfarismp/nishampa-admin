"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductItem } from "./types";

interface ProductCardProps {
  product: ProductItem;
  onEdit: (product: ProductItem) => void;
  onMore: (product: ProductItem) => void;
}

export function ProductCard({ product, onEdit, onMore }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden flex items-center justify-between p-3 border border-surface-container transition-all active:scale-[0.99] hover:border-border-default select-none">
      {/* Left: Thumbnail & Details */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* 56x56 Thumbnail with Fallback and Grayscale for Draft */}
        <div
          className={`w-14 h-14 rounded-lg bg-surface-container overflow-hidden flex-shrink-0 relative border border-surface-container ${
            !product.is_active ? "opacity-85" : ""
          }`}
        >
          {product.imageUrl && !imageError ? (
            <Image
              src={product.imageUrl}
              alt={product.imageAlt || product.title}
              width={56}
              height={56}
              unoptimized
              priority={false}
              className={`w-full h-full object-cover transition duration-300 ${
                !product.is_active ? "grayscale" : ""
              }`}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-on-surface-variant/40 bg-surface-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Middle Details: SKU + Status, Title, Price */}
        <div className="min-w-0 flex-1 pr-1">
          {/* Top Row: SKU, Status Badge, and Colors */}
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-mono text-[11px] text-on-surface-variant font-medium tracking-tight">
              {product.sku}
            </span>

            {/* Status Pill: Active (solid black/primary dot), Draft (muted gray dot) */}
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                product.is_active
                  ? "bg-surface-container-low text-on-surface"
                  : "bg-surface-container-high text-on-surface-variant"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  product.is_active ? "bg-primary" : "bg-outline"
                }`}
              />
              <span>{product.is_active ? "Active" : "Draft"}</span>
            </span>

            {/* Subtle color dots if present */}
            {product.colors && product.colors.length > 0 && (
              <div className="hidden xs:flex items-center gap-1 ml-auto">
                {product.colors.slice(0, 3).map((col) => (
                  <span
                    key={col.id}
                    title={col.name}
                    className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: col.hex }}
                  />
                ))}
                {product.colors.length > 3 && (
                  <span className="text-[9px] text-on-surface-variant font-medium">
                    +{product.colors.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-[14px] leading-snug font-semibold text-on-surface truncate">
            {product.title}
          </h3>

          {/* Price with optional original price strike */}
          <div className="flex items-center gap-2 mt-0.5">
            <p className="font-mono text-[13px] text-on-surface font-semibold tabular-nums">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="font-mono text-[11px] text-on-surface-variant line-through tabular-nums">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right Actions Cluster */}
      <div className="flex items-center gap-1 flex-shrink-0 ml-1.5">
        {/* Edit Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(product);
          }}
          type="button"
          className="h-8 px-2.5 rounded-lg bg-surface-container-low text-on-surface text-[12px] font-medium flex items-center gap-1 hover:bg-surface-container active:scale-95 transition-all cursor-pointer"
          title="Edit product"
          aria-label={`Edit ${product.title}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <span>Edit</span>
        </button>

        {/* More Actions Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMore(product);
          }}
          type="button"
          aria-label="More actions"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low active:scale-95 transition-all cursor-pointer"
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
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>
    </div>
  );
}
