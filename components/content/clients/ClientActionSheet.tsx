"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ClientItem } from "../types";

interface ClientActionSheetProps {
  client: ClientItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (client: ClientItem) => void;
  onDelete: (client: ClientItem) => void;
  onToggleShowLogo?: (client: ClientItem) => void;
}

const FALLBACK_IMAGE = "/images/general-img-square.png";

export const ClientActionSheet: React.FC<ClientActionSheetProps> = ({
  client,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleShowLogo,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!isOpen || !client) return null;

  const handleClose = () => {
    setConfirmDelete(false);
    setImageError(false);
    onClose();
  };

  const imageSrc = !imageError && client.logoUrl ? client.logoUrl : FALLBACK_IMAGE;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="client-actions-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200"
    >
      <div className="fixed inset-0" onClick={handleClose} aria-hidden="true" />

      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-5 flex flex-col gap-3 shadow-2xl animate-in slide-in-from-bottom duration-250 z-10 border-t border-border-default/60 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
        {/* Grab Handle */}
        <div className="w-10 h-1 bg-surface-container-highest rounded-full mx-auto -mt-1 mb-1" />

        {/* Client Preview Header */}
        <div className="flex items-center gap-3.5 pb-3 border-b border-surface-container">
          <div className="relative w-12 h-12 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-center overflow-hidden flex-shrink-0 p-1.5 shadow-2xs">
            <Image
              src={imageSrc}
              alt={client.name || "Client logo"}
              fill
              sizes="48px"
              className="object-contain"
              onError={() => setImageError(true)}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <p
              id="client-actions-title"
              className="text-[16px] font-semibold text-on-surface truncate leading-tight"
            >
              {client.name || "Unnamed Client"}
            </p>
            <p className="text-[12px] text-on-surface-variant truncate mt-0.5">
              {client.show_logo ? "Storefront: Showing Logo" : "Storefront: Showing Brand Name"}
            </p>
          </div>
        </div>

        {/* Actions List */}
        <div className="flex flex-col gap-2">
          {/* Edit */}
          <button
            type="button"
            onClick={() => {
              handleClose();
              onEdit(client);
            }}
            className="w-full h-11 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center gap-3 text-left text-[13px] font-medium text-on-surface transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-on-surface-variant"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
            <span>Edit Client Details</span>
          </button>

          {/* Toggle Show Logo vs Brand Name */}
          {onToggleShowLogo && (
            <button
              type="button"
              onClick={() => {
                handleClose();
                onToggleShowLogo(client);
              }}
              className="w-full h-11 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-between text-left text-[13px] font-medium text-on-surface transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {client.show_logo ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-on-surface-variant"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="4 7 4 4 20 4 20 7" />
                    <line x1="9" y1="20" x2="15" y2="20" />
                    <line x1="12" y1="4" x2="12" y2="20" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-on-surface-variant"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                )}
                <span>
                  {client.show_logo ? "Switch to Display Brand Name" : "Switch to Display Logo"}
                </span>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant">
                Currently: {client.show_logo ? "Logo" : "Brand Name"}
              </span>
            </button>
          )}

          {/* Delete Action with inline confirm */}
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="w-full h-11 px-3 rounded-xl bg-error-container/20 hover:bg-error-container/40 flex items-center gap-3 text-left text-[13px] font-medium text-error transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-error"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
              <span>Delete Client</span>
            </button>
          ) : (
            <div className="p-3 bg-error-container/20 border border-error/30 rounded-xl flex flex-col gap-2 animate-in fade-in duration-150">
              <p className="text-[12px] text-error font-medium">
                Are you sure you want to delete this client? The logo and client record will be permanently removed.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 h-9 rounded-lg bg-surface-container text-[12px] font-medium text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    onDelete(client);
                  }}
                  className="flex-1 h-9 rounded-lg bg-error hover:bg-error/90 text-on-error text-[12px] font-medium transition-colors"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

