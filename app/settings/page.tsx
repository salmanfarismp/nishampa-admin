"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { usePwaInstall } from "@/lib/hooks/usePwaInstall";

export default function SettingsPage() {
  const { isInstallable, isStandalone, promptInstall } = usePwaInstall();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 pb-1">
        <h2 className="text-lg font-bold text-white tracking-tight">App Settings</h2>
        <p className="text-xs text-zinc-400">PWA preferences and device configurations.</p>
      </div>

      <Card className="p-3.5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-white">Standalone Installation</p>
          <p className="text-[11px] text-zinc-400">
            {isStandalone
              ? "Running in installed standalone mode"
              : isInstallable
              ? "Ready to install to home screen"
              : "Running in browser shell"}
          </p>
        </div>
        {!isStandalone && isInstallable && (
          <button
            onClick={() => promptInstall()}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold shadow transition active:scale-95 cursor-pointer"
          >
            Install
          </button>
        )}
      </Card>

      <Card className="p-3.5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-white">Offline Synchronization</p>
          <p className="text-[11px] text-zinc-400">Cache static assets & admin layouts</p>
        </div>
        <span className="text-xs font-semibold text-emerald-400">Enabled</span>
      </Card>

      <Card className="p-3.5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-white">Safe Area Layout</p>
          <p className="text-[11px] text-zinc-400">iOS & Android home indicator insets</p>
        </div>
        <span className="text-xs font-semibold text-blue-400">Adaptive</span>
      </Card>
    </div>
  );
}
