import { z } from "zod";

export const businessSettingsSchema = z.object({
  name: z.string().min(1, "Required"),
  shortName: z.string().min(1, "Required"),
  tagline: z.string().min(1, "Required"),
  phone: z.string().min(1, "Required"),
  phoneHref: z.string().min(1, "Required"),
  whatsapp: z.string().min(1, "Required"),
  address: z.string().min(1, "Required"),
  hours: z.string().min(1, "Required"),
  mapQuery: z.string().min(1, "Required"),
});

export type BusinessSettingsFormValues = z.infer<typeof businessSettingsSchema>;
