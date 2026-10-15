"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";

export default function AdminHeader() {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userAvatar = user?.user_metadata?.avatar_url;
  const userName =
    user?.user_metadata?.full_name || user?.user_metadata?.name || "Admin";
  const userEmail = user?.email || "";
  const initial = (userName[0] || userEmail[0] || "A").toUpperCase();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full bg-canvas/95 backdrop-blur-md border-b border-border-default px-4 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] pb-3 flex items-center justify-between select-none">
      {/* Brand & Monogram */}
      <Link href="/" className="flex items-center gap-2 min-w-0 hover:opacity-85 transition-opacity">
        <div className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
          W
        </div>
        <h1 className="text-[17px] font-semibold tracking-tight text-on-surface truncate">
          Westernswings
        </h1>
      </Link>

      {/* Header Actions & Profile */}
      <div className="relative flex items-center gap-2 flex-shrink-0" ref={menuRef}>
        {/* User Account Button */}
        <button
          type="button"
          aria-label="User Account Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="w-9 h-9 rounded-full bg-surface-container-low border border-border-default flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-all cursor-pointer shadow-xs overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {userAvatar ? (
            <Image
              src={userAvatar}
              alt={userName}
              width={36}
              height={36}
              className="w-full h-full object-cover rounded-full"
              unoptimized
            />
          ) : (
            <span className="text-xs font-semibold text-text-primary">
              {initial}
            </span>
          )}
        </button>

        {/* User Dropdown Menu */}
        {menuOpen && (
          <div className="absolute right-0 top-11 w-56 bg-surface-container-lowest border border-border-default rounded-xl shadow-lg p-1.5 flex flex-col gap-1 z-50 animate-in fade-in zoom-in-95 duration-150">
            {/* Account Info */}
            <div className="px-3 py-2 border-b border-border-subtle flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-text-primary truncate">
                {userName}
              </span>
              <span className="text-[11px] font-mono text-text-secondary truncate">
                {userEmail}
              </span>
              <div className="mt-1 inline-flex items-center gap-1 self-start px-1.5 py-0.5 rounded bg-surface-container text-[10px] font-mono text-text-secondary uppercase">
                Admin
              </div>
            </div>

            {/* Menu Links */}
            <Link
              href="/settings"
              onClick={() => setMenuOpen(false)}
              className="w-full px-3 py-2 text-xs text-text-primary rounded-lg hover:bg-surface-hover flex items-center gap-2 transition-colors cursor-pointer"
            >
              <svg
                className="w-3.5 h-3.5 text-text-secondary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span>App Settings</span>
            </Link>

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                signOut();
              }}
              className="w-full px-3 py-2 text-xs text-telemetry-critical rounded-lg hover:bg-telemetry-critical-bg flex items-center gap-2 transition-colors cursor-pointer text-left font-medium"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
