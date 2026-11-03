"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ClientItem } from "../types";

interface ClientCardProps {
  client: ClientItem;
  onOpenMenu: (client: ClientItem) => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "CL";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_PALETTES = [
  { bg: "bg-blue-100 dark:bg-blue-950/60", text: "text-blue-800 dark:text-blue-200" },
  { bg: "bg-emerald-100 dark:bg-emerald-950/60", text: "text-emerald-800 dark:text-emerald-200" },
  { bg: "bg-purple-100 dark:bg-purple-950/60", text: "text-purple-800 dark:text-purple-200" },
  { bg: "bg-amber-100 dark:bg-amber-950/60", text: "text-amber-800 dark:text-amber-200" },
  { bg: "bg-rose-100 dark:bg-rose-950/60", text: "text-rose-800 dark:text-rose-200" },
  { bg: "bg-indigo-100 dark:bg-indigo-950/60", text: "text-indigo-800 dark:text-indigo-200" },
];

export const ClientCard: React.FC<ClientCardProps> = ({ client, onOpenMenu }) => {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(client.name || "Client");
  const paletteIndex = Math.abs(
    (client.rawId || client.id.charCodeAt(0) || 0) % AVATAR_PALETTES.length
  );
  const palette = AVATAR_PALETTES[paletteIndex];

  const hasValidLogo = Boolean(client.logoUrl) && !imageError;

  return (
    <article className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 flex items-center justify-between gap-3.5 transition-all duration-200 select-none shadow-2xs hover:shadow-xs hover:border-outline-variant/60">
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Logo / Monogram Container */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-surface-container/50 border border-outline-variant/30 flex items-center justify-center overflow-hidden flex-shrink-0 p-1.5">
          {hasValidLogo ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={client.logoUrl}
                alt={client.name || "Client logo"}
                fill
                sizes="(max-width: 640px) 48px, 56px"
                className="object-contain"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div
              className={`w-full h-full rounded-lg ${palette.bg} ${palette.text} flex items-center justify-center font-bold text-xs sm:text-sm tracking-wider`}
              aria-hidden="true"
            >
              {initials}
            </div>
          )}
        </div>

        {/* Client Details */}
        <div className="flex flex-col min-w-0">
          <h3 className="text-[14px] sm:text-[15px] font-semibold text-on-surface truncate leading-snug">
            {client.name || "Unnamed Client"}
          </h3>
          <p className="text-[11px] sm:text-[12px] text-on-surface-variant font-normal truncate mt-0.5">
            {client.formattedDate ? `Added ${client.formattedDate}` : "Client Partner"}
          </p>
        </div>
      </div>

      {/* Action Menu Trigger Button */}
      <button
        type="button"
        onClick={() => onOpenMenu(client)}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer flex-shrink-0"
        aria-label={`Options for ${client.name || "client"}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>
    </article>
  );
};

