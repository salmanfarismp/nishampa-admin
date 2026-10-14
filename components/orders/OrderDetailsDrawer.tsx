"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Order } from "./types";

interface OrderDetailsDrawerProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onAcceptOrder?: (order: Order) => void;
  onDispatchCourier?: (order: Order) => void;
  onTrackShipment?: (order: Order) => void;
}

export const OrderDetailsDrawer: React.FC<OrderDetailsDrawerProps> = ({
  order,
  isOpen,
  onClose,
  onAcceptOrder,
  onDispatchCourier,
  onTrackShipment,
}) => {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

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
        className="relative w-full max-w-md max-h-[88vh] bg-surface-container-lowest text-on-surface rounded-t-2xl flex flex-col shadow-2xl z-10 overflow-hidden animate-in slide-in-from-bottom duration-250 ease-out border-t border-border-default/50"
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
          {/* Status Indicators */}
          <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
                Fulfillment Status
              </span>
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-medium capitalize">
                  {order.primaryStatus}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-medium capitalize">
                  {order.secondaryStatus}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
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
                      : "text-on-surface"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </span>
            </div>
          </div>

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
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-[13px] font-semibold text-on-surface flex-shrink-0 tabular-nums">
                    ${(item.quantity * item.price).toFixed(2)}
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
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Shipping</span>
              <span className="font-mono text-telemetry-success">Free Express</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Estimated Tax</span>
              <span className="font-mono tabular-nums">$0.00</span>
            </div>
            <div className="border-t border-border-default/50 pt-1.5 flex justify-between font-semibold text-on-surface text-[14px]">
              <span>Total Amount</span>
              <span className="font-mono tabular-nums">
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-border-subtle bg-surface-container-lowest pb-[calc(1rem+env(safe-area-inset-bottom,0px))] flex flex-col gap-2">
          {order.primaryStatus === "new" && onAcceptOrder && (
            <button
              type="button"
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
              Track Shipment ({order.carrier})
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
