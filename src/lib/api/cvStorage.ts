import { supabase } from "@/lib/supabaseClient";

const BUCKET = "cvs";

// Public — called by an unauthenticated applicant. Storage RLS allows anon
// insert into this private bucket but no anon select, so the returned path
// is only ever readable by an authenticated admin via getCvSignedUrl below.
export async function uploadCv(file: File, categorySlug: string): Promise<string> {
  const path = `${categorySlug}/${crypto.randomUUID()}-${file.name}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;

  return path;
}

// Admin-only — requires an authenticated session (enforced by storage RLS).
// Generate this on demand per click, never pre-generated for every row.
export async function getCvSignedUrl(path: string, expiresInSeconds = 60): Promise<string> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, expiresInSeconds);
  if (error) throw error;
  return data.signedUrl;
}
