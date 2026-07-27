import { useQuery } from "@tanstack/react-query";
import { fetchGalleryPhotos, staticGalleryPhotos } from "@/lib/api/gallery";

export function useGalleryPhotos() {
  return useQuery({
    queryKey: ["gallery-photos"],
    queryFn: fetchGalleryPhotos,
    placeholderData: staticGalleryPhotos,
    staleTime: 5 * 60_000,
  });
}
