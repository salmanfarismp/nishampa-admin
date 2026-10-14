"use client";

import React from "react";
import Link from "next/link";

export default function OfflinePage() {
  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center px-4 py-12">
      {/* Offline Icon Container */}
      <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-10 h-10 text-amber-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3l18 18M10.5 10.5a5 5 0 017.07 0M1.42 9a15.91 15.91 0 014.7-2.88M8.53 4.88A15.91 15.91 0 0122.58 9M6.28 14.72a9.96 9.96 0 01-1.34-.84M17.72 13.88c-.46.33-.96.61-1.48.84m-4.24.78a5 5 0 01-1.5-.23"
          />
        </svg>
      </div>

      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
        Offline Mode
      </span>

      <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
        You&apos;re Currently Offline
      </h1>

      <p className="text-sm text-zinc-400 max-w-xs mb-8 leading-relaxed">
        Western Admin is running in offline cache mode. Check your internet connection to sync real-time administrative updates.
      </p>

      <div className="flex flex-col w-full max-w-xs gap-3">
        <button
          onClick={handleReload}
          className="w-full py-3 px-4 rounded-xl font-medium text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/25 transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
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
        </button>

        <Link
          href="/"
          className="w-full py-3 px-4 rounded-xl font-medium text-sm bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition active:scale-[0.98] text-center"
        >
          Return to Cached Dashboard
        </Link>
      </div>

      <div className="mt-12 text-xs text-zinc-600 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
        Service Worker Cache Active
      </div>
    </div>
  );
}
