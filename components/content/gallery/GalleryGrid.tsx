"use client";

import React from "react";
import { GalleryAsset } from "../types";
import { GalleryUploadTile } from "./GalleryUploadTile";
import { GalleryAssetCard } from "./GalleryAssetCard";

interface GalleryGridProps {
  assets: GalleryAsset[];
  isSelecting: boolean;
  selectedIds: Set<string>;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onToggleSelect: (id: string) => void;
  onOpenUpload: () => void;
  onOpenDetail: (asset: GalleryAsset) => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  assets,
  isSelecting,
  selectedIds,
  isLoading = false,
  error = null,
  onRetry,
  onToggleSelect,
  onOpenUpload,
  onOpenDetail,
}) => {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-surface-container-lowest rounded-2xl border border-red-200 text-center my-4">
        <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-[13px] font-semibold text-on-surface">
          Failed to load gallery
        </p>
        <p className="text-[11px] text-on-surface-variant mt-1 max-w-xs">
          {error}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            type="button"
            className="mt-3 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-[12px] font-medium active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            Retry Connection
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      id="galleryGrid"
      className="grid grid-cols-2 gap-2.5 pt-0.5 pb-16"
    >
      {/* Upload Drop Target Tile */}
      <GalleryUploadTile onOpenUpload={onOpenUpload} />

      {/* Loading Skeletons */}
      {isLoading ? (
        Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="aspect-square w-full rounded-2xl bg-surface-container animate-pulse border border-border-default/40"
          />
        ))
      ) : assets.length > 0 ? (
        /* Image Item Tiles */
        assets.map((asset) => (
          <GalleryAssetCard
            key={asset.id}
            asset={asset}
            isSelecting={isSelecting}
            isSelected={selectedIds.has(asset.id)}
            onToggleSelect={onToggleSelect}
            onOpenDetail={onOpenDetail}
          />
        ))
      ) : (
        /* Empty State */
        <div className="col-span-1 aspect-square rounded-2xl border border-dashed border-border-default/60 flex flex-col items-center justify-center p-4 text-center bg-surface-container-lowest">
          <p className="text-[12px] font-medium text-on-surface">No images yet</p>
          <p className="text-[10px] text-on-surface-variant mt-0.5">
            Click upload to add lifestyle photos
          </p>
        </div>
      )}
    </div>
  );
};
