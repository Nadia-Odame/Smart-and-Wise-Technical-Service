import { useState } from "react";
import { Clock, MapPin, Phone, Send } from "lucide-react";
import { Layout } from "@/components/Layout";
import { business, services } from "@/data/business";
import { openWhatsApp, submitToFormspree } from "@/lib/notify";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const serviceOptions = [
  ...services.map((s) => s.name),
  "Generator Purchase",
  "Generator Rental",
  "Parts & Accessories",
  "Something else",
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", phone: "", service: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.service) {
      toast({
        title: "Please fill the required fields",
        description: "We need your name, phone number and the service you need.",
        variant: "destructive",
      });
      return;
    }

    const whatsappMessage = [
      "New quote request from the website",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Service: ${form.service}`,
      form.message ? `Message: ${form.message}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    openWhatsApp(business.whatsapp, whatsappMessage);
    void submitToFormspree({
      _subject: "New quote request — Smart and Wise website",
      name: form.name,
      phone: form.phone,
      service: form.service,
      message: form.message,
    });

    toast({
      title: "Thank you, we have your request",
      description: `We will call you on ${form.phone}. For anything urgent, call ${business.phone}.`,
    });
    setForm({ name: "", phone: "", service: "", message: "" });
  };

  return (
    <Layout>
      <section className="bg-foreground text-background py-14 sm:py-20">
        <div className="container-full">
          <p className="section-label text-primary">Get in touch</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-6xl font-bold">Contact Us</h1>
          <p className="mt-4 max-w-2xl text-background/75 leading-relaxed">
            Call us for anything urgent. Otherwise send a quote request and we will get back to you.
          </p>
        </div>
      </section>

      <section className="container-full py-14 sm:py-20 grid gap-10 lg:grid-cols-2">
        {/* Details */}
        <div>
          <h2 className="font-serif text-3xl font-bold border-l-4 border-primary pl-4">
            Our Details
          </h2>

          <ul className="mt-6 space-y-4">
            <li>
              <a
                href={business.phoneHref}
                className="flex items-start gap-4 border border-border bg-card p-5 hover-lift"
              >
                <Phone className="w-6 h-6 text-primary shrink-0" aria-hidden="true" />
                <span>
                  <span className="block text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                    Phone — tap to call
                  </span>
                  <span className="block font-serif text-2xl font-bold">{business.phone}</span>
                </span>
              </a>
            </li>
            <li className="flex items-start gap-4 border border-border bg-card p-5">
              <MapPin className="w-6 h-6 text-primary shrink-0" aria-hidden="true" />
              <span>
                <span className="block text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                  Address
                </span>
                <span className="block text-lg">{business.address}</span>
              </span>
            </li>
            <li className="flex items-start gap-4 border border-border bg-card p-5">
              <Clock className="w-6 h-6 text-primary shrink-0" aria-hidden="true" />
              <span>
                <span className="block text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                  Opening hours
                </span>
                <span className="block text-lg">{business.hours}</span>
              </span>
            </li>
          </ul>

          <div className="mt-8 border border-border overflow-hidden">
            <iframe
              title={`Map showing ${business.address}`}
              src={`https://www.google.com/maps?q=${business.mapQuery}&output=embed`}
              className="w-full h-72 border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        {/* Form */}
        <div>
          <h2 className="font-serif text-3xl font-bold border-l-4 border-primary pl-4">
            Request a Quote
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Fill this in and we will call you back.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5 border border-border bg-card p-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Kwame Mensah"
                className="rounded-none h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone number *</Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="e.g. 024 000 0000"
                className="rounded-none h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Service needed *</Label>
              <Select
                value={form.service}
                onValueChange={(value) => setForm({ ...form, service: value })}
              >
                <SelectTrigger id="service" className="rounded-none h-12">
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  {serviceOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us what the generator is doing, the size, and where you are."
                rows={5}
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

            <p className="text-xs text-muted-foreground text-center">
              In a hurry?{" "}
              <a href={business.phoneHref} className="font-semibold text-foreground underline">
                Call {business.phone}
              </a>
            </p>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
