export type ContentTab = "gallery" | "faqs";

export type FaqStatus = "published" | "draft";
export type FaqFilter = "all" | "published" | "draft";

export interface GalleryAsset {
  id: string;
  url: string;
  rawPath?: string;
  alt: string;
  tag: string;
  uploadedAt: string;
  createdAt?: string;
  dimensions?: string;
  fileSize?: string;
  aspectRatio?: string;
}

export interface FaqItem {
  id: string;
  rawId?: number;
  question: string;
  answer: string;
  status: FaqStatus;
  updatedAt: string;
  createdAt?: string;
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
