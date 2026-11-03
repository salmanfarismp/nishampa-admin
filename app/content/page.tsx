"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  ContentTab,
  ContentStatusFilter,
  GalleryAsset,
  ServiceReviewItem,
  ClientItem,
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
  toggleServiceReviewStatus,
  deleteServiceReview,
  getClients,
  createClient,
  updateClient,
  deleteClient,
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
import { ServiceReviewFilterChips } from "@/components/content/service-reviews/ServiceReviewFilterChips";
import { ServiceReviewCard } from "@/components/content/service-reviews/ServiceReviewCard";
import { ServiceReviewFloatingActionButton } from "@/components/content/service-reviews/ServiceReviewFloatingActionButton";
import { ServiceReviewCreateEditModal } from "@/components/content/service-reviews/ServiceReviewCreateEditModal";
import { ServiceReviewActionSheet } from "@/components/content/service-reviews/ServiceReviewActionSheet";

// Client Subcomponents
import { ClientCard } from "@/components/content/clients/ClientCard";
import { ClientSearchBar } from "@/components/content/clients/ClientSearchBar";
import { ClientFloatingActionButton } from "@/components/content/clients/ClientFloatingActionButton";
import { ClientCreateEditModal } from "@/components/content/clients/ClientCreateEditModal";
import { ClientActionSheet } from "@/components/content/clients/ClientActionSheet";

export default function ContentPage() {
  // Navigation View State
  const [activeTab, setActiveTab] = useState<ContentTab>("gallery");

  // Filters for Draft Mode
  const [galleryFilter, setGalleryFilter] = useState<ContentStatusFilter>("all");
  const [serviceReviewFilter, setServiceReviewFilter] = useState<ContentStatusFilter>("all");

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

  // Clients State (Supabase Client)
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [clientsError, setClientsError] = useState<string | null>(null);
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<ClientItem | null>(null);
  const [activeClientMenu, setActiveClientMenu] = useState<ClientItem | null>(null);

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

  // Fetch Clients from Supabase
  const reloadClients = useCallback(async () => {
    setIsLoadingClients(true);
    setClientsError(null);
    try {
      const items = await getClients();
      setClients(items);
    } catch (err: unknown) {
      console.error("Failed to load Clients:", err);
      setClientsError(
        err instanceof Error
          ? err.message
          : "Unable to load clients from Supabase.",
      );
    } finally {
      setIsLoadingClients(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadInitialData() {
      try {
        const [assets, reviewItems, clientItems] = await Promise.all([
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
          getClients().catch((err) => {
            console.error("Failed to load clients:", err);
            if (!cancelled) {
              setClientsError(
                err instanceof Error
                  ? err.message
                  : "Unable to load clients from Supabase.",
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
          setClients(clientItems);
          setIsLoadingClients(false);
        }
      } catch {
        if (!cancelled) {
          setIsLoadingGallery(false);
          setIsLoadingReviews(false);
          setIsLoadingClients(false);
        }
      }
    }

    loadInitialData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Gallery Status Filtering Computation
  const galleryCounts = useMemo(() => {
    const active = galleryAssets.filter((a) => a.is_active).length;
    const draft = galleryAssets.filter((a) => !a.is_active).length;
    return { all: galleryAssets.length, active, draft };
  }, [galleryAssets]);

  const filteredGalleryAssets = useMemo(() => {
    if (galleryFilter === "active") return galleryAssets.filter((a) => a.is_active);
    if (galleryFilter === "draft") return galleryAssets.filter((a) => !a.is_active);
    return galleryAssets;
  }, [galleryAssets, galleryFilter]);

  // Service Reviews Filtering & Counts Computation
  const reviewCounts = useMemo(() => {
    const active = serviceReviews.filter((r) => r.is_active).length;
    const draft = serviceReviews.filter((r) => !r.is_active).length;
    return { all: serviceReviews.length, active, draft };
  }, [serviceReviews]);

  const filteredReviews = useMemo(() => {
    const q = reviewSearchQuery.toLowerCase().trim();

    return serviceReviews.filter((review) => {
      // 1. Status Filter
      if (serviceReviewFilter === "active" && !review.is_active) return false;
      if (serviceReviewFilter === "draft" && review.is_active) return false;

      // 2. Search Query
      if (!q) return true;
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
  }, [serviceReviews, reviewSearchQuery, serviceReviewFilter]);

  const filteredClients = useMemo(() => {
    const q = clientSearchQuery.toLowerCase().trim();
    if (!q) return clients;
    return clients.filter((client) =>
      client.name.toLowerCase().includes(q)
    );
  }, [clients, clientSearchQuery]);

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
    is_active?: boolean;
  }) => {
    const isActive =
      newAssetData.is_active !== undefined ? newAssetData.is_active : true;

    if (newAssetData.file) {
      try {
        const created = await uploadLifeStyleImage(newAssetData.file, {
          tag: newAssetData.tag,
          title: newAssetData.title,
          description: newAssetData.description,
          is_active: isActive,
        });
        setGalleryAssets((prev) => [created, ...prev]);
        showToast(
          isActive
            ? "Added to Workshops & Speaking gallery"
            : "Saved as draft photo in gallery"
        );
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
        is_active: isActive,
      };
      setGalleryAssets((prev) => [newAsset, ...prev]);
      showToast(
        isActive
          ? "Added to Workshops & Speaking gallery"
          : "Saved as draft photo in gallery"
      );
    }
  };

  const handleUpdateAsset = async (
    id: string,
    updates: {
      tag?: string;
      title?: string;
      description?: string;
      is_active?: boolean;
    }
  ) => {
    const backup = [...galleryAssets];
    // Optimistic update
    setGalleryAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
    setActiveDetailAsset((prev) =>
      prev && prev.id === id ? { ...prev, ...updates } : prev
    );
    const feedbackMsg =
      updates.is_active !== undefined
        ? updates.is_active
          ? "Photo published to gallery"
          : "Photo moved to drafts"
        : "Item details updated";
    showToast(feedbackMsg);

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
    is_active: boolean;
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
                is_active: data.is_active,
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
          is_active: data.is_active,
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
        is_active: data.is_active,
      };
      setServiceReviews((prev) => [optimisticReview, ...prev]);
      showToast(
        data.is_active
          ? "Service review added"
          : "Service review saved as draft"
      );

      try {
        const created = await createServiceReview({
          name: data.name,
          occupation: data.occupation,
          place: data.place,
          comment: data.comment,
          is_active: data.is_active,
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

  const handleToggleReviewStatus = async (review: ServiceReviewItem) => {
    const backup = [...serviceReviews];
    const nextStatus = !review.is_active;

    // Optimistic toggle
    setServiceReviews((prev) =>
      prev.map((r) =>
        r.id === review.id ? { ...r, is_active: nextStatus } : r
      )
    );
    showToast(
      nextStatus ? "Review published to website" : "Review moved to drafts"
    );

    try {
      const updated = await toggleServiceReviewStatus(
        review.id,
        review.is_active
      );
      setServiceReviews((prev) =>
        prev.map((r) => (r.id === review.id ? updated : r))
      );
    } catch (err) {
      console.error("Failed to toggle review status:", err);
      setServiceReviews(backup);
      showToast("Failed to update review status in database");
    }
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

  // Client Actions
  const handleSaveClient = async (data: {
    id?: string;
    name: string;
    file?: File | null;
    logoUrl?: string;
    removeLogo?: boolean;
  }) => {
    if (data.id) {
      try {
        const updated = await updateClient(data.id, {
          name: data.name,
          file: data.file,
          logoUrl: data.logoUrl,
          removeLogo: data.removeLogo,
        });
        setClients((prev) =>
          prev.map((c) => (c.id === data.id ? updated : c))
        );
        showToast("Client updated successfully");
      } catch (err: unknown) {
        console.error("Failed to update client:", err);
        showToast(
          err instanceof Error ? err.message : "Failed to update client"
        );
        throw err;
      }
    } else {
      try {
        const created = await createClient({
          name: data.name,
          file: data.file,
          logoUrl: data.logoUrl,
        });
        setClients((prev) => [created, ...prev]);
        showToast("Client added successfully");
      } catch (err: unknown) {
        console.error("Failed to create client:", err);
        showToast(
          err instanceof Error ? err.message : "Failed to add client"
        );
        throw err;
      }
    }
    setClientToEdit(null);
  };

  const handleDeleteClient = async (clientItem: ClientItem) => {
    const backup = [...clients];
    setClients((prev) => prev.filter((c) => c.id !== clientItem.id));
    showToast("Client removed");

    try {
      await deleteClient(clientItem.id);
    } catch (err) {
      console.error("Failed to delete client:", err);
      setClients(backup);
      showToast("Failed to delete client from database");
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
        clientCount={clients.length}
      />

      {/* VIEW 1: GALLERY MANAGEMENT */}
      {activeTab === "gallery" && (
        <section
          id="gallery-panel"
          aria-labelledby="tab-gallery"
          className="flex flex-col gap-2.5 animate-in fade-in duration-200"
        >
          {/* Action Bar with Select Toggle and Filter Chips */}
          <GalleryActionBar
            totalCount={galleryAssets.length}
            isSelecting={isSelecting}
            selectedCount={selectedAssetIds.size}
            activeFilter={galleryFilter}
            counts={galleryCounts}
            onFilterChange={setGalleryFilter}
            onToggleSelectMode={() => {
              setIsSelecting(!isSelecting);
              setSelectedAssetIds(new Set());
            }}
            onSelectAll={handleSelectAllAssets}
            onDeleteSelected={handleDeleteSelectedAssets}
          />

          {/* 2-Column Responsive Image Grid */}
          <GalleryGrid
            assets={filteredGalleryAssets}
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
          {/* Search Bar & Filter Chips */}
          <div className="flex flex-col gap-2">
            <ServiceReviewSearchBar
              query={reviewSearchQuery}
              onChange={setReviewSearchQuery}
              onClear={() => setReviewSearchQuery("")}
            />
            <ServiceReviewFilterChips
              activeFilter={serviceReviewFilter}
              onSelectFilter={setServiceReviewFilter}
              counts={reviewCounts}
            />
          </div>

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

      {/* VIEW 3: CLIENTS MANAGEMENT */}
      {activeTab === "clients" && (
        <section
          id="clients-panel"
          aria-labelledby="tab-clients"
          className="flex flex-col gap-2.5 animate-in fade-in duration-200 pb-20"
        >
          {/* Search Bar */}
          <ClientSearchBar
            query={clientSearchQuery}
            onChange={setClientSearchQuery}
            onClear={() => setClientSearchQuery("")}
          />

          {/* Clients Grid & Status */}
          <div className="flex flex-col gap-2.5 mt-1">
            {isLoadingClients ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-20 bg-surface-container-low rounded-2xl border border-outline-variant/30 p-4 flex items-center gap-3.5"
                  >
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-surface-container rounded-md w-3/4" />
                      <div className="h-3 bg-surface-container rounded-md w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : clientsError ? (
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
                  Failed to Load Clients
                </h3>
                <p className="text-[12px] text-on-surface-variant max-w-xs mt-1">
                  {clientsError}
                </p>
                <button
                  type="button"
                  onClick={reloadClients}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-[12px] font-medium text-on-surface transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : filteredClients.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredClients.map((client) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    onOpenMenu={(item) => setActiveClientMenu(item)}
                  />
                ))}
              </div>
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
                    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <h3 className="text-[15px] font-semibold text-on-surface">
                  No Clients Found
                </h3>
                <p className="text-[12px] text-on-surface-variant max-w-xs mt-1">
                  {clientSearchQuery
                    ? `No clients matched "${clientSearchQuery}". Try clearing search.`
                    : "No clients added yet. Tap '+' to add the first client we've worked with."}
                </p>
                {clientSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setClientSearchQuery("")}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-[12px] font-medium text-on-surface transition-colors cursor-pointer"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Floating Action Button (FAB) */}
          <ClientFloatingActionButton
            onClick={() => {
              setClientToEdit(null);
              setIsClientModalOpen(true);
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
        onToggleStatus={handleToggleReviewStatus}
        onDelete={handleDeleteReview}
      />

      {/* 5. Client Create / Edit Modal */}
      <ClientCreateEditModal
        isOpen={isClientModalOpen}
        clientToEdit={clientToEdit}
        onClose={() => {
          setIsClientModalOpen(false);
          setClientToEdit(null);
        }}
        onSave={handleSaveClient}
      />

      {/* 6. Client Action Sheet */}
      <ClientActionSheet
        client={activeClientMenu}
        isOpen={Boolean(activeClientMenu)}
        onClose={() => setActiveClientMenu(null)}
        onEdit={(item) => {
          setClientToEdit(item);
          setIsClientModalOpen(true);
        }}
        onDelete={handleDeleteClient}
      />
    </div>
  );
}
