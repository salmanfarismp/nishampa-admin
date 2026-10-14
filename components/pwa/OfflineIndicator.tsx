"use client";

import { useEffect, useRef, useState } from "react";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";

export default function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const [showReconnected, setShowReconnected] = useState(false);
  const prevOnlineRef = useRef(isOnline);

  useEffect(() => {
    // If transitioning from offline to online, flash reconnection pill
    if (!prevOnlineRef.current && isOnline) {
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 3500);
      prevOnlineRef.current = isOnline;
      return () => clearTimeout(timer);
    }
    prevOnlineRef.current = isOnline;
  }, [isOnline]);

  if (isOnline && !showReconnected) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm pointer-events-none transition-all duration-300">
      {!isOnline ? (
        <div className="bg-[#fffbeb] text-[#b45309] border border-[#fde68a] px-3.5 py-1.5 rounded-md shadow-xs flex items-center justify-center gap-2 text-xs font-semibold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 animate-pulse text-[#d97706]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
          </svg>
          <span>Offline mode active (cached data)</span>
        </div>
      ) : showReconnected ? (
        <div className="bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] px-3.5 py-1.5 rounded-md shadow-xs flex items-center justify-center gap-2 text-xs font-semibold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-[#16a34a]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
          </svg>
          <span>Connection restored</span>
        </div>
      ) : null}
    </div>
  );
}
