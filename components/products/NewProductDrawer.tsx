"use client";

import React, { useState } from "react";
import { AdminCategoryOption } from "@/lib/api/mappers";

interface NewProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (productData: {
    name: string;
    sku?: string;
    price: number;
    categoryId?: number | null;
    isActive: boolean;
    description?: string;
  }) => Promise<void> | void;
  categories: AdminCategoryOption[];
  isSubmitting?: boolean;
}

export function NewProductDrawer({
  isOpen,
  onClose,
  onAddProduct,
  categories,
  isSubmitting = false,
}: NewProductDrawerProps) {
  const [title, setTitle] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState<string>(
    categories[0]?.dbId ? String(categories[0].dbId) : ""
  );
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) return;

    await onAddProduct({
      name: title.trim(),
      sku: sku.trim() || undefined,
      price: parseFloat(price) || 0,
      categoryId: categoryId ? parseInt(categoryId, 10) : null,
      isActive,
      description: description.trim() || undefined,
    });

    onClose();
    // Reset form
    setTitle("");
    setSku("");
    setPrice("");
    setDescription("");
    setIsActive(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center select-none">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md bg-canvas rounded-t-2xl border-t border-border-default shadow-xl z-10 px-4 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200"
      >
        <div className="w-10 h-1 bg-border-default rounded-full mx-auto mb-3" />

        <div className="flex items-center justify-between pb-3 border-b border-border-default">
          <h3 className="text-sm font-semibold text-text-primary">
            New Catalog Product
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-surface-hover flex items-center justify-center text-text-secondary hover:text-text-primary active:scale-95"
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

        <div className="py-3 flex flex-col gap-3">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary block mb-1">
              Product Title *
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Aspen Cedar Log 3-Seater Swing"
              className="w-full h-10 px-3 rounded-lg bg-surface-subtle border border-border-default text-xs text-text-primary focus:outline-none focus:border-border-strong"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary block mb-1">
                SKU / Ref ID
              </label>
              <input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="TRE-0967BA"
                className="w-full h-10 px-3 rounded-lg bg-surface-subtle border border-border-default font-mono text-xs text-text-primary focus:outline-none focus:border-border-strong"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary block mb-1">
                Price (₹) *
              </label>
              <input
                required
                type="number"
                min="0"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="27999"
                className="w-full h-10 px-3 rounded-lg bg-surface-subtle border border-border-default font-mono text-xs text-text-primary focus:outline-none focus:border-border-strong"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary block mb-1">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-surface-subtle border border-border-default text-xs text-text-primary focus:outline-none focus:border-border-strong"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.dbId ?? ""}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary block mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key specifications, material, cushions..."
              className="w-full p-2 rounded-lg bg-surface-subtle border border-border-default text-xs text-text-primary focus:outline-none focus:border-border-strong resize-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary block mb-1.5">
              Publication Status
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsActive(true)}
                className={`flex-1 h-9 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 ${
                  isActive
                    ? "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]"
                    : "bg-surface-subtle text-text-secondary border-border-default"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                Active
              </button>
              <button
                type="button"
                onClick={() => setIsActive(false)}
                className={`flex-1 h-9 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 ${
                  !isActive
                    ? "bg-[#f4f4f5] text-[#71717a] border-[#e4e4e7]"
                    : "bg-surface-subtle text-text-secondary border-border-default"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#71717a]" />
                Draft
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-border-default">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-lg bg-primary text-on-primary text-xs font-semibold shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
