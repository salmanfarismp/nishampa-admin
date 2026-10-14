"use client";

import React from "react";
import Image from "next/image";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";
import { usePwaInstall } from "@/lib/hooks/usePwaInstall";

export default function AdminHeader() {
  const isOnline = useOnlineStatus();
  const { isInstallable, promptInstall } = usePwaInstall();

  return (
    <header className="sticky top-0 z-40 w-full bg-canvas/95 backdrop-blur-md border-b border-border-default px-4 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] pb-3 flex items-center justify-between select-none">
      {/* Brand & Monogram */}
      <div className="flex items-center gap-2.5">
        <div className="relative w-8 h-8 rounded-md bg-text-primary p-[1px] shadow-xs">
          <div className="w-full h-full bg-text-primary rounded-[5px] flex items-center justify-center overflow-hidden">
            <Image
              src="/icons/icon.svg"
              alt="Western Admin"
              width={20}
              height={20}
              priority
              className="w-4 h-4 invert"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm font-semibold tracking-tight text-text-primary font-sans">
              WESTERN
            </h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 bg-surface-hover text-text-secondary border border-border-default rounded-[4px]">
              STUDIO
            </span>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2">
        {/* Telemetry Status Indicator */}
        <div
          title={isOnline ? "Operational" : "Offline Mode"}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-semibold tracking-wider border select-none tabular-nums ${
            isOnline
              ? "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]"
              : "bg-[#fffbeb] text-[#b45309] border-[#fde68a]"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isOnline ? "bg-[#16a34a] animate-pulse" : "bg-[#d97706]"
            }`}
          />
          <span>{isOnline ? "LIVE" : "OFFLINE"}</span>
        </div>

        {/* Install quick-button if available */}
        {isInstallable && (
          <button
            onClick={() => promptInstall()}
            className="p-1.5 rounded-md bg-canvas hover:bg-surface-hover text-text-primary border border-border-default transition active:scale-95 cursor-pointer"
            title="Install PWA"
            aria-label="Install App"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </button>
        )}

        {/* Admin Avatar */}
        <div className="w-8 h-8 rounded-full bg-surface-subtle border border-border-default flex items-center justify-center text-xs font-semibold text-text-primary">
          WA
        </div>
      </div>
    </header>
  );
}
