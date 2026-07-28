import { z } from "zod";

export const emailOtpSchema = z.object({
  code: z.string().length(6, "Enter the 6-digit code").regex(/^\d{6}$/, "Code must be 6 digits"),
});

export type EmailOtpFormValues = z.infer<typeof emailOtpSchema>;
