import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { services as staticServices, ServiceItem } from "@/data/business";

export interface ServiceRow {
  id: string;
  name: string;
  short: string;
  description: string;
  points: string[];
  sort_order: number;
}

const toServiceItem = (row: ServiceRow): ServiceItem => ({
  id: row.id,
  name: row.name,
  short: row.short,
  description: row.description,
  points: row.points,
});

export async function fetchServices(): Promise<ServiceItem[]> {
  if (!isSupabaseConfigured) return staticServices;

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return staticServices;
  return (data as ServiceRow[]).map(toServiceItem);
}

export async function upsertService(
  service: ServiceItem & { sort_order?: number }
): Promise<void> {
  const { error } = await supabase.from("services").upsert(
    {
      id: service.id,
      name: service.name,
      short: service.short,
      description: service.description,
      points: service.points,
      ...(service.sort_order !== undefined ? { sort_order: service.sort_order } : {}),
    },
    { onConflict: "id" }
  );
  if (error) throw error;
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw error;
}
