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
      aria-label={`${asset.title || asset.alt} (${asset.tag})`}
      className={`relative w-full rounded-2xl overflow-hidden bg-surface-container-lowest border transition-all duration-200 select-none cursor-pointer group active:scale-[0.98] shadow-2xs flex flex-col ${
        isSelected
          ? "ring-2 ring-primary ring-offset-2 ring-offset-surface border-primary"
          : "border-border-default/50 hover:border-border-strong hover:shadow-xs"
      }`}
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-container">
        <Image
          src={asset.url}
          alt={asset.title || asset.alt}
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
      </div>

      {/* Card Content matching storefront presentation */}
      <div className="p-3 flex flex-col flex-1 text-left">
        {asset.tag && (
          <span className="text-[10px] font-bold tracking-wider uppercase text-amber-800 dark:text-amber-400 line-clamp-1 mb-1">
            {asset.tag}
          </span>
        )}
        <h4 className="text-[13px] font-bold text-on-surface line-clamp-1 leading-snug">
          {asset.title || "Untitled"}
        </h4>
        {asset.description ? (
          <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-1 leading-snug">
            {asset.description}
          </p>
        ) : (
          <p className="text-[11px] text-on-surface-variant/60 italic line-clamp-1 mt-1">
            No description
          </p>
        )}
      </div>
    </div>
  );
};
