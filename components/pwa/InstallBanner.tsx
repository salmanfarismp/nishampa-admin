"use client";

import { useState } from "react";
import { usePwaInstall } from "@/lib/hooks/usePwaInstall";

export default function InstallBanner() {
  const { isInstallable, isStandalone, isIOS, promptInstall } = usePwaInstall();
  const [dismissed, setDismissed] = useState(true);
  const [showIOSModal, setShowIOSModal] = useState(false);

  // Keep dismissed by default so it does not clutter the screen
  if (isStandalone || dismissed || (!isInstallable && !isIOS)) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pwa_install_dismissed", "true");
    }
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
    } else {
      await promptInstall();
    }
  };

  return (
    <>
      <div className="mx-4 my-2 p-3 rounded-lg bg-canvas border border-border-default shadow-xs flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-md bg-surface-subtle border border-border-default flex items-center justify-center shrink-0 text-text-primary">
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
          </div>
          <div className="truncate">
            <p className="font-semibold text-text-primary tracking-tight">Install Western Admin</p>
            <p className="text-[11px] text-text-secondary truncate">Fast offline administration workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstallClick}
            className="h-8 px-3 bg-text-primary hover:bg-[#27272a] active:scale-95 text-text-inverted font-medium rounded-md transition text-xs cursor-pointer select-none"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="p-1.5 text-text-subtle hover:text-text-primary transition cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* iOS Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-[#09090b]/40 backdrop-blur-xs flex items-end justify-center p-4">
          <div className="w-full max-w-sm bg-canvas border border-border-default rounded-xl p-5 text-text-primary shadow-level-2 animate-in fade-in slide-in-from-bottom-4 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-4">
              <h3 className="font-semibold text-text-primary text-sm">Install on iOS</h3>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-text-subtle hover:text-text-primary p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <ol className="space-y-3 text-xs text-text-secondary">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-surface-subtle border border-border-default text-text-primary flex items-center justify-center font-bold text-[11px] shrink-0">
                  1
                </span>
                <span>
                  Tap the <strong className="text-text-primary">Share</strong> button in Safari&apos;s bottom toolbar{" "}
                  <span className="inline-block px-1 py-0.5 bg-surface-hover border border-border-default rounded text-[10px]">⎋</span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-surface-subtle border border-border-default text-text-primary flex items-center justify-center font-bold text-[11px] shrink-0">
                  2
                </span>
                <span>
                  Scroll down and tap <strong className="text-text-primary">Add to Home Screen</strong>{" "}
                  <span className="inline-block px-1 py-0.5 bg-surface-hover border border-border-default rounded text-[10px]">➕</span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-surface-subtle border border-border-default text-text-primary flex items-center justify-center font-bold text-[11px] shrink-0">
                  3
                </span>
                <span>
                  Tap <strong className="text-text-primary">Add</strong> in the top right to complete installation.
                </span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full h-9 bg-text-primary hover:bg-[#27272a] text-text-inverted rounded-md text-xs font-semibold transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
