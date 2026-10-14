export type ReviewStatus = "pending" | "approved" | "flagged" | "spam";

export type ReviewFilterTab = "all" | "pending" | "flagged";

export interface ReviewProduct {
  name: string;
  sku?: string;
  url?: string;
}

export interface Review {
  id: string;
  author: string;
  status: ReviewStatus;
  createdAt: string;
  rating: number; // 1 to 5
  product: ReviewProduct;
  comment: string;
  photos: string[];
  verifiedPurchase: boolean;
  merchantReply?: string;
  flagReason?: string;
  ipAddress?: string;
}

export interface ReviewCounts {
  all: number;
  pending: number;
  flagged: number;
}
