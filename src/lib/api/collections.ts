import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { collections as staticCollections, Collection } from "@/data/products";

export interface CollectionRow {
  slug: string;
  name: string;
  description: string;
  image_url: string | null;
  hero_image_url: string | null;
  sort_order: number;
}

const toCollection = (row: CollectionRow): Collection => ({
  id: row.slug,
  slug: row.slug,
  name: row.name,
  description: row.description,
  image: row.image_url ?? "",
  heroImage: row.hero_image_url ?? undefined,
});

export async function fetchCollections(): Promise<Collection[]> {
  if (!isSupabaseConfigured) return staticCollections;

  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return staticCollections;
  return (data as CollectionRow[]).map(toCollection);
}

export async function upsertCollection(
  collection: Collection & { sort_order?: number }
): Promise<void> {
  const { error } = await supabase.from("collections").upsert(
    {
      slug: collection.slug,
      name: collection.name,
      description: collection.description,
      image_url: collection.image || null,
      hero_image_url: collection.heroImage || null,
      ...(collection.sort_order !== undefined ? { sort_order: collection.sort_order } : {}),
    },
    { onConflict: "slug" }
  );
  if (error) throw error;
}

export async function deleteCollection(slug: string): Promise<void> {
  const { error } = await supabase.from("collections").delete().eq("slug", slug);
  if (error) throw error;
}
