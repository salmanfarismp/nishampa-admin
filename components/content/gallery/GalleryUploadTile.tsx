"use client";

import React from "react";

interface GalleryUploadTileProps {
  onOpenUpload: () => void;
}

export const GalleryUploadTile: React.FC<GalleryUploadTileProps> = ({
  onOpenUpload,
}) => {
  return (
    <button
      type="button"
      onClick={onOpenUpload}
      aria-label="Upload photo asset"
      className="flex flex-col items-center justify-center aspect-square rounded-2xl bg-surface-container-low hover:bg-surface-container border border-dashed border-outline-variant/50 transition-all cursor-pointer text-center p-3 group active:scale-[0.98] shadow-2xs"
    >
      <div className="w-11 h-11 rounded-full bg-surface-container-highest flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform text-on-surface">
        {/* add_photo_alternate icon */}
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
          <path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          <circle cx="9" cy="9" r="2" />
          <line x1="19" y1="5" x2="19" y2="11" />
          <line x1="16" y1="8" x2="22" y2="8" />
        </svg>
      </div>
      <span className="text-[13px] font-semibold text-on-surface">
        Upload
      </span>
      <span className="text-[11px] text-on-surface-variant mt-0.5">
        Tap to add
      </span>
    </button>
  );
};
