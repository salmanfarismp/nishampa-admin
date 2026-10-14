"use client";

import { useState } from "react";
import { usePwaInstall } from "@/lib/hooks/usePwaInstall";

export default function InstallBanner() {
  const { isInstallable, isStandalone, isIOS, promptInstall } = usePwaInstall();
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return true;
    return Boolean(sessionStorage.getItem("pwa_install_dismissed"));
  });
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If installed or dismissed or not installable yet (and not iOS), don't show banner
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
      <div className="mx-4 my-2 p-3 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/30 border border-blue-500/20 backdrop-blur-md shadow-lg shadow-black/20 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-blue-400"
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
            <p className="font-semibold text-white tracking-tight">Install Western Admin</p>
            <p className="text-[11px] text-zinc-400 truncate">Fast standalone mobile experience</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-medium rounded-xl shadow-md shadow-blue-600/30 transition text-xs cursor-pointer"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="p-1.5 text-zinc-400 hover:text-zinc-200 transition"
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
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center p-4">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-5 text-zinc-200 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="font-bold text-white text-base">Install on iOS</h3>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-zinc-400 hover:text-zinc-200 p-1"
              >
                ✕
              </button>
            </div>

            <ol className="space-y-3.5 text-xs text-zinc-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-[11px] shrink-0">
                  1
                </span>
                <span>
                  Tap the <strong className="text-white">Share</strong> button in Safari&apos;s bottom toolbar{" "}
                  <span className="inline-block px-1 py-0.5 bg-zinc-800 rounded text-[11px]">⎋</span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-[11px] shrink-0">
                  2
                </span>
                <span>
                  Scroll down and tap <strong className="text-white">Add to Home Screen</strong>{" "}
                  <span className="inline-block px-1 py-0.5 bg-zinc-800 rounded text-[11px]">➕</span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-[11px] shrink-0">
                  3
                </span>
                <span>
                  Tap <strong className="text-white">Add</strong> in the top right to complete installation.
                </span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-6 w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
