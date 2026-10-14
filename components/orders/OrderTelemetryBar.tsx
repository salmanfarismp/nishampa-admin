"use client";

import React from "react";
import { OrderTelemetryData } from "./types";

interface OrderTelemetryBarProps {
  telemetry: OrderTelemetryData;
}

export const OrderTelemetryBar: React.FC<OrderTelemetryBarProps> = ({ telemetry }) => {
  return (
    <div className="flex items-center justify-between px-1 py-1 select-none">
      <div className="flex items-center gap-3">
        {/* Pending Orders Counter */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-text-secondary">
            Pending
          </span>
          <span className="text-[16px] font-semibold text-on-surface tracking-tight">
            {telemetry.pendingCount}
          </span>
        </div>

        {/* Hairline Divider */}
        <span className="text-border-default select-none">|</span>

        {/* Total Today Orders Counter */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-text-secondary">
            Total Today
          </span>
          <span className="text-[16px] font-semibold text-on-surface tracking-tight">
            {telemetry.todayCount}
          </span>
        </div>
      </div>
    </div>
  );
};
