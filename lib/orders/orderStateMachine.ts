import { PrimaryStatus, SecondaryStatus, PaymentStatus } from "@/components/orders/types";

/**
 * Strict Allowed Combinations Matrix:
 *
 * NEW       - ACTIVE        - PENDING, PAID
 * NEW       - CANCELLED     - PENDING, PAID, FAILED, REFUNDED
 *
 * ACCEPTED  - ACTIVE        - PENDING, PAID
 * ACCEPTED  - CANCELLED     - PENDING, PAID, FAILED, REFUNDED
 *
 * SHIPPED   - ACTIVE        - PENDING, PAID
 * SHIPPED   - CANCELLED     - PENDING, PAID, FAILED, REFUNDED
 *
 * DELIVERED - ACTIVE        - PENDING
 * DELIVERED - COMPLETED     - PAID
 * DELIVERED - RETURN_ACTIVE - PAID
 *
 * RETURNED  - COMPLETED     - REFUNDED
 */

export const VALID_ORDER_COMBINATIONS: Record<
  PrimaryStatus,
  Partial<Record<SecondaryStatus, readonly PaymentStatus[]>>
> = {
  new: {
    active: ["pending", "paid"],
    cancelled: ["pending", "paid", "failed", "refunded"],
  },
  accepted: {
    active: ["pending", "paid"],
    cancelled: ["pending", "paid", "failed", "refunded"],
  },
  shipped: {
    active: ["pending", "paid"],
    cancelled: ["pending", "paid", "failed", "refunded"],
  },
  delivered: {
    active: ["pending"],
    completed: ["paid"],
    return_active: ["paid"],
  },
  returned: {
    completed: ["refunded"],
  },
};

/**
 * Validates whether the given combination of primaryStatus, secondaryStatus (fulfillment),
 * and paymentStatus conforms to the official business lifecycle matrix.
 */
export function isValidOrderCombination(
  primary: PrimaryStatus,
  fulfillment: SecondaryStatus,
  payment: PaymentStatus
): boolean {
  const allowedPayments = VALID_ORDER_COMBINATIONS[primary]?.[fulfillment];
  if (!allowedPayments) return false;
  return allowedPayments.includes(payment);
}

export type OrderActionType =
  | "accept"
  | "cancel"
  | "dispatch"
  | "deliver"
  | "mark_paid"
  | "initiate_return"
  | "complete_return"
  | "reject_return"
  | "refund";

export interface OrderActionDefinition {
  type: OrderActionType;
  label: string;
  confirmPrompt?: string;
  targetState: {
    primaryStatus?: PrimaryStatus;
    secondaryStatus?: SecondaryStatus;
    paymentStatus?: PaymentStatus;
  };
}

/**
 * Returns permissible state transition actions based on the current order state.
 */
export function getAvailableOrderActions(
  primary: PrimaryStatus,
  fulfillment: SecondaryStatus,
  payment: PaymentStatus
): OrderActionDefinition[] {
  const actions: OrderActionDefinition[] = [];

  // 1. NEW orders
  if (primary === "new" && fulfillment === "active") {
    actions.push({
      type: "accept",
      label: "Accept Order",
      targetState: {
        primaryStatus: "accepted",
        secondaryStatus: "active",
      },
    });
    actions.push({
      type: "cancel",
      label: "Cancel Order",
      confirmPrompt: "Are you sure you want to cancel this order?",
      targetState: {
        primaryStatus: "new",
        secondaryStatus: "cancelled",
      },
    });
  }

  // 2. ACCEPTED orders
  if (primary === "accepted" && fulfillment === "active") {
    actions.push({
      type: "dispatch",
      label: "Dispatch Courier",
      targetState: {
        primaryStatus: "shipped",
        secondaryStatus: "active",
      },
    });
    actions.push({
      type: "cancel",
      label: "Cancel Order",
      confirmPrompt: "Are you sure you want to cancel this accepted order?",
      targetState: {
        primaryStatus: "accepted",
        secondaryStatus: "cancelled",
      },
    });
  }

  // 3. SHIPPED orders
  if (primary === "shipped" && fulfillment === "active") {
    // Delivery target depends on whether payment is already paid or pending
    if (payment === "paid") {
      actions.push({
        type: "deliver",
        label: "Mark Delivered",
        targetState: {
          primaryStatus: "delivered",
          secondaryStatus: "completed",
          paymentStatus: "paid",
        },
      });
    } else {
      // Pending payment (e.g. COD)
      actions.push({
        type: "deliver",
        label: "Mark Delivered (Payment Pending)",
        targetState: {
          primaryStatus: "delivered",
          secondaryStatus: "active",
          paymentStatus: "pending",
        },
      });
    }
    actions.push({
      type: "cancel",
      label: "Cancel Shipment",
      confirmPrompt: "Cancel this in-transit shipment (RTO)?",
      targetState: {
        primaryStatus: "shipped",
        secondaryStatus: "cancelled",
      },
    });
  }

  // 4. DELIVERED orders
  if (primary === "delivered") {
    if (fulfillment === "active" && payment === "pending") {
      // Cash payment collection for COD
      actions.push({
        type: "mark_paid",
        label: "Mark Payment Collected",
        confirmPrompt: "Confirm that customer cash payment has been collected in full?",
        targetState: {
          primaryStatus: "delivered",
          secondaryStatus: "completed",
          paymentStatus: "paid",
        },
      });
    }

    if (fulfillment === "completed" && payment === "paid") {
      actions.push({
        type: "initiate_return",
        label: "Initiate Return",
        confirmPrompt: "Initiate a return for this delivered order?",
        targetState: {
          primaryStatus: "delivered",
          secondaryStatus: "return_active",
          paymentStatus: "paid",
        },
      });
    }

    if (fulfillment === "return_active" && payment === "paid") {
      actions.push({
        type: "complete_return",
        label: "Complete Return & Refund",
        confirmPrompt: "Inspect items and finalize return with full customer refund?",
        targetState: {
          primaryStatus: "returned",
          secondaryStatus: "completed",
          paymentStatus: "refunded",
        },
      });
      actions.push({
        type: "reject_return",
        label: "Cancel/Reject Return",
        confirmPrompt: "Cancel this active return and restore order as completed?",
        targetState: {
          primaryStatus: "delivered",
          secondaryStatus: "completed",
          paymentStatus: "paid",
        },
      });
    }
  }

  // 5. CANCELLED with PAID orders -> Record refund
  if (fulfillment === "cancelled" && payment === "paid") {
    actions.push({
      type: "refund",
      label: "Record Refund",
      confirmPrompt: "Mark this cancelled order's payment as refunded?",
      targetState: {
        paymentStatus: "refunded",
      },
    });
  }

  return actions;
}
