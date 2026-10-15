import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { galleryQuery } from "@/lib/cms";

export function GalleryGrid({ items }: { items: { id: string; src: string; caption: string; description: string }[] }) {
  return (
    <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
      {items.map((item) => (
        <figure key={item.id} className="mb-8 break-inside-avoid">
          <img src={item.src} alt={`Calipro Painting project: ${item.caption || "painting work"}`} loading="lazy" className="h-auto w-full" />
          {(item.caption || item.description) && (
            <figcaption className="border-b border-border py-5">
              {item.caption && <h3 className="font-display text-lg font-bold">{item.caption}</h3>}
              {item.description && <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

export function ProjectGallery({ title, subtitle }: { title: string; subtitle: string }) {
  const { data } = useSuspenseQuery(galleryQuery);
  const items = data.filter((g) => g.category === "before_after");
  return (
    <section id="projects" className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">{title}</h2>
        {subtitle && <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">{subtitle}</p>}
        <div className="mt-12">
          <GalleryGrid items={items} />
        </div>
        <div className="text-center">
          <Link to="/gallery" className="font-bold text-primary hover:underline">See the full gallery →</Link>
        </div>
      </div>
    </section>
  );
}
