import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export interface CareerCategory {
  slug: string;
  name: string;
  description: string;
}

export interface CareerCategoryRow {
  slug: string;
  name: string;
  description: string;
  sort_order: number;
}

export const FALLBACK_CATEGORIES: CareerCategory[] = [
  {
    slug: "student-programs",
    name: "Student Programs",
    description: "Internships and attachments for students who want hands-on generator and electrical experience.",
  },
  {
    slug: "apprentice-program",
    name: "Apprentice Program",
    description: "Structured, hands-on training for people starting out in generator servicing and repair.",
  },
  {
    slug: "entry-level-jobs",
    name: "Entry-Level Jobs",
    description: "Roles for candidates early in their career who are ready to learn on the job.",
  },
  {
    slug: "experienced-hires",
    name: "Experienced Hires",
    description: "Positions for skilled technicians and professionals with proven generator or electrical experience.",
  },
];

const toCareerCategory = (row: CareerCategoryRow): CareerCategory => ({
  slug: row.slug,
  name: row.name,
  description: row.description,
});

export async function fetchCareerCategories(): Promise<CareerCategory[]> {
  if (!isSupabaseConfigured) return FALLBACK_CATEGORIES;

  const { data, error } = await supabase
    .from("career_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return FALLBACK_CATEGORIES;
  return (data as CareerCategoryRow[]).map(toCareerCategory);
}

export async function upsertCareerCategory(
  category: CareerCategory & { sort_order?: number }
): Promise<void> {
  const { error } = await supabase.from("career_categories").upsert(
    {
      slug: category.slug,
      name: category.name,
      description: category.description,
      ...(category.sort_order !== undefined ? { sort_order: category.sort_order } : {}),
    },
    { onConflict: "slug" }
  );
  if (error) throw error;
}

export async function deleteCareerCategory(slug: string): Promise<void> {
  const { error } = await supabase.from("career_categories").delete().eq("slug", slug);
  if (error) throw error;
}
