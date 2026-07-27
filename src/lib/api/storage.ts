import { supabase } from "@/lib/supabaseClient";

const BUCKET = "media";

export type MediaFolder = "products" | "gallery" | "business";

// Admin-only — requires an authenticated session (enforced by storage RLS).
export async function uploadImage(file: File, folder: MediaFolder): Promise<string> {
  const path = `${folder}/${crypto.randomUUID()}-${file.name}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteImage(publicUrl: string): Promise<void> {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) return; // not a storage URL we manage (e.g. a bundled seed asset)

  const path = publicUrl.slice(index + marker.length);
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}
