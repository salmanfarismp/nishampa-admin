"use client";

import React, { useState, useRef, useEffect } from "react";
import { AdminCategoryOption } from "@/lib/api/mappers";
import { ColorRow, ProductBadge } from "@/types/database";
import { CreateProductInput, getColors } from "@/lib/api/products";

interface NewProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (productData: CreateProductInput) => Promise<void> | void;
  categories: AdminCategoryOption[];
  colors?: ColorRow[];
  isSubmitting?: boolean;
}

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

const BADGE_OPTIONS: { value: ProductBadge; label: string; desc: string }[] = [
  { value: null, label: "None", desc: "No badge" },
  { value: "STAND INCLUDED", label: "Stand Included", desc: "Displays 'Stand Included' pill" },
  { value: "NEW", label: "New", desc: "Highlights new arrival" },
  { value: "POPULAR", label: "Popular", desc: "Marks as top trending" },
];

export function NewProductDrawer({
  isOpen,
  onClose,
  onAddProduct,
  categories,
  colors: initialColors,
  isSubmitting = false,
}: NewProductDrawerProps) {
  // Field States
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [userSelectedCategoryId, setUserSelectedCategoryId] = useState<string>("");
  const categoryId =
    userSelectedCategoryId || (categories[0]?.dbId ? String(categories[0].dbId) : "");

  const [description, setDescription] = useState("");
  const [badge, setBadge] = useState<ProductBadge>(null);
  const [hasHangingKit, setHasHangingKit] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Available Colors & Selection
  const [fetchedColors, setFetchedColors] = useState<ColorRow[]>([]);
  const [selectedColorIds, setSelectedColorIds] = useState<number[]>([]);
  const availableColors =
    initialColors && initialColors.length > 0 ? initialColors : fetchedColors;

  // Images: Sequential list up to 5 images (inspired by nearbyshops-app)
  // images[0] is always the Main / Hero Image
  // images[1..4] are the 4 additional gallery images
  const [images, setImages] = useState<ImageItem[]>([]);

  // Hidden File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch colors if not passed as prop
  useEffect(() => {
    let active = true;
    if (!initialColors || initialColors.length === 0) {
      getColors()
        .then((cols) => {
          if (active) setFetchedColors(cols);
        })
        .catch((err) => console.error("Error fetching colors in drawer:", err));
    }
    return () => {
      active = false;
    };
  }, [initialColors]);

  // Cleanup object URLs on unmount/removal
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, [images]);

  if (!isOpen) return null;

  // Add Files (multi-file or single file up to max 5)
  const handleAddFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = 5 - images.length;
    if (remainingSlots <= 0) {
      alert("You can upload a maximum of 5 images (1 Main + 4 Additional).");
      return;
    }

    const filesToAdd = Array.from(files).slice(0, remainingSlots);
    const newItems: ImageItem[] = filesToAdd.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newItems]);
  };

  // Remove an image at a specific index
  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => {
      const target = prev[indexToRemove];
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  // Promote any secondary image to the Hero slot (position 0)
  const handleMakeHero = (indexToPromote: number) => {
    if (indexToPromote === 0) return;
    setImages((prev) => {
      const next = [...prev];
      const [promoted] = next.splice(indexToPromote, 1);
      next.unshift(promoted);
      return next;
    });
  };

  // Color Toggle
  const toggleColor = (colorId: number) => {
    setSelectedColorIds((prev) =>
      prev.includes(colorId) ? prev.filter((id) => id !== colorId) : [...prev, colorId]
    );
  };

  // Discount Calculation Preview
  const numPrice = parseFloat(price);
  const numOrigPrice = parseFloat(originalPrice);
  const discountPercent =
    !isNaN(numPrice) && !isNaN(numOrigPrice) && numOrigPrice > numPrice && numPrice > 0
      ? Math.round(((numOrigPrice - numPrice) / numOrigPrice) * 100)
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    await onAddProduct({
      name: name.trim(),
      subtitle: subtitle.trim() || undefined,
      description: description.trim() || undefined,
      price: parseFloat(price) || 0,
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      categoryId: categoryId ? parseInt(categoryId, 10) : null,
      badge,
      hasHangingKit,
      isActive,
      colorIds: selectedColorIds,
      images: images.map((item) => item.file),
    });

    onClose();
    // Reset state
    setName("");
    setSubtitle("");
    setPrice("");
    setOriginalPrice("");
    setDescription("");
    setBadge(null);
    setHasHangingKit(false);
    setIsActive(true);
    setSelectedColorIds([]);
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center select-none overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Drawer Container */}
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-2xl bg-canvas sm:rounded-2xl rounded-t-2xl border border-border-default shadow-2xl z-10 flex flex-col max-h-[92vh] sm:max-h-[88vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 overflow-hidden"
      >
        {/* Mobile Pull Bar */}
        <div className="sm:hidden w-10 h-1 bg-border-default rounded-full mx-auto mt-2.5 mb-1" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-default bg-surface-subtle/50 shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-text-primary tracking-tight">
              Add New Product
            </h3>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Specify catalog details, pricing, media assets, and variants
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-text-secondary hover:text-text-primary active:scale-95 transition-all cursor-pointer"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 divide-y divide-border-subtle">
          {/* SECTION 1: PRODUCT IMAGES (Inspired by nearbyshops-app) */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-subtle">
                  Product Images
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-subtle text-text-secondary border border-border-default">
                  {images.length}/5 photos
                </span>
              </div>
              <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
                Auto-optimized (1080px WebP)
              </span>
            </div>

            {/* Hidden Input for Multiple Image Selection */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                handleAddFiles(e.target.files);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            />

            {/* Responsive Media Container: Square Hero on Left, 2x2 Square Grid on Right */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Left Column: Main / Hero Image Card (images[0]) */}
              <div className="w-full">
                {images.length > 0 ? (
                  <div className="relative aspect-square w-full max-w-[320px] sm:max-w-none mx-auto rounded-xl border border-border-default overflow-hidden bg-surface-subtle group shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={images[0].previewUrl}
                      alt="Main Display"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                    {/* Top Overlay Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-[2px] text-white text-[10px] font-semibold tracking-wide">
                        MAIN HERO IMAGE
                      </span>
                    </div>

                    {/* Top-Right Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(0)}
                      disabled={isSubmitting}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-md"
                      title="Remove Main Image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* Bottom Change Button on Hover */}
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSubmitting}
                        className="px-2.5 py-1 rounded bg-white/90 hover:bg-white text-text-primary text-[10px] font-semibold shadow-xs cursor-pointer"
                      >
                        Add More Photos
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Empty Main Image Dropzone (1:1 square) */
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                    className="aspect-square w-full max-w-[320px] sm:max-w-none mx-auto rounded-xl border-2 border-dashed border-border-default hover:border-border-strong bg-surface-subtle/50 hover:bg-surface-hover flex flex-col items-center justify-center gap-2.5 p-4 transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center text-primary transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="text-center px-2">
                      <span className="text-xs font-semibold text-text-primary block">
                        Upload Main Product Image
                      </span>
                      <span className="text-[10px] text-text-secondary mt-1 block leading-relaxed">
                        Square 1:1 (1080x1080px)<br />Click or drag up to 5 photos
                      </span>
                    </div>
                  </button>
                )}
              </div>

              {/* Right Column: 4-Slot Secondary Thumbnail Grid (Images 2 through 5) */}
              <div className="grid grid-cols-4 sm:grid-cols-2 gap-2 sm:gap-2.5 max-w-[320px] sm:max-w-none mx-auto w-full">
                {[1, 2, 3, 4].map((slotIndex) => {
                  const hasImage = images.length > slotIndex;
                  const imgItem = hasImage ? images[slotIndex] : null;
                  const isNextSlot = images.length === slotIndex && images.length < 5;

                  if (hasImage && imgItem) {
                    return (
                      <div
                        key={imgItem.id}
                        className="relative aspect-square rounded-lg border border-border-default overflow-hidden group bg-surface-subtle shadow-xs"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgItem.previewUrl}
                          alt={`Photo ${slotIndex + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Slot Order Badge */}
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-black/60 text-white text-[9px] font-mono">
                          #{slotIndex + 1}
                        </span>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(slotIndex)}
                          disabled={isSubmitting}
                          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90"
                          title="Remove photo"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>

                        {/* Set as Hero Button on Hover */}
                        <button
                          type="button"
                          onClick={() => handleMakeHero(slotIndex)}
                          disabled={isSubmitting}
                          className="absolute inset-x-0 bottom-0 py-1 bg-black/70 hover:bg-black/90 text-white text-[9px] font-semibold text-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Make this photo the Main Image"
                        >
                          Make Hero
                        </button>
                      </div>
                    );
                  }

                  if (isNextSlot) {
                    return (
                      <button
                        key={slotIndex}
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSubmitting}
                        className="aspect-square rounded-lg border-2 border-dashed border-border-default hover:border-border-strong bg-surface-subtle/50 hover:bg-surface-hover flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-text-subtle group-hover:text-text-primary transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span className="text-[10px] font-semibold text-text-secondary group-hover:text-text-primary">
                          Add Photo
                        </span>
                      </button>
                    );
                  }

                  // Inactive empty slot
                  return (
                    <div
                      key={slotIndex}
                      className="aspect-square rounded-lg border border-dashed border-border-subtle bg-surface-subtle/20 flex flex-col items-center justify-center gap-1 opacity-50"
                    >
                      <span className="text-[10px] font-mono text-text-subtle">#{slotIndex + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION 2: BASIC DETAILS */}
          <div className="space-y-3 pt-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-subtle">
              Basic Details
            </h4>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary block mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Royal Oak Teak Swing Bench"
                className="w-full h-10 px-3 rounded-lg bg-surface-subtle border border-border-default text-xs text-text-primary placeholder:text-text-subtle focus:outline-none focus:border-border-strong transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary block mb-1">
                Subtitle / Tagline
              </label>
              <input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Handcrafted Solid Cedar Wood"
                className="w-full h-10 px-3 rounded-lg bg-surface-subtle border border-border-default text-xs text-text-primary placeholder:text-text-subtle focus:outline-none focus:border-border-strong transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary block mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter comprehensive product specifications, wood finish, weight limits, cushions..."
                className="w-full p-3 rounded-lg bg-surface-subtle border border-border-default text-xs text-text-primary placeholder:text-text-subtle focus:outline-none focus:border-border-strong resize-none transition-colors"
              />
            </div>
          </div>

          {/* SECTION 3: CATEGORY & BADGE */}
          <div className="space-y-3 pt-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-subtle">
              Categorization & Badges
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary block mb-1">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setUserSelectedCategoryId(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-surface-subtle border border-border-default text-xs text-text-primary focus:outline-none focus:border-border-strong transition-colors cursor-pointer"
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.dbId ?? ""}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary block mb-1">
                  Product Badge
                </label>
                <select
                  value={badge || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setBadge(val ? (val as ProductBadge) : null);
                  }}
                  className="w-full h-10 px-3 rounded-lg bg-surface-subtle border border-border-default text-xs text-text-primary focus:outline-none focus:border-border-strong transition-colors cursor-pointer"
                >
                  {BADGE_OPTIONS.map((opt) => (
                    <option key={opt.label} value={opt.value || ""}>
                      {opt.label} {opt.desc ? `(${opt.desc})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 4: PRICING */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-subtle">
                Pricing (INR ₹)
              </h4>
              {discountPercent !== null && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary block mb-1">
                  Selling Price (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-text-subtle font-mono">
                    ₹
                  </span>
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="24999"
                    className="w-full h-10 pl-7 pr-3 rounded-lg bg-surface-subtle border border-border-default font-mono text-xs text-text-primary placeholder:text-text-subtle focus:outline-none focus:border-border-strong transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary block mb-1">
                  Original Price / MRP (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-text-subtle font-mono">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="29999"
                    className="w-full h-10 pl-7 pr-3 rounded-lg bg-surface-subtle border border-border-default font-mono text-xs text-text-primary placeholder:text-text-subtle focus:outline-none focus:border-border-strong transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: TOGGLES (Publication & Hanging Kit) */}
          <div className="space-y-3 pt-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-subtle">
              Status & Options
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Publication Status */}
              <div className="p-3 rounded-xl bg-surface-subtle border border-border-default flex flex-col justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-text-primary block">
                    Publication Status
                  </span>
                  <span className="text-[10px] text-text-secondary block">
                    {isActive ? "Visible in online catalog" : "Saved as unpublished draft"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsActive(true)}
                    className={`flex-1 h-8 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]"
                        : "bg-canvas text-text-secondary border-border-default hover:bg-surface-hover"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsActive(false)}
                    className={`flex-1 h-8 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      !isActive
                        ? "bg-[#f4f4f5] text-[#71717a] border-[#e4e4e7]"
                        : "bg-canvas text-text-secondary border-border-default hover:bg-surface-hover"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#71717a]" />
                    Draft
                  </button>
                </div>
              </div>

              {/* Hanging Kit Toggle */}
              <div className="p-3 rounded-xl bg-surface-subtle border border-border-default flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-text-primary block">
                    Hanging Kit
                  </span>
                  <span className="text-[10px] text-text-secondary block">
                    {hasHangingKit ? "Hanging accessories included" : "Not included with product"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setHasHangingKit(!hasHangingKit)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    hasHangingKit ? "bg-primary" : "bg-border-default"
                  }`}
                  aria-pressed={hasHangingKit}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      hasHangingKit ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 6: COLOR SELECTION */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-subtle">
                Color Options
              </h4>
              <span className="text-[10px] text-text-secondary">
                {selectedColorIds.length} selected
              </span>
            </div>

            {availableColors.length === 0 ? (
              <p className="text-xs text-text-secondary italic">No colors available in catalog.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableColors.map((c) => {
                  const isSelected = selectedColorIds.includes(c.id);
                  const hexCode = c.hashcode.startsWith("#") ? c.hashcode : `#${c.hashcode}`;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleColor(c.id)}
                      className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "bg-primary text-on-primary border-primary shadow-xs"
                          : "bg-surface-subtle text-text-primary border-border-default hover:border-border-strong"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 shadow-xs"
                        style={{ backgroundColor: hexCode }}
                      />
                      <span>{c.name}</span>
                      {isSelected && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3 ml-0.5 text-on-primary"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Form Footer */}
        <div className="p-4 border-t border-border-default bg-surface-subtle/50 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 h-10 rounded-lg border border-border-default text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !price}
            className="px-6 h-10 rounded-lg bg-primary text-on-primary text-xs font-semibold shadow-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Optimizing & Saving...
              </>
            ) : (
              "Create Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
