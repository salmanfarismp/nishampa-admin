"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function SystemPage() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 pb-1">
        <h2 className="type-headline-md text-text-primary">System & Diagnostics</h2>
        <p className="type-body-sm text-text-secondary">PWA storage, cache partitions & background telemetry.</p>
      </div>

      <Card className="p-3.5 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="type-label-sm text-text-primary">Cache Partition</span>
          <Badge variant="neutral">western-admin-v1</Badge>
        </div>
        <div className="w-full bg-surface-subtle border border-border-default h-2 rounded-full overflow-hidden">
          <div className="bg-text-primary h-full w-[24%]" />
        </div>
        <span className="type-mono-data text-text-secondary">Storage: 2.8 MB / 50 MB precached</span>
      </Card>

      <Card className="p-3.5 flex flex-col gap-2">
        <span className="type-label-sm text-text-primary">Environment Architecture</span>
        <div className="type-mono-data text-text-secondary flex flex-col gap-1.5 pt-1">
          <div className="flex justify-between py-1 border-b border-border-subtle">
            <span className="text-text-subtle">Framework</span>
            <span className="text-text-primary">Next.js 16 (Turbopack)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border-subtle">
            <span className="text-text-subtle">Styling Stack</span>
            <span className="text-text-primary">Tailwind CSS v4 (@theme)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border-subtle">
            <span className="text-text-subtle">Design Spec</span>
            <span className="text-text-primary">Monochrome Commerce Studio</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-text-subtle">PWA Mode</span>
            <span className="text-text-primary">Standalone Mobile (Manifest 2.0)</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
