import { Link } from "react-router-dom";
import { Clock, MapPin, Phone } from "lucide-react";
import { useBusinessSettings } from "@/hooks/useBusinessSettings";
import { useServices } from "@/hooks/useServices";

export const Footer = () => {
  const { data: business } = useBusinessSettings();
  const { data: services = [] } = useServices();

  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="h-1 hazard-stripe" aria-hidden="true" />
      <div className="container-full py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-2xl font-bold uppercase">
            Smart <span className="text-primary">&amp;</span> Wise
          </p>
          <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-background/50">
            Technical Service
          </p>
          <p className="mt-4 text-sm text-background/70 leading-relaxed max-w-xs">
            {business.tagline}
          </p>
        </div>

        <div>
          <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary mb-4">
            Services
          </h2>
          <ul className="space-y-2.5">
            {services.map((s) => (
              <li key={s.id}>
                <Link
                  to={`/services#${s.id}`}
                  className="text-sm text-background/70 hover:text-background transition-colors"
                >
                  {s.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/shop" className="text-sm text-background/70 hover:text-background transition-colors">
                Sales &amp; Rentals
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary mb-4">
            Pages
          </h2>
          <ul className="space-y-2.5">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/gallery", label: "Gallery" },
              { to: "/contact", label: "Contact" },
              { to: "/cart", label: "Your Order" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-background/70 hover:text-background transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary mb-4">
            Contact
          </h2>
          <ul className="space-y-3 text-sm text-background/70">
            <li>
              <a href={business.phoneHref} className="flex items-start gap-2.5 hover:text-background">
                <Phone className="w-4 h-4 mt-0.5 text-primary shrink-0" aria-hidden="true" />
                {business.phone}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" aria-hidden="true" />
              {business.address}
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 mt-0.5 text-primary shrink-0" aria-hidden="true" />
              {business.hours}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="container-full py-5 text-xs text-background/50">
          © {new Date().getFullYear()} {business.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
