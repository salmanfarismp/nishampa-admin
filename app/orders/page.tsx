"use client";

import React, { useState, useMemo } from "react";
import { Order, OrderFilterStatus } from "@/components/orders/types";
import { INITIAL_ORDERS, INITIAL_TELEMETRY, INITIAL_STATUS_TABS } from "@/components/orders/mockData";
import { OrderTelemetryBar } from "@/components/orders/OrderTelemetryBar";
import { OrderSearchBar } from "@/components/orders/OrderSearchBar";
import { OrderStatusPills } from "@/components/orders/OrderStatusPills";
import { OrderCard } from "@/components/orders/OrderCard";
import { OrderDetailsDrawer } from "@/components/orders/OrderDetailsDrawer";
import { ShipmentTrackingDrawer } from "@/components/orders/ShipmentTrackingDrawer";
import { OrderToast } from "@/components/orders/OrderToast";

export default function OrdersScreen() {
  // Orders State
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [telemetry, setTelemetry] = useState(INITIAL_TELEMETRY);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<OrderFilterStatus>("all");

  // Drawers & Modals State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  // Micro-interaction Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 2800);
  };

  // Filter & Search Pipeline
  const filteredOrders = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return orders.filter((order) => {
      // 1. Search Query filter (matches ID, customer name, location, or items)
      if (q) {
        const matchId = order.id.toLowerCase().includes(q);
        const matchCustomer = order.customerName.toLowerCase().includes(q);
        const matchLocation = order.location.toLowerCase().includes(q);
        const matchItems = order.itemsSummary.toLowerCase().includes(q);
        if (!matchId && !matchCustomer && !matchLocation && !matchItems) {
          return false;
        }
      }

      // 2. Status Pill Filter
      if (activeFilter !== "all") {
        if (order.primaryStatus !== activeFilter) {
          return false;
        }
      }

      return true;
    });
  }, [orders, searchQuery, activeFilter]);

  // Dynamic counts for status tabs based on loaded orders
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: INITIAL_STATUS_TABS.find((t) => t.id === "all")?.count ?? 86,
      new: INITIAL_STATUS_TABS.find((t) => t.id === "new")?.count ?? 18,
      accepted: INITIAL_STATUS_TABS.find((t) => t.id === "accepted")?.count ?? 14,
      shipped: INITIAL_STATUS_TABS.find((t) => t.id === "shipped")?.count ?? 42,
      delivered: INITIAL_STATUS_TABS.find((t) => t.id === "delivered")?.count ?? 10,
      returned: INITIAL_STATUS_TABS.find((t) => t.id === "returned")?.count ?? 2,
    };
    return counts;
  }, []);

  // Action Handlers
  const handleAcceptOrder = (orderToAccept: Order) => {
    // Set loading state on button
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderToAccept.id ? { ...o, actionState: "loading" } : o
      )
    );

    // Simulate label generation delay matching code.html
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderToAccept.id
            ? {
                ...o,
                actionState: "done",
              }
            : o
        )
      );
      // Decrement pending count slightly on telemetry for delight
      setTelemetry((prev) => ({
        ...prev,
        pendingCount: Math.max(0, prev.pendingCount - 1),
      }));
      triggerToast(
        `Waybill generated for ${orderToAccept.customerName} (${orderToAccept.id})`
      );
    }, 850);
  };

  const handleDispatchCourier = (orderToDispatch: Order) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderToDispatch.id
          ? {
              ...o,
              actionState: "done",
            }
          : o
      )
    );
    triggerToast(`${orderToDispatch.id} handed over to carrier.`);
  };

  const handleTrackShipment = (orderToTrack: Order) => {
    setTrackingOrder(orderToTrack);
    setIsTrackingOpen(true);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  return (
    <div className="flex flex-col w-full gap-3 pb-8">
      {/* 1. Floating Operational Toast Notification */}
      <OrderToast message={toastMessage} isVisible={isToastVisible} />

      {/* 2. Operational Telemetry Bar (Pending | Total Today) */}
      <OrderTelemetryBar telemetry={telemetry} />

      {/* 3. Real-time Search Input */}
      <OrderSearchBar query={searchQuery} onChange={setSearchQuery} />

      {/* 4. Horizontally Scrollable Status Chips */}
      <OrderStatusPills
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        statusCounts={statusCounts}
      />

      {/* 5. Orders Feed Stack */}
      <div className="flex flex-col gap-2.5 mt-0.5" id="orders-stream">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAccept={handleAcceptOrder}
              onDispatch={handleDispatchCourier}
              onTrack={handleTrackShipment}
              onViewDetails={handleViewDetails}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-surface-container-lowest rounded-xl border border-border-default/60 text-center mt-2 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-text-secondary mb-2.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <p className="text-[14px] font-semibold text-on-surface">
              No orders found
            </p>
            <p className="text-[12px] text-text-secondary mt-0.5">
              No orders match your filter or search criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
              className="mt-3 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-[12px] font-medium active:scale-95 transition-all cursor-pointer hover:bg-surface-container-high"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* 6. Order Details Bottom Sheet Drawer */}
      <OrderDetailsDrawer
        order={selectedOrder}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onAcceptOrder={handleAcceptOrder}
        onDispatchCourier={handleDispatchCourier}
        onTrackShipment={handleTrackShipment}
      />

      {/* 7. Shipment Live Tracking Drawer */}
      <ShipmentTrackingDrawer
        order={trackingOrder}
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />
    </div>
  );
}
