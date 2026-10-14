"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function OfflinePage() {
  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center px-4 py-12">
      {/* Offline Icon Container */}
      <div className="w-16 h-16 rounded-lg bg-surface-subtle border border-border-default flex items-center justify-center mb-5 text-[#b45309]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3l18 18M10.5 10.5a5 5 0 017.07 0M1.42 9a15.91 15.91 0 014.7-2.88M8.53 4.88A15.91 15.91 0 0122.58 9M6.28 14.72a9.96 9.96 0 01-1.34-.84M17.72 13.88c-.46.33-.96.61-1.48.84m-4.24.78a5 5 0 01-1.5-.23"
          />
        </svg>
      </div>

      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-semibold tracking-wider bg-[#fffbeb] text-[#b45309] border border-[#fde68a] mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-pulse" />
        OFFLINE TELEMETRY
      </span>

      <h1 className="type-headline-md text-text-primary mb-2">
        You&apos;re Currently Offline
      </h1>

      <p className="type-body-sm text-text-secondary max-w-xs mb-8 leading-relaxed">
        Western Admin is serving from the offline application cache. Check your network connection to sync real-time administrative telemetry.
      </p>

      <div className="flex flex-col w-full max-w-xs gap-2.5">
        <Button
          onClick={handleReload}
          variant="primary"
          size="md"
          className="w-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          Try Reconnecting
        </Button>

        <Link
          href="/"
          className="w-full h-9 rounded-md font-medium text-sm bg-canvas border border-border-default text-text-primary hover:bg-surface-hover transition active:scale-[0.98] flex items-center justify-center"
        >
          Return to Cached Dashboard
        </Link>
      </div>

      <div className="mt-12 type-mono-data text-text-subtle flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span>
        Service Worker Cache Active
      </div>
    </div>
  );
}
