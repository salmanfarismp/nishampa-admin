"use client";

import React, { useState, useMemo } from "react";
import { Review, ReviewFilterTab, ReviewCounts } from "@/components/reviews/types";
import { INITIAL_REVIEWS } from "@/components/reviews/mockData";
import { ReviewSearchBar } from "@/components/reviews/ReviewSearchBar";
import { ReviewFilterTabs } from "@/components/reviews/ReviewFilterTabs";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ReviewPhotoModal } from "@/components/reviews/ReviewPhotoModal";
import { ReviewReplyDrawer } from "@/components/reviews/ReviewReplyDrawer";
import { ReviewToast } from "@/components/reviews/ReviewToast";
import { ReviewEmptyState } from "@/components/reviews/ReviewEmptyState";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [activeTab, setActiveTab] = useState<ReviewFilterTab>("pending");
  const [searchQuery, setSearchQuery] = useState("");

  // Toast state matching code.html
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);

  // Photo modal lightbox state
  const [activePhoto, setActivePhoto] = useState<{
    url: string;
    author: string;
    product: string;
  } | null>(null);

  // Merchant reply drawer state
  const [replyingReview, setReplyingReview] = useState<Review | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 3200);
  };

  // Compute live counts for tabs
  const counts: ReviewCounts = useMemo(() => {
    const all = reviews.length;
    const pending = reviews.filter((r) => r.status === "pending").length;
    const flagged = reviews.filter((r) => r.status === "flagged").length;
    return { all, pending, flagged };
  }, [reviews]);

  // Filter reviews by activeTab and search query
  const filteredReviews = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return reviews.filter((review) => {
      // Tab filter
      if (activeTab === "pending" && review.status !== "pending") return false;
      if (activeTab === "flagged" && review.status !== "flagged") return false;
      // In "all", show all statuses

      // Search query filter
      if (q) {
        const matchAuthor = review.author.toLowerCase().includes(q);
        const matchProduct = review.product.name.toLowerCase().includes(q);
        const matchComment = review.comment.toLowerCase().includes(q);
        if (!matchAuthor && !matchProduct && !matchComment) return false;
      }

      return true;
    });
  }, [reviews, activeTab, searchQuery]);

  // Actions
  const handleApprove = (review: Review) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === review.id ? { ...r, status: "approved" } : r))
    );
    triggerToast(`Approved review by ${review.author}`);
  };

  const handleFlag = (review: Review) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === review.id
          ? {
              ...r,
              status: "flagged",
              flagReason: r.flagReason || "Flagged for manual compliance inspection",
            }
          : r
      )
    );
    triggerToast("Review moved to flagged inspector");
  };

  const handlePurgeSpam = (review: Review) => {
    setReviews((prev) => prev.filter((r) => r.id !== review.id));
    triggerToast("Malicious spam entry purged & signature added to ruleset");
  };

  const handleBatchApprove = () => {
    const pendingCount = reviews.filter((r) => r.status === "pending").length;
    setReviews((prev) =>
      prev.map((r) => (r.status === "pending" ? { ...r, status: "approved" } : r))
    );
    triggerToast(`${pendingCount} pending reviews published to storefront`);
  };

  const handleSaveReply = (reviewId: string, replyText: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, merchantReply: replyText } : r))
    );
    const target = reviews.find((r) => r.id === reviewId);
    triggerToast(`Public response posted for ${target?.author || "customer"}`);
  };

  const handleResetData = () => {
    setReviews(INITIAL_REVIEWS);
    setActiveTab("pending");
    setSearchQuery("");
    triggerToast("Demo reviews queue reset");
  };

  return (
    <div className="flex flex-col w-full space-y-3 pb-8">
      {/* Toast Notification Micro-interaction */}
      <ReviewToast
        message={toastMessage}
        isVisible={isToastVisible}
        onDismiss={() => setIsToastVisible(false)}
      />

      {/* Search Bar & Segmented Filter Tabs matching screen.png */}
      <div className="space-y-2.5">
        <ReviewSearchBar
          query={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
        />

        <ReviewFilterTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={counts}
        />
      </div>

      {/* Batch Action Toolbar when pending items exist */}
      {activeTab === "pending" && filteredReviews.length > 1 && !searchQuery && (
        <div className="flex items-center justify-between px-3 py-2 bg-surface-container-low rounded-xl border border-surface-container text-[12px]">
          <span className="text-on-surface-variant font-medium">
            {filteredReviews.length} pending moderation
          </span>
          <button
            type="button"
            onClick={handleBatchApprove}
            className="px-2.5 py-1 bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-border-default/80 rounded-md font-semibold text-[11px] active:scale-95 transition-all cursor-pointer shadow-2xs"
          >
            Approve All Pending
          </button>
        </div>
      )}

      {/* Review Stream List */}
      <div className="space-y-3" id="reviewContainer">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onApprove={handleApprove}
              onFlag={handleFlag}
              onPurgeSpam={handlePurgeSpam}
              onOpenReply={(rev) => setReplyingReview(rev)}
              onOpenPhoto={(photoUrl, rev) =>
                setActivePhoto({
                  url: photoUrl,
                  author: rev.author,
                  product: rev.product.name,
                })
              }
            />
          ))
        ) : (
          <ReviewEmptyState
            onReset={handleResetData}
            message={
              searchQuery
                ? "No Matching Reviews"
                : activeTab === "pending"
                ? "Queue Cleared"
                : activeTab === "flagged"
                ? "No Flagged Reviews"
                : "No Reviews Found"
            }
            description={
              searchQuery
                ? `No reviews matched "${searchQuery}". Try a different search term.`
                : activeTab === "pending"
                ? "All incoming customer reviews have been moderated and published."
                : activeTab === "flagged"
                ? "There are no flagged reviews requiring inspection."
                : "No customer reviews exist in this view."
            }
          />
        )}
      </div>

      {/* Photo Lightbox Inspection Modal */}
      <ReviewPhotoModal
        isOpen={Boolean(activePhoto)}
        photoUrl={activePhoto?.url || null}
        authorName={activePhoto?.author}
        productName={activePhoto?.product}
        onClose={() => setActivePhoto(null)}
      />

      {/* Merchant Reply Drawer Sheet */}
      <ReviewReplyDrawer
        isOpen={Boolean(replyingReview)}
        review={replyingReview}
        onClose={() => setReplyingReview(null)}
        onSubmitReply={handleSaveReply}
      />
    </div>
  );
}
