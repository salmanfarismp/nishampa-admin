"use client";

import React from "react";
import Image from "next/image";
import { GalleryAsset } from "../types";

interface GalleryAssetCardProps {
  asset: GalleryAsset;
  isSelecting: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onOpenDetail: (asset: GalleryAsset) => void;
}

export const GalleryAssetCard: React.FC<GalleryAssetCardProps> = ({
  asset,
  isSelecting,
  isSelected,
  onToggleSelect,
  onOpenDetail,
}) => {
  const handleClick = () => {
    if (isSelecting) {
      onToggleSelect(asset.id);
    } else {
      onOpenDetail(asset);
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`${asset.alt} (${asset.tag})`}
      className={`relative aspect-square w-full rounded-2xl overflow-hidden bg-surface-container border transition-all duration-200 select-none cursor-pointer group active:scale-[0.98] shadow-2xs ${
        isSelected
          ? "ring-2 ring-primary ring-offset-2 ring-offset-surface"
          : "border-border-default/50"
      }`}
    >
      {/* Asset Image */}
      <Image
        src={asset.url}
        alt={asset.alt}
        fill
        unoptimized
        sizes="(max-width: 640px) 50vw, 240px"
        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
      />

      {/* Selection Checkbox Overlay */}
      {isSelecting && (
        <div className="absolute top-2 right-2 z-10">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
              isSelected
                ? "bg-primary text-white shadow-md border-2 border-white scale-105"
                : "bg-black/35 backdrop-blur-xs border-2 border-white/80"
            }`}
          >
            {isSelected && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5 stroke-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* Subtle Tag Pill at bottom (visible on non-selection view) */}
      {!isSelecting && (
        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
          <span className="text-[10px] text-white/95 font-medium px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-xs truncate">
            {asset.tag}
          </span>
        </div>
      )}
    </div>
  );
};
