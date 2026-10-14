"use client";

import React from "react";
import { GalleryAsset } from "../types";
import { GalleryUploadTile } from "./GalleryUploadTile";
import { GalleryAssetCard } from "./GalleryAssetCard";

interface GalleryGridProps {
  assets: GalleryAsset[];
  isSelecting: boolean;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onOpenUpload: () => void;
  onOpenDetail: (asset: GalleryAsset) => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  assets,
  isSelecting,
  selectedIds,
  onToggleSelect,
  onOpenUpload,
  onOpenDetail,
}) => {
  return (
    <div
      id="galleryGrid"
      className="grid grid-cols-2 gap-2.5 pt-0.5 pb-16"
    >
      {/* Upload Drop Target Tile */}
      <GalleryUploadTile onOpenUpload={onOpenUpload} />

      {/* Image Item Tiles */}
      {assets.map((asset) => (
        <GalleryAssetCard
          key={asset.id}
          asset={asset}
          isSelecting={isSelecting}
          isSelected={selectedIds.has(asset.id)}
          onToggleSelect={onToggleSelect}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </div>
  );
};
