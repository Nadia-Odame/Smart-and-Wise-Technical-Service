import { Link } from "react-router-dom";
import { CheckCircle2, Phone } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useBusinessSettings } from "@/hooks/useBusinessSettings";
import heroImage from "@/assets/img3.webp";
import repairImage from "@/assets/img1.webp";

const values = [
  {
    title: "Honest pricing",
    body: "You hear the cost before we open anything. If a repair is not worth it, we say so.",
  },
  {
    title: "Proper workmanship",
    body: "Right parts, right torque, tested before we leave. We stand behind the work we do.",
  },
  {
    title: "We answer the phone",
    body: "Open every day until 8pm. A generator problem does not wait for Monday morning.",
  },
];

const About = () => {
  const { data: business } = useBusinessSettings();

  return (
    <Layout>
      <section className="bg-foreground text-background py-14 sm:py-20">
        <div className="container-full">
          <p className="section-label text-primary">Who we are</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-6xl font-bold">About Us</h1>
          <p className="mt-4 max-w-2xl text-background/75 leading-relaxed">
            {business.name} — serving Owulabu and the surrounding communities with reliable
            generator solutions.
          </p>
        </div>
      </section>

      <section className="container-full py-14 sm:py-20 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="image-reveal border border-border aspect-[4/3]">
          <img
            src={heroImage}
            alt="Our technician at work on a generator"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold border-l-4 border-primary pl-4">
            Our Story
          </h2>
          <div className="mt-5 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Serving Owulabu for years with reliable generator solutions. What started as one
              technician with a toolbox has grown into a small team that homes, shops, churches
              and businesses around the area call when their power lets them down.
            </p>
            <p>
              We service and repair generators of all sizes, handle the electrical work around
              them, and overhaul engines that others would write off. We also sell and rent out
              sets, so if what you need is a machine rather than a repair, we can sort that too.
            </p>
            <p className="text-sm italic">
              (Placeholder history — swap in the real story and dates when you are ready.)
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted py-14 sm:py-20">
        <div className="container-full">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">How we work</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="bg-card border border-border border-t-4 border-t-primary p-6">
                <CheckCircle2 className="w-7 h-7 text-primary" aria-hidden="true" />
                <h3 className="mt-4 font-serif text-xl">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-full py-14 sm:py-20 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">
            Where to find us
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            We are based at {business.address}, and we travel out to customers across the area.
            {" "}
            {business.hours}.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <a
              href={business.phoneHref}
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 text-xs font-bold tracking-[0.15em] uppercase hover:brightness-95 transition"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              {business.phone}
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-foreground px-6 py-3.5 text-xs font-bold tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition"
            >
              Request a quote
            </Link>
          </div>
        </div>
        <div className="image-reveal border border-border aspect-[4/3]">
          <img
            src={repairImage}
            alt="Generator engine repair in the workshop"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </Layout>
  );
};

export default About;
