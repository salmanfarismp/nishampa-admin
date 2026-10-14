"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function ModulesPage() {
  const modules = [
    { title: "Inventory Management", count: "1,248 Items", status: "Healthy" },
    { title: "Order Pipeline", count: "42 Pending", status: "Active" },
    { title: "Customer Directory", count: "892 Accounts", status: "Synced" },
    { title: "Payment Gateways", count: "Stripe & Wire", status: "Live" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 pb-1">
        <h2 className="text-lg font-bold text-white tracking-tight">Admin Modules</h2>
        <p className="text-xs text-zinc-400">Modular sub-applications and administrative tools.</p>
      </div>

      <div className="flex flex-col gap-2.5">
        {modules.map((m) => (
          <Card key={m.title} className="p-3.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">{m.title}</p>
              <p className="text-[11px] text-zinc-400">{m.count}</p>
            </div>
            <Badge variant="success">{m.status}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
