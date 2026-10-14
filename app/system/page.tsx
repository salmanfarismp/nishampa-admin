"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function SystemPage() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 pb-1">
        <h2 className="text-lg font-bold text-white tracking-tight">System & Diagnostics</h2>
        <p className="text-xs text-zinc-400">PWA storage, cache partitions & background tasks.</p>
      </div>

      <Card className="p-3.5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white">Cache Partition</span>
          <Badge variant="info">western-admin-v1</Badge>
        </div>
        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
          <div className="bg-blue-500 h-full w-[24%]" />
        </div>
        <span className="text-[10px] text-zinc-400">Storage: 2.8 MB / 50 MB precached</span>
      </Card>

      <Card className="p-3.5 flex flex-col gap-2">
        <span className="text-xs font-semibold text-white">Environment</span>
        <div className="text-[11px] text-zinc-400 flex flex-col gap-1 font-mono">
          <div>Framework: Next.js 16 (Turbopack)</div>
          <div>UI Runtime: React 19 (Server Components + PWA Client)</div>
          <div>PWA Spec: Web Manifest 2.0 (Standalone Mobile)</div>
        </div>
      </Card>
    </div>
  );
}
