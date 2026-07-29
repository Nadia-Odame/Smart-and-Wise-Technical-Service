import { supabase } from "@/lib/supabaseClient";

export type ApplicationStatus = "new" | "reviewed" | "shortlisted" | "rejected" | "hired";

export interface NewJobApplication {
  categorySlug: string;
  fullName: string;
  email: string;
  phone: string;
  coverMessage?: string | null;
  cvPath: string;
}

export interface JobApplication {
  id: string;
  category_slug: string;
  full_name: string;
  email: string;
  phone: string;
  cover_message: string | null;
  cv_path: string;
  status: ApplicationStatus;
  created_at: string;
}

// Unlike submitEnquiry (src/lib/api/enquiries.ts), this THROWS on failure.
// Enquiries have WhatsApp + Formspree as backup channels; an application has
// no other channel at all — Supabase is the only place it's ever recorded, so
// callers must surface the error and let the applicant retry, never show a
// false success state.
export async function submitApplication(payload: NewJobApplication): Promise<void> {
  const { error } = await supabase.from("job_applications").insert({
    category_slug: payload.categorySlug,
    full_name: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    cover_message: payload.coverMessage ?? null,
    cv_path: payload.cvPath,
  });
  if (error) throw error;
}

// Admin-only — requires an authenticated session (enforced by RLS).
export async function fetchApplications(status?: ApplicationStatus): Promise<JobApplication[]> {
  let query = supabase
    .from("job_applications")
    .select("*")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as JobApplication[];
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus): Promise<void> {
  const { error } = await supabase.from("job_applications").update({ status }).eq("id", id);
  if (error) throw error;
}
