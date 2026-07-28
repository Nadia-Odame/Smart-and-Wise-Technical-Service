import { z } from "zod";

export const mfaCodeSchema = z.object({
  code: z.string().length(6, "Enter the 6-digit code").regex(/^\d{6}$/, "Code must be 6 digits"),
});

export type MfaCodeFormValues = z.infer<typeof mfaCodeSchema>;
