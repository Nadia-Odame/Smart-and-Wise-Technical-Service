import { Link } from "react-router-dom";
import { CheckCircle2, Phone } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useBusinessSettings } from "@/hooks/useBusinessSettings";
import heroImage from "@/assets/img3.webp";
import repairImage from "@/assets/img1.webp";

const values = [
  {
    title: "Integrity",
    body: "We conduct our business with honesty, transparency, and accountability, building trust through every service we provide.",
  },
  {
    title: "Excellence",
    body: "We are committed to delivering high-quality workmanship and technical solutions that consistently exceed customer expectations.",
  },
  {
    title: "Reliability",
    body: "Our customers depend on us to keep their power systems running, and we take that responsibility seriously by delivering dependable services they can count on.",
  },
  {
    title: "Customer Commitment",
    body: "We put our customers first by understanding their needs, responding promptly, and providing personalized solutions with exceptional service.",
  },
  {
    title: "Innovation",
    body: "We embrace continuous learning, modern technology, and improved practices to provide efficient and effective power solutions.",
  },
  {
    title: "Safety",
    body: "Safety is at the heart of everything we do. We follow industry best practices to protect our team, our customers, and every project we undertake.",
  },
  {
    title: "Professionalism",
    body: "We uphold the highest standards of professionalism through respect, technical expertise, and a commitment to delivering every project with care and precision.",
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
            {business.name} is a Ghanaian generator and electrical service company dedicated to 
            providing reliable power solutions for homes, businesses, and organizations.
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
              Founded with a passion for solving power challenges, Smart & Wise Technical Service
              Limited has grown into a trusted technical partner for customers who depend on 
              reliable electricity. Over the years, we have built our reputation through quality 
              workmanship, professional service, and a commitment to keeping our clients' power 
              systems running efficiently.
            </p>
            <p>
              Our experienced technicians handle generator maintenance, troubleshooting, repairs, 
              and complete engine overhauls for different types and sizes of generators. 
              Beyond repairs, we also provide electrical services and support customers who 
              require generator solutions for their homes, shops, churches, and businesses.
            </p>
            <p>
              At Smart & Wise, we understand that power interruptions can affect daily operations. 
              That is why we focus on delivering dependable solutions that reduce downtime and give 
              our customers confidence in their power systems.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted py-14 sm:py-20">
        <div className="container-full grid gap-10 lg:grid-cols-2">
          <div className="border-l-4 border-primary pl-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">Our Mission</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              To deliver reliable power solutions through exceptional technical expertise,
              quality workmanship, and customer-focused service, ensuring homes, businesses, and
              industries can operate with confidence and uninterrupted productivity.
            </p>
          </div>
          <div className="border-l-4 border-primary pl-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">Our Vision</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              To become the most trusted name in generator and technical services across Ghana
              by setting the standard for quality, reliability, and customer satisfaction.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="container-full">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">Our Core Values</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
            Based at {business.address}, we proudly serve clients across the country. 
            We are committed to delivering dependable service, building lasting relationships, 
            and providing solutions that our customers can trust.
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
