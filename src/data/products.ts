import genUnit from "@/assets/gallery-unit.jpg";
import genRepair from "@/assets/gallery-repair.jpg";
import genElectrical from "@/assets/gallery-electrical.jpg";
import genHero from "@/assets/hero-generator.jpg";

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  heroImage?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  collection: string;
  price: number;
  /** e.g. "per day" for rentals */
  priceUnit?: string;
  description: string;
  longDescription: string;
  materials: string;
  dimensions?: string;
  images: string[];
  featured?: boolean;
  new?: boolean;
}

export const collections: Collection[] = [
  {
    id: "sales",
    name: "Generators for Sale",
    slug: "sales",
    description: "New and reconditioned sets, delivered and installed",
    image: genUnit,
    heroImage: genHero,
  },
  {
    id: "rentals",
    name: "Generator Rentals",
    slug: "rentals",
    description: "Short and long term hire for events, sites and offices",
    image: genHero,
    heroImage: genHero,
  },
  {
    id: "parts",
    name: "Parts & Accessories",
    slug: "parts",
    description: "Filters, batteries, changeover switches and spares",
    image: genElectrical,
    heroImage: genElectrical,
  },
];

export const products: Product[] = [
  // ---- Sales ----
  {
    id: "gen-5kva",
    name: "5 kVA Petrol Generator",
    slug: "5-kva-petrol-generator",
    collection: "sales",
    price: 6500,
    description: "Good for a home, small shop or salon.",
    longDescription:
      "A small petrol set that runs lights, fans, a fridge and a TV comfortably. Easy to start, easy to service, and cheap to keep running. Price includes delivery within the area and a first service after one month.",
    materials: "Petrol · 5 kVA · Recoil and electric start",
    dimensions: "Approx. 680 × 520 × 560 mm",
    images: [genUnit, genRepair],
    featured: true,
  },
  {
    id: "gen-15kva",
    name: "15 kVA Diesel Generator",
    slug: "15-kva-diesel-generator",
    collection: "sales",
    price: 24000,
    description: "Diesel set for offices, guest houses and small shops.",
    longDescription:
      "A dependable diesel set for buildings that need power through the whole day. Lower running cost than petrol on long hours. We install, wire the changeover and show your staff how to run it safely.",
    materials: "Diesel · 15 kVA · Electric start",
    dimensions: "Approx. 1500 × 700 × 1000 mm",
    images: [genUnit, genHero],
    featured: true,
  },
  {
    id: "gen-40kva-canopy",
    name: "40 kVA Silent Canopy Generator",
    slug: "40-kva-silent-canopy-generator",
    collection: "sales",
    price: 62000,
    description: "Quiet, weather-proof set for schools and clinics.",
    longDescription:
      "Housed in a sound-reduced canopy so it can sit outside without disturbing the neighbours. Suitable for clinics, schools, churches and small factories. Installation and changeover wiring quoted separately based on your site.",
    materials: "Diesel · 40 kVA · Silent canopy",
    dimensions: "Approx. 2200 × 900 × 1400 mm",
    images: [genUnit, genElectrical],
    new: true,
  },
  {
    id: "gen-reconditioned-30kva",
    name: "Reconditioned 30 kVA Generator",
    slug: "reconditioned-30-kva-generator",
    collection: "sales",
    price: 31000,
    description: "Overhauled in our workshop and test-run before sale.",
    longDescription:
      "A used set that we have stripped, rebuilt and tested ourselves. A cheaper way into a bigger machine. We tell you honestly what was replaced and what was reused, and it comes with a three-month workmanship guarantee.",
    materials: "Diesel · 30 kVA · Fully overhauled",
    images: [genRepair, genUnit],
  },

  // ---- Rentals ----
  {
    id: "rent-10kva",
    name: "10 kVA Generator Hire",
    slug: "10-kva-generator-hire",
    collection: "rentals",
    price: 450,
    priceUnit: "per day",
    description: "For funerals, weddings and small outdoor events.",
    longDescription:
      "We deliver the set, connect it, and collect it when you are done. Fuel is not included in the daily rate. An operator can be arranged for an extra charge if your event runs late.",
    materials: "Diesel · 10 kVA · Delivery included",
    images: [genHero, genUnit],
    featured: true,
  },
  {
    id: "rent-30kva",
    name: "30 kVA Generator Hire",
    slug: "30-kva-generator-hire",
    collection: "rentals",
    price: 950,
    priceUnit: "per day",
    description: "For building sites, big events and standby cover.",
    longDescription:
      "A larger set for construction work, big gatherings or to cover your building while your own generator is being repaired. Weekly and monthly rates are cheaper — call us and we will work it out with you.",
    materials: "Diesel · 30 kVA · Delivery included",
    images: [genUnit, genHero],
  },
  {
    id: "rent-60kva",
    name: "60 kVA Generator Hire",
    slug: "60-kva-generator-hire",
    collection: "rentals",
    price: 1800,
    priceUnit: "per day",
    description: "Heavy duty hire for factories and long jobs.",
    longDescription:
      "For sites that draw serious load. Includes delivery, positioning and connection by our team. We check the set on site each week for hires running longer than a month.",
    materials: "Diesel · 60 kVA · Delivery and connection",
    images: [genHero, genElectrical],
  },

  // ---- Parts ----
  {
    id: "part-service-kit",
    name: "Generator Service Kit",
    slug: "generator-service-kit",
    collection: "parts",
    price: 380,
    description: "Oil, fuel and air filters plus engine oil.",
    longDescription:
      "Everything needed for one routine service on a small to mid-size set. Tell us your generator make and size when ordering and we will match the right filters.",
    materials: "Filters · Engine oil",
    images: [genRepair, genUnit],
  },
  {
    id: "part-battery",
    name: "Heavy Duty Starter Battery",
    slug: "heavy-duty-starter-battery",
    collection: "parts",
    price: 950,
    description: "Reliable starting power for diesel sets.",
    longDescription:
      "A maintenance-free battery sized for generator starting. We can fit it for you and check your charging circuit at the same time.",
    materials: "12V · Maintenance free",
    images: [genElectrical, genUnit],
  },
  {
    id: "part-changeover",
    name: "Manual Changeover Switch",
    slug: "manual-changeover-switch",
    collection: "parts",
    price: 1200,
    description: "Switch safely between mains and generator.",
    longDescription:
      "A properly rated changeover switch so your generator is never connected to the mains at the same time. Supply only, or supply and installation — just ask.",
    materials: "63A · Enclosed",
    images: [genElectrical, genRepair],
    new: true,
  },
  {
    id: "part-ats",
    name: "Automatic Transfer Switch (ATS)",
    slug: "automatic-transfer-switch",
    collection: "parts",
    price: 4200,
    description: "Starts the generator by itself when the light goes off.",
    longDescription:
      "The ATS senses when mains power fails, starts your generator and switches the building over, then switches back and shuts the set down when power returns. Installation is quoted after we look at your board.",
    materials: "Automatic · Panel mounted",
    images: [genElectrical, genUnit],
  },
];

export const getCollectionBySlug = (slug: string) =>
  collections.find((c) => c.slug === slug);

export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);

export const getFeaturedProducts = () => products.filter((p) => p.featured);

export const getRelatedProducts = (product: Product, limit = 3) =>
  products
    .filter((p) => p.collection === product.collection && p.id !== product.id)
    .slice(0, limit);

export const formatPrice = (value: number) =>
  `GH₵ ${value.toLocaleString("en-GH")}`;
