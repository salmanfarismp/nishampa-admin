export type ProductCategory =
  | "all"
  | "apparel"
  | "footwear"
  | "accessories"
  | "home_living";

export interface ProductItem {
  id: string;
  sku: string;
  title: string;
  price: number;
  imageUrl: string;
  imageAlt: string;
  is_active: boolean; // boolean: true -> Active, false -> Draft
  category: ProductCategory;
  stockCount: number;
  barcode?: string;
  description?: string;
}

export type SortOption = "newest" | "price_asc" | "price_desc" | "stock_asc";

export interface FilterState {
  status: "all" | "active" | "draft";
  category: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
}
