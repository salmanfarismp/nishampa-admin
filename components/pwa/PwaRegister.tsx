"use client";

import { useEffect, useState } from "react";

export default function PwaRegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV !== "development" // in production, register SW
    ) {
      navigator.serviceWorker
        .register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        })
        .then((registration) => {
          // Check if there is already a waiting worker
          if (registration.waiting) {
            setWaitingWorker(registration.waiting);
            setUpdateAvailable(true);
          }

          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  setWaitingWorker(newWorker);
                  setUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn("PWA Service Worker registration error:", err);
        });

      // Reload page when the new service worker takes over
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    }
    setUpdateAvailable(false);
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm bg-blue-600/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl shadow-blue-900/30 border border-blue-400/30 flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="font-medium">New admin version available</span>
      </div>
      <button
        onClick={handleUpdate}
        className="px-3 py-1 bg-white text-blue-700 font-semibold rounded-lg shadow-sm hover:bg-blue-50 active:scale-95 transition"
      >
        Update
      </button>
    </div>
  );
}
