"use client";

import React from "react";
import { ContentStats } from "./types";

interface ContentAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: ContentStats;
}

export const ContentAnalyticsModal: React.FC<ContentAnalyticsModalProps> = ({
  isOpen,
  onClose,
  stats,
}) => {
  if (!isOpen) return null;

  const storagePercentage = Math.min(
    100,
    Math.round((stats.cdnStorageUsedMb / stats.cdnStorageLimitMb) * 100)
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="analytics-modal-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-5 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-bottom duration-250 z-10 border-t border-border-default/60 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
        {/* Grab Handle */}
        <div className="w-10 h-1 bg-surface-container-highest rounded-full mx-auto -mt-1 mb-1" />

        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
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
                <path d="m18 15-6-6-6 6" />
                <path d="M12 9v12" />
                <path d="M5 3h14" />
              </svg>
            </div>
            <div>
              <h3
                id="analytics-modal-title"
                className="text-[17px] font-semibold text-on-surface"
              >
                Content Telemetry
              </h3>
              <p className="text-[12px] text-on-surface-variant">
                CDN distribution & cache performance
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close analytics modal"
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

        {/* CDN Storage Metric */}
        <div className="p-3.5 bg-surface-container-low rounded-2xl border border-surface-container flex flex-col gap-2">
          <div className="flex items-center justify-between text-[12px]">
            <span className="font-medium text-on-surface">Cloudflare CDN Storage</span>
            <span className="font-mono text-on-surface-variant font-semibold">
              {stats.cdnStorageUsedMb.toFixed(1)} MB / {stats.cdnStorageLimitMb} MB ({storagePercentage}%)
            </span>
          </div>
          <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${storagePercentage}%` }}
            />
          </div>
        </div>

        {/* 2x2 Metric Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 bg-surface-container-low rounded-2xl border border-surface-container">
            <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider block mb-1">
              Brand Assets
            </span>
            <span className="text-[20px] font-bold text-on-surface block font-mono">
              {stats.totalAssets}
            </span>
            <span className="text-[11px] text-on-surface-variant">
              100% indexed in CDN
            </span>
          </div>

          <div className="p-3 bg-surface-container-low rounded-2xl border border-surface-container">
            <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider block mb-1">
              Active FAQs
            </span>
            <span className="text-[20px] font-bold text-on-surface block font-mono">
              {stats.publishedFaqs}{" "}
              <span className="text-[12px] font-normal text-on-surface-variant">
                / {stats.totalFaqs}
              </span>
            </span>
            <span className="text-[11px] text-on-surface-variant">
              {stats.draftFaqs} in review
            </span>
          </div>

          <div className="p-3 bg-surface-container-low rounded-2xl border border-surface-container">
            <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider block mb-1">
              Monthly Views
            </span>
            <span className="text-[20px] font-bold text-on-surface block font-mono">
              {stats.monthlyViews}
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">
              +18.4% vs last mo.
            </span>
          </div>

          <div className="p-3 bg-surface-container-low rounded-2xl border border-surface-container">
            <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider block mb-1">
              Cache Hit Ratio
            </span>
            <span className="text-[20px] font-bold text-on-surface block font-mono">
              98.8%
            </span>
            <span className="text-[11px] text-on-surface-variant">
              Edge served
            </span>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full h-11 bg-primary text-on-primary rounded-xl font-medium text-[13px] active:scale-[0.98] transition-transform cursor-pointer shadow-xs mt-1"
        >
          Close Telemetry
        </button>
      </div>
    </div>
  );
};
