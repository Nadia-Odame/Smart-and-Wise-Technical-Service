import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { products as staticProducts, getProductBySlug, Product } from "@/data/products";

export interface ProductRow {
  id: string;
  slug: string;
  collection_slug: string;
  name: string;
  price: number;
  price_unit: string | null;
  description: string;
  long_description: string;
  materials: string;
  dimensions: string | null;
  images: string[];
  featured: boolean;
  is_new: boolean;
  sort_order: number;
}

const toProduct = (row: ProductRow): Product => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  collection: row.collection_slug,
  price: row.price,
  priceUnit: row.price_unit ?? undefined,
  description: row.description,
  longDescription: row.long_description,
  materials: row.materials,
  dimensions: row.dimensions ?? undefined,
  images: row.images,
  featured: row.featured,
  new: row.is_new,
});

export async function fetchProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) return staticProducts;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return staticProducts;
  return (data as ProductRow[]).map(toProduct);
}

export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured) return getProductBySlug(slug);

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return getProductBySlug(slug);
  return toProduct(data as ProductRow);
}

export async function upsertProduct(
  product: Product & { sort_order?: number }
): Promise<void> {
  const { error } = await supabase.from("products").upsert(
    {
      id: product.id,
      slug: product.slug,
      collection_slug: product.collection,
      name: product.name,
      price: product.price,
      price_unit: product.priceUnit || null,
      description: product.description,
      long_description: product.longDescription,
      materials: product.materials,
      dimensions: product.dimensions || null,
      images: product.images,
      featured: Boolean(product.featured),
      is_new: Boolean(product.new),
      ...(product.sort_order !== undefined ? { sort_order: product.sort_order } : {}),
    },
    { onConflict: "id" }
  );
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}
