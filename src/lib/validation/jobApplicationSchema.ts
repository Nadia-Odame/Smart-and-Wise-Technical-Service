import { z } from "zod";

export const jobApplicationSchema = z.object({
  categorySlug: z.string().min(1, "Please choose a category"),
  fullName: z.string().min(1, "Required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(6, "Enter a valid phone number"),
  coverMessage: z.string().optional(),
});

export type JobApplicationFormValues = z.infer<typeof jobApplicationSchema>;

export const ACCEPTED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024;

export function validateCvFile(file: File): string | null {
  if (!ACCEPTED_CV_TYPES.includes(file.type)) {
    return "Please upload a PDF, DOC, or DOCX file.";
  }
  if (file.size > MAX_CV_SIZE_BYTES) {
    return "That file is too large — please keep it under 5MB.";
  }
  return null;
}
