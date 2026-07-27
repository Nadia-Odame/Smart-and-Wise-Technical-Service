import { z } from "zod";

const slugPattern = /^[a-z0-9-]+$/;

export const productSchema = z.object({
  id: z.string().min(1, "Required").regex(slugPattern, "Lowercase letters, numbers, and hyphens only"),
  slug: z.string().min(1, "Required").regex(slugPattern, "Lowercase letters, numbers, and hyphens only"),
  collection: z.string().min(1, "Choose a collection"),
  name: z.string().min(1, "Required"),
  price: z.coerce.number().min(0, "Must be 0 or more"),
  priceUnit: z.string().optional(),
  description: z.string().min(1, "Required"),
  longDescription: z.string().min(1, "Required"),
  materials: z.string().min(1, "Required"),
  dimensions: z.string().optional(),
  featured: z.boolean(),
  new: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
