"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { optimizeImage } from "@/lib/utils/imageOptimizer";

interface GalleryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (newAsset: {
    file?: File | null;
    url: string;
    alt: string;
    tag: string;
    title: string;
    description: string;
    dimensions: string;
    fileSize: string;
    is_active?: boolean;
  }) => Promise<void> | void;
}

export const GalleryUploadModal: React.FC<GalleryUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [tag, setTag] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileSizeText, setFileSizeText] = useState("Optimized");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (rawFile) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      let fileToUse = rawFile;
      try {
        fileToUse = await optimizeImage(rawFile, {
          maxWidth: 1080,
          quality: 0.8,
        });
      } catch (err) {
        console.warn("Pre-upload image optimization warning:", err);
      }

      setSelectedFile(fileToUse);
      const url = URL.createObjectURL(fileToUse);
      setPreviewUrl(url);

      const sizeKb = Math.round(fileToUse.size / 1024);
      const sizeText =
        sizeKb >= 1024
          ? `${(sizeKb / 1024).toFixed(1)} MB`
          : `${sizeKb} KB`;
      setFileSizeText(`${sizeText} • WebP`);
    }
  };

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    setTag("");
    setTitle("");
    setDescription("");
    setIsActive(true);
    onClose();
  };

  const handleConfirm = async () => {
    if (!selectedFile && !previewUrl) {
      alert("Please choose an image file to upload.");
      return;
    }

    setIsUploading(true);
    try {
      const finalUrl =
        previewUrl ||
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80";

      const derivedAlt =
        title.trim() ||
        selectedFile?.name?.replace(/\.[^/.]+$/, "") ||
        tag.trim() ||
        "Gallery photo";

      await onUpload({
        file: selectedFile,
        url: finalUrl,
        alt: derivedAlt,
        tag: tag.trim().toUpperCase() || "WORKSHOP",
        title: title.trim() || "Untitled Workshop",
        description: description.trim(),
        dimensions: "2400 × 2400",
        fileSize: fileSizeText,
        is_active: isActive,
      });

      handleClose();
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
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-5 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-bottom duration-250 z-10 border-t border-border-default/60 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] max-h-[90vh] overflow-y-auto">
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
              Add Workshop & Speaking Item
            </h3>
          </div>

          <button
            type="button"
            onClick={handleClose}
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
          className="flex flex-col items-center justify-center w-full aspect-[16/10] rounded-2xl bg-surface-container-low hover:bg-surface-container border border-dashed border-outline-variant/50 transition-colors cursor-pointer text-center p-4 group select-none relative overflow-hidden"
        >
          {previewUrl ? (
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <Image
                src={previewUrl}
                alt="Upload preview"
                fill
                unoptimized
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
              <div className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center text-on-surface mb-1.5 group-hover:-translate-y-0.5 transition-transform">
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
                Choose Image File
              </span>
              <span className="text-[11px] font-mono text-on-surface-variant mt-0.5">
                JPG, PNG, WEBP (max 15MB)
              </span>
            </>
          )}
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-3">
          {/* Title Input */}
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
              Title
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Keynote Address"
              className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-[13px] text-on-surface placeholder:text-on-surface-variant/50 border border-border-default/50 focus:border-border-strong focus:outline-none focus:bg-surface-container-lowest transition-colors"
            />
          </label>

          {/* Tag / Category Input */}
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
              Tag / Category
            </span>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="e.g. CONVOCATION, TEAM WORKSHOP"
              className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-[13px] text-on-surface placeholder:text-on-surface-variant/50 border border-border-default/50 focus:border-border-strong focus:outline-none focus:bg-surface-container-lowest transition-colors"
            />
          </label>

          {/* Description Textarea */}
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
              Description
            </span>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the workshop, keynote, or session..."
              className="w-full p-3 bg-surface-container-low rounded-xl text-[13px] text-on-surface placeholder:text-on-surface-variant/50 border border-border-default/50 focus:border-border-strong focus:outline-none focus:bg-surface-container-lowest transition-colors resize-none leading-relaxed"
            />
          </label>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-border-default/50">
            <div className="flex flex-col">
              <span className="text-[12px] font-semibold text-on-surface flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? "bg-emerald-500" : "bg-outline"
                  }`}
                />
                Status: {isActive ? "Active (Publish immediately)" : "Draft (Hidden)"}
              </span>
              <span className="text-[11px] text-on-surface-variant">
                {isActive
                  ? "Will be immediately visible on public site"
                  : "Saved as draft, hidden from storefront"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                isActive ? "bg-primary" : "bg-surface-container-highest"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px] font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isUploading || (!selectedFile && !previewUrl)}
            onClick={handleConfirm}
            className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary-container active:scale-[0.98] text-on-primary text-[13px] font-medium transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Save to Gallery"}
          </button>
        </div>
      </div>
    </div>
  );
};
