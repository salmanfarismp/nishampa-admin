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

