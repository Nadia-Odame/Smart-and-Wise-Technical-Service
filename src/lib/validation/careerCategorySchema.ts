import { z } from "zod";

const slugPattern = /^[a-z0-9-]+$/;

export const careerCategorySchema = z.object({
  slug: z.string().min(1, "Required").regex(slugPattern, "Lowercase letters, numbers, and hyphens only"),
  name: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
});

export type CareerCategoryFormValues = z.infer<typeof careerCategorySchema>;
