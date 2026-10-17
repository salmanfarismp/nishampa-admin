"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  ContentTab,
  FaqFilter,
  GalleryAsset,
  FaqItem,
  FaqStatus,
} from "@/components/content/types";
import {
  getLifeStyleImages,
  uploadLifeStyleImage,
  deleteLifeStyleImage,
  deleteLifeStyleImages,
  getFaqs,
  createFaq,
  updateFaq,
  toggleFaqStatus,
  deleteFaq,
} from "@/lib/api/content";
import { ContentHeader } from "@/components/content/ContentHeader";
import { ContentToast } from "@/components/content/ContentToast";

// Gallery Subcomponents
import { GalleryActionBar } from "@/components/content/gallery/GalleryActionBar";
import { GalleryGrid } from "@/components/content/gallery/GalleryGrid";
import { GalleryUploadModal } from "@/components/content/gallery/GalleryUploadModal";
import { GalleryDetailModal } from "@/components/content/gallery/GalleryDetailModal";

// FAQ Subcomponents
import { FaqFilterChips } from "@/components/content/faqs/FaqFilterChips";
import { FaqSearchBar } from "@/components/content/faqs/FaqSearchBar";
import { FaqCard } from "@/components/content/faqs/FaqCard";
import { FaqFloatingActionButton } from "@/components/content/faqs/FaqFloatingActionButton";
import { FaqCreateEditModal } from "@/components/content/faqs/FaqCreateEditModal";
import { FaqActionSheet } from "@/components/content/faqs/FaqActionSheet";

export default function ContentPage() {
  // Navigation View State
  const [activeTab, setActiveTab] = useState<ContentTab>("gallery");

  // Gallery State (Supabase LifeStyleImage)
  const [galleryAssets, setGalleryAssets] = useState<GalleryAsset[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);
  const [galleryError, setGalleryError] = useState<string | null>(null);

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(
    new Set(),
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeDetailAsset, setActiveDetailAsset] =
    useState<GalleryAsset | null>(null);

  // FAQ State (Supabase Faq)
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(true);
  const [faqError, setFaqError] = useState<string | null>(null);
  const [faqFilter, setFaqFilter] = useState<FaqFilter>("all");
  const [faqSearchQuery, setFaqSearchQuery] = useState("");
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [faqToEdit, setFaqToEdit] = useState<FaqItem | null>(null);
  const [activeFaqMenu, setActiveFaqMenu] = useState<FaqItem | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 3000);
  };

  // Fetch lifestyle gallery from Supabase
  const reloadGallery = useCallback(async () => {
    setIsLoadingGallery(true);
    setGalleryError(null);
    try {
      const assets = await getLifeStyleImages();
      setGalleryAssets(assets);
    } catch (err: unknown) {
      console.error("Failed to load lifestyle gallery images:", err);
      setGalleryError(
        err instanceof Error
          ? err.message
          : "Unable to load gallery images from Supabase.",
      );
    } finally {
      setIsLoadingGallery(false);
    }
  }, []);

  // Fetch FAQs from Supabase
  const reloadFaqs = useCallback(async () => {
    setIsLoadingFaqs(true);
    setFaqError(null);
    try {
      const items = await getFaqs();
      setFaqs(items);
    } catch (err: unknown) {
      console.error("Failed to load FAQs:", err);
      setFaqError(
        err instanceof Error
          ? err.message
          : "Unable to load FAQs from Supabase.",
      );
    } finally {
      setIsLoadingFaqs(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadInitialData() {
      try {
        const [assets, faqItems] = await Promise.all([
          getLifeStyleImages().catch((err) => {
            console.error("Failed to load lifestyle gallery images:", err);
            if (!cancelled) {
              setGalleryError(
                err instanceof Error
                  ? err.message
                  : "Unable to load gallery images from Supabase.",
              );
            }
            return [];
          }),
          getFaqs().catch((err) => {
            console.error("Failed to load FAQs:", err);
            if (!cancelled) {
              setFaqError(
                err instanceof Error
                  ? err.message
                  : "Unable to load FAQs from Supabase.",
              );
            }
            return [];
          }),
        ]);

        if (!cancelled) {
          setGalleryAssets(assets);
          setIsLoadingGallery(false);
          setFaqs(faqItems);
          setIsLoadingFaqs(false);
        }
      } catch (err) {
        if (!cancelled) {
          setIsLoadingGallery(false);
          setIsLoadingFaqs(false);
        }
      }
    }

    loadInitialData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Computations
  const faqCounts = useMemo(() => {
    const all = faqs.length;
    const published = faqs.filter((f) => f.status === "published").length;
    const draft = faqs.filter((f) => f.status === "draft").length;
    return { all, published, draft };
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    const q = faqSearchQuery.toLowerCase().trim();

    return faqs.filter((faq) => {
      // Status Filter
      if (faqFilter === "published" && faq.status !== "published") return false;
      if (faqFilter === "draft" && faq.status !== "draft") return false;

      // Search Query
      if (q) {
        const matchQ = faq.question.toLowerCase().includes(q);
        const matchA = faq.answer.toLowerCase().includes(q);
        if (!matchQ && !matchA) return false;
      }

      return true;
    });
  }, [faqs, faqFilter, faqSearchQuery]);

  // Gallery Actions
  const handleUploadAsset = async (newAssetData: {
    file?: File | null;
    url: string;
    alt: string;
    tag: string;
    dimensions: string;
    fileSize: string;
  }) => {
    if (newAssetData.file) {
      try {
        const created = await uploadLifeStyleImage(newAssetData.file);
        setGalleryAssets((prev) => [created, ...prev]);
        showToast("Photo uploaded to lifestyle gallery");
      } catch (err) {
        console.error("Failed to upload image:", err);
        showToast("Failed to upload photo to Supabase storage");
        throw err;
      }
    } else {
      const newAsset: GalleryAsset = {
        id: `gal-${Date.now()}`,
        url: newAssetData.url,
        alt: newAssetData.alt,
        tag: newAssetData.tag,
        uploadedAt: "Just now",
        dimensions: newAssetData.dimensions,
        fileSize: newAssetData.fileSize,
      };
      setGalleryAssets((prev) => [newAsset, ...prev]);
      showToast("Photo added to brand gallery");
    }
  };

  const handleDeleteAsset = async (id: string, rawPath?: string) => {
    const backup = [...galleryAssets];
    // Optimistic delete
    setGalleryAssets((prev) => prev.filter((a) => a.id !== id));
    setSelectedAssetIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

    try {
      await deleteLifeStyleImage(id, rawPath);
      showToast("Photo removed from brand gallery");
    } catch (err) {
      console.error("Failed to delete lifestyle image:", err);
      setGalleryAssets(backup);
      showToast("Failed to remove photo from database");
    }
  };

  const handleToggleSelectAsset = (id: string) => {
    setSelectedAssetIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAllAssets = () => {
    if (selectedAssetIds.size === galleryAssets.length) {
      setSelectedAssetIds(new Set());
    } else {
      setSelectedAssetIds(new Set(galleryAssets.map((a) => a.id)));
    }
  };

  const handleDeleteSelectedAssets = async () => {
    const idsToDelete = Array.from(selectedAssetIds);
    const count = idsToDelete.length;
    if (count === 0) return;

    const backup = [...galleryAssets];
    // Optimistic bulk delete
    setGalleryAssets((prev) => prev.filter((a) => !selectedAssetIds.has(a.id)));
    setSelectedAssetIds(new Set());
    setIsSelecting(false);

    try {
      await deleteLifeStyleImages(idsToDelete);
      showToast(
        `${count} photo${count > 1 ? "s" : ""} removed from brand gallery`,
      );
    } catch (err) {
      console.error("Failed to bulk delete lifestyle images:", err);
      setGalleryAssets(backup);
      showToast("Failed to remove photos from database");
    }
  };

  // FAQ Actions
  const handleSaveFaq = async (data: {
    id?: string;
    question: string;
    answer: string;
    status: FaqStatus;
  }) => {
    const backup = [...faqs];
    if (data.id) {
      // Optimistic update
      setFaqs((prev) =>
        prev.map((f) =>
          f.id === data.id
            ? {
                ...f,
                question: data.question,
                answer: data.answer,
                status: data.status,
                updatedAt: "Updated just now",
              }
            : f,
        ),
      );
      showToast("FAQ updated successfully");
      try {
        const updated = await updateFaq(data.id, {
          question: data.question,
          answer: data.answer,
          status: data.status,
        });
        setFaqs((prev) => prev.map((f) => (f.id === data.id ? updated : f)));
      } catch (err) {
        console.error("Failed to update FAQ:", err);
        setFaqs(backup);
        showToast("Failed to save FAQ to database");
      }
    } else {
      // Optimistic create
      const tempId = `temp-${Date.now()}`;
      const optimisticFaq: FaqItem = {
        id: tempId,
        question: data.question,
        answer: data.answer,
        status: data.status,
        updatedAt: "Created just now",
      };
      setFaqs((prev) => [optimisticFaq, ...prev]);
      showToast(
        data.status === "published"
          ? "New FAQ published to storefront"
          : "FAQ saved to drafts",
      );
      try {
        const created = await createFaq({
          question: data.question,
          answer: data.answer,
          status: data.status,
        });
        setFaqs((prev) => prev.map((f) => (f.id === tempId ? created : f)));
      } catch (err) {
        console.error("Failed to create FAQ:", err);
        setFaqs(backup);
        showToast("Failed to save FAQ to database");
      }
    }
    setFaqToEdit(null);
  };

  const handleToggleFaqStatus = async (faq: FaqItem) => {
    const nextStatus: FaqStatus =
      faq.status === "published" ? "draft" : "published";
    const backup = [...faqs];
    setFaqs((prev) =>
      prev.map((f) =>
        f.id === faq.id
          ? {
              ...f,
              status: nextStatus,
              updatedAt: "Status updated just now",
            }
          : f,
      ),
    );
    showToast(
      nextStatus === "published"
        ? "FAQ published to storefront"
        : "FAQ moved to drafts",
    );
    try {
      const updated = await toggleFaqStatus(faq.id, faq.status);
      setFaqs((prev) => prev.map((f) => (f.id === faq.id ? updated : f)));
    } catch (err) {
      console.error("Failed to toggle FAQ status:", err);
      setFaqs(backup);
      showToast("Failed to update FAQ status in database");
    }
  };

  const handleDuplicateFaq = async (faq: FaqItem) => {
    const tempId = `temp-${Date.now()}`;
    const backup = [...faqs];
    const clone: FaqItem = {
      ...faq,
      id: tempId,
      question: `${faq.question} (Copy)`,
      status: "draft",
      updatedAt: "Duplicated just now",
    };
    setFaqs((prev) => [clone, ...prev]);
    showToast("FAQ duplicated as draft");

    try {
      const created = await createFaq({
        question: clone.question,
        answer: clone.answer,
        status: "draft",
      });
      setFaqs((prev) => prev.map((f) => (f.id === tempId ? created : f)));
    } catch (err) {
      console.error("Failed to duplicate FAQ in database:", err);
      setFaqs(backup);
      showToast("Failed to duplicate FAQ in database");
    }
  };

  const handleDeleteFaq = async (faq: FaqItem) => {
    const backup = [...faqs];
    setFaqs((prev) => prev.filter((f) => f.id !== faq.id));
    showToast("FAQ removed from storefront");

    try {
      await deleteFaq(faq.id);
    } catch (err) {
      console.error("Failed to delete FAQ from database:", err);
      setFaqs(backup);
      showToast("Failed to delete FAQ from database");
    }
  };

  return (
    <div className="flex flex-col w-full pb-8 relative min-h-full">
      {/* Toast Notification Micro-interaction */}
      <ContentToast
        message={toastMessage}
        isVisible={isToastVisible}
        onDismiss={() => setIsToastVisible(false)}
      />

      {/* Main Header & Segmented View Switcher */}
      <ContentHeader
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setIsSelecting(false);
        }}
        galleryCount={galleryAssets.length}
        faqCount={faqs.length}
      />

      {/* VIEW 1: GALLERY MANAGEMENT */}
      {activeTab === "gallery" && (
        <section
          id="gallery-panel"
          aria-labelledby="tab-gallery"
          className="flex flex-col gap-2.5 animate-in fade-in duration-200"
        >
          {/* Action Bar with Select Toggle */}
          <GalleryActionBar
            totalCount={galleryAssets.length}
            isSelecting={isSelecting}
            selectedCount={selectedAssetIds.size}
            onToggleSelectMode={() => {
              setIsSelecting(!isSelecting);
              setSelectedAssetIds(new Set());
            }}
            onSelectAll={handleSelectAllAssets}
            onDeleteSelected={handleDeleteSelectedAssets}
          />

          {/* 2-Column Responsive Image Grid */}
          <GalleryGrid
            assets={galleryAssets}
            isSelecting={isSelecting}
            selectedIds={selectedAssetIds}
            isLoading={isLoadingGallery}
            error={galleryError}
            onRetry={reloadGallery}
            onToggleSelect={handleToggleSelectAsset}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onOpenDetail={(asset) => setActiveDetailAsset(asset)}
          />
        </section>
      )}

      {/* VIEW 2: FAQS MANAGEMENT */}
      {activeTab === "faqs" && (
        <section
          id="faqs-panel"
          aria-labelledby="tab-faqs"
          className="flex flex-col gap-2.5 animate-in fade-in duration-200 pb-20"
        >
          {/* Search Bar */}
          <FaqSearchBar
            query={faqSearchQuery}
            onChange={setFaqSearchQuery}
            onClear={() => setFaqSearchQuery("")}
          />

          {/* Quick Filter Chips */}
          <FaqFilterChips
            activeFilter={faqFilter}
            onSelectFilter={setFaqFilter}
            counts={faqCounts}
          />

          {/* FAQ Card Stream */}
          <div className="flex flex-col gap-2.5 pt-0.5" id="faqListContainer">
            {isLoadingFaqs ? (
              <div className="flex flex-col gap-2.5 animate-pulse">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="h-24 bg-surface-container-low rounded-2xl border border-outline-variant/30"
                  />
                ))}
              </div>
            ) : faqError ? (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-surface-container-lowest rounded-2xl border border-red-200 mt-2">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
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
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h3 className="text-[15px] font-semibold text-on-surface">
                  Failed to Load FAQs
                </h3>
                <p className="text-[12px] text-on-surface-variant max-w-xs mt-1">
                  {faqError}
                </p>
                <button
                  type="button"
                  onClick={reloadFaqs}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-[12px] font-medium text-on-surface transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <FaqCard
                  key={faq.id}
                  faq={faq}
                  onOpenMenu={(item) => setActiveFaqMenu(item)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-surface-container-lowest rounded-2xl border border-dashed border-border-default/80 mt-2">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-2">
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
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <h3 className="text-[15px] font-semibold text-on-surface">
                  No Questions Found
                </h3>
                <p className="text-[12px] text-on-surface-variant max-w-xs mt-1">
                  {faqSearchQuery
                    ? `No FAQs matched "${faqSearchQuery}". Try clearing search or selecting a different filter.`
                    : "No questions match the selected filter."}
                </p>
                {faqSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setFaqSearchQuery("")}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-[12px] font-medium text-on-surface transition-colors cursor-pointer"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Floating Action Button (FAB) matching screen.png */}
          <FaqFloatingActionButton
            onClick={() => {
              setFaqToEdit(null);
              setIsFaqModalOpen(true);
            }}
          />
        </section>
      )}

      {/* --- MODALS & DRAWERS --- */}

      {/* 1. CDN Upload Modal */}
      <GalleryUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadAsset}
      />

      {/* 2. Photo Lightbox Detail Modal */}
      <GalleryDetailModal
        asset={activeDetailAsset}
        isOpen={Boolean(activeDetailAsset)}
        onClose={() => setActiveDetailAsset(null)}
        onDelete={handleDeleteAsset}
      />

      {/* 3. FAQ Create / Edit Modal */}
      <FaqCreateEditModal
        isOpen={isFaqModalOpen}
        faqToEdit={faqToEdit}
        onClose={() => {
          setIsFaqModalOpen(false);
          setFaqToEdit(null);
        }}
        onSave={handleSaveFaq}
      />

      {/* 4. FAQ Actions Bottom Sheet */}
      <FaqActionSheet
        faq={activeFaqMenu}
        isOpen={Boolean(activeFaqMenu)}
        onClose={() => setActiveFaqMenu(null)}
        onEdit={(item) => {
          setFaqToEdit(item);
          setIsFaqModalOpen(true);
        }}
        onToggleStatus={handleToggleFaqStatus}
        onDuplicate={handleDuplicateFaq}
        onDelete={handleDeleteFaq}
      />
    </div>
  );
}
