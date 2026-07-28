import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock, MapPin, Phone, Wrench } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useBusinessSettings } from "@/hooks/useBusinessSettings";
import { useServices } from "@/hooks/useServices";
import { useProducts } from "@/hooks/useProducts";
import { useGalleryPhotos } from "@/hooks/useGalleryPhotos";
import { filterFeaturedProducts } from "@/lib/products-helpers";

const reasons = [
  "We come to you — home, shop, office or site",
  "We explain the fault and the cost before we start",
  "Genuine filters and parts, no shortcuts",
  "Open every day until 8pm, including emergencies",
];

const HERO_SLIDE_MS = 5000;

const Index = () => {
  const { data: business } = useBusinessSettings();
  const { data: services = [] } = useServices();
  const { data: products = [] } = useProducts();
  const { data: heroPhotos = [] } = useGalleryPhotos();
  const featured = filterFeaturedProducts(products);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (heroPhotos.length <= 1) return;
    const id = setInterval(
      () => setActiveSlide((i) => (i + 1) % heroPhotos.length),
      HERO_SLIDE_MS
    );
    return () => clearInterval(id);
  }, [heroPhotos.length]);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-foreground text-background">
        {heroPhotos.map((photo, i) => (
          <img
            key={photo.id}
            src={photo.src}
            alt={photo.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              i === activeSlide ? "opacity-40" : "opacity-0"
            }`}
          />
        ))}
        <div className="relative container-full py-20 sm:py-28 lg:py-36">
          <p className="section-label text-primary">
            <span className="w-8 h-0.5 bg-primary inline-block" aria-hidden="true" />
            Owulabu, Ghana
          </p>
          <h1 className="mt-4 font-serif text-4xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] max-w-3xl text-balance">
            Smart <span className="text-primary">&amp;</span> Wise
            <span className="block text-background/90">Technical Service</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-background/80 max-w-xl leading-relaxed">
            Generator servicing, repairs, electrical works and engine overhauling — plus
            generators for sale and for hire.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href={business.phoneHref}
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-7 py-4 text-sm font-bold tracking-[0.15em] uppercase hover:brightness-95 transition"
            >
              <Phone className="w-5 h-5" aria-hidden="true" />
              Call Now
            </a>
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 border-2 border-background/40 px-7 py-4 text-sm font-bold tracking-[0.15em] uppercase hover:border-primary hover:text-primary transition"
            >
              See Our Services
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-background/70">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
              {business.hours}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" aria-hidden="true" />
              {business.address}
            </span>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 sm:py-20">
        <div className="container-full">
          <p className="section-label">What we do</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold">Our Services</h2>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Link
                key={s.id}
                to={`/services#${s.id}`}
                className="group border border-border bg-card p-6 border-t-4 border-t-primary hover-lift"
              >
                <Wrench className="w-7 h-7 text-primary" aria-hidden="true" />
                <h3 className="mt-4 font-serif text-xl leading-tight group-hover:text-primary transition-colors">
                  {s.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.short}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.15em] uppercase text-foreground">
                  Read more
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="bg-foreground text-background py-16 sm:py-20">
        <div className="container-full grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="section-label text-primary">Local and reliable</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold">
              A working generator company, not a call centre
            </h2>
            <p className="mt-4 text-background/75 leading-relaxed">
              We are a small team based in Owulabu. The person who picks up the phone is the
              person who comes to look at your machine. We keep our prices plain and we tell you
              when a repair is not worth the money.
            </p>
            <ul className="mt-6 space-y-3">
              {reasons.map((r) => (
                <li key={r} className="flex items-start gap-3 text-sm text-background/80">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 border-2 border-primary text-primary px-6 py-3 text-xs font-bold tracking-[0.15em] uppercase hover:bg-primary hover:text-primary-foreground transition"
            >
              About us
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "4", label: "Core services" },
              { value: "7", label: "Days a week" },
              { value: "8pm", label: "We close at" },
              { value: "1", label: "Call to get started" },
            ].map((stat) => (
              <div key={stat.label} className="border border-background/15 p-6">
                <p className="font-serif text-4xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-xs font-semibold tracking-[0.15em] uppercase text-background/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sales & rentals */}
      <section className="py-16 sm:py-20">
        <div className="container-full">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-label">Buy or hire</p>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold">
                Generators for sale &amp; rental
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase link-underline"
            >
              View all
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-14">
        <div className="container-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">Generator giving trouble?</h2>
            <p className="mt-2 text-sm sm:text-base opacity-80">
              Call us and describe the problem — we will tell you what it likely is.
            </p>
          </div>
          <a
            href={business.phoneHref}
            className="inline-flex items-center gap-2 bg-foreground text-background px-7 py-4 text-sm font-bold tracking-[0.15em] uppercase hover:opacity-90 transition"
          >
            <Phone className="w-5 h-5" aria-hidden="true" />
            {business.phone}
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
