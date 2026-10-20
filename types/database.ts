export interface ProductCategoryRow {
  id: number;
  created_at: string;
  name: string | null;
  slug: string | null;
  nick_name: string | null;
  img_url: string | null;
  prefix: string | null;
}

export type ProductBadge = "STAND INCLUDED" | "NEW" | "POPULAR" | null;

export interface ProductRow {
  id: string;
  created_at: string;
  name: string;
  category: number | null;
  subtitle: string | null;
  description: string | null;
  price: number;
  original_price: number | null;
  computed_rating: number | null;
  computed_review_count: number | null;
  badge: ProductBadge;
  slug?: string;
  has_hanging_kit: boolean | null;
  ref_id: string | null;
  is_active: boolean;
  deleted_at?: string | null;
}

export interface ProductImageRow {
  id: number;
  created_at: string;
  product_id: string;
  img_url: string;
  alt: string | null;
  display_order: number | null;
  is_primary: boolean | null;
}

export interface ColorRow {
  id: number;
  created_at: string;
  name: string;
  hashcode: string;
}

export interface ProductColorRow {
  id: number;
  created_at: string;
  product_id: string | null;
  color_id: number | null;
  Color?: ColorRow | null;
}

export interface ProductJoined extends ProductRow {
  ProductCategory?: ProductCategoryRow | null;
  ProductImage?: ProductImageRow[];
  ProductColor?: ProductColorRow[];
}

export interface LifeStyleImageRow {
  id: number;
  created_at: string;
  img_url: string | null;
}

export interface FaqRow {
  id: number;
  created_at: string;
  question: string | null;
  answer: string | null;
  is_active: boolean | null;
}

export type OrderStatus =
  | "new"
  | "accepted"
  | "shipped"
  | "delivered"
  | "returned";

export type FulfillmentStatus =
  | "active"
  | "cancelled"
  | "completed"
  | "return_active";

export type PaymentMethod = "cod" | "online";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderRow {
  id: number;
  created_at: string;
  payment: string | null;
  status: OrderStatus | null;
  fulfillment: FulfillmentStatus | null;
  shipping: number | null;
  total_amount: string | null;
  profile_id: string | null;
}

export interface OrderItemRow {
  id: number;
  created_at: string;
  product: string | null;
  quantity: number | null;
  order_id: number | null;
  product_title_snapshot: string | null;
  unit_price_snapshot: string | null;
  total_price: number | null;
}

export interface PaymentRow {
  id: string;
  created_at: string;
  gateway: string | null;
  gateway_payment_id: string | null;
  gateway_order_id: string | null;
  gateway_signature: string | null;
  amount: string | null;
  status: string | null;
  raw_response: any;
  updated_at: string | null;
}

export interface ProfileRow {
  id: string;
  created_at: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  contact_phone: string | null;
  avatar_url: string | null;
}

export interface ShippingRow {
  id: number;
  created_at: string;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  contact_phone: string | null;
}

export interface OrderItemWithProduct extends OrderItemRow {
  Product?: {
    id: string;
    name: string;
    ProductImage?: {
      id: number;
      img_url: string;
      is_primary: boolean | null;
    }[];
  } | null;
}

export interface OrderJoined extends OrderRow {
  Payment?: PaymentRow | null;
  Shipping?: ShippingRow | null;
  Profile?: ProfileRow | null;
  OrderItem?: OrderItemWithProduct[];
}

