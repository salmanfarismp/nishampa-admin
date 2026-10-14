"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Order } from "./types";

interface OrderCardProps {
  order: Order;
  onAccept: (order: Order) => void;
  onDispatch: (order: Order) => void;
  onTrack: (order: Order) => void;
  onViewDetails: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onAccept,
  onDispatch,
  onTrack,
  onViewDetails,
}) => {
  const [imgError, setImgError] = useState(false);

  // Status Badge Class Helpers matching design tokens
  const getPrimaryStatusBadge = () => {
    switch (order.primaryStatus) {
      case "new":
      case "accepted":
        return "bg-secondary-fixed text-on-secondary-fixed";
      case "shipped":
        return "bg-surface-container text-on-surface-variant";
      case "returned":
        return "bg-error-container text-on-error-container";
      default:
        return "bg-surface-container text-on-surface-variant";
    }
  };

  const getSecondaryStatusBadge = () => {
    switch (order.secondaryStatus) {
      case "active":
        return "bg-surface-container text-on-surface-variant";
      case "completed":
        return "bg-secondary-fixed text-on-secondary-fixed";
      case "cancelled":
        return "bg-surface-container text-on-surface-variant";
      default:
        return "bg-surface-container text-on-surface-variant";
    }
  };

  // Payment Status Styling
  const renderPaymentStatus = () => {
    if (order.paymentStatus === "paid") {
      return (
        <span className="font-mono text-[11px] text-on-surface-variant">
          {order.paymentMethod} •{" "}
          <span className="font-medium text-primary">Paid</span>
        </span>
      );
    }
    if (order.paymentStatus === "refunded") {
      return (
        <span className="font-mono text-[11px] text-on-surface-variant">
          {order.paymentMethod} •{" "}
          <span className="font-medium text-on-error-container">Refunded</span>
        </span>
      );
    }
    return (
      <span className="font-mono text-[11px] text-on-surface-variant">
        {order.paymentMethod} •{" "}
        <span className="font-medium text-on-surface">Pending</span>
      </span>
    );
  };

  const isReturnedOrCancelled =
    order.primaryStatus === "returned" || order.secondaryStatus === "cancelled";
  const isShipped = order.primaryStatus === "shipped";

  return (
    <div
      onClick={() => onViewDetails(order)}
      className={`order-card flex flex-col bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-border-default/50 transition-all gap-2.5 cursor-pointer active:bg-surface-container-low/40 ${
        isReturnedOrCancelled
          ? "opacity-75"
          : isShipped
          ? "opacity-90"
          : "opacity-100"
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-2">
        {/* Left Column: ID, Time, Customer, Location */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-mono text-[12px] font-semibold ${
                order.isStrikethrough
                  ? "line-through text-on-surface-variant"
                  : "text-primary"
              }`}
            >
              {order.id}
            </span>
            <span className="text-on-surface-variant text-[10px]">•</span>
            <span className="font-mono text-[11px] text-on-surface-variant">
              {order.timeAgo}
            </span>
          </div>
          <span className="text-[15px] font-semibold text-on-surface mt-0.5 tracking-tight truncate">
            {order.customerName}
          </span>
          <span className="text-[12px] text-on-surface-variant">
            {order.location}
          </span>
        </div>

        {/* Right Column: Status Badges & Payment Info */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <div className="flex items-center gap-1">
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${getPrimaryStatusBadge()}`}
            >
              {order.primaryStatus}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${getSecondaryStatusBadge()}`}
            >
              {order.secondaryStatus}
            </span>
          </div>
          {renderPaymentStatus()}
        </div>
      </div>

      {/* Middle Items Summary Strip */}
      <div className="flex items-center gap-2.5 py-1.5 px-2 bg-surface-container-low rounded-lg">
        {order.primaryImageUrl && !imgError && !order.isStrikethrough ? (
          <div className="h-9 w-9 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container relative">
            <Image
              src={order.primaryImageUrl}
              alt={order.itemsSummary}
              width={36}
              height={36}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
              unoptimized
            />
          </div>
        ) : null}

        <div className="flex flex-col min-w-0 flex-1">
          <span
            className={`text-[13px] truncate ${
              order.isStrikethrough
                ? "text-on-surface-variant font-normal"
                : "text-on-surface font-medium"
            }`}
          >
            {order.itemsSummary}
          </span>
          {order.totalItemsCount > 0 && (
            <span className="font-mono text-[11px] text-on-surface-variant">
              {order.totalItemsCount} item{order.totalItemsCount > 1 ? "s" : ""}{" "}
              total
            </span>
          )}
        </div>

        <span
          className={`font-mono text-[14px] flex-shrink-0 tabular-nums ${
            order.isStrikethrough
              ? "text-on-surface-variant font-medium"
              : "text-on-surface font-semibold"
          }`}
        >
          ${order.totalAmount.toFixed(2)}
        </span>
      </div>

      {/* Bottom Action Section */}
      <div
        className="pt-0.5"
        onClick={(e) => {
          // Prevent opening card details drawer when clicking specific action buttons
          e.stopPropagation();
        }}
      >
        {/* State 1: Order New -> Accept Order */}
        {order.primaryStatus === "new" && (
          <button
            type="button"
            disabled={order.actionState === "loading" || order.actionState === "done"}
            onClick={() => onAccept(order)}
            className={`w-full h-10 flex items-center justify-center gap-1.5 rounded-lg text-[13px] font-medium transition-all shadow-xs cursor-pointer ${
              order.actionState === "done"
                ? "bg-surface-container-highest text-on-surface"
                : "bg-primary text-on-primary active:scale-[0.98]"
            }`}
          >
            {order.actionState === "loading" ? (
              <>
                <svg
                  className="animate-spin w-4 h-4 text-on-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Printing Label...</span>
              </>
            ) : order.actionState === "done" ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Ready for Courier</span>
              </>
            ) : (
              <span>Accept Order</span>
            )}
          </button>
        )}

        {/* State 2: Order Accepted -> Dispatch Courier */}
        {order.primaryStatus === "accepted" && (
          <button
            type="button"
            disabled={order.actionState === "done"}
            onClick={() => onDispatch(order)}
            className={`w-full h-10 flex items-center justify-center gap-1.5 rounded-lg text-[13px] font-medium transition-all shadow-xs cursor-pointer ${
              order.actionState === "done"
                ? "bg-surface-container-highest text-on-surface"
                : "bg-primary text-on-primary active:scale-[0.98]"
            }`}
          >
            {order.actionState === "done" ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-telemetry-success"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="16 10 11 15 8 12" />
                </svg>
                <span>Dispatched</span>
              </>
            ) : (
              <span>Dispatch Courier</span>
            )}
          </button>
        )}

        {/* State 3: Order Shipped -> Carrier code + Track Shipment */}
        {order.primaryStatus === "shipped" && (
          <div className="flex items-center justify-between py-0.5">
            <span className="font-mono text-[11px] text-on-surface-variant">
              {order.carrier} • {order.trackingNumber}
            </span>
            <button
              type="button"
              onClick={() => onTrack(order)}
              className="text-[12px] text-on-surface hover:underline font-medium cursor-pointer"
            >
              Track Shipment
            </button>
          </div>
        )}

        {/* State 4: Order Returned/Cancelled -> Refund summary + Details button */}
        {order.primaryStatus === "returned" && (
          <div className="flex items-center justify-between py-0.5">
            <span className="font-mono text-[11px] text-on-surface-variant truncate mr-2">
              {order.refundDetails}
            </span>
            <button
              type="button"
              onClick={() => onViewDetails(order)}
              className="text-[12px] text-on-surface-variant hover:text-on-surface font-medium flex-shrink-0 cursor-pointer"
            >
              Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
