"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Order, OrderFilterStatus, PrimaryStatus, SecondaryStatus, PaymentStatus, OrderTelemetryData } from "@/components/orders/types";
import { OrderTelemetryBar } from "@/components/orders/OrderTelemetryBar";
import { OrderSearchBar } from "@/components/orders/OrderSearchBar";
import { OrderStatusPills } from "@/components/orders/OrderStatusPills";
import { OrderCard } from "@/components/orders/OrderCard";
import { OrderDetailsDrawer } from "@/components/orders/OrderDetailsDrawer";
import { ShipmentTrackingDrawer } from "@/components/orders/ShipmentTrackingDrawer";
import { OrderToast } from "@/components/orders/OrderToast";
import {
  getAdminOrders,
  updateOrderStatus,
  cancelOrder,
  transitionOrderState,
  markPaymentCollected,
  initiateReturn,
  completeReturn,
  rejectReturn,
  recordRefund,
} from "@/lib/api/orders";
import { OrderActionType } from "@/lib/orders/orderStateMachine";

export default function OrdersScreen() {
  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
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

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 2800);
  }, []);

  // Fetch orders from Supabase via Server Action
  const loadOrders = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const data = await getAdminOrders();
      setOrders(data);
    } catch (err: any) {
      console.error("Failed to load orders:", err);
      triggerToast(err.message || "Could not load orders.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [triggerToast]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Dynamic Telemetry Metrics
  const [telemetry, setTelemetry] = useState<OrderTelemetryData>({
    pendingCount: 0,
    todayCount: 0,
  });

  useEffect(() => {
    const pendingCount = orders.filter(
      (o) =>
        (o.primaryStatus === "new" || o.primaryStatus === "accepted") &&
        o.secondaryStatus !== "cancelled"
    ).length;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayCount = orders.filter((o) => {
      if (!o.createdAt) return false;
      const orderDate = new Date(o.createdAt);
      return orderDate >= startOfToday;
    }).length;

    setTelemetry({
      pendingCount,
      todayCount: todayCount > 0 ? todayCount : orders.length,
    });
  }, [orders]);

  // Dynamic counts for status tabs based on loaded orders
  // Option A confirmed: "returns" tab aggregates return_active and returned
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: orders.length,
      new: 0,
      accepted: 0,
      shipped: 0,
      delivered: 0,
      returns: 0,
      cancelled: 0,
    };

    orders.forEach((o) => {
      if (o.secondaryStatus === "cancelled") {
        counts.cancelled++;
        return;
      }
      if (o.secondaryStatus === "return_active" || o.primaryStatus === "returned") {
        counts.returns++;
        return;
      }
      if (counts[o.primaryStatus] !== undefined) {
        counts[o.primaryStatus]++;
      }
    });

    return counts;
  }, [orders]);

  // Filter & Search Pipeline
  const filteredOrders = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return orders.filter((order) => {
      // 1. Search Query filter (matches ID, customer name, phone, email, location, or items)
      if (q) {
        const matchId =
          order.id.toLowerCase().includes(q) ||
          (order.rawOrderId ? String(order.rawOrderId).includes(q) : false);
        const matchCustomer = order.customerName.toLowerCase().includes(q);
        const matchLocation = order.location.toLowerCase().includes(q);
        const matchItems = order.itemsSummary.toLowerCase().includes(q);
        const matchPhone = order.customerPhone?.toLowerCase().includes(q) ?? false;
        const matchEmail = order.customerEmail?.toLowerCase().includes(q) ?? false;

        if (
          !matchId &&
          !matchCustomer &&
          !matchLocation &&
          !matchItems &&
          !matchPhone &&
          !matchEmail
        ) {
          return false;
        }
      }

      // 2. Status Pill Filter
      if (activeFilter !== "all") {
        if (activeFilter === "cancelled") {
          if (order.secondaryStatus !== "cancelled") return false;
        } else if (activeFilter === "returns" || activeFilter === "returned") {
          if (
            order.secondaryStatus !== "return_active" &&
            order.primaryStatus !== "returned"
          ) {
            return false;
          }
        } else if (activeFilter === "delivered") {
          if (
            order.primaryStatus !== "delivered" ||
            order.secondaryStatus === "return_active" ||
            order.secondaryStatus === "cancelled"
          ) {
            return false;
          }
        } else {
          // new, accepted, shipped
          if (
            order.primaryStatus !== activeFilter ||
            order.secondaryStatus === "cancelled"
          ) {
            return false;
          }
        }
      }

      return true;
    });
  }, [orders, searchQuery, activeFilter]);

  // Helper to optimistically and synchronously update local state
  const updateOrderInLocalState = useCallback(
    (
      orderId: number,
      updates: {
        primaryStatus?: PrimaryStatus;
        secondaryStatus?: SecondaryStatus;
        paymentStatus?: PaymentStatus;
        actionState?: "default" | "loading" | "done";
      }
    ) => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.rawOrderId !== orderId) return o;
          const nextPrimary = updates.primaryStatus ?? o.primaryStatus;
          const nextSecondary = updates.secondaryStatus ?? o.secondaryStatus;
          const nextPayment = updates.paymentStatus ?? o.paymentStatus;
          return {
            ...o,
            primaryStatus: nextPrimary,
            secondaryStatus: nextSecondary,
            paymentStatus: nextPayment,
            actionState: updates.actionState ?? o.actionState,
            isStrikethrough:
              nextSecondary === "cancelled" || nextPrimary === "returned",
          };
        })
      );

      setSelectedOrder((prev) => {
        if (!prev || prev.rawOrderId !== orderId) return prev;
        const nextPrimary = updates.primaryStatus ?? prev.primaryStatus;
        const nextSecondary = updates.secondaryStatus ?? prev.secondaryStatus;
        const nextPayment = updates.paymentStatus ?? prev.paymentStatus;
        return {
          ...prev,
          primaryStatus: nextPrimary,
          secondaryStatus: nextSecondary,
          paymentStatus: nextPayment,
          isStrikethrough:
            nextSecondary === "cancelled" || nextPrimary === "returned",
        };
      });
    },
    []
  );

  // 1. Action: Accept Order
  const handleAcceptOrder = async (orderToAccept: Order) => {
    if (!orderToAccept.rawOrderId) {
      triggerToast("Missing order ID.");
      return;
    }

    updateOrderInLocalState(orderToAccept.rawOrderId, { actionState: "loading" });
    const result = await updateOrderStatus(orderToAccept.rawOrderId, "accepted", "active");
    if (!result.success) {
      updateOrderInLocalState(orderToAccept.rawOrderId, { actionState: "default" });
      triggerToast(result.error || "Failed to accept order.");
      return;
    }

    updateOrderInLocalState(orderToAccept.rawOrderId, {
      primaryStatus: "accepted",
      secondaryStatus: "active",
      actionState: "done",
    });
    triggerToast(`Order ${orderToAccept.id} accepted.`);
  };

  // 2. Action: Dispatch Courier
  const handleDispatchCourier = async (orderToDispatch: Order) => {
    if (!orderToDispatch.rawOrderId) {
      triggerToast("Missing order ID.");
      return;
    }

    updateOrderInLocalState(orderToDispatch.rawOrderId, { actionState: "loading" });
    const result = await updateOrderStatus(orderToDispatch.rawOrderId, "shipped", "active");
    if (!result.success) {
      updateOrderInLocalState(orderToDispatch.rawOrderId, { actionState: "default" });
      triggerToast(result.error || "Failed to dispatch order.");
      return;
    }

    updateOrderInLocalState(orderToDispatch.rawOrderId, {
      primaryStatus: "shipped",
      secondaryStatus: "active",
      actionState: "done",
    });
    triggerToast(`Order ${orderToDispatch.id} dispatched to courier.`);
  };

  // 3. Action: Mark Delivered
  const handleDeliverOrder = async (order: Order) => {
    if (!order.rawOrderId) return;
    const isPaid = order.paymentStatus === "paid";
    const targetFulfillment: SecondaryStatus = isPaid ? "completed" : "active";

    const result = await transitionOrderState(order.rawOrderId, {
      primaryStatus: "delivered",
      secondaryStatus: targetFulfillment,
      paymentStatus: order.paymentStatus,
    });

    if (!result.success) {
      triggerToast(result.error || "Failed to deliver order.");
      return;
    }

    updateOrderInLocalState(order.rawOrderId, {
      primaryStatus: "delivered",
      secondaryStatus: targetFulfillment,
    });
    triggerToast(
      isPaid
        ? `Order ${order.id} marked as delivered & completed!`
        : `Order ${order.id} marked as delivered (COD payment pending).`
    );
  };

  // 4. Action: Mark COD Payment Collected
  const handleMarkPaymentCollected = async (order: Order) => {
    if (!order.rawOrderId) return;
    const result = await markPaymentCollected(order.rawOrderId);
    if (!result.success) {
      triggerToast(result.error || "Failed to record payment collection.");
      return;
    }

    updateOrderInLocalState(order.rawOrderId, {
      primaryStatus: "delivered",
      secondaryStatus: "completed",
      paymentStatus: "paid",
    });
    triggerToast(`Payment collected for order ${order.id}. Order completed!`);
  };

  // 5. Action: Initiate Return
  const handleInitiateReturn = async (order: Order) => {
    if (!order.rawOrderId) return;
    const result = await initiateReturn(order.rawOrderId);
    if (!result.success) {
      triggerToast(result.error || "Failed to initiate return.");
      return;
    }

    updateOrderInLocalState(order.rawOrderId, {
      primaryStatus: "delivered",
      secondaryStatus: "return_active",
      paymentStatus: "paid",
    });
    triggerToast(`Return initiated for order ${order.id}.`);
  };

  // 6. Action: Complete Return & Refund
  const handleCompleteReturn = async (order: Order) => {
    if (!order.rawOrderId) return;
    const result = await completeReturn(order.rawOrderId);
    if (!result.success) {
      triggerToast(result.error || "Failed to finalize return.");
      return;
    }

    updateOrderInLocalState(order.rawOrderId, {
      primaryStatus: "returned",
      secondaryStatus: "completed",
      paymentStatus: "refunded",
    });
    triggerToast(`Return finalized and refund recorded for order ${order.id}.`);
  };

  // 7. Action: Reject / Cancel Return
  const handleRejectReturn = async (order: Order) => {
    if (!order.rawOrderId) return;
    const result = await rejectReturn(order.rawOrderId);
    if (!result.success) {
      triggerToast(result.error || "Failed to cancel return.");
      return;
    }

    updateOrderInLocalState(order.rawOrderId, {
      primaryStatus: "delivered",
      secondaryStatus: "completed",
      paymentStatus: "paid",
    });
    triggerToast(`Return cancelled for order ${order.id}. Restored to delivered.`);
  };

  // 8. Action: Record Refund (Cancelled orders)
  const handleRecordRefund = async (order: Order) => {
    if (!order.rawOrderId) return;
    const result = await recordRefund(order.rawOrderId);
    if (!result.success) {
      triggerToast(result.error || "Failed to record refund.");
      return;
    }

    updateOrderInLocalState(order.rawOrderId, {
      paymentStatus: "refunded",
    });
    triggerToast(`Refund recorded for order ${order.id}.`);
  };

  // 9. Action: Cancel Order
  const handleCancelOrder = async (order: Order) => {
    if (!order.rawOrderId) {
      triggerToast("Missing order ID.");
      return;
    }

    const result = await cancelOrder(order.rawOrderId);
    if (!result.success) {
      triggerToast(result.error || "Failed to cancel order.");
      return;
    }

    updateOrderInLocalState(order.rawOrderId, {
      secondaryStatus: "cancelled",
    });
    triggerToast(`Order ${order.id} has been cancelled.`);
  };

  // Dispatcher for OrderDetailsDrawer
  const handleDrawerAction = async (actionType: OrderActionType, order: Order) => {
    switch (actionType) {
      case "accept":
        await handleAcceptOrder(order);
        break;
      case "dispatch":
        await handleDispatchCourier(order);
        break;
      case "deliver":
        await handleDeliverOrder(order);
        break;
      case "mark_paid":
        await handleMarkPaymentCollected(order);
        break;
      case "initiate_return":
        await handleInitiateReturn(order);
        break;
      case "complete_return":
        await handleCompleteReturn(order);
        break;
      case "reject_return":
        await handleRejectReturn(order);
        break;
      case "refund":
        await handleRecordRefund(order);
        break;
      case "cancel":
        await handleCancelOrder(order);
        break;
    }
  };

  const handleTrackShipment = (orderToTrack: Order) => {
    setTrackingOrder(orderToTrack);
    setIsTrackingOpen(true);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleCopyAddress = (order: Order) => {
    triggerToast(`Shipping address for ${order.customerName} copied!`);
  };

  return (
    <div className="flex flex-col w-full gap-3 pb-8">
      {/* 1. Floating Operational Toast Notification */}
      <OrderToast message={toastMessage} isVisible={isToastVisible} />

      {/* 2. Operational Telemetry Bar (Pending | Total Today) + Refresh */}
      <OrderTelemetryBar
        telemetry={telemetry}
        onRefresh={() => loadOrders(true)}
        isRefreshing={isRefreshing}
      />

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
        {isLoading ? (
          // Loading Skeletons
          <div className="flex flex-col gap-2.5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-border-default/50 animate-pulse flex flex-col gap-2.5"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5 w-1/2">
                    <div className="h-3.5 bg-surface-container rounded w-1/3" />
                    <div className="h-4 bg-surface-container-high rounded w-3/4" />
                    <div className="h-3 bg-surface-container rounded w-1/2" />
                  </div>
                  <div className="flex flex-col items-end gap-1.5 w-1/4">
                    <div className="h-4 bg-surface-container-high rounded-full w-16" />
                    <div className="h-3 bg-surface-container rounded w-12" />
                  </div>
                </div>
                <div className="h-12 bg-surface-container-low rounded-lg" />
                <div className="h-9 bg-surface-container rounded-lg" />
              </div>
            ))}
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAccept={handleAcceptOrder}
              onDispatch={handleDispatchCourier}
              onDeliver={handleDeliverOrder}
              onMarkPaid={handleMarkPaymentCollected}
              onInitiateReturn={handleInitiateReturn}
              onCompleteReturn={handleCompleteReturn}
              onRecordRefund={handleRecordRefund}
              onCancel={handleCancelOrder}
              onTrack={handleTrackShipment}
              onViewDetails={handleViewDetails}
              onCopyAddress={handleCopyAddress}
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
              {searchQuery || activeFilter !== "all"
                ? "No orders match your filter or search criteria."
                : "No customer orders have been placed yet."}
            </p>
            {(searchQuery || activeFilter !== "all") && (
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
            )}
          </div>
        )}
      </div>

      {/* 6. Order Details Bottom Sheet Drawer */}
      <OrderDetailsDrawer
        order={selectedOrder}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onAction={handleDrawerAction}
        onAcceptOrder={handleAcceptOrder}
        onDispatchCourier={handleDispatchCourier}
        onDeliverOrder={handleDeliverOrder}
        onMarkPaymentCollected={handleMarkPaymentCollected}
        onInitiateReturn={handleInitiateReturn}
        onCompleteReturn={handleCompleteReturn}
        onRejectReturn={handleRejectReturn}
        onRecordRefund={handleRecordRefund}
        onCancelOrder={handleCancelOrder}
        onTrackShipment={handleTrackShipment}
        onToast={triggerToast}
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
