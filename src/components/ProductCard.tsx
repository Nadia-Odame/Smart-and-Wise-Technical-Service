import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Product, formatPrice } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { useCollections } from "@/hooks/useCollections";
import { findCollectionBySlug } from "@/lib/products-helpers";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCart((s) => s.addItem);
  const { data: collections = [] } = useCollections();
  const collection = findCollectionBySlug(collections, product.collection);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast({
      title: "Added to your order",
      description: `${product.name} is in your order list.`,
    });
  };

  return (
    <article className="group border border-border bg-card flex flex-col hover-lift">
      <Link to={`/product/${product.slug}`} className="block image-reveal aspect-[4/3] bg-muted">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </Link>

      <div className="p-5 flex flex-col flex-1">
        {collection && (
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">
            {collection.name}
          </p>
        )}
        <h3 className="font-serif text-xl leading-tight">
          <Link to={`/product/${product.slug}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
          {product.description}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <p className="font-serif text-2xl font-bold">
            {formatPrice(product.price)}
            {product.priceUnit && (
              <span className="block text-[11px] font-sans font-medium tracking-wide uppercase text-muted-foreground">
                {product.priceUnit}
              </span>
            )}
          </p>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3.5 py-2.5 text-xs font-bold tracking-[0.12em] uppercase hover:brightness-95 transition"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            {product.collection === "rentals" ? "Book" : "Order"}
          </button>
        </div>
      </div>
    </article>
  );
};
