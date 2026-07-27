import { Camera, Phone } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useBusinessSettings } from "@/hooks/useBusinessSettings";
import { useGalleryPhotos } from "@/hooks/useGalleryPhotos";

const Gallery = () => {
  const { data: business } = useBusinessSettings();
  const { data: photos = [] } = useGalleryPhotos();

  return (
    <Layout>
      <section className="bg-foreground text-background py-14 sm:py-20">
        <div className="container-full">
          <p className="section-label text-primary">Our work</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-6xl font-bold">Gallery</h1>
          <p className="mt-4 max-w-2xl text-background/75 leading-relaxed">
            A few pictures from jobs we have done. We add new ones as we go.
          </p>
        </div>
      </section>

      <section className="container-full py-14 sm:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, i) => (
            <figure
              key={photo.id}
              className={`group relative image-reveal border border-border bg-muted ${
                i === 0 ? "sm:col-span-2 aspect-[16/10]" : "aspect-[4/3]"
              }`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-foreground/80 text-background px-4 py-3 text-xs font-bold tracking-[0.15em] uppercase">
                {photo.caption}
              </figcaption>
            </figure>
          ))}

          {/* Placeholder slots so the grid still reads well */}
          {[1, 2].map((n) => (
            <div
              key={n}
              className="aspect-[4/3] border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground gap-2"
            >
              <Camera className="w-8 h-8" aria-hidden="true" />
              <p className="text-xs font-bold tracking-[0.15em] uppercase">More photos coming</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-12">
        <div className="container-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Want work like this done for you?
          </h2>
          <a
            href={business.phoneHref}
            className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3.5 text-xs font-bold tracking-[0.15em] uppercase hover:opacity-90 transition"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            {business.phone}
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default Gallery;
