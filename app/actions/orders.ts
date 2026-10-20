"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/utils/supabase/admin";
import { assertAdmin } from "@/lib/auth/assertAdmin";
import { OrderJoined, OrderStatus, FulfillmentStatus } from "@/types/database";
import { Order, PaymentStatus } from "@/components/orders/types";
import { mapOrderJoinedToOrder } from "@/lib/api/orderMappers";
import { isValidOrderCombination } from "@/lib/orders/orderStateMachine";

/**
 * Server Action: Fetches all orders with relations (Payment, Shipping, Profile, OrderItem, Product)
 * Strictly guarded by assertAdmin() and runs with admin service role client to bypass RLS.
 */
export async function getAdminOrdersAction(): Promise<Order[]> {
  await assertAdmin();
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from("Order")
    .select(`
      *,
      Payment(*),
      Shipping(*),
      Profile(*),
      OrderItem(
        *,
        Product(
          id,
          name,
          ProductImage(id, img_url, is_primary)
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch admin orders:", error);
    throw new Error(`Failed to load orders: ${error.message}`);
  }

  const rows = (data as unknown as OrderJoined[]) || [];
  return rows.map(mapOrderJoinedToOrder);
}

/**
 * Unified Server Action: Transitions an order's lifecycle (status, fulfillment, and/or payment).
 * Validates the resulting combination against the official state machine before mutating the DB.
 */
export async function transitionOrderStateAction(
  orderId: number,
  target: {
    primaryStatus?: OrderStatus;
    secondaryStatus?: FulfillmentStatus;
    paymentStatus?: PaymentStatus;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    const adminClient = createAdminClient();

    // 1. Fetch current order state and associated payment
    const { data: orderRow, error: fetchErr } = await adminClient
      .from("Order")
      .select("id, status, fulfillment, payment, Payment(id, status)")
      .eq("id", orderId)
      .single();

    if (fetchErr || !orderRow) {
      return { success: false, error: fetchErr?.message || "Order not found." };
    }

    const currentPrimary = (orderRow.status || "new") as OrderStatus;
    const currentFulfillment = (orderRow.fulfillment || "active") as FulfillmentStatus;

    // Determine current payment status
    const rawPaymentStatus = (
      orderRow.Payment && Array.isArray(orderRow.Payment)
        ? orderRow.Payment[0]?.status
        : (orderRow.Payment as any)?.status || "pending"
    ).toLowerCase();

    let currentPayment: PaymentStatus = "pending";
    if (rawPaymentStatus === "paid" || rawPaymentStatus === "captured" || rawPaymentStatus === "completed") {
      currentPayment = "paid";
    } else if (rawPaymentStatus === "refunded") {
      currentPayment = "refunded";
    } else if (rawPaymentStatus === "failed") {
      currentPayment = "failed";
    }

    // 2. Compute candidate target state
    const nextPrimary = target.primaryStatus ?? currentPrimary;
    const nextFulfillment = target.secondaryStatus ?? currentFulfillment;
    const nextPayment = target.paymentStatus ?? currentPayment;

    // 3. Strict State Machine Validation
    if (!isValidOrderCombination(nextPrimary, nextFulfillment, nextPayment)) {
      const errMsg = `Invalid state transition: [${nextPrimary.toUpperCase()} - ${nextFulfillment.toUpperCase()} - ${nextPayment.toUpperCase()}] is not a permitted combination.`;
      console.error(errMsg);
      return { success: false, error: errMsg };
    }

    // 4. Update Order table if primary or fulfillment changed
    const orderPayload: Record<string, string> = {};
    if (target.primaryStatus !== undefined) {
      orderPayload.status = target.primaryStatus;
    }
    if (target.secondaryStatus !== undefined) {
      orderPayload.fulfillment = target.secondaryStatus;
    }

    if (Object.keys(orderPayload).length > 0) {
      const { error: orderUpdateErr } = await adminClient
        .from("Order")
        .update(orderPayload)
        .eq("id", orderId);

      if (orderUpdateErr) {
        console.error(`Failed to update Order #${orderId}:`, orderUpdateErr);
        return { success: false, error: orderUpdateErr.message };
      }
    }

    // 5. Update Payment table if paymentStatus changed
    if (target.paymentStatus !== undefined && orderRow.payment) {
      const paymentId = orderRow.payment;
      const { error: paymentUpdateErr } = await adminClient
        .from("Payment")
        .update({
          status: target.paymentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", paymentId);

      if (paymentUpdateErr) {
        console.error(`Failed to update Payment for Order #${orderId}:`, paymentUpdateErr);
        return { success: false, error: paymentUpdateErr.message };
      }
    }

    revalidatePath("/orders");
    return { success: true };
  } catch (err: any) {
    console.error(`Error in transitionOrderStateAction for order #${orderId}:`, err);
    return { success: false, error: err.message || "Failed to transition order state." };
  }
}

/**
 * Server Action: Updates primary status and optionally fulfillment status.
 */
export async function updateOrderStatusAction(
  orderId: number,
  status: OrderStatus,
  fulfillment?: FulfillmentStatus
): Promise<{ success: boolean; error?: string }> {
  return transitionOrderStateAction(orderId, {
    primaryStatus: status,
    secondaryStatus: fulfillment,
  });
}

/**
 * Server Action: Cancels an order by setting fulfillment to 'cancelled'.
 */
export async function cancelOrderAction(
  orderId: number
): Promise<{ success: boolean; error?: string }> {
  return transitionOrderStateAction(orderId, {
    secondaryStatus: "cancelled",
  });
}

/**
 * Server Action: Updates the fulfillment status of an order.
 */
export async function updateOrderFulfillmentAction(
  orderId: number,
  fulfillment: FulfillmentStatus
): Promise<{ success: boolean; error?: string }> {
  return transitionOrderStateAction(orderId, {
    secondaryStatus: fulfillment,
  });
}

/**
 * Server Action: Settles a COD payment upon or after delivery.
 * Transitions order from DELIVERED - ACTIVE - PENDING to DELIVERED - COMPLETED - PAID.
 */
export async function markPaymentCollectedAction(
  orderId: number
): Promise<{ success: boolean; error?: string }> {
  return transitionOrderStateAction(orderId, {
    primaryStatus: "delivered",
    secondaryStatus: "completed",
    paymentStatus: "paid",
  });
}

/**
 * Server Action: Initiates a return on a delivered order.
 * Transitions order from DELIVERED - COMPLETED - PAID to DELIVERED - RETURN_ACTIVE - PAID.
 */
export async function initiateReturnAction(
  orderId: number
): Promise<{ success: boolean; error?: string }> {
  return transitionOrderStateAction(orderId, {
    primaryStatus: "delivered",
    secondaryStatus: "return_active",
    paymentStatus: "paid",
  });
}

/**
 * Server Action: Finalizes return inspection and customer refund.
 * Transitions order from DELIVERED - RETURN_ACTIVE - PAID to RETURNED - COMPLETED - REFUNDED.
 */
export async function completeReturnAction(
  orderId: number
): Promise<{ success: boolean; error?: string }> {
  return transitionOrderStateAction(orderId, {
    primaryStatus: "returned",
    secondaryStatus: "completed",
    paymentStatus: "refunded",
  });
}

/**
 * Server Action: Cancels an active return and restores delivered order to completed.
 */
export async function rejectReturnAction(
  orderId: number
): Promise<{ success: boolean; error?: string }> {
  return transitionOrderStateAction(orderId, {
    primaryStatus: "delivered",
    secondaryStatus: "completed",
    paymentStatus: "paid",
  });
}

/**
 * Server Action: Records a refund for a cancelled order that was prepaid.
 * Updates payment status to 'refunded'.
 */
export async function recordRefundAction(
  orderId: number
): Promise<{ success: boolean; error?: string }> {
  return transitionOrderStateAction(orderId, {
    paymentStatus: "refunded",
  });
}
