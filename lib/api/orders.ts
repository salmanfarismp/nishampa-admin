import {
  getAdminOrdersAction,
  updateOrderStatusAction,
  updateOrderFulfillmentAction,
  cancelOrderAction,
} from "@/app/actions/orders";
import { Order, PrimaryStatus, SecondaryStatus } from "@/components/orders/types";

/**
 * Fetch all orders for admin review and fulfillment.
 */
export async function getAdminOrders(): Promise<Order[]> {
  return await getAdminOrdersAction();
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
 * Update order fulfillment status (e.g. "active", "completed", "cancelled").
 */
export async function updateOrderFulfillment(
  orderId: number,
  fulfillment: SecondaryStatus
): Promise<{ success: boolean; error?: string }> {
  return await updateOrderFulfillmentAction(orderId, fulfillment);
}
