"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

interface GalleryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (newAsset: {
    file?: File | null;
    url: string;
    alt: string;
    tag: string;
    dimensions: string;
    fileSize: string;
  }) => Promise<void> | void;
}

export const GalleryUploadModal: React.FC<GalleryUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [tag, setTag] = useState("Lifestyle Showcase");
  const [alt, setAlt] = useState("Showcase photography");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileSizeText, setFileSizeText] = useState("2.4 MB");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setAlt(file.name.replace(/\.[^/.]+$/, ""));
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setFileSizeText(`${sizeMb} MB`);
    }
  };

  const handleConfirm = async () => {
    setIsUploading(true);
    try {
      const finalUrl =
        previewUrl ||
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80";

      await onUpload({
        file: selectedFile,
        url: finalUrl,
        alt: alt.trim() || "Brand asset photo",
        tag: tag.trim() || "Showcase",
        dimensions: "2400 × 2400",
        fileSize: fileSizeText,
      });

      setPreviewUrl(null);
      setSelectedFile(null);
      onClose();
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-sheet-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-5 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-bottom duration-250 z-10 border-t border-border-default/60 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
        {/* Grab Handle */}
        <div className="w-10 h-1 bg-surface-container-highest rounded-full mx-auto -mt-1 mb-1" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface">
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
                <path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                <circle cx="9" cy="9" r="2" />
                <line x1="19" y1="5" x2="19" y2="11" />
                <line x1="16" y1="8" x2="22" y2="8" />
              </svg>
            </div>
            <h3
              id="upload-sheet-title"
              className="text-[17px] font-semibold text-on-surface"
            >
              Add Photo Asset
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close upload dialog"
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

        {/* Hidden native input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Dropzone area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className="flex flex-col items-center justify-center h-36 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-dashed border-outline-variant/50 transition-colors cursor-pointer text-center p-4 group select-none relative overflow-hidden"
        >
          {previewUrl ? (
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <Image
                src={previewUrl}
                alt="Upload preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[12px] text-white font-medium bg-black/60 px-2 py-1 rounded-md">
                  Change photo
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface mb-1.5 group-hover:-translate-y-0.5 transition-transform">
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
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                  <path d="M12 12v9" />
                  <path d="m16 16-4-4-4 4" />
                </svg>
              </div>
              <span className="text-[13px] font-semibold text-on-surface">
                Tap to choose image file
              </span>
              <span className="text-[11px] font-mono text-on-surface-variant mt-0.5">
                JPG, WEBP, PNG (max 15MB)
              </span>
            </>
          )}
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-2.5">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
              Photo Tag / Label
            </span>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="e.g. Lookbook FW25"
              className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-[13px] text-on-surface placeholder:text-on-surface-variant/50 border border-border-default/50 focus:border-border-strong focus:outline-none focus:bg-surface-container-lowest transition-colors"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
              Alt Description
            </span>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="e.g. Handcrafted leather messenger bag"
              className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-[13px] text-on-surface placeholder:text-on-surface-variant/50 border border-border-default/50 focus:border-border-strong focus:outline-none focus:bg-surface-container-lowest transition-colors"
            />
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px] font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isUploading}
            onClick={handleConfirm}
            className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary-container active:scale-[0.98] text-on-primary text-[13px] font-medium transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Upload to CDN"}
          </button>
        </div>
      </div>
    </div>
  );
};
