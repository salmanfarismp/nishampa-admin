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

export interface GalleryRow {
  id: number;
  created_at: string;
  img_url: string | null;
  tag: string | null;
  title: string | null;
  description: string | null;
  is_active: boolean;
}

export type LifeStyleImageRow = GalleryRow;

export interface FaqRow {
  id: number;
  created_at: string;
  question: string | null;
  answer: string | null;
  is_active: boolean | null;
}

export interface ServiceReviewRow {
  id: number;
  created_at: string;
  comment: string | null;
  name: string | null;
  occupation: string | null;
  place: string | null;
  is_active: boolean;
}

export interface ClientRow {
  id: number;
  created_at: string;
  name: string | null;
  logo_url: string | null;
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

export interface BookRow {
  id: number;
  created_at: string;
  name: string | null;
  name_ml: string | null;
  sm_description: string | null;
  pages_approx: number | null;
  language: string | null;
  cover_url: string | null;
}

export interface BookReviewRow {
  id: number;
  created_at: string;
  stars: number | null;
  comment: string | null;
  name: string | null;
  occupation: string | null;
  place: string | null;
  book_id: number | null;
  is_active: boolean;
}

export interface OrderItemRow {
  id: number;
  created_at: string;
  book?: number | null;
  product?: string | null;
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
  raw_response: Record<string, unknown> | null;
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

export interface OrderItemWithBook extends OrderItemRow {
  Book?: BookRow | null;
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

export type OrderItemWithProduct = OrderItemWithBook;

export interface OrderJoined extends OrderRow {
  Payment?: PaymentRow | null;
  Shipping?: ShippingRow | null;
  Profile?: ProfileRow | null;
  OrderItem?: OrderItemWithBook[];
}

