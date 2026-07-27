import { useQuery } from "@tanstack/react-query";
import { fetchServices } from "@/lib/api/services";
import { services } from "@/data/business";

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
    placeholderData: services,
    staleTime: 5 * 60_000,
  });
}
