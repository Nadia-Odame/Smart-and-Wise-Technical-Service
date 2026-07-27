import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { business as staticBusiness } from "@/data/business";

export interface BusinessSettingsRow {
  id: number;
  name: string;
  short_name: string;
  tagline: string;
  phone: string;
  phone_href: string;
  whatsapp: string;
  address: string;
  hours: string;
  map_query: string;
}

const toBusiness = (row: BusinessSettingsRow): typeof staticBusiness => ({
  name: row.name,
  shortName: row.short_name,
  tagline: row.tagline,
  phone: row.phone,
  phoneHref: row.phone_href,
  whatsapp: row.whatsapp,
  address: row.address,
  hours: row.hours,
  mapQuery: row.map_query,
});

export async function fetchBusinessSettings(): Promise<typeof staticBusiness> {
  if (!isSupabaseConfigured) return staticBusiness;

  const { data, error } = await supabase
    .from("business_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) return staticBusiness;
  return toBusiness(data as BusinessSettingsRow);
}

export async function updateBusinessSettings(
  patch: Partial<Omit<BusinessSettingsRow, "id">>
): Promise<void> {
  const { error } = await supabase.from("business_settings").update(patch).eq("id", 1);
  if (error) throw error;
}
