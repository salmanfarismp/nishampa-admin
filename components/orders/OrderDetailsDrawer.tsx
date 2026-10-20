"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Order, PrimaryStatus, SecondaryStatus } from "./types";

interface OrderDetailsDrawerProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onAcceptOrder?: (order: Order) => void;
  onDispatchCourier?: (order: Order) => void;
  onTrackShipment?: (order: Order) => void;
  onUpdateStatus?: (
    order: Order,
    newStatus: PrimaryStatus,
    newFulfillment?: SecondaryStatus
  ) => Promise<void> | void;
  onToast?: (message: string) => void;
}

export const OrderDetailsDrawer: React.FC<OrderDetailsDrawerProps> = ({
  order,
  isOpen,
  onClose,
  onAcceptOrder,
  onDispatchCourier,
  onTrackShipment,
  onUpdateStatus,
  onToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCopied(false);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const handleCopyShippingAddress = async () => {
    const textToCopy =
      order.shippingAddress?.formattedAddress ||
      `${order.customerName}\n${order.location}${
        order.customerPhone ? `\nPhone: ${order.customerPhone}` : ""
      }`;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for non-secure or restricted iframe contexts
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      onToast?.("Shipping address copied to clipboard!");
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error("Failed to copy address:", err);
      onToast?.("Could not copy address.");
    }
  };

  const handleStatusChange = async (newStatus: PrimaryStatus) => {
    if (!onUpdateStatus || isUpdatingStatus) return;
    try {
      setIsUpdatingStatus(true);
      await onUpdateStatus(order, newStatus);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Surface */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Order Details"
        className="relative w-full max-w-lg max-h-[90vh] bg-surface-container-lowest text-on-surface rounded-t-2xl flex flex-col shadow-2xl z-10 overflow-hidden animate-in slide-in-from-bottom duration-250 ease-out border-t border-border-default/50"
      >
        {/* Drag Handle Bar */}
        <div className="w-full flex items-center justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-surface-container-highest rounded-full" />
        </div>

        {/* Drawer Header */}
        <div className="px-4 py-3 flex items-start justify-between border-b border-border-subtle">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[14px] font-semibold text-primary">
                {order.id}
              </span>
              <span className="text-[10px] text-text-secondary">•</span>
              <span className="font-mono text-[11px] text-text-secondary">
                {order.timeAgo}
              </span>
            </div>
            <h2 className="text-[18px] font-semibold text-on-surface tracking-tight mt-0.5">
              {order.customerName}
            </h2>
            <span className="text-[12px] text-text-secondary">
              {order.location}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-text-secondary hover:text-on-surface active:scale-90 transition-all cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {/* Status & Operational Controls */}
          <div className="p-3 bg-surface-container-low rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                  Order Status
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-medium capitalize">
                    {order.primaryStatus}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-medium capitalize">
                    {order.secondaryStatus}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                  Payment
                </span>
                <span className="font-mono text-[12px] text-on-surface-variant">
                  {order.paymentMethod} •{" "}
                  <span
                    className={`font-semibold capitalize ${
                      order.paymentStatus === "paid"
                        ? "text-primary"
                        : order.paymentStatus === "refunded"
                        ? "text-error"
                        : order.paymentStatus === "failed"
                        ? "text-error"
                        : "text-on-surface"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </span>
              </div>
            </div>

            {/* Admin Status Quick Override Pills */}
            <div className="border-t border-border-default/40 pt-2 flex items-center justify-between gap-1 flex-wrap">
              <span className="text-[11px] text-text-secondary">Set Status:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(["new", "accepted", "shipped", "delivered", "cancelled"] as PrimaryStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={isUpdatingStatus || order.primaryStatus === st}
                      onClick={() => handleStatusChange(st)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all capitalize cursor-pointer ${
                        order.primaryStatus === st
                          ? "bg-primary text-on-primary shadow-xs font-semibold"
                          : "bg-surface-container text-on-surface hover:bg-surface-container-high active:scale-95"
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Customer & Shipping Details with Copy Address Button */}
          <div className="p-3 bg-surface-container-low rounded-xl space-y-2 border border-border-default/30">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Shipping Address
              </h3>

              {/* COPY SHIPPING ADDRESS BUTTON */}
              <button
                type="button"
                onClick={handleCopyShippingAddress}
                aria-label="Copy shipping address"
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  copied
                    ? "bg-secondary-fixed text-on-secondary-fixed font-semibold shadow-xs"
                    : "bg-surface-container text-on-surface hover:bg-surface-container-high active:scale-95"
                }`}
              >
                {copied ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 h-3.5 text-primary"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 h-3.5 text-text-secondary"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                    <span>Copy Address</span>
                  </>
                )}
              </button>
            </div>

            {/* Address Details */}
            <div className="text-[12px] text-on-surface font-sans space-y-0.5 leading-relaxed bg-surface-container-lowest p-2.5 rounded-lg border border-border-default/40">
              <div className="font-semibold text-on-surface">
                {order.customerName}
              </div>
              {order.customerPhone && (
                <div className="text-text-secondary font-mono text-[11px]">
                  📞 {order.customerPhone}
                </div>
              )}
              {order.customerEmail && (
                <div className="text-text-secondary font-mono text-[11px]">
                  ✉️ {order.customerEmail}
                </div>
              )}
              {order.shippingAddress?.addressLine1 && (
                <div className="pt-1 text-on-surface">
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2
                    ? `, ${order.shippingAddress.addressLine2}`
                    : ""}
                </div>
              )}
              <div className="text-on-surface">
                {[
                  order.shippingAddress?.city,
                  order.shippingAddress?.state,
                  order.shippingAddress?.postalCode,
                ]
                  .filter(Boolean)
                  .join(", ") || order.location}
              </div>
              {order.shippingAddress?.country && (
                <div className="text-text-secondary text-[11px]">
                  {order.shippingAddress.country}
                </div>
              )}
            </div>
          </div>

          {/* Payment & Gateway Reference Details */}
          {order.paymentDetail && (
            <div className="p-3 bg-surface-container-low rounded-xl space-y-1.5 text-[12px]">
              <h3 className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">
                Payment Information
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-surface-container-lowest p-2 rounded-lg border border-border-default/40">
                  <span className="text-text-secondary block">Gateway</span>
                  <span className="font-medium text-on-surface uppercase">
                    {order.paymentDetail.gateway || order.paymentMethod}
                  </span>
                </div>
                <div className="bg-surface-container-lowest p-2 rounded-lg border border-border-default/40">
                  <span className="text-text-secondary block">Status</span>
                  <span className="font-medium text-primary capitalize">
                    {order.paymentDetail.status || order.paymentStatus}
                  </span>
                </div>
              </div>

              {order.paymentDetail.gatewayOrderId && (
                <div className="bg-surface-container-lowest p-2 rounded-lg border border-border-default/40 font-mono text-[11px] flex justify-between">
                  <span className="text-text-secondary">Order ID:</span>
                  <span className="text-on-surface truncate ml-2">
                    {order.paymentDetail.gatewayOrderId}
                  </span>
                </div>
              )}

              {order.paymentDetail.gatewayPaymentId && (
                <div className="bg-surface-container-lowest p-2 rounded-lg border border-border-default/40 font-mono text-[11px] flex justify-between">
                  <span className="text-text-secondary">Payment ID:</span>
                  <span className="text-on-surface truncate ml-2">
                    {order.paymentDetail.gatewayPaymentId}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Refund Notice if applicable */}
          {order.refundDetails && (
            <div className="p-3 bg-error-container/20 border border-error-container/40 rounded-xl text-[12px] text-on-surface font-mono">
              {order.refundDetails}
            </div>
          )}

          {/* Order Items List */}
          <div>
            <h3 className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Order Items ({order.items.length})
            </h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-xl gap-2.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                          unoptimized
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-text-subtle"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-medium text-on-surface truncate">
                        {item.name}
                      </span>
                      <span className="font-mono text-[11px] text-text-secondary">
                        Qty: {item.quantity} × {formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-[13px] font-semibold text-on-surface flex-shrink-0 tabular-nums">
                    {formatCurrency(item.totalPrice != null ? item.totalPrice : item.quantity * item.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Calculation Summary */}
          <div className="p-3 bg-surface-container-low/70 rounded-xl space-y-1.5 text-[12px]">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Shipping</span>
              <span className="font-mono text-telemetry-success">Free Delivery</span>
            </div>
            <div className="border-t border-border-default/50 pt-1.5 flex justify-between font-semibold text-on-surface text-[14px]">
              <span>Total Amount</span>
              <span className="font-mono tabular-nums text-primary font-bold">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-border-subtle bg-surface-container-lowest pb-[calc(1rem+env(safe-area-inset-bottom,0px))] flex flex-col gap-2">
          {order.primaryStatus === "new" && onAcceptOrder && (
            <button
              type="button"
              disabled={isUpdatingStatus}
              onClick={() => {
                onAcceptOrder(order);
                onClose();
              }}
              className="w-full h-10 flex items-center justify-center bg-primary text-on-primary rounded-lg text-[13px] font-medium active:scale-[0.98] transition-transform shadow-xs cursor-pointer"
            >
              Accept Order
            </button>
          )}

          {order.primaryStatus === "accepted" && onDispatchCourier && (
            <button
              type="button"
              disabled={isUpdatingStatus}
              onClick={() => {
                onDispatchCourier(order);
                onClose();
              }}
              className="w-full h-10 flex items-center justify-center bg-primary text-on-primary rounded-lg text-[13px] font-medium active:scale-[0.98] transition-transform shadow-xs cursor-pointer"
            >
              Dispatch Courier
            </button>
          )}

          {order.primaryStatus === "shipped" && onTrackShipment && (
            <button
              type="button"
              onClick={() => {
                onTrackShipment(order);
                onClose();
              }}
              className="w-full h-10 flex items-center justify-center bg-primary text-on-primary rounded-lg text-[13px] font-medium active:scale-[0.98] transition-transform shadow-xs cursor-pointer"
            >
              Track Shipment ({order.carrier || "Carrier"})
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full h-10 flex items-center justify-center bg-surface-container text-on-surface rounded-lg text-[13px] font-medium hover:bg-surface-container-high active:scale-[0.98] transition-all cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
