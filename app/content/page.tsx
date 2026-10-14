"use client";

import React, { useState, useMemo } from "react";
import {
  ContentTab,
  FaqCategory,
  GalleryAsset,
  FaqItem,
  ContentStats,
  FaqStatus,
} from "@/components/content/types";
import {
  INITIAL_GALLERY_ASSETS,
  INITIAL_FAQS,
} from "@/components/content/mockData";
import { ContentHeader } from "@/components/content/ContentHeader";
import { ContentToast } from "@/components/content/ContentToast";
import { ContentAnalyticsModal } from "@/components/content/ContentAnalyticsModal";

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

  // Gallery State
  const [galleryAssets, setGalleryAssets] = useState<GalleryAsset[]>(
    INITIAL_GALLERY_ASSETS,
  );
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(
    new Set(),
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeDetailAsset, setActiveDetailAsset] =
    useState<GalleryAsset | null>(null);

  // FAQ State
  const [faqs, setFaqs] = useState<FaqItem[]>(INITIAL_FAQS);
  const [faqFilter, setFaqFilter] = useState<
    FaqCategory | "published" | "draft"
  >("all");
  const [faqSearchQuery, setFaqSearchQuery] = useState("");
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [faqToEdit, setFaqToEdit] = useState<FaqItem | null>(null);
  const [activeFaqMenu, setActiveFaqMenu] = useState<FaqItem | null>(null);

  // Analytics Modal State
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

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
      // Category / Status Filter
      if (faqFilter === "published" && faq.status !== "published") return false;
      if (faqFilter === "draft" && faq.status !== "draft") return false;
      if (
        faqFilter !== "all" &&
        faqFilter !== "published" &&
        faqFilter !== "draft" &&
        faq.category !== faqFilter
      ) {
        return false;
      }

      // Search Query
      if (q) {
        const matchQ = faq.question.toLowerCase().includes(q);
        const matchA = faq.answer.toLowerCase().includes(q);
        const matchC = faq.category.toLowerCase().includes(q);
        if (!matchQ && !matchA && !matchC) return false;
      }

      return true;
    });
  }, [faqs, faqFilter, faqSearchQuery]);

  const stats: ContentStats = useMemo(() => {
    return {
      totalAssets: galleryAssets.length,
      totalFaqs: faqs.length,
      publishedFaqs: faqCounts.published,
      draftFaqs: faqCounts.draft,
      cdnStorageUsedMb: galleryAssets.length * 2.2,
      cdnStorageLimitMb: 500,
      monthlyViews: "34.2k",
    };
  }, [galleryAssets.length, faqs.length, faqCounts]);

  // Gallery Actions
  const handleUploadAsset = (newAssetData: {
    url: string;
    alt: string;
    tag: string;
    dimensions: string;
    fileSize: string;
  }) => {
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
    showToast("Photo uploaded and queued for CDN deploy");
  };

  const handleDeleteAsset = (id: string) => {
    setGalleryAssets((prev) => prev.filter((a) => a.id !== id));
    setSelectedAssetIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    showToast("Photo removed from brand gallery");
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

  const handleDeleteSelectedAssets = () => {
    const count = selectedAssetIds.size;
    setGalleryAssets((prev) => prev.filter((a) => !selectedAssetIds.has(a.id)));
    setSelectedAssetIds(new Set());
    setIsSelecting(false);
    showToast(
      `${count} photo${count > 1 ? "s" : ""} removed from brand gallery`,
    );
  };

  // FAQ Actions
  const handleSaveFaq = (data: {
    id?: string;
    question: string;
    answer: string;
    category: "shipping" | "returns" | "materials" | "warranty" | "general";
    status: FaqStatus;
  }) => {
    if (data.id) {
      // Update
      setFaqs((prev) =>
        prev.map((f) =>
          f.id === data.id
            ? {
                ...f,
                question: data.question,
                answer: data.answer,
                category: data.category,
                status: data.status,
                updatedAt: "Updated just now",
              }
            : f,
        ),
      );
      showToast("FAQ updated successfully");
    } else {
      // Create new
      const newFaq: FaqItem = {
        id: `faq-${Date.now()}`,
        question: data.question,
        answer: data.answer,
        category: data.category,
        status: data.status,
        updatedAt: "Created just now",
      };
      setFaqs((prev) => [newFaq, ...prev]);
      showToast(
        data.status === "published"
          ? "New FAQ published to storefront"
          : "FAQ saved to drafts",
      );
    }
    setFaqToEdit(null);
  };

  const handleToggleFaqStatus = (faq: FaqItem) => {
    const nextStatus: FaqStatus =
      faq.status === "published" ? "draft" : "published";
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
  };

  const handleDuplicateFaq = (faq: FaqItem) => {
    const clone: FaqItem = {
      ...faq,
      id: `faq-${Date.now()}`,
      question: `${faq.question} (Copy)`,
      status: "draft",
      updatedAt: "Duplicated just now",
    };
    setFaqs((prev) => [clone, ...prev]);
    showToast("FAQ duplicated as draft");
  };

  const handleDeleteFaq = (faq: FaqItem) => {
    setFaqs((prev) => prev.filter((f) => f.id !== faq.id));
    showToast("FAQ removed from storefront");
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
            {filteredFaqs.length > 0 ? (
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
                    : "No questions match the selected category filter."}
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
