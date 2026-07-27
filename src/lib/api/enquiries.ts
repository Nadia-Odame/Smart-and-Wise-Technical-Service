import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export type EnquiryType = "quote" | "order";
export type EnquiryStatus = "new" | "contacted" | "done" | "archived";

export interface EnquiryItem {
  name: string;
  quantity: number;
  lineTotal: number;
}

export interface NewEnquiry {
  type: EnquiryType;
  name: string;
  phone: string;
  service?: string | null;
  message?: string | null;
  location?: string | null;
  notes?: string | null;
  items?: EnquiryItem[] | null;
  total?: number | null;
}

export interface Enquiry extends NewEnquiry {
  id: string;
  status: EnquiryStatus;
  created_at: string;
}

// Fire-and-forget, same contract as submitToFormspree in src/lib/notify.ts —
// never throws, never blocks the WhatsApp redirect or the success toast.
export async function submitEnquiry(payload: NewEnquiry): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { error } = await supabase.from("enquiries").insert({
      type: payload.type,
      name: payload.name,
      phone: payload.phone,
      service: payload.service ?? null,
      message: payload.message ?? null,
      location: payload.location ?? null,
      notes: payload.notes ?? null,
      items: payload.items ?? null,
      total: payload.total ?? null,
    });
    return !error;
  } catch {
    return false;
  }
}

// Admin-only — requires an authenticated session (enforced by RLS).
export async function fetchEnquiries(status?: EnquiryStatus): Promise<Enquiry[]> {
  let query = supabase.from("enquiries").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Enquiry[];
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<void> {
  const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
  if (error) throw error;
}
