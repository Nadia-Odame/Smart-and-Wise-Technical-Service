import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api/products";
import { products } from "@/data/products";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    placeholderData: products,
    staleTime: 5 * 60_000,
  });
}
