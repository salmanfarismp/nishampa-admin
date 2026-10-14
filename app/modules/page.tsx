"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function ModulesPage() {
  const modules = [
    { title: "Inventory Management", count: "1,248 Items", status: "Active" as const, variant: "neutral" as const },
    { title: "Order Pipeline", count: "42 Pending", status: "In Review" as const, variant: "warning" as const },
    { title: "Customer Directory", count: "892 Accounts", status: "Synced" as const, variant: "success" as const },
    { title: "Payment Gateways", count: "Stripe & Wire", status: "Operational" as const, variant: "success" as const },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 pb-1">
        <h2 className="type-headline-md text-text-primary">Admin Modules</h2>
        <p className="type-body-sm text-text-secondary">Modular sub-applications and administrative tools.</p>
      </div>

      <div className="flex flex-col gap-2">
        {modules.map((m) => (
          <Card key={m.title} className="p-3.5 flex items-center justify-between hover:bg-surface-subtle transition">
            <div>
              <p className="type-label-md text-text-primary">{m.title}</p>
              <p className="type-mono-data text-text-secondary mt-0.5">{m.count}</p>
            </div>
            <Badge variant={m.variant}>{m.status}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
