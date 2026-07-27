import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Phone } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { products, collections, getCollectionBySlug } from "@/data/products";
import { business } from "@/data/business";
import { cn } from "@/lib/utils";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get("collection") || "all";

  const list = useMemo(() => {
    if (active === "all") return products;
    const collection = getCollectionBySlug(active);
    return collection ? products.filter((p) => p.collection === collection.id) : products;
  }, [active]);

  const handleFilter = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug === "all") params.delete("collection");
    else params.set("collection", slug);
    setSearchParams(params);
  };

  return (
    <Layout>
      <section className="bg-foreground text-background py-14 sm:py-20">
        <div className="container-full">
          <p className="section-label text-primary">Buy, hire or order parts</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-6xl font-bold">Shop &amp; Rentals</h1>
          <p className="mt-4 max-w-2xl text-background/75 leading-relaxed">
            Add what you need to your order list and send it to us — we will confirm price,
            availability and delivery by phone. Nothing is charged online.
          </p>
        </div>
      </section>

      <section className="container-full py-10 sm:py-14">
        <div className="flex flex-wrap gap-2">
          {[{ slug: "all", name: "Everything" }, ...collections].map((c) => (
            <button
              key={c.slug}
              onClick={() => handleFilter(c.slug)}
              className={cn(
                "px-4 py-2.5 text-xs font-bold tracking-[0.12em] uppercase border-2 transition",
                active === c.slug
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-14 border border-border bg-muted p-8 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Not sure which size you need?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Tell us what you want to run — lights, fridge, freezer, air conditioner, machines —
            and we will recommend the right generator.
          </p>
          <a
            href={business.phoneHref}
            className="mt-6 inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 text-xs font-bold tracking-[0.15em] uppercase hover:brightness-95 transition"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            Call {business.phone}
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default Products;
