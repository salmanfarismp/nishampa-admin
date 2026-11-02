"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GalleryAsset } from "../types";

interface GalleryDetailModalProps {
  asset: GalleryAsset | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string, rawPath?: string) => void;
  onUpdate?: (
    id: string,
    data: { tag?: string; title?: string; description?: string }
  ) => Promise<void> | void;
}

interface GalleryDetailContentProps {
  asset: GalleryAsset;
  onClose: () => void;
  onDelete: (id: string, rawPath?: string) => void;
  onUpdate?: (
    id: string,
    data: { tag?: string; title?: string; description?: string }
  ) => Promise<void> | void;
}

const GalleryDetailContent: React.FC<GalleryDetailContentProps> = ({
  asset,
  onClose,
  onDelete,
  onUpdate,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTag, setEditTag] = useState(asset.tag || "");
  const [editTitle, setEditTitle] = useState(asset.title || "");
  const [editDescription, setEditDescription] = useState(asset.description || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(asset.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    onDelete(asset.id, asset.rawPath);
    onClose();
  };

  const handleSaveEdit = async () => {
    if (!onUpdate) return;
    setIsSaving(true);
    try {
      await onUpdate(asset.id, {
        tag: editTag.trim().toUpperCase(),
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save gallery changes:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative w-full max-w-md max-h-[90vh] bg-surface-container-lowest rounded-t-3xl p-5 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-bottom duration-250 z-10 border-t border-border-default/60 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] overflow-y-auto">
      {/* Grab Handle */}
      <div className="w-10 h-1 bg-surface-container-highest rounded-full mx-auto -mt-1 mb-1 flex-shrink-0" />

      {/* Modal Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h3
            id="gallery-detail-title"
            className="text-[17px] font-semibold text-on-surface"
          >
            {isEditing ? "Edit Item" : asset.title || "Photo Details"}
          </h3>
          <p className="text-[12px] text-on-surface-variant font-mono">
            {asset.uploadedAt}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
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
      <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-surface-container border border-border-default/50 shadow-inner flex items-center justify-center">
        {asset.url ? (
          <Image
            src={asset.url}
            alt={asset.title || asset.alt}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-text-subtle">
            <svg
              className="w-8 h-8 opacity-40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Content Section: View vs Edit Mode */}
      {isEditing ? (
        <div className="p-3.5 bg-surface-container-low rounded-2xl border border-surface-container flex flex-col gap-3">
          <div className="flex items-center justify-between pb-1 border-b border-border-default/40">
            <span className="text-[12px] font-bold text-on-surface">
              Edit Item Details
            </span>
            <span className="text-[10px] font-mono text-on-surface-variant">
              ID #{asset.id}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Category Tag
            </label>
            <input
              type="text"
              value={editTag}
              onChange={(e) => setEditTag(e.target.value)}
              placeholder="e.g. WORKSHOPS, SPEAKING, EVENTS"
              className="w-full h-9 px-3 rounded-lg bg-surface-container-lowest border border-border-default text-[13px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary uppercase font-mono"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Headline Title
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="e.g. Masterclass in Calicut"
              className="w-full h-9 px-3 rounded-lg bg-surface-container-lowest border border-border-default text-[13px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Description / Caption
            </label>
            <textarea
              rows={2}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Add short context or date details..."
              className="w-full p-2.5 rounded-lg bg-surface-container-lowest border border-border-default text-[13px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary resize-none leading-relaxed"
            />
          </div>

          {/* Edit Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveEdit}
              className="flex-1 h-10 rounded-xl bg-primary text-on-primary text-[13px] font-medium active:scale-98 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="h-10 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px] font-medium active:scale-98 transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Metadata Grid */}
          <div className="p-3.5 bg-surface-container-low rounded-2xl border border-surface-container flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                {asset.tag || "GENERAL"}
              </span>
              {onUpdate && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-[11px] font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                  <span>Edit</span>
                </button>
              )}
            </div>

            {asset.title && (
              <h4 className="text-[15px] font-bold text-on-surface leading-tight">
                {asset.title}
              </h4>
            )}

            {asset.description && (
              <p className="text-[12px] text-on-surface-variant leading-relaxed">
                {asset.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-default/40">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-mono text-on-surface-variant">
                  Aspect Ratio
                </span>
                <span className="text-[12px] font-mono font-medium text-on-surface">
                  {asset.dimensions}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-mono text-on-surface-variant">
                  Payload
                </span>
                <span className="text-[12px] font-mono font-medium text-on-surface">
                  {asset.fileSize}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      {!isEditing && (
        <div className="flex items-center gap-2 pt-1 flex-shrink-0">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex-1 h-11 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px] font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
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
                <span className="text-emerald-700 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-on-surface-variant"
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
                <span>Copy URL</span>
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
      )}
    </div>
  );
};

export const GalleryDetailModal: React.FC<GalleryDetailModalProps> = ({
  asset,
  isOpen,
  onClose,
  onDelete,
  onUpdate,
}) => {
  if (!isOpen || !asset) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-detail-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <GalleryDetailContent
        key={asset.id}
        asset={asset}
        onClose={onClose}
        onDelete={onDelete}
        onUpdate={onUpdate}
      />
    </div>
  );
};
