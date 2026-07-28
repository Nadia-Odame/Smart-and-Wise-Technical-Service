import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import installImage from "@/assets/img1.webp";
import servicingImage from "@/assets/img5.webp";
import repairImage from "@/assets/img7.webp";
import electricalImage from "@/assets/img4.webp";

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
  { id: "seed-install", src: installImage, alt: "Technician handing over a newly installed standby generator", caption: "New installation" },
  { id: "seed-servicing", src: servicingImage, alt: "Checking the generator control panel after a service", caption: "Servicing" },
  { id: "seed-repair", src: repairImage, alt: "Engine bay during a generator repair", caption: "Engine repairs" },
  { id: "seed-electrical", src: electricalImage, alt: "Wiring a distribution board and circuit breaker", caption: "Electrical works" },
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
