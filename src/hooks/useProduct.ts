import { useQuery } from "@tanstack/react-query";
import { fetchProductBySlug } from "@/lib/api/products";
import { getProductBySlug } from "@/data/products";

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug as string),
    placeholderData: () => (slug ? getProductBySlug(slug) : undefined),
    enabled: Boolean(slug),
    staleTime: 5 * 60_000,
  });
}
