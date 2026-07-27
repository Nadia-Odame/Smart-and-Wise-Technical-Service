import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Phone, Send } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/data/products";
import { business } from "@/data/business";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, clearCart } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", location: "", notes: "" });
  const [sent, setSent] = useState(false);
  const subtotal = getSubtotal();

  if (items.length === 0 && !sent) {
    return (
      <Layout>
        <div className="container-narrow py-20 text-center">
          <h1 className="font-serif text-3xl font-bold">Nothing to send yet</h1>
          <p className="mt-3 text-muted-foreground">Add something to your order list first.</p>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 text-xs font-bold tracking-[0.15em] uppercase"
          >
            Go to shop
          </Link>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast({
        title: "Name and phone are needed",
        description: "We need a number to call you back on.",
        variant: "destructive",
      });
      return;
    }
    setSent(true);
    clearCart();
    toast({
      title: "Request received",
      description: `We will call you on ${form.phone} to confirm.`,
    });
  };

  if (sent) {
    return (
      <Layout>
        <div className="container-narrow py-20 text-center">
          <CheckCircle2 className="w-14 h-14 mx-auto text-primary" aria-hidden="true" />
          <h1 className="mt-6 font-serif text-3xl sm:text-4xl font-bold">Request sent</h1>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Thank you, {form.name}. We will call you on {form.phone} to confirm the items, price
            and delivery. If it is urgent, call us directly.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={business.phoneHref}
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 text-xs font-bold tracking-[0.15em] uppercase"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              {business.phone}
            </a>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center gap-2 border-2 border-foreground px-6 py-3.5 text-xs font-bold tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition"
            >
              Back to home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-full py-12 sm:py-16">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to order list
        </Link>

        <h1 className="mt-6 font-serif text-3xl sm:text-5xl font-bold">Send Your Request</h1>
        <p className="mt-3 text-muted-foreground max-w-xl">
          No payment is taken online. We call you back to confirm everything first.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <form onSubmit={handleSubmit} className="lg:col-span-2 border border-border bg-card p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="co-name">Your name *</Label>
              <Input
                id="co-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-none h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="co-phone">Phone number *</Label>
              <Input
                id="co-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="e.g. 024 000 0000"
                className="rounded-none h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="co-location">Delivery location</Label>
              <Input
                id="co-location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Town or landmark"
                className="rounded-none h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="co-notes">Notes</Label>
              <Textarea
                id="co-notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Rental dates, installation needed, or anything else."
                rows={4}
                className="rounded-none"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-4 text-sm font-bold tracking-[0.15em] uppercase hover:brightness-95 transition"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              Send request
            </button>
          </form>

          <aside className="border border-border bg-card p-6 h-fit border-t-4 border-t-primary">
            <h2 className="font-serif text-2xl font-bold">Your items</h2>
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li key={item.product.id} className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">
                    {item.quantity} × {item.product.name}
                  </span>
                  <span className="font-semibold whitespace-nowrap">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-border flex justify-between font-serif text-xl font-bold">
              <span>Estimated total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Final price confirmed by phone.
            </p>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
