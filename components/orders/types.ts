export type OrderFilterStatus =
  | "all"
  | "new"
  | "accepted"
  | "shipped"
  | "delivered"
  | "returned";

export type PrimaryStatus = "new" | "accepted" | "shipped" | "returned" | "delivered";
export type SecondaryStatus = "active" | "completed" | "cancelled";
export type PaymentStatus = "paid" | "pending" | "refunded";
export type PaymentMethod = "Online" | "COD";

export interface OrderItemDetail {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  alt?: string;
}

export interface Order {
  id: string; // e.g. "#ORD-9024"
  timeAgo: string; // e.g. "12m ago"
  customerName: string;
  location: string;
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
