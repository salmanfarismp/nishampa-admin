"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  ContentTab,
  GalleryAsset,
  ServiceReviewItem,
} from "@/components/content/types";
import {
  getLifeStyleImages,
  uploadLifeStyleImage,
  updateGalleryItem,
  deleteLifeStyleImage,
  deleteLifeStyleImages,
  getServiceReviews,
  createServiceReview,
  updateServiceReview,
  deleteServiceReview,
  formatReviewSubtitle,
} from "@/lib/api/content";
import { ContentHeader } from "@/components/content/ContentHeader";
import { ContentToast } from "@/components/content/ContentToast";

// Gallery Subcomponents
import { GalleryActionBar } from "@/components/content/gallery/GalleryActionBar";
import { GalleryGrid } from "@/components/content/gallery/GalleryGrid";
import { GalleryUploadModal } from "@/components/content/gallery/GalleryUploadModal";
import { GalleryDetailModal } from "@/components/content/gallery/GalleryDetailModal";

// Service Review Subcomponents
import { ServiceReviewSearchBar } from "@/components/content/service-reviews/ServiceReviewSearchBar";
import { ServiceReviewCard } from "@/components/content/service-reviews/ServiceReviewCard";
import { ServiceReviewFloatingActionButton } from "@/components/content/service-reviews/ServiceReviewFloatingActionButton";
import { ServiceReviewCreateEditModal } from "@/components/content/service-reviews/ServiceReviewCreateEditModal";
import { ServiceReviewActionSheet } from "@/components/content/service-reviews/ServiceReviewActionSheet";

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

  // Service Reviews State (Supabase ServiceReview)
  const [serviceReviews, setServiceReviews] = useState<ServiceReviewItem[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [reviewSearchQuery, setReviewSearchQuery] = useState("");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState<ServiceReviewItem | null>(null);
  const [activeReviewMenu, setActiveReviewMenu] = useState<ServiceReviewItem | null>(null);

  // Toast Notification State with timer ref
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((message: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMessage(message);
    setIsToastVisible(true);
    toastTimerRef.current = setTimeout(() => {
      setIsToastVisible(false);
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

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

  // Fetch Service Reviews from Supabase
  const reloadReviews = useCallback(async () => {
    setIsLoadingReviews(true);
    setReviewsError(null);
    try {
      const items = await getServiceReviews();
      setServiceReviews(items);
    } catch (err: unknown) {
      console.error("Failed to load Service Reviews:", err);
      setReviewsError(
        err instanceof Error
          ? err.message
          : "Unable to load service reviews from Supabase.",
      );
    } finally {
      setIsLoadingReviews(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadInitialData() {
      try {
        const [assets, reviewItems] = await Promise.all([
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
          getServiceReviews().catch((err) => {
            console.error("Failed to load service reviews:", err);
            if (!cancelled) {
              setReviewsError(
                err instanceof Error
                  ? err.message
                  : "Unable to load service reviews from Supabase.",
              );
            }
            return [];
          }),
        ]);

        if (!cancelled) {
          setGalleryAssets(assets);
          setIsLoadingGallery(false);
          setServiceReviews(reviewItems);
          setIsLoadingReviews(false);
        }
      } catch {
        if (!cancelled) {
          setIsLoadingGallery(false);
          setIsLoadingReviews(false);
        }
      }
    }

    loadInitialData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Search Filter Computation
  const filteredReviews = useMemo(() => {
    const q = reviewSearchQuery.toLowerCase().trim();
    if (!q) return serviceReviews;

    return serviceReviews.filter((review) => {
      const matchName = review.name.toLowerCase().includes(q);
      const matchComment = review.comment.toLowerCase().includes(q);
      const matchOccupation = review.occupation.toLowerCase().includes(q);
      const matchPlace = review.place.toLowerCase().includes(q);
      const matchSubtitle = review.displaySubtitle.toLowerCase().includes(q);

      return (
        matchName ||
        matchComment ||
        matchOccupation ||
        matchPlace ||
        matchSubtitle
      );
    });
  }, [serviceReviews, reviewSearchQuery]);

  // Gallery Actions
  const handleUploadAsset = async (newAssetData: {
    file?: File | null;
    url: string;
    alt: string;
    tag: string;
    title?: string;
    description?: string;
    dimensions: string;
    fileSize: string;
  }) => {
    if (newAssetData.file) {
      try {
        const created = await uploadLifeStyleImage(newAssetData.file, {
          tag: newAssetData.tag,
          title: newAssetData.title,
          description: newAssetData.description,
        });
        setGalleryAssets((prev) => [created, ...prev]);
        showToast("Added to Workshops & Speaking gallery");
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
        title: newAssetData.title,
        description: newAssetData.description,
        uploadedAt: "Just now",
        dimensions: newAssetData.dimensions,
        fileSize: newAssetData.fileSize,
      };
      setGalleryAssets((prev) => [newAsset, ...prev]);
      showToast("Added to Workshops & Speaking gallery");
    }
  };

  const handleUpdateAsset = async (
    id: string,
    updates: { tag?: string; title?: string; description?: string }
  ) => {
    const backup = [...galleryAssets];
    // Optimistic update
    setGalleryAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
    setActiveDetailAsset((prev) =>
      prev && prev.id === id ? { ...prev, ...updates } : prev
    );
    showToast("Item details updated");

    try {
      const updated = await updateGalleryItem(id, updates);
      setGalleryAssets((prev) =>
        prev.map((a) => (a.id === id ? updated : a))
      );
      setActiveDetailAsset(updated);
    } catch (err) {
      console.error("Failed to update gallery item:", err);
      setGalleryAssets(backup);
      showToast("Failed to save changes to database");
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

  // Service Review Actions
  const handleSaveReview = async (data: {
    id?: string;
    name: string;
    occupation: string;
    place: string;
    comment: string;
  }) => {
    const backup = [...serviceReviews];
    const subtitle = formatReviewSubtitle(data.occupation, data.place);

    if (data.id) {
      // Optimistic update
      setServiceReviews((prev) =>
        prev.map((r) =>
          r.id === data.id
            ? {
                ...r,
                name: data.name,
                occupation: data.occupation,
                place: data.place,
                comment: data.comment,
                displaySubtitle: subtitle,
              }
            : r
        )
      );
      showToast("Service review updated");

      try {
        const updated = await updateServiceReview(data.id, {
          name: data.name,
          occupation: data.occupation,
          place: data.place,
          comment: data.comment,
        });
        setServiceReviews((prev) =>
          prev.map((r) => (r.id === data.id ? updated : r))
        );
      } catch (err) {
        console.error("Failed to update service review:", err);
        setServiceReviews(backup);
        showToast("Failed to save review to database");
      }
    } else {
      // Optimistic create
      const tempId = `temp-${Date.now()}`;
      const optimisticReview: ServiceReviewItem = {
        id: tempId,
        rawId: 0,
        name: data.name,
        occupation: data.occupation,
        place: data.place,
        comment: data.comment,
        createdAt: "Just now",
        displaySubtitle: subtitle,
      };
      setServiceReviews((prev) => [optimisticReview, ...prev]);
      showToast("Service review added");

      try {
        const created = await createServiceReview({
          name: data.name,
          occupation: data.occupation,
          place: data.place,
          comment: data.comment,
        });
        setServiceReviews((prev) =>
          prev.map((r) => (r.id === tempId ? created : r))
        );
      } catch (err) {
        console.error("Failed to create service review:", err);
        setServiceReviews(backup);
        showToast("Failed to save review to database");
      }
    }
    setReviewToEdit(null);
  };

  const handleDeleteReview = async (review: ServiceReviewItem) => {
    const backup = [...serviceReviews];
    setServiceReviews((prev) => prev.filter((r) => r.id !== review.id));
    showToast("Service review removed");

    try {
      await deleteServiceReview(review.id);
    } catch (err) {
      console.error("Failed to delete service review from database:", err);
      setServiceReviews(backup);
      showToast("Failed to delete review from database");
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
        serviceReviewCount={serviceReviews.length}
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

      {/* VIEW 2: SERVICE REVIEWS MANAGEMENT */}
      {activeTab === "service-reviews" && (
        <section
          id="service-reviews-panel"
          aria-labelledby="tab-service-reviews"
          className="flex flex-col gap-2.5 animate-in fade-in duration-200 pb-20"
        >
          {/* Search Bar */}
          <ServiceReviewSearchBar
            query={reviewSearchQuery}
            onChange={setReviewSearchQuery}
            onClear={() => setReviewSearchQuery("")}
          />

          {/* Service Reviews Stream */}
          <div className="flex flex-col gap-2.5 pt-0.5" id="reviewListContainer">
            {isLoadingReviews ? (
              <div className="flex flex-col gap-2.5 animate-pulse">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-28 bg-surface-container-low rounded-2xl border border-outline-variant/30"
                  />
                ))}
              </div>
            ) : reviewsError ? (
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
                  Failed to Load Service Reviews
                </h3>
                <p className="text-[12px] text-on-surface-variant max-w-xs mt-1">
                  {reviewsError}
                </p>
                <button
                  type="button"
                  onClick={reloadReviews}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-[12px] font-medium text-on-surface transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <ServiceReviewCard
                  key={review.id}
                  review={review}
                  onOpenMenu={(item) => setActiveReviewMenu(item)}
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
                  No Service Reviews Found
                </h3>
                <p className="text-[12px] text-on-surface-variant max-w-xs mt-1">
                  {reviewSearchQuery
                    ? `No reviews matched "${reviewSearchQuery}". Try clearing search.`
                    : "No client service reviews added yet. Tap '+' to create the first review."}
                </p>
                {reviewSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setReviewSearchQuery("")}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-[12px] font-medium text-on-surface transition-colors cursor-pointer"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Floating Action Button (FAB) */}
          <ServiceReviewFloatingActionButton
            onClick={() => {
              setReviewToEdit(null);
              setIsReviewModalOpen(true);
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
        onUpdate={handleUpdateAsset}
      />

      {/* 3. Service Review Create / Edit Modal */}
      <ServiceReviewCreateEditModal
        isOpen={isReviewModalOpen}
        reviewToEdit={reviewToEdit}
        onClose={() => {
          setIsReviewModalOpen(false);
          setReviewToEdit(null);
        }}
        onSave={handleSaveReview}
      />

      {/* 4. Service Review Actions Bottom Sheet */}
      <ServiceReviewActionSheet
        review={activeReviewMenu}
        isOpen={Boolean(activeReviewMenu)}
        onClose={() => setActiveReviewMenu(null)}
        onEdit={(item) => {
          setReviewToEdit(item);
          setIsReviewModalOpen(true);
        }}
        onDelete={handleDeleteReview}
      />
    </div>
  );
}
