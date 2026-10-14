"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GalleryAsset } from "../types";

interface GalleryDetailModalProps {
  asset: GalleryAsset | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const GalleryDetailModal: React.FC<GalleryDetailModalProps> = ({
  asset,
  isOpen,
  onClose,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !asset) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(asset.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    onDelete(asset.id);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="asset-detail-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-5 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-bottom duration-250 z-10 border-t border-border-default/60 max-h-[90vh] overflow-y-auto pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
        {/* Grab Handle */}
        <div className="w-10 h-1 bg-surface-container-highest rounded-full mx-auto -mt-1 mb-1" />

        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3
              id="asset-detail-title"
              className="text-[17px] font-semibold text-on-surface"
            >
              {asset.tag}
            </h3>
            <p className="text-[11px] font-mono text-on-surface-variant">
              Asset ID: {asset.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close photo inspector"
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Photo Display */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-surface-container border border-border-default/50 shadow-inner">
          <Image
            src={asset.url}
            alt={asset.alt}
            fill
            className="object-contain"
          />
        </div>

        {/* Metadata Details */}
        <div className="p-3 bg-surface-container-low rounded-2xl border border-surface-container flex flex-col gap-2">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-on-surface-variant">Alt Description</span>
            <span className="font-medium text-on-surface text-right truncate max-w-[200px]">
              {asset.alt}
            </span>
          </div>

          <div className="flex items-center justify-between text-[12px] border-t border-surface-container/60 pt-2">
            <span className="text-on-surface-variant">Resolution</span>
            <span className="font-mono text-on-surface font-semibold">
              {asset.dimensions || "2400 × 2400"}
            </span>
          </div>

          <div className="flex items-center justify-between text-[12px] border-t border-surface-container/60 pt-2">
            <span className="text-on-surface-variant">File Size</span>
            <span className="font-mono text-on-surface font-semibold">
              {asset.fileSize || "2.1 MB"}
            </span>
          </div>

          <div className="flex items-center justify-between text-[12px] border-t border-surface-container/60 pt-2">
            <span className="text-on-surface-variant">Uploaded</span>
            <span className="text-on-surface">{asset.uploadedAt}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex-1 h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px] font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            {copied ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-emerald-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-emerald-700 font-semibold">Link Copied</span>
              </>
            ) : (
              <>
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
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                <span>Copy CDN URL</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="h-11 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-[13px] font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
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
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
