"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/utils/supabase/admin";
import { assertAdmin } from "@/lib/auth/assertAdmin";
import { OrderJoined, OrderStatus, FulfillmentStatus } from "@/types/database";
import { Order } from "@/components/orders/types";
import { mapOrderJoinedToOrder } from "@/lib/api/orderMappers";

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
 * Server Action: Updates the primary status (and optionally fulfillment status) of an order.
 */
export async function updateOrderStatusAction(
  orderId: number,
  status: OrderStatus,
  fulfillment?: FulfillmentStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    const adminClient = createAdminClient();

    const updatePayload: Record<string, string> = { status };
    if (fulfillment) {
      updatePayload.fulfillment = fulfillment;
    } else if (status === "delivered" || status === "returned") {
      updatePayload.fulfillment = "completed";
    }

    const { error } = await adminClient
      .from("Order")
      .update(updatePayload)
      .eq("id", orderId);

    if (error) {
      console.error(`Failed to update order #${orderId} status:`, error);
      return { success: false, error: error.message };
    }

    revalidatePath("/orders");
    return { success: true };
  } catch (err: any) {
    console.error(`Error in updateOrderStatusAction for order #${orderId}:`, err);
    return { success: false, error: err.message || "Failed to update order status." };
  }
}

/**
 * Server Action: Cancels an order by setting its fulfillment status to 'cancelled'.
 */
export async function cancelOrderAction(
  orderId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    const adminClient = createAdminClient();

    const { error } = await adminClient
      .from("Order")
      .update({ fulfillment: "cancelled" })
      .eq("id", orderId);

    if (error) {
      console.error(`Failed to cancel order #${orderId}:`, error);
      return { success: false, error: error.message };
    }

    revalidatePath("/orders");
    return { success: true };
  } catch (err: any) {
    console.error(`Error in cancelOrderAction for order #${orderId}:`, err);
    return { success: false, error: err.message || "Failed to cancel order." };
  }
}

/**
 * Server Action: Updates the fulfillment status of an order.
 */
export async function updateOrderFulfillmentAction(
  orderId: number,
  fulfillment: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    const adminClient = createAdminClient();

    const { error } = await adminClient
      .from("Order")
      .update({ fulfillment })
      .eq("id", orderId);

    if (error) {
      console.error(`Failed to update order #${orderId} fulfillment:`, error);
      return { success: false, error: error.message };
    }

    revalidatePath("/orders");
    return { success: true };
  } catch (err: any) {
    console.error(`Error in updateOrderFulfillmentAction for order #${orderId}:`, err);
    return { success: false, error: err.message || "Failed to update order fulfillment." };
  }
}
