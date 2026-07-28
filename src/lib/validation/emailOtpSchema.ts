import { z } from "zod";

export const emailOtpSchema = z.object({
  code: z.string().length(8, "Enter the 8-digit code").regex(/^\d{8}$/, "Code must be 8 digits"),
});

export type EmailOtpFormValues = z.infer<typeof emailOtpSchema>;
