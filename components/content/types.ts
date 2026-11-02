export type ContentTab = "gallery" | "service-reviews";

export type FaqStatus = "published" | "draft";
export type FaqFilter = "all" | "published" | "draft";

export interface GalleryAsset {
  id: string;
  url: string;
  rawPath?: string;
  alt: string;
  tag: string;
  title?: string;
  description?: string;
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

export interface ServiceReviewItem {
  id: string;
  rawId: number;
  comment: string;
  name: string;
  occupation: string;
  place: string;
  createdAt: string;
  displaySubtitle: string;
}

export interface ContentStats {
  totalAssets: number;
  totalServiceReviews: number;
  totalFaqs?: number;
  publishedFaqs?: number;
  draftFaqs?: number;
  cdnStorageUsedMb: number;
  cdnStorageLimitMb: number;
  monthlyViews: string;
}
