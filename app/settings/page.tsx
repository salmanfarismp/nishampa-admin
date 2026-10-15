"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { usePwaInstall } from "@/lib/hooks/usePwaInstall";
import { useAuth } from "@/components/auth/AuthProvider";

export default function SettingsPage() {
  const { isInstallable, isStandalone, promptInstall } = usePwaInstall();
  const { user, signOut, isLoading } = useAuth();

  const userEmail = user?.email || "Unknown";
  const userName =
    user?.user_metadata?.full_name || user?.user_metadata?.name || "Administrator";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 pb-1">
        <h2 className="type-headline-md text-text-primary">App Settings</h2>
        <p className="type-body-sm text-text-secondary">
          Account credentials, PWA preferences, and device configurations.
        </p>
      </div>

      {/* Admin Account Section */}
      <Card className="p-3.5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="type-label-md text-text-primary">Administrator Session</p>
            <p className="type-label-xs text-text-secondary">
              {isLoading ? "Validating session..." : `Signed in as ${userName}`}
            </p>
          </div>
          <Badge variant="success">Authenticated</Badge>
        </div>

        <div className="p-2.5 rounded-lg bg-surface-container-low border border-border-subtle flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">
              Google Account
            </span>
            <span className="text-xs font-mono text-text-primary truncate">
              {userEmail}
            </span>
          </div>
          <Button
            onClick={() => signOut()}
            variant="ghost"
            size="sm"
            className="text-telemetry-critical hover:bg-telemetry-critical-bg flex-shrink-0"
          >
            Sign Out
          </Button>
        </div>
      </Card>

      {/* PWA Settings */}
      <Card className="p-3.5 flex items-center justify-between">
        <div>
          <p className="type-label-md text-text-primary">Standalone Installation</p>
          <p className="type-label-xs text-text-secondary">
            {isStandalone
              ? "Running in installed standalone mode"
              : isInstallable
              ? "Ready to install to home screen"
              : "Running in browser shell"}
          </p>
        </div>
        {!isStandalone && isInstallable && (
          <Button
            onClick={() => promptInstall()}
            variant="primary"
            size="sm"
          >
            Install
          </Button>
        )}
      </Card>

      <Card className="p-3.5 flex items-center justify-between">
        <div>
          <p className="type-label-md text-text-primary">Offline Synchronization</p>
          <p className="type-label-xs text-text-secondary">Cache static assets & admin layouts</p>
        </div>
        <Badge variant="success">Enabled</Badge>
      </Card>

      <Card className="p-3.5 flex items-center justify-between">
        <div>
          <p className="type-label-md text-text-primary">Design System Theme</p>
          <p className="type-label-xs text-text-secondary">Monochrome Commerce Studio standard</p>
        </div>
        <Badge variant="neutral">Active</Badge>
      </Card>
    </div>
  );
}
