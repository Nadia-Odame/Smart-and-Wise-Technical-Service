import { useQuery } from "@tanstack/react-query";
import { getAal, listMfaFactors } from "@/lib/api/mfa";

export function useMfaStatus(enabled = true) {
  return useQuery({
    queryKey: ["mfa-status"],
    queryFn: async () => {
      const [aal, factors] = await Promise.all([getAal(), listMfaFactors()]);
      const totpFactors = factors.filter((f) => f.factor_type === "totp");
      return {
        currentLevel: aal.currentLevel,
        nextLevel: aal.nextLevel,
        verifiedFactor: totpFactors.find((f) => f.status === "verified") ?? null,
        unverifiedFactor: totpFactors.find((f) => f.status === "unverified") ?? null,
      };
    },
    enabled,
    staleTime: 0,
  });
}
