import { OrderJoined, ShippingRow } from "@/types/database";
import {
  Order,
  OrderItemDetail,
  PrimaryStatus,
  SecondaryStatus,
  PaymentStatus,
  ShippingAddressDetail,
  PaymentDetail,
} from "@/components/orders/types";
import { resolveMediaUrl } from "@/lib/utils/media";

/**
 * Formats a clean, multi-line address text suitable for copying into courier / dispatch forms.
 */
export function formatShippingAddress(
  shipping: ShippingRow | null | undefined,
  customerName?: string,
  fallbackPhone?: string
): string {
  if (!shipping && !customerName && !fallbackPhone) {
    return "No shipping details available.";
  }

  const lines: string[] = [];
  if (customerName) {
    lines.push(`Recipient: ${customerName}`);
  }
  const phone = shipping?.contact_phone || fallbackPhone;
  if (phone) {
    lines.push(`Phone: ${phone}`);
  }

  const street = [shipping?.address_line1, shipping?.address_line2]
    .filter(Boolean)
    .join(", ");
  if (street) {
    lines.push(`Address: ${street}`);
  }

  const cityStateZip = [
    shipping?.city,
    shipping?.state
      ? `${shipping.state}${shipping?.postal_code ? ` - ${shipping.postal_code}` : ""}`
      : shipping?.postal_code,
  ]
    .filter(Boolean)
    .join(", ");
  if (cityStateZip) {
    lines.push(`City/State/PIN: ${cityStateZip}`);
  }

  if (shipping?.country) {
    lines.push(`Country: ${shipping.country}`);
  }

  return lines.join("\n");
}

/**
 * Computes human-readable relative timestamp (e.g., "5m ago", "2h ago", "Yesterday").
 */
export function formatTimeAgo(dateString: string | null | undefined): string {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Maps a joined Supabase Order row into the domain Order model used by UI components.
 */
export function mapOrderJoinedToOrder(row: OrderJoined): Order {
  const customerName =
    row.Profile?.name ||
    (row.Shipping?.contact_phone ? `Customer (${row.Shipping.contact_phone})` : `Order #${row.id}`);

  const customerPhone =
    row.Shipping?.contact_phone ||
    row.Profile?.phone ||
    row.Profile?.contact_phone ||
    undefined;

  const customerEmail = row.Profile?.email || undefined;

  const location =
    [row.Shipping?.city, row.Shipping?.state || row.Shipping?.country]
      .filter(Boolean)
      .join(", ") || "Standard Shipping";

  const formattedAddress = formatShippingAddress(
    row.Shipping,
    row.Profile?.name || undefined,
    customerPhone
  );

  const shippingAddress: ShippingAddressDetail = {
    addressLine1: row.Shipping?.address_line1,
    addressLine2: row.Shipping?.address_line2,
    city: row.Shipping?.city,
    state: row.Shipping?.state,
    postalCode: row.Shipping?.postal_code,
    country: row.Shipping?.country,
    contactPhone: row.Shipping?.contact_phone || customerPhone,
    formattedAddress,
  };

  const paymentDetail: PaymentDetail = {
    gateway: row.Payment?.gateway,
    gatewayPaymentId: row.Payment?.gateway_payment_id,
    gatewayOrderId: row.Payment?.gateway_order_id,
    amount: row.Payment?.amount,
    status: row.Payment?.status,
  };

  // Map Primary Status
  const rawStatus = (row.status || "new").toLowerCase();
  let primaryStatus: PrimaryStatus = "new";
  if (
    rawStatus === "accepted" ||
    rawStatus === "shipped" ||
    rawStatus === "delivered" ||
    rawStatus === "returned" ||
    rawStatus === "cancelled"
  ) {
    primaryStatus = rawStatus;
  }

  // Map Secondary Status (fulfillment)
  const rawFulfillment = (row.fulfillment || "active").toLowerCase();
  let secondaryStatus: SecondaryStatus = "active";
  if (rawFulfillment === "completed" || rawFulfillment === "cancelled") {
    secondaryStatus = rawFulfillment;
  }

  // Map Payment Method & Payment Status
  const gateway = (row.Payment?.gateway || "").toLowerCase();
  let paymentMethod = "Online";
  if (gateway.includes("razorpay")) {
    paymentMethod = "Razorpay";
  } else if (gateway === "cod" || gateway.includes("cash")) {
    paymentMethod = "COD";
  }

  const pStatus = (row.Payment?.status || "").toLowerCase();
  let paymentStatus: PaymentStatus = "pending";
  if (pStatus === "captured" || pStatus === "paid" || pStatus === "completed") {
    paymentStatus = "paid";
  } else if (pStatus === "refunded") {
    paymentStatus = "refunded";
  } else if (pStatus === "failed") {
    paymentStatus = "failed";
  }

  // Map Order Items
  const items: OrderItemDetail[] = (row.OrderItem || []).map((item) => {
    // Resolve primary image from joined Product
    const images = item.Product?.ProductImage || [];
    const primaryImg =
      images.find((img) => img.is_primary) || images[0];
    const imageUrl = primaryImg?.img_url ? resolveMediaUrl(primaryImg.img_url) : undefined;

    const qty = Number(item.quantity) || 1;
    const unitPrice =
      item.unit_price_snapshot != null && item.unit_price_snapshot !== ""
        ? parseFloat(item.unit_price_snapshot)
        : item.total_price != null
        ? Number(item.total_price) / qty
        : 0;

    const totalPrice = item.total_price != null ? Number(item.total_price) : unitPrice * qty;

    return {
      id: String(item.id),
      productId: item.product || item.Product?.id || undefined,
      name: item.product_title_snapshot || item.Product?.name || "Custom Item",
      quantity: qty,
      price: unitPrice,
      totalPrice,
      imageUrl,
      alt: item.product_title_snapshot || item.Product?.name || "Item image",
    };
  });

  const totalItemsCount = items.reduce((acc, it) => acc + it.quantity, 0);

  // Compute total amount from row or item prices
  let totalAmount = 0;
  if (row.total_amount != null && row.total_amount !== "") {
    totalAmount = parseFloat(row.total_amount);
  } else if (row.Payment?.amount != null && row.Payment.amount !== "") {
    totalAmount = parseFloat(row.Payment.amount);
  } else {
    totalAmount = items.reduce((acc, it) => acc + (it.totalPrice || it.price * it.quantity), 0);
  }

  // Summary String (e.g. "Merino Wool Crewneck (x1), Tumbler (x2)")
  const itemsSummary =
    items.length > 0
      ? items.map((it) => `${it.name} (x${it.quantity})`).join(", ")
      : "No items";

  const primaryImageUrl = items.find((it) => Boolean(it.imageUrl))?.imageUrl;

  return {
    id: `#ORD-${row.id}`,
    rawOrderId: row.id,
    createdAt: row.created_at,
    timeAgo: formatTimeAgo(row.created_at),
    customerName,
    customerEmail,
    customerPhone,
    location,
    shippingAddress,
    paymentDetail,
    primaryStatus,
    secondaryStatus,
    paymentMethod,
    paymentStatus,
    itemsSummary,
    totalItemsCount,
    totalAmount,
    primaryImageUrl,
    items,
    isStrikethrough: primaryStatus === "cancelled" || primaryStatus === "returned",
    actionState: "default",
  };
}
