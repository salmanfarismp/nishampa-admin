export type ContentTab = "gallery" | "faqs";

export type FaqCategory =
  | "all"
  | "shipping"
  | "returns"
  | "materials"
  | "warranty"
  | "general";

export type FaqStatus = "published" | "draft";

export interface GalleryAsset {
  id: string;
  url: string;
  alt: string;
  tag: string;
  uploadedAt: string;
  dimensions?: string;
  fileSize?: string;
  aspectRatio?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "shipping" | "returns" | "materials" | "warranty" | "general";
  status: FaqStatus;
  updatedAt: string;
}

export interface ContentStats {
  totalAssets: number;
  totalFaqs: number;
  publishedFaqs: number;
  draftFaqs: number;
  cdnStorageUsedMb: number;
  cdnStorageLimitMb: number;
  monthlyViews: string;
}
