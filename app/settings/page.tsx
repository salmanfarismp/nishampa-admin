"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { usePwaInstall } from "@/lib/hooks/usePwaInstall";

export default function SettingsPage() {
  const { isInstallable, isStandalone, promptInstall } = usePwaInstall();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 pb-1">
        <h2 className="type-headline-md text-text-primary">App Settings</h2>
        <p className="type-body-sm text-text-secondary">PWA preferences and device configurations.</p>
      </div>

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
