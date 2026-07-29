import { Link, NavLink as RouterNavLink } from "react-router-dom";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { CartIcon } from "@/components/CartIcon";
import { useBusinessSettings } from "@/hooks/useBusinessSettings";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/shop", label: "Shop & Rentals" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const { data: business } = useBusinessSettings();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      {/* Phone bar — always visible */}
      <div className="bg-foreground text-background">
        <div className="container-full flex items-center justify-between gap-3 py-2 text-xs sm:text-sm">
          <span className="hidden sm:inline text-background/70">{business.hours}</span>
          <a
            href={business.phoneHref}
            className="flex items-center gap-2 font-semibold text-primary hover:underline"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            {business.phone}
          </a>
        </div>
      </div>

      <div className="h-1 hazard-stripe" aria-hidden="true" />

      <nav className="container-full" aria-label="Main">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="leading-none">
            <span className="block font-serif text-xl sm:text-2xl font-bold tracking-tight">
              Smart <span className="text-primary">&amp;</span> Wise
            </span>
            <span className="block text-[9px] sm:text-[10px] font-semibold tracking-[0.28em] uppercase text-muted-foreground">
              Technical Service
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => (
              <RouterNavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "text-xs font-bold tracking-[0.15em] uppercase transition-colors link-underline",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                {item.label}
              </RouterNavLink>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <a
              href={business.phoneHref}
              className="hidden sm:inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 text-xs font-bold tracking-[0.15em] uppercase hover:brightness-95 transition"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              Call Now
            </a>
            <CartIcon />
            <button
              className="lg:hidden p-2"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border py-3">
            <ul className="flex flex-col">
              {navItems.map((item) => (
                <li key={item.to}>
                  <RouterNavLink
                    to={item.to}
                    end={item.to === "/"}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "block py-3 text-sm font-bold tracking-[0.12em] uppercase border-l-4 pl-4 transition-colors",
                        isActive
                          ? "border-primary text-foreground"
                          : "border-transparent text-muted-foreground"
                      )
                    }
                  >
                    {item.label}
                  </RouterNavLink>
                </li>
              ))}
            </ul>
            <a
              href={business.phoneHref}
              className="mt-3 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-3 text-sm font-bold tracking-[0.15em] uppercase"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              Call {business.phone}
            </a>
          </div>
        )}
      </nav>
    </header>
  );
};
