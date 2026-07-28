// One-off local script. Run once after applying supabase/schema.sql, rls.sql,
// and storage.sql, to populate the database with the site's current content
// and upload the existing placeholder photos, so the live site looks the
// same immediately after switching from static data to Supabase.
//
// Usage:
//   node --env-file=.env scripts/seed-supabase.mjs
//
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env (the service
// role key bypasses Row Level Security — never commit it, never set it on
// your hosting platform, it is local/seed-only).

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(__dirname, "..", "src", "assets");

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Add both to your local .env, then run: node --env-file=.env scripts/seed-supabase.mjs"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const SEED_IMAGES = {
  hero: "hero-generator.jpg",
  unit: "gallery-unit.jpg",
  repair: "gallery-repair.jpg",
  electrical: "gallery-electrical.jpg",
};

async function uploadSeedImages() {
  const urls = {};
  for (const [key, filename] of Object.entries(SEED_IMAGES)) {
    const filePath = path.join(ASSETS_DIR, filename);
    const buffer = await readFile(filePath);
    const storagePath = `seed/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(storagePath, buffer, { contentType: "image/jpeg", upsert: true });
    if (uploadError) throw new Error(`Upload failed for ${filename}: ${uploadError.message}`);

    const { data } = supabase.storage.from("media").getPublicUrl(storagePath);
    urls[key] = data.publicUrl;
  }
  return urls;
}

async function seedBusinessSettings() {
  const { error } = await supabase.from("business_settings").upsert(
    {
      id: 1,
      name: "Smart and Wise Technical Service",
      short_name: "Smart & Wise",
      tagline: "Generator servicing, repairs and power solutions you can rely on.",
      phone: "+233 24 409 3842",
      phone_href: "tel:+233244093842",
      whatsapp: "https://wa.me/233244093842",
      address: "HGXG+8J9, Owulabu, Ghana",
      hours: "Open daily · Closes 8:00 pm",
      map_query: "HGXG%2B8J9%2C+Owulabu%2C+Ghana",
    },
    { onConflict: "id" }
  );
  if (error) throw new Error(`business_settings seed failed: ${error.message}`);
}

async function seedServices() {
  const services = [
    {
      id: "servicing",
      name: "Generator Servicing",
      short: "Routine maintenance that keeps your generator starting first time.",
      description:
        "Regular servicing is the simplest way to avoid a breakdown. We change the oil and filters, check the coolant and battery, clean the air intake, test the output and run the machine under load to be sure it performs when the lights go off.",
      points: [
        "Oil, oil filter, fuel filter and air filter change",
        "Battery, coolant and belt checks",
        "Load test and output reading",
        "Simple written report of what we found",
      ],
      sort_order: 0,
    },
    {
      id: "repairs",
      name: "Generator Repairs",
      short: "Fault finding and repairs for generators that won't start or run properly.",
      description:
        "If your generator won't start, cuts out, smokes or trips, we come and find the fault first, then explain the problem and the cost before any work begins. We handle starters, alternators, control panels, fuel systems, cooling and wiring.",
      points: [
        "On-site fault diagnosis",
        "Starter, alternator and control panel repairs",
        "Fuel system and injector work",
        "Cooling system and radiator repairs",
      ],
      sort_order: 1,
    },
    {
      id: "electrical",
      name: "Electrical Works",
      short: "Wiring, changeover switches and distribution boards done safely.",
      description:
        "We do the electrical work around your generator and your building: changeover switches, automatic transfer switches, distribution boards, cabling, earthing and general wiring for homes, shops and offices.",
      points: [
        "Manual and automatic changeover switches",
        "Distribution boards and breakers",
        "Cabling, earthing and socket circuits",
        "Fault tracing on existing installations",
      ],
      sort_order: 2,
    },
    {
      id: "overhauling",
      name: "Engine Overhauling",
      short: "Full engine rebuilds for tired or seized generator engines.",
      description:
        "When an engine has done long hours or has seized, an overhaul brings it back instead of buying a new set. We strip the engine, measure and machine what can be saved, replace worn parts, reassemble and test-run before handing it over.",
      points: [
        "Complete strip-down and inspection",
        "Piston, ring, liner and bearing replacement",
        "Head reconditioning and valve work",
        "Reassembly, timing and test run",
      ],
      sort_order: 3,
    },
  ];

  const { error } = await supabase.from("services").upsert(services, { onConflict: "id" });
  if (error) throw new Error(`services seed failed: ${error.message}`);
  return services.length;
}

async function seedCollectionsAndProducts(imageUrls) {
  const collections = [
    {
      slug: "sales",
      name: "Generators for Sale",
      description: "New and reconditioned sets, delivered and installed",
      image_url: imageUrls.unit,
      hero_image_url: imageUrls.hero,
      sort_order: 0,
    },
    {
      slug: "rentals",
      name: "Generator Rentals",
      description: "Short and long term hire for events, sites and offices",
      image_url: imageUrls.hero,
      hero_image_url: imageUrls.hero,
      sort_order: 1,
    },
    {
      slug: "parts",
      name: "Parts & Accessories",
      description: "Filters, batteries, changeover switches and spares",
      image_url: imageUrls.electrical,
      hero_image_url: imageUrls.electrical,
      sort_order: 2,
    },
  ];

  const { error: collectionsError } = await supabase
    .from("collections")
    .upsert(collections, { onConflict: "slug" });
  if (collectionsError) throw new Error(`collections seed failed: ${collectionsError.message}`);

  const products = [
    {
      id: "gen-5kva",
      slug: "5-kva-petrol-generator",
      collection_slug: "sales",
      name: "5 kVA Petrol Generator",
      price: 6500,
      description: "Good for a home, small shop or salon.",
      long_description:
        "A small petrol set that runs lights, fans, a fridge and a TV comfortably. Easy to start, easy to service, and cheap to keep running. Price includes delivery within the area and a first service after one month.",
      materials: "Petrol · 5 kVA · Recoil and electric start",
      dimensions: "Approx. 680 × 520 × 560 mm",
      images: [imageUrls.unit, imageUrls.repair],
      featured: true,
    },
    {
      id: "gen-15kva",
      slug: "15-kva-diesel-generator",
      collection_slug: "sales",
      name: "15 kVA Diesel Generator",
      price: 24000,
      description: "Diesel set for offices, guest houses and small shops.",
      long_description:
        "A dependable diesel set for buildings that need power through the whole day. Lower running cost than petrol on long hours. We install, wire the changeover and show your staff how to run it safely.",
      materials: "Diesel · 15 kVA · Electric start",
      dimensions: "Approx. 1500 × 700 × 1000 mm",
      images: [imageUrls.unit, imageUrls.hero],
      featured: true,
    },
    {
      id: "gen-40kva-canopy",
      slug: "40-kva-silent-canopy-generator",
      collection_slug: "sales",
      name: "40 kVA Silent Canopy Generator",
      price: 62000,
      description: "Quiet, weather-proof set for schools and clinics.",
      long_description:
        "Housed in a sound-reduced canopy so it can sit outside without disturbing the neighbours. Suitable for clinics, schools, churches and small factories. Installation and changeover wiring quoted separately based on your site.",
      materials: "Diesel · 40 kVA · Silent canopy",
      dimensions: "Approx. 2200 × 900 × 1400 mm",
      images: [imageUrls.unit, imageUrls.electrical],
      is_new: true,
    },
    {
      id: "gen-reconditioned-30kva",
      slug: "reconditioned-30-kva-generator",
      collection_slug: "sales",
      name: "Reconditioned 30 kVA Generator",
      price: 31000,
      description: "Overhauled in our workshop and test-run before sale.",
      long_description:
        "A used set that we have stripped, rebuilt and tested ourselves. A cheaper way into a bigger machine. We tell you honestly what was replaced and what was reused, and it comes with a three-month workmanship guarantee.",
      materials: "Diesel · 30 kVA · Fully overhauled",
      images: [imageUrls.repair, imageUrls.unit],
    },
    {
      id: "rent-10kva",
      slug: "10-kva-generator-hire",
      collection_slug: "rentals",
      name: "10 kVA Generator Hire",
      price: 450,
      price_unit: "per day",
      description: "For funerals, weddings and small outdoor events.",
      long_description:
        "We deliver the set, connect it, and collect it when you are done. Fuel is not included in the daily rate. An operator can be arranged for an extra charge if your event runs late.",
      materials: "Diesel · 10 kVA · Delivery included",
      images: [imageUrls.hero, imageUrls.unit],
      featured: true,
    },
    {
      id: "rent-30kva",
      slug: "30-kva-generator-hire",
      collection_slug: "rentals",
      name: "30 kVA Generator Hire",
      price: 950,
      price_unit: "per day",
      description: "For building sites, big events and standby cover.",
      long_description:
        "A larger set for construction work, big gatherings or to cover your building while your own generator is being repaired. Weekly and monthly rates are cheaper — call us and we will work it out with you.",
      materials: "Diesel · 30 kVA · Delivery included",
      images: [imageUrls.unit, imageUrls.hero],
    },
    {
      id: "rent-60kva",
      slug: "60-kva-generator-hire",
      collection_slug: "rentals",
      name: "60 kVA Generator Hire",
      price: 1800,
      price_unit: "per day",
      description: "Heavy duty hire for factories and long jobs.",
      long_description:
        "For sites that draw serious load. Includes delivery, positioning and connection by our team. We check the set on site each week for hires running longer than a month.",
      materials: "Diesel · 60 kVA · Delivery and connection",
      images: [imageUrls.hero, imageUrls.electrical],
    },
    {
      id: "part-service-kit",
      slug: "generator-service-kit",
      collection_slug: "parts",
      name: "Generator Service Kit",
      price: 380,
      description: "Oil, fuel and air filters plus engine oil.",
      long_description:
        "Everything needed for one routine service on a small to mid-size set. Tell us your generator make and size when ordering and we will match the right filters.",
      materials: "Filters · Engine oil",
      images: [imageUrls.repair, imageUrls.unit],
    },
    {
      id: "part-battery",
      slug: "heavy-duty-starter-battery",
      collection_slug: "parts",
      name: "Heavy Duty Starter Battery",
      price: 950,
      description: "Reliable starting power for diesel sets.",
      long_description:
        "A maintenance-free battery sized for generator starting. We can fit it for you and check your charging circuit at the same time.",
      materials: "12V · Maintenance free",
      images: [imageUrls.electrical, imageUrls.unit],
    },
    {
      id: "part-changeover",
      slug: "manual-changeover-switch",
      collection_slug: "parts",
      name: "Manual Changeover Switch",
      price: 1200,
      description: "Switch safely between mains and generator.",
      long_description:
        "A properly rated changeover switch so your generator is never connected to the mains at the same time. Supply only, or supply and installation — just ask.",
      materials: "63A · Enclosed",
      images: [imageUrls.electrical, imageUrls.repair],
      is_new: true,
    },
    {
      id: "part-ats",
      slug: "automatic-transfer-switch",
      collection_slug: "parts",
      name: "Automatic Transfer Switch (ATS)",
      price: 4200,
      description: "Starts the generator by itself when the light goes off.",
      long_description:
        "The ATS senses when mains power fails, starts your generator and switches the building over, then switches back and shuts the set down when power returns. Installation is quoted after we look at your board.",
      materials: "Automatic · Panel mounted",
      images: [imageUrls.electrical, imageUrls.unit],
    },
  ];

  // PostgREST's batch upsert unions the keys across all rows in the call; a row
  // that omits a boolean flag another row sets gets NULL for it, not the
  // column's DEFAULT — so both NOT NULL flags need an explicit value on every row.
  const productsToInsert = products.map((p) => ({
    featured: false,
    is_new: false,
    ...p,
  }));

  const { error: productsError } = await supabase
    .from("products")
    .upsert(productsToInsert, { onConflict: "id" });
  if (productsError) throw new Error(`products seed failed: ${productsError.message}`);

  return { collections: collections.length, products: products.length };
}

async function seedGalleryPhotos(imageUrls) {
  const { count } = await supabase
    .from("gallery_photos")
    .select("*", { count: "exact", head: true });
  if (count && count > 0) {
    console.log(`Skipping gallery_photos seed — ${count} row(s) already present.`);
    return 0;
  }

  const photos = [
    {
      image_url: imageUrls.hero,
      alt: "Technician servicing a diesel generator on site",
      caption: "On-site servicing",
      sort_order: 0,
    },
    {
      image_url: imageUrls.repair,
      alt: "Generator engine being repaired with a wrench",
      caption: "Engine repairs",
      sort_order: 1,
    },
    {
      image_url: imageUrls.unit,
      alt: "Silent canopy standby generator installed outside a building",
      caption: "Installed sets",
      sort_order: 2,
    },
    {
      image_url: imageUrls.electrical,
      alt: "Electrician working on a distribution board",
      caption: "Electrical works",
      sort_order: 3,
    },
  ];

  const { error } = await supabase.from("gallery_photos").insert(photos);
  if (error) throw new Error(`gallery_photos seed failed: ${error.message}`);
  return photos.length;
}

async function main() {
  console.log("Uploading seed images to the 'media' bucket...");
  const imageUrls = await uploadSeedImages();

  console.log("Seeding business_settings...");
  await seedBusinessSettings();

  console.log("Seeding services...");
  const serviceCount = await seedServices();

  console.log("Seeding collections and products...");
  const { collections, products } = await seedCollectionsAndProducts(imageUrls);

  console.log("Seeding gallery_photos...");
  const galleryCount = await seedGalleryPhotos(imageUrls);

  console.log(
    `\nDone. Seeded 1 business settings row, ${serviceCount} services, ${collections} collections, ${products} products, ${galleryCount} gallery photos.`
  );
}

main().catch((error) => {
  console.error("\nSeed failed:", error.message);
  if (error.cause) console.error("Cause:", error.cause);
  console.error("This script is safe to re-run — it upserts, so retrying won't duplicate anything.");
  process.exit(1);
});
