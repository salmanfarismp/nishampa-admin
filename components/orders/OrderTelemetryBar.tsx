"use client";

import React from "react";
import { OrderTelemetryData } from "./types";

interface OrderTelemetryBarProps {
  telemetry: OrderTelemetryData;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const OrderTelemetryBar: React.FC<OrderTelemetryBarProps> = ({
  telemetry,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className="flex items-center justify-between px-1 py-1 select-none">
      <div className="flex items-center gap-3">
        {/* Pending Orders Counter */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-text-secondary">
            Pending
          </span>
          <span className="text-[16px] font-semibold text-primary tracking-tight">
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

      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh orders"
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-text-secondary hover:text-on-surface bg-surface-container hover:bg-surface-container-high rounded-lg transition-all active:scale-95 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
          <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
        </button>
      )}
    </div>
  );
};
