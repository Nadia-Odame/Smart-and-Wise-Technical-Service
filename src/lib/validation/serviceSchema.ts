import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().min(1, "Required"),
  short: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  points: z.array(z.object({ value: z.string().min(1, "Can't be empty") })).min(1, "Add at least one point"),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;
