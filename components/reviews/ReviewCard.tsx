"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Review } from "./types";

interface ReviewCardProps {
  review: Review;
  onApprove: (review: Review) => void;
  onFlag: (review: Review) => void;
  onPurgeSpam?: (review: Review) => void;
  onOpenReply?: (review: Review) => void;
  onOpenPhoto?: (photoUrl: string, review: Review) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onApprove,
  onFlag,
  onPurgeSpam,
  onOpenReply,
  onOpenPhoto,
}) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleApproveClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      onApprove(review);
    }, 250);
  };

  const handleFlagClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      onFlag(review);
    }, 250);
  };

  const handlePurgeClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      onPurgeSpam?.(review);
    }, 250);
  };

  return (
    <article
      id={review.id}
      className={`bg-surface-container-lowest rounded-xl p-3.5 sm:p-4 shadow-xs border border-border-default/70 space-y-3 transition-all duration-300 ${
        isExiting
          ? "opacity-0 -translate-y-2 pointer-events-none scale-[0.98]"
          : "opacity-100 translate-y-0 scale-100"
      }`}
    >
      {/* Top Header Row: Author, Status Badge, Timestamp, Stars */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-[15px] text-on-surface truncate">
              {review.author}
            </span>
            {review.status === "pending" && (
              <span className="px-1.5 py-0.5 rounded-full bg-primary text-on-primary font-mono text-[10px] uppercase font-semibold leading-none">
                Pending
              </span>
            )}
            {review.status === "approved" && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] font-mono text-[10px] uppercase font-semibold leading-none">
                Approved
              </span>
            )}
            {review.status === "flagged" && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#fffbeb] text-[#b45309] border border-[#fde68a] font-mono text-[10px] uppercase font-semibold leading-none">
                Flagged
              </span>
            )}
          </div>
          <span className="text-[12px] text-on-surface-variant font-normal mt-0.5">
            {review.createdAt}
          </span>
        </div>

        {/* 5-Star Rating Display matching screen.png */}
        <div
          aria-label={`${review.rating} out of 5 stars`}
          className="flex items-center gap-0.5 text-primary flex-shrink-0 pt-0.5"
        >
          {[1, 2, 3, 4, 5].map((starIndex) => {
            const isFilled = starIndex <= review.rating;
            return (
              <svg
                key={starIndex}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={isFilled ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={isFilled ? "0" : "1.8"}
                className={`w-4 h-4 ${
                  isFilled ? "text-primary" : "text-surface-container-highest"
                }`}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            );
          })}
        </div>
      </div>

      {/* Product Information Strip matching screen.png */}
      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface-container-low border border-surface-container/50">
        <span className="font-mono text-[10px] text-on-surface-variant font-semibold tracking-wider uppercase flex-shrink-0">
          PRODUCT
        </span>
        <span className="text-[12px] text-on-surface font-semibold truncate">
          {review.product.name}
        </span>
      </div>

      {/* Review Body Text */}
      <p className="text-[14px] leading-relaxed text-on-surface font-normal">
        {review.comment}
      </p>

      {/* Attached Photos Section matching screen.png */}
      {review.photos && review.photos.length > 0 && (
        <div className="flex items-center gap-3 pt-0.5">
          <button
            type="button"
            onClick={() => onOpenPhoto?.(review.photos[0], review)}
            aria-label="Enlarge review photo"
            className="relative w-20 h-20 rounded-lg overflow-hidden bg-surface-container flex-shrink-0 group cursor-pointer active:scale-95 transition-transform border border-border-subtle shadow-2xs"
          >
            <Image
              src={review.photos[0]}
              alt={`Review photo by ${review.author}`}
              fill
              sizes="80px"
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <span className="absolute bottom-1 right-1 bg-surface-container-lowest/90 backdrop-blur-xs rounded p-0.5 text-on-surface shadow-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </span>
          </button>

          <div className="flex flex-col justify-center gap-0.5 min-w-0">
            <span className="text-[12px] text-on-surface-variant font-medium">
              {review.photos.length}{" "}
              {review.photos.length === 1 ? "photo attached" : "photos attached"}
            </span>
            {review.verifiedPurchase && (
              <span className="font-mono text-[10px] text-on-surface-variant">
                Verified Purchase
              </span>
            )}
          </div>
        </div>
      )}

      {/* Verified Purchase label if no photos */}
      {(!review.photos || review.photos.length === 0) &&
        review.verifiedPurchase && (
          <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant font-mono">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 text-emerald-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Verified Purchase</span>
          </div>
        )}

      {/* Flag Reason Callout if Flagged */}
      {review.status === "flagged" && review.flagReason && (
        <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-900 flex items-start gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
          </svg>
          <div className="min-w-0">
            <span className="font-semibold block">Flagged Notice:</span>
            <span>{review.flagReason}</span>
            {review.ipAddress && (
              <span className="block font-mono text-[10px] text-amber-700/80 mt-0.5">
                IP: {review.ipAddress}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Merchant Reply Callout if exists */}
      {review.merchantReply && (
        <div className="p-2.5 rounded-lg bg-surface-container-low border border-border-subtle text-[12px] text-on-surface space-y-0.5">
          <span className="font-semibold text-[11px] font-mono text-on-surface-variant uppercase tracking-wider block">
            Store Response
          </span>
          <p className="italic text-on-surface-variant">&ldquo;{review.merchantReply}&rdquo;</p>
        </div>
      )}

      {/* Action Buttons Row matching screen.png */}
      <div className="pt-1 flex items-center gap-2">
        {review.status === "pending" && (
          <>
            <button
              type="button"
              onClick={handleApproveClick}
              className="flex-1 h-9 bg-primary text-on-primary rounded-lg text-[13px] font-medium flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Approve</span>
            </button>

            <button
              type="button"
              onClick={handleFlagClick}
              className="h-9 px-3.5 bg-surface-container text-on-surface-variant hover:text-on-surface rounded-lg text-[13px] font-medium flex items-center justify-center gap-1.5 active:scale-95 transition-colors cursor-pointer"
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
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                <line x1="4" y1="22" x2="4" y2="15" />
              </svg>
              <span>Flag</span>
            </button>
          </>
        )}

        {review.status === "flagged" && (
          <>
            <button
              type="button"
              onClick={handleApproveClick}
              className="flex-1 h-9 bg-primary text-on-primary rounded-lg text-[13px] font-medium flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Restore & Approve</span>
            </button>

            <button
              type="button"
              onClick={handlePurgeClick}
              className="h-9 px-3 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-[13px] font-medium flex items-center justify-center gap-1.5 active:scale-95 transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span>Purge Spam</span>
            </button>
          </>
        )}

        {review.status === "approved" && (
          <div className="flex-1 flex items-center justify-between">
            <span className="text-[12px] text-emerald-700 font-medium flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Live on Storefront
            </span>

            <button
              type="button"
              onClick={() => onOpenReply?.(review)}
              className="h-8 px-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-[12px] font-medium flex items-center gap-1.5 active:scale-95 transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>{review.merchantReply ? "Edit Reply" : "Reply"}</span>
            </button>
          </div>
        )}

        {review.status !== "approved" && (
          <button
            type="button"
            onClick={() => onOpenReply?.(review)}
            aria-label="Reply to customer"
            className="w-9 h-9 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center active:scale-95 transition-colors cursor-pointer flex-shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        )}
      </div>
    </article>
  );
};
