export type ContentTab = "gallery" | "service-reviews" | "clients";

export type ContentStatusFilter = "all" | "active" | "draft";

export type ClientDisplayFilter = "all" | "logo" | "name";

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
  is_active: boolean;
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
  is_active: boolean;
}

export interface ClientItem {
  id: string;
  rawId: number;
  name: string;
  logoUrl: string;
  rawLogoPath?: string;
  show_logo: boolean;
  createdAt: string;
  formattedDate?: string;
}

export interface ContentStats {
  totalAssets: number;
  totalServiceReviews: number;
  totalClients?: number;
  totalFaqs?: number;
  publishedFaqs?: number;
  draftFaqs?: number;
  cdnStorageUsedMb: number;
  cdnStorageLimitMb: number;
  monthlyViews: string;
}
