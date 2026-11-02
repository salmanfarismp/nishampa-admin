"use client";

import React, { useState, useEffect } from "react";
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

export const GalleryDetailModal: React.FC<GalleryDetailModalProps> = ({
  asset,
  isOpen,
  onClose,
  onDelete,
  onUpdate,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTag, setEditTag] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (asset) {
      setEditTag(asset.tag || "");
      setEditTitle(asset.title || "");
      setEditDescription(asset.description || "");
      setIsEditing(false);
    }
  }, [asset]);

  if (!isOpen || !asset) return null;

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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="asset-detail-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200"
    >
      <div
        className="fixed inset-0"
        onClick={() => {
          setIsEditing(false);
          onClose();
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-5 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-bottom duration-250 z-10 border-t border-border-default/60 max-h-[90vh] overflow-y-auto pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
        {/* Grab Handle */}
        <div className="w-10 h-1 bg-surface-container-highest rounded-full mx-auto -mt-1 mb-1" />

        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <span className="text-[10px] font-bold tracking-wider uppercase text-amber-800 dark:text-amber-400 block mb-0.5 truncate">
              {asset.tag || "WORKSHOP"}
            </span>
            <h3
              id="asset-detail-title"
              className="text-[16px] font-bold text-on-surface truncate"
            >
              {asset.title || "Gallery Item"}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              onClose();
            }}
            aria-label="Close photo inspector"
            className="w-8 h-8 shrink-0 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
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
        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-surface-container border border-border-default/50 shadow-inner">
          <Image
            src={asset.url}
            alt={asset.title || asset.alt}
            fill
            unoptimized
            className="object-cover"
          />
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

            {/* Title Input */}
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Title
              </span>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="e.g. Keynote Address"
                className="w-full h-9 px-3 bg-surface-container-lowest rounded-xl text-[13px] text-on-surface placeholder:text-on-surface-variant/50 border border-border-default/60 focus:border-border-strong focus:outline-none"
              />
            </label>

            {/* Tag / Category Input */}
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Category / Tag
              </span>
              <input
                type="text"
                value={editTag}
                onChange={(e) => setEditTag(e.target.value)}
                placeholder="e.g. CONVOCATION"
                className="w-full h-9 px-3 bg-surface-container-lowest rounded-xl text-[13px] text-on-surface placeholder:text-on-surface-variant/50 border border-border-default/60 focus:border-border-strong focus:outline-none uppercase"
              />
            </label>

            {/* Description Textarea */}
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Description
              </span>
              <textarea
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Session summary..."
                className="w-full p-2.5 bg-surface-container-lowest rounded-xl text-[12px] text-on-surface placeholder:text-on-surface-variant/50 border border-border-default/60 focus:border-border-strong focus:outline-none resize-none leading-relaxed"
              />
            </label>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setEditTag(asset.tag || "");
                  setEditTitle(asset.title || "");
                  setEditDescription(asset.description || "");
                  setIsEditing(false);
                }}
                className="flex-1 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveEdit}
                className="flex-1 h-9 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-[12px] font-medium transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-surface-container-low rounded-2xl border border-surface-container flex flex-col gap-2.5">
            <div>
              <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-0.5">
                Title
              </span>
              <p className="text-[13px] font-bold text-on-surface">
                {asset.title || "Untitled Workshop"}
              </p>
            </div>

            <div className="border-t border-surface-container/60 pt-2">
              <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-0.5">
                Category Tag
              </span>
              <span className="inline-block text-[11px] font-bold tracking-wider uppercase text-amber-800 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                {asset.tag || "WORKSHOP"}
              </span>
            </div>

            <div className="border-t border-surface-container/60 pt-2">
              <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-0.5">
                Description
              </span>
              <p className="text-[12px] text-on-surface leading-relaxed">
                {asset.description || (
                  <span className="italic text-on-surface-variant/60">
                    No description provided
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] border-t border-surface-container/60 pt-2 text-on-surface-variant font-mono">
              <span>Uploaded: {asset.uploadedAt}</span>
              <span>ID: #{asset.id}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!isEditing && (
          <div className="flex items-center gap-2 pt-1">
            {onUpdate && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex-1 h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px] font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
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
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <span>Edit Details</span>
              </button>
            )}

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
    </div>
  );
};