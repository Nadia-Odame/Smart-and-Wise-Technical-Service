import { useQuery } from "@tanstack/react-query";
import { fetchCareerCategories, FALLBACK_CATEGORIES } from "@/lib/api/careers";

export function useCareerCategories() {
  return useQuery({
    queryKey: ["career-categories"],
    queryFn: fetchCareerCategories,
    placeholderData: FALLBACK_CATEGORIES,
    staleTime: 5 * 60_000,
  });
}
