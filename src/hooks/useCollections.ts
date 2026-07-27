import { useQuery } from "@tanstack/react-query";
import { fetchCollections } from "@/lib/api/collections";
import { collections } from "@/data/products";

export function useCollections() {
  return useQuery({
    queryKey: ["collections"],
    queryFn: fetchCollections,
    placeholderData: collections,
    staleTime: 5 * 60_000,
  });
}
