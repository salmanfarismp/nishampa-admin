"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ClientItem } from "../types";
import { optimizeImage } from "@/lib/utils/imageOptimizer";

interface ClientCreateEditModalProps {
  isOpen: boolean;
  clientToEdit: ClientItem | null;
  onClose: () => void;
  onSave: (clientData: {
    id?: string;
    name: string;
    file?: File | null;
    logoUrl?: string;
    removeLogo?: boolean;
    show_logo?: boolean;
  }) => Promise<void> | void;
}

interface ClientFormContentProps {
  clientToEdit: ClientItem | null;
  onClose: () => void;
  onSave: (clientData: {
    id?: string;
    name: string;
    file?: File | null;
    logoUrl?: string;
    removeLogo?: boolean;
    show_logo?: boolean;
  }) => Promise<void> | void;
}

const ClientFormContent: React.FC<ClientFormContentProps> = ({
  clientToEdit,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(clientToEdit);
  const [name, setName] = useState(clientToEdit?.name ?? "");
  const [showLogo, setShowLogo] = useState(clientToEdit ? Boolean(clientToEdit.show_logo) : false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    clientToEdit?.logoUrl || null
  );
  const [isBlobUrl, setIsBlobUrl] = useState(false);
  const [imageMetaText, setImageMetaText] = useState<string | null>(null);
  const [removeExistingLogo, setRemoveExistingLogo] = useState(false);
  const [externalLogoUrl, setExternalLogoUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URL on unmount or replacement
  useEffect(() => {
    return () => {
      if (previewUrl && isBlobUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, isBlobUrl]);

  // Process and refine uploaded image file
  const handleProcessFile = async (rawFile: File) => {
    if (!rawFile.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, WebP, SVG, etc.).");
      return;
    }

    setError("");
    let fileToUse = rawFile;

    // Apply project image refinement method
    try {
      fileToUse = await optimizeImage(rawFile, {
        maxWidth: 1080,
        quality: 0.8,
      });
    } catch (err) {
      console.warn("Client image optimization failed, using original:", err);
    }

    if (previewUrl && isBlobUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(fileToUse);
    const newUrl = URL.createObjectURL(fileToUse);
    setPreviewUrl(newUrl);
    setIsBlobUrl(true);
    setRemoveExistingLogo(false);

    // Compute friendly size format
    const sizeKb = Math.round(fileToUse.size / 1024);
    const sizeText =
      sizeKb >= 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
    const formatLabel =
      fileToUse.type === "image/webp"
        ? "Optimized WebP"
        : fileToUse.type.split("/")[1]?.toUpperCase() || "Image";
    setImageMetaText(`${sizeText} • ${formatLabel}`);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (rawFile) {
      await handleProcessFile(rawFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      await handleProcessFile(droppedFile);
    }
  };

  const handleClearLogo = () => {
    if (previewUrl && isBlobUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsBlobUrl(false);
    setImageMetaText(null);
    setExternalLogoUrl("");
    setRemoveExistingLogo(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleApplyUrl = () => {
    const url = externalLogoUrl.trim();
    if (!url) return;

    if (previewUrl && isBlobUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(url);
    setIsBlobUrl(false);
    setImageMetaText("External Web URL");
    setRemoveExistingLogo(false);
    setShowUrlInput(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Client name is required.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onSave({
        id: clientToEdit?.id,
        name: name.trim(),
        file: selectedFile,
        logoUrl: !selectedFile && previewUrl && !isBlobUrl ? previewUrl : undefined,
        removeLogo: removeExistingLogo && !selectedFile && !previewUrl,
        show_logo: showLogo,
      });
      onClose();
    } catch (err: unknown) {
      console.error("Save client error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to save client record."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full max-w-lg bg-surface-container-lowest sm:rounded-3xl rounded-t-3xl p-5 sm:p-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-bottom duration-250 z-10 border-t sm:border border-border-default/60 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] max-h-[90vh] overflow-y-auto">
      {/* Grab Handle for mobile */}
      <div className="w-10 h-1 bg-surface-container-highest rounded-full mx-auto -mt-1 mb-1 sm:hidden flex-shrink-0" />

      {/* Modal Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface">
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
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <div>
            <h2
              id="client-modal-title"
              className="text-[17px] font-semibold text-on-surface leading-tight"
            >
              {isEditing ? "Edit Client" : "Add Worked-With Client"}
            </h2>
            <p className="text-[12px] text-on-surface-variant font-normal">
              {isEditing
                ? "Update client brand details and logo"
                : "Add brand partner or client we've worked with"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Close dialog"
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

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 rounded-xl bg-error-container/20 border border-error/30 text-error text-[12px] flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Client Name Input */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="client-name-input"
            className="text-[12px] font-semibold text-on-surface uppercase tracking-wider"
          >
            Client / Brand Name <span className="text-primary">*</span>
          </label>
          <input
            id="client-name-input"
            type="text"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            placeholder="e.g. Acme Corp, Tech Innovators, Studio 9"
            className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-border-default/60 text-[13px] text-on-surface placeholder:text-on-surface-variant/60 focus:border-border-strong focus:outline-none transition-colors"
          />
        </div>

        {/* Logo Dropzone & Refinement */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-semibold text-on-surface uppercase tracking-wider">
              Client Logo
            </label>
            {imageMetaText && (
              <span className="text-[11px] font-mono text-primary font-medium">
                {imageMetaText}
              </span>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {previewUrl ? (
            <div className="relative w-full rounded-2xl bg-surface-container-low border border-border-default/60 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-16 h-16 rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center p-2 overflow-hidden flex-shrink-0">
                  <Image
                    src={previewUrl}
                    alt="Logo preview"
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-[13px] font-medium text-on-surface truncate">
                    {selectedFile ? selectedFile.name : "Active Client Logo"}
                  </p>
                  <p className="text-[11px] text-on-surface-variant">
                    {selectedFile
                      ? imageMetaText || "Refined for high-res web display"
                      : "Ready for client display"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                  className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-[11px] font-medium text-on-surface transition-colors cursor-pointer"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleClearLogo}
                  disabled={isSubmitting}
                  className="p-1.5 rounded-lg text-error hover:bg-error-container/20 transition-colors cursor-pointer"
                  title="Remove Logo"
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
            </div>
          ) : (
            /* Dropzone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full aspect-[16/7] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 p-4 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-outline-variant/50 bg-surface-container-low hover:bg-surface-container"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-medium text-on-surface">
                  Drag & drop logo, or <span className="text-primary font-semibold">browse</span>
                </p>
                <p className="text-[11px] text-on-surface-variant/80 mt-0.5">
                  Auto-optimized to high-fidelity WebP (max 1080px). SVG/PNG supported.
                </p>
              </div>
            </div>
          )}

          {/* External URL alternative */}
          {!previewUrl && (
            <div className="mt-1">
              {!showUrlInput ? (
                <button
                  type="button"
                  onClick={() => setShowUrlInput(true)}
                  className="text-[11px] text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  + Or paste image web URL instead
                </button>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="url"
                    value={externalLogoUrl}
                    onChange={(e) => setExternalLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="flex-1 h-8 px-2.5 rounded-lg bg-surface-container-low border border-border-default/60 text-[12px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-border-strong"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="h-8 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-[11px] font-medium text-on-surface transition-colors cursor-pointer"
                  >
                    Use
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(false)}
                    className="h-8 px-2 text-[11px] text-on-surface-variant hover:text-on-surface cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Storefront Display Preference */}
        <div className="flex flex-col gap-2.5 p-3.5 rounded-2xl bg-surface-container-low border border-border-default/60">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-semibold text-on-surface uppercase tracking-wider">
              Storefront Display Mode
            </label>
            <span className="text-[11px] font-medium text-primary">
              {showLogo ? "Logo Mode Active" : "Brand Name Mode Active"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setShowLogo(false)}
              className={`p-3 rounded-xl border flex flex-col gap-1 text-left transition-all cursor-pointer ${
                !showLogo
                  ? "bg-surface-container-lowest border-primary shadow-xs ring-1 ring-primary/20"
                  : "bg-surface-container/30 border-transparent hover:bg-surface-container hover:border-outline-variant/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-on-surface">
                  <svg
                    className={`w-4 h-4 flex-shrink-0 ${
                      !showLogo ? "text-primary" : "text-on-surface-variant"
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="4 7 4 4 20 4 20 7" />
                    <line x1="9" y1="20" x2="15" y2="20" />
                    <line x1="12" y1="4" x2="12" y2="20" />
                  </svg>
                  <span>Brand Name</span>
                </div>
                {!showLogo && (
                  <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-on-surface-variant leading-normal mt-0.5">
                Renders stylized typography on storefront
              </p>
            </button>

            <button
              type="button"
              onClick={() => setShowLogo(true)}
              className={`p-3 rounded-xl border flex flex-col gap-1 text-left transition-all cursor-pointer ${
                showLogo
                  ? "bg-surface-container-lowest border-primary shadow-xs ring-1 ring-primary/20"
                  : "bg-surface-container/30 border-transparent hover:bg-surface-container hover:border-outline-variant/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-on-surface">
                  <svg
                    className={`w-4 h-4 flex-shrink-0 ${
                      showLogo ? "text-primary" : "text-on-surface-variant"
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  <span>Client Logo</span>
                </div>
                {showLogo && (
                  <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-on-surface-variant leading-normal mt-0.5">
                Renders high-res brand logo graphic
              </p>
            </button>
          </div>

          {showLogo && !selectedFile && !previewUrl && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] flex items-center gap-2 mt-0.5">
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>Logo mode selected, but no logo uploaded yet. Storefront will use brand name until an image is attached.</span>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-surface-container mt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-[13px] font-medium text-on-surface transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-container text-[13px] font-semibold text-on-primary transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <span>{isEditing ? "Save Changes" : "Add Client"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export const ClientCreateEditModal: React.FC<ClientCreateEditModalProps> = ({
  isOpen,
  clientToEdit,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="client-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 transition-opacity animate-in fade-in duration-200"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <ClientFormContent
        key={clientToEdit?.id ?? "new-client"}
        clientToEdit={clientToEdit}
        onClose={onClose}
        onSave={onSave}
      />
    </div>
  );
};
