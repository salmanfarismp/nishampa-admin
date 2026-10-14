"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { usePwaInstall } from "@/lib/hooks/usePwaInstall";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";

export default function AdminDashboardPage() {
  const { isStandalone, isInstallable, promptInstall } = usePwaInstall();
  const isOnline = useOnlineStatus();

  return (
    <div className="flex flex-col gap-4">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/50 via-[#131926] to-[#0d0f14] border border-blue-500/20 p-4">
        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-blue-400 tracking-wider uppercase">
              Admin Control Center
            </span>
            <Badge variant={isStandalone ? "success" : "info"}>
              {isStandalone ? "Installed PWA" : "Browser Mode"}
            </Badge>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Western Admin
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Production-grade modular mobile PWA with offline caching & instant sync.
          </p>
          {!isStandalone && isInstallable && (
            <button
              onClick={() => promptInstall()}
              className="mt-1 self-start px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/30 transition active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
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
              Install App
            </button>
          )}
        </div>
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* PWA System Diagnostic Metrics */}
      <div className="grid grid-cols-2 gap-2.5">
        <Card className="flex flex-col gap-1 p-3">
          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            Network Status
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? "bg-emerald-400" : "bg-amber-400"
              }`}
            />
            <span className="text-sm font-bold text-white">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
          <span className="text-[10px] text-zinc-400">
            {isOnline ? "Syncing live data" : "Serving from cache"}
          </span>
        </Card>

        <Card className="flex flex-col gap-1 p-3">
          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            PWA Manifest
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-sm font-bold text-white">v1.0 Ready</span>
          </div>
          <span className="text-[10px] text-zinc-400">Standalone App Scope</span>
        </Card>

        <Card className="flex flex-col gap-1 p-3">
          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            Service Worker
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span className="text-sm font-bold text-white">Active (sw.js)</span>
          </div>
          <span className="text-[10px] text-zinc-400">Cache-First Shell</span>
        </Card>

        <Card className="flex flex-col gap-1 p-3">
          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            Display Mode
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isStandalone ? "bg-emerald-400" : "bg-zinc-400"
              }`}
            />
            <span className="text-sm font-bold text-white">
              {isStandalone ? "Standalone" : "Web Shell"}
            </span>
          </div>
          <span className="text-[10px] text-zinc-400">
            {isStandalone ? "Full screen native" : "Installable banner active"}
          </span>
        </Card>
      </div>

      {/* Admin Quick Action Modules */}
      <div className="flex flex-col gap-2 mt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Core Modules
          </h3>
          <span className="text-[11px] text-blue-400 font-medium">Modular Architecture</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {/* Module: Store Operations */}
          <Card className="flex items-center justify-between p-3.5 hover:border-zinc-700 active:scale-[0.99] transition cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Catalog & Inventory</p>
                <p className="text-[10px] text-zinc-400">Manage products, stock & SKUs</p>
              </div>
            </div>
            <Badge variant="info">Active</Badge>
          </Card>

          {/* Module: Orders & Shipments */}
          <Card className="flex items-center justify-between p-3.5 hover:border-zinc-700 active:scale-[0.99] transition cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Orders & Shipments</p>
                <p className="text-[10px] text-zinc-400">Dispatch queue & tracking</p>
              </div>
            </div>
            <Badge variant="success">Syncing</Badge>
          </Card>

          {/* Module: User Access & Roles */}
          <Card className="flex items-center justify-between p-3.5 hover:border-zinc-700 active:scale-[0.99] transition cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Staff & Permissions</p>
                <p className="text-[10px] text-zinc-400">Roles, sessions & audit log</p>
              </div>
            </div>
            <Badge variant="default">Protected</Badge>
          </Card>
        </div>
      </div>

      {/* PWA Offline Test Trigger */}
      <Card className="p-3.5 bg-[#10131b] border-dashed border-zinc-800 flex flex-col gap-2 mt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-300">PWA Resilience Check</span>
          <Link
            href="/offline"
            className="text-[11px] font-medium text-blue-400 hover:text-blue-300 transition"
          >
            Preview Offline Page →
          </Link>
        </div>
        <p className="text-[11px] text-zinc-500 leading-relaxed">
          The service worker automatically intercepts disconnection and renders the offline cache fallback.
        </p>
      </Card>
    </div>
  );
}
