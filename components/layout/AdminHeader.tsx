"use client";

import React from "react";
import Image from "next/image";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";
import { usePwaInstall } from "@/lib/hooks/usePwaInstall";

export default function AdminHeader() {
  const isOnline = useOnlineStatus();
  const { isInstallable, promptInstall } = usePwaInstall();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#111317]/90 backdrop-blur-md border-b border-[#1e232d] px-4 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] pb-3 flex items-center justify-between select-none">
      {/* Brand & Monogram */}
      <div className="flex items-center gap-2.5">
        <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-[1px] shadow-md shadow-blue-500/20">
          <div className="w-full h-full bg-[#0d0f14] rounded-[11px] flex items-center justify-center overflow-hidden">
            <Image
              src="/icons/icon.svg"
              alt="Western Admin"
              width={24}
              height={24}
              priority
              className="w-5 h-5"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm font-bold tracking-tight text-white font-sans">
              WESTERN
            </h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
              ADMIN
            </span>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2">
        {/* Connection Pulse */}
        <div
          title={isOnline ? "Online" : "Offline"}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium border ${
            isOnline
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isOnline ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
            }`}
          />
          <span>{isOnline ? "LIVE" : "OFFLINE"}</span>
        </div>

        {/* Install quick-button if available */}
        {isInstallable && (
          <button
            onClick={() => promptInstall()}
            className="p-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 transition active:scale-95 cursor-pointer"
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
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-700/80 flex items-center justify-center text-xs font-bold text-white shadow-sm">
          WA
        </div>
      </div>
    </header>
  );
}
