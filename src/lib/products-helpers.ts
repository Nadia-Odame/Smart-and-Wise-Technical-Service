import { Collection, Product } from "@/data/products";

export const findCollectionBySlug = (list: Collection[], slug: string) =>
  list.find((c) => c.slug === slug);

export const filterFeaturedProducts = (list: Product[]) => list.filter((p) => p.featured);

export const filterRelatedProducts = (list: Product[], product: Product, limit = 3) =>
  list
    .filter((p) => p.collection === product.collection && p.id !== product.id)
    .slice(0, limit);
