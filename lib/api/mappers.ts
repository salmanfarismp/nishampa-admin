import { ProductJoined, ProductCategoryRow } from "@/types/database";
import { ProductItem, ProductColorItem, ProductImageItem } from "@/components/products/types";
import { resolveMediaUrl } from "@/lib/utils/media";

export function mapProductJoinedToItem(row: ProductJoined): ProductItem {
  // Sort images: primary first, then display_order
  const images = [...(row.ProductImage || [])]
    .filter((img) => Boolean(img.img_url))
    .sort((a, b) => {
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;
      return (a.display_order ?? 0) - (b.display_order ?? 0);
    });

  const primaryImage = images[0];
  const imageUrl = primaryImage ? resolveMediaUrl(primaryImage.img_url) : "";
  const imageAlt = primaryImage?.alt || row.name;

  const mappedImages: ProductImageItem[] = images.map((img, idx) => ({
    id: img.id,
    imgUrl: img.img_url,
    url: resolveMediaUrl(img.img_url),
    alt: img.alt,
    displayOrder: img.display_order ?? idx,
    isPrimary: Boolean(img.is_primary),
  }));

  const colors: ProductColorItem[] = (row.ProductColor || [])
    .filter((pc) => pc.Color)
    .map((pc) => {
      const hex = pc.Color!.hashcode.startsWith("#")
        ? pc.Color!.hashcode
        : `#${pc.Color!.hashcode}`;
      return {
        id: pc.Color!.id,
        name: pc.Color!.name,
        hex,
      };
    });

  const categorySlug = row.ProductCategory?.slug || (row.category ? String(row.category) : "all");
  const categoryName = row.ProductCategory?.name || "General";

  return {
    id: row.id,
    sku: row.ref_id || row.id.slice(0, 8).toUpperCase(),
    title: row.name,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    imageUrl,
    imageAlt,
    is_active: Boolean(row.is_active),
    category: categorySlug,
    categoryName,
    categoryId: row.category,
    description: row.description || "",
    subtitle: row.subtitle || "",
    slug: row.slug || row.id,
    badge: row.badge,
    has_hanging_kit: row.has_hanging_kit,
    colors,
    images: mappedImages,
  };
}

export interface AdminCategoryOption {
  id: string;
  label: string;
  slug: string;
  dbId?: number;
}

export function mapCategoryRowToOption(row: ProductCategoryRow): AdminCategoryOption {
  return {
    id: row.slug || String(row.id),
    slug: row.slug || String(row.id),
    label: row.name || row.nick_name || "Category",
    dbId: row.id,
  };
}
