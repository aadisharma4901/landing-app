import type { Product } from '@/types/product';

export type ProductRow = Product & {
  original_price?: number | null;
  image_url?: string | null;
};

export function normalizeProduct(row: ProductRow): Product {
  return {
    ...row,
    originalPrice: row.originalPrice ?? row.original_price ?? undefined,
    imageUrl: row.imageUrl ?? row.image_url ?? '',
    specifications: Array.isArray(row.specifications) ? row.specifications : [],
    features: Array.isArray(row.features) ? row.features : [],
  };
}

export function normalizeProducts(rows: ProductRow[] | null | undefined): Product[] {
  return (rows ?? []).map(normalizeProduct);
}
