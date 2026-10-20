import {
  getAdminOrdersAction,
  updateOrderStatusAction,
  updateOrderFulfillmentAction,
  cancelOrderAction,
  transitionOrderStateAction,
  markPaymentCollectedAction,
  initiateReturnAction,
  completeReturnAction,
  rejectReturnAction,
  recordRefundAction,
} from "@/app/actions/orders";
import { Order, PrimaryStatus, SecondaryStatus, PaymentStatus } from "@/components/orders/types";

/**
 * Fetch all orders for admin review and fulfillment.
 */
export async function getAdminOrders(): Promise<Order[]> {
  return await getAdminOrdersAction();
}

/**
 * Transition order status, fulfillment, and/or payment state with validation.
 */
export async function transitionOrderState(
  orderId: number,
  target: {
    primaryStatus?: PrimaryStatus;
    secondaryStatus?: SecondaryStatus;
    paymentStatus?: PaymentStatus;
  }
): Promise<{ success: boolean; error?: string }> {
  return await transitionOrderStateAction(orderId, target);
}

/**
 * Update order primary status (e.g. "new", "accepted", "shipped", "delivered", "returned").
 */
export async function updateOrderStatus(
  orderId: number,
  status: PrimaryStatus,
  fulfillment?: SecondaryStatus
): Promise<{ success: boolean; error?: string }> {
  return await updateOrderStatusAction(orderId, status, fulfillment);
}

/**
 * Cancel an order (sets fulfillment status to 'cancelled').
 */
export async function cancelOrder(
  orderId: number
): Promise<{ success: boolean; error?: string }> {
  return await cancelOrderAction(orderId);
}

/**
 * Update order fulfillment status (e.g. "active", "completed", "cancelled", "return_active").
 */
export async function updateOrderFulfillment(
  orderId: number,
  fulfillment: SecondaryStatus
): Promise<{ success: boolean; error?: string }> {
  return await updateOrderFulfillmentAction(orderId, fulfillment);
}

/**
 * Settle COD payment upon delivery: DELIVERED - ACTIVE - PENDING -> DELIVERED - COMPLETED - PAID.
 */
export async function markPaymentCollected(
  orderId: number
): Promise<{ success: boolean; error?: string }> {
  return await markPaymentCollectedAction(orderId);
}

/**
 * Initiate return: DELIVERED - COMPLETED - PAID -> DELIVERED - RETURN_ACTIVE - PAID.
 */
export async function initiateReturn(
  orderId: number
): Promise<{ success: boolean; error?: string }> {
  return await initiateReturnAction(orderId);
}

/**
 * Complete return & refund: DELIVERED - RETURN_ACTIVE - PAID -> RETURNED - COMPLETED - REFUNDED.
 */
export async function completeReturn(
  orderId: number
): Promise<{ success: boolean; error?: string }> {
  return await completeReturnAction(orderId);
}

/**
 * Cancel/reject active return: DELIVERED - RETURN_ACTIVE - PAID -> DELIVERED - COMPLETED - PAID.
 */
export async function rejectReturn(
  orderId: number
): Promise<{ success: boolean; error?: string }> {
  return await rejectReturnAction(orderId);
}

/**
 * Record refund for prepaid cancelled order -> marks payment as 'refunded'.
 */
export async function recordRefund(
  orderId: number
): Promise<{ success: boolean; error?: string }> {
  return await recordRefundAction(orderId);
}
