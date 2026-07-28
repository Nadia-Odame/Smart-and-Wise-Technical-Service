import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Phone, ShoppingCart } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { QuantitySelector } from "@/components/QuantitySelector";
import { useCart } from "@/hooks/useCart";
import { useBusinessSettings } from "@/hooks/useBusinessSettings";
import { useCollections } from "@/hooks/useCollections";
import { useProducts } from "@/hooks/useProducts";
import { useProduct } from "@/hooks/useProduct";
import { toast } from "@/hooks/use-toast";
import { formatPrice } from "@/data/products";
import { findCollectionBySlug, filterRelatedProducts } from "@/lib/products-helpers";
import NotFound from "./NotFound";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product } = useProduct(slug);
  const { data: business } = useBusinessSettings();
  const { data: collections = [] } = useCollections();
  const { data: products = [] } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart((s) => s.addItem);

  if (!product) return <NotFound />;

  const collection = findCollectionBySlug(collections, product.collection);
  const related = filterRelatedProducts(products, product);
  const isRental = product.collection === "rentals";

  const handleAdd = () => {
    addItem(product, quantity);
    toast({
      title: isRental ? "Added to your booking" : "Added to your order",
      description: `${quantity} × ${product.name}`,
    });
  };

  return (
    <Layout>
      <div className="container-full py-8 sm:py-12">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to shop
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="border border-border aspect-[4/3] bg-muted" />
          </div>

          <div>
            {collection && (
              <Link
                to={`/shop?collection=${collection.slug}`}
                className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground hover:text-primary"
              >
                {collection.name}
              </Link>
            )}
            <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold leading-tight">
              {product.name}
            </h1>

            <p className="mt-4 font-serif text-4xl font-bold text-foreground">
              {formatPrice(product.price)}
              {product.priceUnit && (
                <span className="ml-2 text-sm font-sans font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  {product.priceUnit}
                </span>
              )}
            </p>

            <p className="mt-5 text-muted-foreground leading-relaxed">{product.longDescription}</p>

            <dl className="mt-6 border-t border-border divide-y divide-border text-sm">
              <div className="flex justify-between gap-4 py-3">
                <dt className="font-semibold uppercase tracking-[0.12em] text-xs text-muted-foreground">
                  Details
                </dt>
                <dd className="text-right">{product.materials}</dd>
              </div>
              {product.dimensions && (
                <div className="flex justify-between gap-4 py-3">
                  <dt className="font-semibold uppercase tracking-[0.12em] text-xs text-muted-foreground">
                    Size
                  </dt>
                  <dd className="text-right">{product.dimensions}</dd>
                </div>
              )}
            </dl>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
              <button
                onClick={handleAdd}
                className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-4 text-sm font-bold tracking-[0.15em] uppercase hover:brightness-95 transition"
              >
                <ShoppingCart className="w-4 h-4" aria-hidden="true" />
                {isRental ? "Add to booking" : "Add to order"}
              </button>
            </div>

            <a
              href={business.phoneHref}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 border-2 border-foreground px-6 py-4 text-sm font-bold tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              Call to ask a question
            </a>

            <p className="mt-4 text-xs text-muted-foreground">
              Prices are a guide. We confirm the final price, delivery and installation by phone
              before anything is paid.
            </p>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">You may also need</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
