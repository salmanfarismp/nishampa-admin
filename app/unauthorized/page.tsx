"use client";

import React from "react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function UnauthorizedPage() {
  const { user, signOut, isLoading } = useAuth();

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-8 bg-canvas">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Warning Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-telemetry-warning-bg border border-telemetry-warning-border text-telemetry-warning flex items-center justify-center mb-4 shadow-xs">
          <svg
            className="w-7 h-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-on-surface text-center mb-1">
          Access Restricted
        </h1>
        <p className="text-xs text-text-secondary text-center mb-6 max-w-xs">
          Your Google account is authenticated, but does not have administrator authorization for Westernswings.
        </p>

        {/* Account Details Card */}
        <div className="w-full bg-surface-container-lowest border border-border-default rounded-2xl p-5 shadow-xs flex flex-col gap-4">
          <div className="flex flex-col gap-1 p-3 rounded-xl bg-surface-container-low border border-border-subtle">
            <span className="text-[11px] font-mono text-text-secondary uppercase tracking-wider">
              Signed In Account
            </span>
            <span className="text-sm font-medium text-text-primary break-all">
              {isLoading ? "Checking account..." : user?.email || "Unknown User"}
            </span>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            If you need access to this admin portal, please contact the primary administrator to add your email to the authorized roster.
          </p>

          <button
            type="button"
            onClick={() => signOut()}
            className="w-full h-11 px-4 rounded-xl border border-border-default bg-canvas hover:bg-surface-hover active:scale-[0.98] transition-all text-sm font-medium text-on-surface flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <svg
              className="w-4 h-4 text-text-secondary"
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
            <span>Sign Out / Switch Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
