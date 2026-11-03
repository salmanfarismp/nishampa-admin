"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ClientItem } from "../types";

interface ClientCardProps {
  client: ClientItem;
  onOpenMenu: (client: ClientItem) => void;
}

const FALLBACK_IMAGE = "/images/general-img-square.png";

export const ClientCard: React.FC<ClientCardProps> = ({ client, onOpenMenu }) => {
  const [imageError, setImageError] = useState(false);
  const imageSrc = !imageError && client.logoUrl ? client.logoUrl : FALLBACK_IMAGE;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenMenu(client)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenMenu(client);
        }
      }}
      className="flex flex-col items-center group cursor-pointer select-none transition-transform active:scale-[0.98]"
      aria-label={`Options for ${client.name || "client"}`}
    >
      {/* Big Square Image Tile */}
      <div className="relative aspect-square w-full rounded-2xl bg-surface-container-lowest border border-outline-variant/30 group-hover:border-outline-variant/70 shadow-2xs group-hover:shadow-xs overflow-hidden flex items-center justify-center p-3 transition-all">
        <Image
          src={imageSrc}
          alt={client.name || "Client logo"}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
          onError={() => setImageError(true)}
        />
      </div>

      {/* Name Only under the square image */}
      <p className="text-[13.5px] sm:text-[14px] font-semibold text-on-surface text-center truncate w-full mt-2 px-1 leading-snug group-hover:text-primary transition-colors">
        {client.name || "Unnamed Client"}
      </p>
    </div>
  );
};
