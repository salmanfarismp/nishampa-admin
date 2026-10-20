"use client";

import React from "react";
import { OrderFilterStatus } from "./types";

interface OrderStatusPillsProps {
  activeFilter: OrderFilterStatus;
  onFilterChange: (filter: OrderFilterStatus) => void;
  statusCounts?: Record<string, number>;
}

const ORDER_STATUS_TABS: { id: OrderFilterStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "accepted", label: "Accepted" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "returns", label: "Returns" },
  { id: "cancelled", label: "Cancelled" },
];

export const OrderStatusPills: React.FC<OrderStatusPillsProps> = ({
  activeFilter,
  onFilterChange,
  statusCounts,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 py-0.5 select-none">
      {ORDER_STATUS_TABS.map((tab) => {
        const isActive = activeFilter === tab.id;
        const count = statusCounts?.[tab.id] ?? 0;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onFilterChange(tab.id)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium flex-shrink-0 whitespace-nowrap transition-all duration-150 active:scale-[0.96] cursor-pointer ${
              isActive
                ? "bg-primary text-on-primary shadow-xs"
                : "bg-surface-container text-on-surface hover:bg-surface-container-high"
            }`}
          >
            {tab.label} ({count})
          </button>
        );
      })}
    </div>
  );
};
