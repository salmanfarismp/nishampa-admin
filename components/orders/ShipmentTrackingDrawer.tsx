"use client";

import React, { useEffect } from "react";
import { Order } from "./types";

interface ShipmentTrackingDrawerProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShipmentTrackingDrawer: React.FC<ShipmentTrackingDrawerProps> = ({
  order,
  isOpen,
  onClose,
}) => {
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

  const steps = [
    {
      title: "Order Dispatched",
      description: "Package handed over to carrier facility",
      time: "Today, 08:30 AM",
      completed: true,
    },
    {
      title: "Departed Sorting Hub",
      description: "Stockholm Distribution Terminal 4",
      time: "Today, 10:15 AM",
      completed: true,
    },
    {
      title: "In Transit",
      description: "On vehicle for delivery route",
      time: "Today, 11:45 AM",
      completed: true,
      current: true,
    },
    {
      title: "Out for Delivery",
      description: "Courier en route to recipient destination",
      time: "Estimated by 4:00 PM",
      completed: false,
    },
  ];

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
        aria-label="Shipment Tracking"
        className="relative w-full max-w-md max-h-[85vh] bg-surface-container-lowest text-on-surface rounded-t-2xl flex flex-col shadow-2xl z-10 overflow-hidden animate-in slide-in-from-bottom duration-250 ease-out border-t border-border-default/50"
      >
        {/* Drag Handle Bar */}
        <div className="w-full flex items-center justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-surface-container-highest rounded-full" />
        </div>

        {/* Drawer Header */}
        <div className="px-4 py-3 flex items-start justify-between border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[13px] font-semibold text-primary">
                {order.carrier || "DHL"}
              </span>
              <span className="text-[10px] text-text-secondary">•</span>
              <span className="font-mono text-[12px] text-text-secondary">
                {order.trackingNumber || "#940124"}
              </span>
            </div>
            <h2 className="text-[17px] font-semibold text-on-surface tracking-tight mt-0.5">
              Tracking Shipment
            </h2>
            <span className="text-[12px] text-text-secondary">
              Recipient: {order.customerName} ({order.location})
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close tracking"
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

        {/* Tracking Timeline */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-default">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col">
                {/* Timeline Dot */}
                <span
                  className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    step.completed
                      ? "bg-primary border-primary text-white"
                      : "bg-surface border-border-default"
                  }`}
                >
                  {step.completed && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-2.5 h-2.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>

                <div className="flex items-baseline justify-between gap-2">
                  <h4
                    className={`text-[13px] font-semibold ${
                      step.current ? "text-primary" : "text-on-surface"
                    }`}
                  >
                    {step.title}
                  </h4>
                  <span className="font-mono text-[10px] text-text-secondary">
                    {step.time}
                  </span>
                </div>
                <p className="text-[12px] text-text-secondary mt-0.5">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-border-subtle bg-surface-container-lowest pb-[calc(1rem+env(safe-area-inset-bottom,0px))] flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 flex items-center justify-center bg-surface-container text-on-surface rounded-lg text-[13px] font-medium active:scale-[0.98] transition-transform cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
