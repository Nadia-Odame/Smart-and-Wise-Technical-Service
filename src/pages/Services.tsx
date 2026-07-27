import { Link } from "react-router-dom";
import { CheckCircle2, Phone } from "lucide-react";
import { Layout } from "@/components/Layout";
import { business, services } from "@/data/business";
import repairImage from "@/assets/gallery-repair.jpg";
import electricalImage from "@/assets/gallery-electrical.jpg";
import unitImage from "@/assets/gallery-unit.jpg";
import heroImage from "@/assets/hero-generator.jpg";

const serviceImages: Record<string, string> = {
  servicing: heroImage,
  repairs: repairImage,
  electrical: electricalImage,
  overhauling: unitImage,
};

const Services = () => {
  return (
    <Layout>
      <section className="bg-foreground text-background py-14 sm:py-20">
        <div className="container-full">
          <p className="section-label text-primary">What we do</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-6xl font-bold">Our Services</h1>
          <p className="mt-4 max-w-2xl text-background/75 leading-relaxed">
            Four things we do every day. If you are not sure which one you need, call us and
            describe what the machine is doing — we will tell you.
          </p>
        </div>
      </section>

      <div className="container-full py-14 sm:py-20 space-y-16 sm:space-y-24">
        {services.map((service, i) => (
          <section
            key={service.id}
            id={service.id}
            className="grid gap-8 lg:grid-cols-2 lg:items-center scroll-mt-32"
          >
            <div className={i % 2 === 1 ? "lg:order-2" : ""}>
              <div className="image-reveal border border-border aspect-[4/3]">
                <img
                  src={serviceImages[service.id]}
                  alt={service.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <p className="section-label">
                <span className="text-primary">0{i + 1}</span>
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold border-l-4 border-primary pl-4">
                {service.name}
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">{service.description}</p>
              <ul className="mt-6 space-y-3">
                {service.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
              <a
                href={business.phoneHref}
                className="mt-7 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 text-xs font-bold tracking-[0.15em] uppercase hover:brightness-95 transition"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                Call about this
              </a>
            </div>
          </section>
        ))}
      </div>

      <section className="border-t border-border py-14">
        <div className="container-full text-center">
          <h2 className="font-serif text-3xl font-bold">Need a generator instead of a repair?</h2>
          <p className="mt-3 text-muted-foreground">
            We also sell and rent out generators, and supply parts.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 border-2 border-foreground px-7 py-3.5 text-xs font-bold tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition"
          >
            Shop &amp; Rentals
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
