import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import heroImage from "@/assets/hero-generator.jpg";
import repairImage from "@/assets/gallery-repair.jpg";
import unitImage from "@/assets/gallery-unit.jpg";
import electricalImage from "@/assets/gallery-electrical.jpg";

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

export interface GalleryPhotoRow {
  id: string;
  image_url: string;
  alt: string;
  caption: string | null;
  sort_order: number;
}

// Default photos shown until the business owner uploads real ones — same
// content the site shipped with before Supabase was wired up.
export const staticGalleryPhotos: GalleryPhoto[] = [
  { id: "seed-hero", src: heroImage, alt: "Technician servicing a diesel generator on site", caption: "On-site servicing" },
  { id: "seed-repair", src: repairImage, alt: "Generator engine being repaired with a wrench", caption: "Engine repairs" },
  { id: "seed-unit", src: unitImage, alt: "Silent canopy standby generator installed outside a building", caption: "Installed sets" },
  { id: "seed-electrical", src: electricalImage, alt: "Electrician working on a distribution board", caption: "Electrical works" },
];

const toGalleryPhoto = (row: GalleryPhotoRow): GalleryPhoto => ({
  id: row.id,
  src: row.image_url,
  alt: row.alt,
  caption: row.caption ?? undefined,
});

export async function fetchGalleryPhotos(): Promise<GalleryPhoto[]> {
  if (!isSupabaseConfigured) return staticGalleryPhotos;

  const { data, error } = await supabase
    .from("gallery_photos")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return staticGalleryPhotos;
  return (data as GalleryPhotoRow[]).map(toGalleryPhoto);
}

export async function insertGalleryPhoto(photo: {
  imageUrl: string;
  alt: string;
  caption?: string;
  sortOrder?: number;
}): Promise<void> {
  const { error } = await supabase.from("gallery_photos").insert({
    image_url: photo.imageUrl,
    alt: photo.alt,
    caption: photo.caption || null,
    sort_order: photo.sortOrder ?? 0,
  });
  if (error) throw error;
}

export async function deleteGalleryPhoto(id: string): Promise<void> {
  const { error } = await supabase.from("gallery_photos").delete().eq("id", id);
  if (error) throw error;
}
