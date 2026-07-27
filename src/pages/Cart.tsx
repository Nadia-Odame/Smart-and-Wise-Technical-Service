import { Link } from "react-router-dom";
import { ArrowRight, Phone, ShoppingCart, Trash2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { QuantitySelector } from "@/components/QuantitySelector";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/data/products";
import { business } from "@/data/business";

const Cart = () => {
  const { items, updateQuantity, removeItem, getSubtotal } = useCart();
  const subtotal = getSubtotal();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container-narrow py-20 text-center">
          <ShoppingCart className="w-14 h-14 mx-auto mb-6 text-muted-foreground/40" aria-hidden="true" />
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Your order list is empty</h1>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Add generators, rentals or parts and send us the list — we will confirm price and
            availability by phone.
          </p>
          <Link
            to="/shop"
            className="mt-7 inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-4 text-sm font-bold tracking-[0.15em] uppercase hover:brightness-95 transition"
          >
            Browse shop &amp; rentals
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-full py-12 sm:py-16">
        <h1 className="font-serif text-3xl sm:text-5xl font-bold">Your Order List</h1>
        <p className="mt-3 text-muted-foreground max-w-xl">
          Nothing is charged here. Send the list and we will call you to confirm everything.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 border border-border bg-card p-4"
              >
                <Link
                  to={`/product/${item.product.slug}`}
                  className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-muted"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.product.slug}`}
                    className="font-serif text-lg sm:text-xl hover:text-primary transition-colors"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm font-semibold mt-1">
                    {formatPrice(item.product.price)}
                    {item.product.priceUnit && (
                      <span className="text-xs font-normal text-muted-foreground">
                        {" "}
                        {item.product.priceUnit}
                      </span>
                    )}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <QuantitySelector
                      quantity={item.quantity}
                      onQuantityChange={(q) => updateQuantity(item.product.id, q)}
                    />
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.12em] uppercase text-muted-foreground hover:text-destructive transition"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="border border-border bg-card p-6 h-fit border-t-4 border-t-primary">
            <h2 className="font-serif text-2xl font-bold">Summary</h2>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated total</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              Delivery, installation and rental deposits are quoted separately once we know your
              location.
            </p>

            <Link
              to="/checkout"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-4 text-sm font-bold tracking-[0.15em] uppercase hover:brightness-95 transition"
            >
              Send order request
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <a
              href={business.phoneHref}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 border-2 border-foreground px-6 py-4 text-sm font-bold tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              Call instead
            </a>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
