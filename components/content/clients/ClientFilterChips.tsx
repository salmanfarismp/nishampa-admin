"use client";

import React from "react";
import { ClientDisplayFilter } from "../types";

interface ClientFilterChipsProps {
  activeFilter: ClientDisplayFilter;
  onSelectFilter: (filter: ClientDisplayFilter) => void;
  counts: {
    all: number;
    logo: number;
    name: number;
  };
}

export const ClientFilterChips: React.FC<ClientFilterChipsProps> = ({
  activeFilter,
  onSelectFilter,
  counts,
}) => {
  const chips: Array<{
    key: ClientDisplayFilter;
    label: string;
    count?: number;
  }> = [
    { key: "all", label: "All", count: counts.all },
    { key: "logo", label: "Logo Display", count: counts.logo },
    { key: "name", label: "Brand Name", count: counts.name },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar select-none -mx-1 px-1">
      {chips.map((chip) => {
        const isActive = activeFilter === chip.key;
        return (
          <button
            key={chip.key}
            type="button"
            onClick={() => onSelectFilter(chip.key)}
            className={`px-3 py-1.5 rounded-full font-mono text-[11px] font-medium whitespace-nowrap transition-all duration-150 cursor-pointer active:scale-95 flex items-center gap-1.5 ${
              isActive
                ? "bg-primary text-on-primary shadow-xs font-semibold"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-border-default/40"
            }`}
          >
            <span>{chip.label}</span>
            {typeof chip.count === "number" && (
              <span
                className={`text-[10px] ${
                  isActive ? "text-white/80" : "text-on-surface-variant/80"
                }`}
              >
                ({chip.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

