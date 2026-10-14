"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { usePwaInstall } from "@/lib/hooks/usePwaInstall";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";

export default function AdminDashboardPage() {
  const { isStandalone, isInstallable, promptInstall } = usePwaInstall();
  const isOnline = useOnlineStatus();

  return (
    <div className="flex flex-col gap-3.5">
      {/* Studio Header Card */}
      <div className="relative overflow-hidden rounded-lg bg-canvas border border-border-default p-4 shadow-xs">
        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="type-label-xs text-text-secondary uppercase">
              Monochrome Commerce Studio
            </span>
            <Badge variant={isStandalone ? "success" : "neutral"}>
              {isStandalone ? "Installed PWA" : "Browser Mode"}
            </Badge>
          </div>
          <h2 className="type-headline-md text-text-primary">
            Western Admin
          </h2>
          <p className="type-body-sm text-text-secondary leading-relaxed">
            Architectural eCommerce administration workspace with instant offline sync & telemetry control.
          </p>
          {!isStandalone && isInstallable && (
            <div className="mt-1">
              <Button
                onClick={() => promptInstall()}
                variant="primary"
                size="sm"
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
                Install Application
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* PWA System Diagnostic Metrics */}
      <div className="grid grid-cols-2 gap-2.5">
        <Card className="flex flex-col gap-1 p-3">
          <span className="type-label-xs uppercase text-text-secondary">
            Network Status
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOnline ? "bg-[#16a34a]" : "bg-[#d97706]"
              }`}
            />
            <span className="type-label-md text-text-primary">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
          <span className="type-label-xs text-text-subtle">
            {isOnline ? "Syncing live data" : "Serving from cache"}
          </span>
        </Card>

        <Card className="flex flex-col gap-1 p-3">
          <span className="type-label-xs uppercase text-text-secondary">
            PWA Manifest
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-border-strong" />
            <span className="type-label-md text-text-primary">v1.0 Ready</span>
          </div>
          <span className="type-label-xs text-text-subtle">Standalone App Scope</span>
        </Card>

        <Card className="flex flex-col gap-1 p-3">
          <span className="type-label-xs uppercase text-text-secondary">
            Service Worker
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
            <span className="type-label-md text-text-primary font-mono-data">sw.js active</span>
          </div>
          <span className="type-label-xs text-text-subtle">Cache-First Shell</span>
        </Card>

        <Card className="flex flex-col gap-1 p-3">
          <span className="type-label-xs uppercase text-text-secondary">
            Display Mode
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isStandalone ? "bg-[#16a34a]" : "bg-text-subtle"
              }`}
            />
            <span className="type-label-md text-text-primary">
              {isStandalone ? "Standalone" : "Web Shell"}
            </span>
          </div>
          <span className="type-label-xs text-text-subtle">
            {isStandalone ? "Full screen native" : "Browser frame"}
          </span>
        </Card>
      </div>

      {/* Admin Core Modules */}
      <div className="flex flex-col gap-2 mt-0.5">
        <div className="flex items-center justify-between">
          <h3 className="type-label-xs text-text-secondary uppercase">
            Core Modules
          </h3>
          <span className="type-label-xs text-text-subtle">Precision Telemetry</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {/* Module: Store Operations */}
          <Card className="flex items-center justify-between p-3.5 hover:bg-surface-subtle active:scale-[0.99] transition cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-surface-subtle border border-border-default flex items-center justify-center text-text-primary">
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <div>
                <p className="type-label-md text-text-primary">Catalog & Inventory</p>
                <p className="type-label-xs text-text-secondary">Manage products, stock & SKUs</p>
              </div>
            </div>
            <Badge variant="neutral">Active</Badge>
          </Card>

          {/* Module: Orders & Shipments */}
          <Card className="flex items-center justify-between p-3.5 hover:bg-surface-subtle active:scale-[0.99] transition cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-surface-subtle border border-border-default flex items-center justify-center text-text-primary">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <p className="type-label-md text-text-primary">Orders & Shipments</p>
                <p className="type-label-xs text-text-secondary">Dispatch queue & tracking</p>
              </div>
            </div>
            <Badge variant="success">Syncing</Badge>
          </Card>

          {/* Module: Staff & Access */}
          <Card className="flex items-center justify-between p-3.5 hover:bg-surface-subtle active:scale-[0.99] transition cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-surface-subtle border border-border-default flex items-center justify-center text-text-primary">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="type-label-md text-text-primary">Staff & Permissions</p>
                <p className="type-label-xs text-text-secondary">Roles, sessions & audit log</p>
              </div>
            </div>
            <Badge variant="default">Protected</Badge>
          </Card>
        </div>
      </div>

      {/* PWA Resilience Card */}
      <Card className="p-3.5 bg-surface-subtle border border-border-default flex flex-col gap-2 mt-0.5">
        <div className="flex items-center justify-between">
          <span className="type-label-xs font-semibold text-text-primary">PWA Resilience Check</span>
          <Link
            href="/offline"
            className="type-label-xs text-text-secondary hover:text-text-primary transition underline underline-offset-2"
          >
            Preview Offline Page →
          </Link>
        </div>
        <p className="type-body-sm text-text-secondary leading-relaxed">
          The service worker automatically intercepts disconnection and renders the offline cache fallback.
        </p>
      </Card>
    </div>
  );
}
