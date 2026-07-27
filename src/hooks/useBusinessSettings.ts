import { useQuery } from "@tanstack/react-query";
import { fetchBusinessSettings } from "@/lib/api/business";
import { business } from "@/data/business";

export function useBusinessSettings() {
  return useQuery({
    queryKey: ["business-settings"],
    queryFn: fetchBusinessSettings,
    placeholderData: business,
    staleTime: 5 * 60_000,
  });
}
