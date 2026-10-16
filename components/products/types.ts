export type ProductCategory = string;

export interface ProductColorItem {
  id: number;
  name: string;
  hex: string;
}

export interface ProductImageItem {
  id: number;
  imgUrl: string;
  url: string;
  alt?: string | null;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductItem {
  id: string;
  sku: string;
  title: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  imageAlt: string;
  is_active: boolean; // true -> Active, false -> Draft
  category: string;
  categoryName?: string;
  categoryId?: number | null;
  barcode?: string;
  description?: string;
  subtitle?: string;
  slug?: string;
  badge?: string | null;
  has_hanging_kit?: boolean | null;
  colors?: ProductColorItem[];
  images?: ProductImageItem[];
}

export type SortOption = "newest" | "price_asc" | "price_desc" | "name_asc";

export interface FilterState {
  status: "all" | "active" | "draft";
  category: string;
  minPrice?: number;
  maxPrice?: number;
}
