import {
  getAdminOrdersAction,
  updateOrderStatusAction,
  updateOrderFulfillmentAction,
} from "@/app/actions/orders";
import { Order } from "@/components/orders/types";

/**
 * Fetch all orders for admin review and fulfillment.
 */
export async function getAdminOrders(): Promise<Order[]> {
  return await getAdminOrdersAction();
}

/**
 * Update order primary status (e.g. "accepted", "shipped", "delivered", "cancelled").
 */
export async function updateOrderStatus(
  orderId: number,
  status: string,
  fulfillment?: string
): Promise<{ success: boolean; error?: string }> {
  return await updateOrderStatusAction(orderId, status, fulfillment);
}

/**
 * Update order fulfillment status (e.g. "active", "completed", "cancelled").
 */
export async function updateOrderFulfillment(
  orderId: number,
  fulfillment: string
): Promise<{ success: boolean; error?: string }> {
  return await updateOrderFulfillmentAction(orderId, fulfillment);
}
