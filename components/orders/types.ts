export type OrderFilterStatus =
  | "all"
  | "new"
  | "accepted"
  | "shipped"
  | "delivered"
  | "returned"
  | "cancelled";

export type PrimaryStatus =
  | "new"
  | "accepted"
  | "shipped"
  | "returned"
  | "delivered"
  | "cancelled";

export type SecondaryStatus = "active" | "completed" | "cancelled";
export type PaymentStatus = "paid" | "pending" | "refunded" | "captured" | "failed";
export type PaymentMethod = "Online" | "COD" | "Razorpay" | string;

export interface OrderItemDetail {
  id: string;
  productId?: string;
  name: string;
  quantity: number;
  price: number;
  totalPrice?: number;
  imageUrl?: string;
  alt?: string;
}

export interface ShippingAddressDetail {
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  contactPhone?: string | null;
  formattedAddress: string;
}

export interface PaymentDetail {
  gateway?: string | null;
  gatewayPaymentId?: string | null;
  gatewayOrderId?: string | null;
  amount?: string | null;
  status?: string | null;
}

export interface Order {
  id: string; // e.g. "#ORD-9024"
  rawOrderId?: number; // numeric id for db mutations
  createdAt?: string;
  timeAgo: string; // e.g. "12m ago"
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  location: string;
  shippingAddress?: ShippingAddressDetail;
  paymentDetail?: PaymentDetail;
  primaryStatus: PrimaryStatus;
  secondaryStatus: SecondaryStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  itemsSummary: string; // e.g. "Merino Wool Crewneck (x1), Tumbler (x2)"
  totalItemsCount: number;
  totalAmount: number;
  primaryImageUrl?: string;
  items: OrderItemDetail[];
  carrier?: string; // e.g. "DHL"
  trackingNumber?: string; // e.g. "#940124"
  refundDetails?: string; // e.g. "Refunded $45.00 to Online • Visa (Completed)"
  isStrikethrough?: boolean;
  actionState?: "default" | "loading" | "done";
}

export interface OrderTelemetryData {
  pendingCount: number;
  todayCount: number;
}

