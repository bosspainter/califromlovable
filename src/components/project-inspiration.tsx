import exteriorPhoto from "@/assets/exterior-reference.jpg.asset.json";
import officePhoto from "@/assets/office-reference.jpg.asset.json";

const references = [
  { title: "Commercial interiors", image: officePhoto.url, alt: "Real photograph of a contemporary office with glass partitions and neutral walls", description: "Neutral walls, defined trim, and a clean professional finish.", source: "https://images.unsplash.com/photo-1497366754035-f200968a6e72" },
  { title: "Exterior finishes", image: exteriorPhoto.url, alt: "Real photograph of a white modern home with dark window frames", description: "Fresh light exteriors paired with contrasting window frames.", source: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9" },
];

export function ProjectInspiration() {
  return (
    <section id="project-inspiration" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-display text-4xl font-bold">Commercial &amp; exterior inspiration</h2>
      <p className="mt-4 max-w-2xl text-muted-foreground">Real photographs for inspiration — not Calipro Painting projects.</p>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {references.map((item) => (
          <figure key={item.title} className="overflow-hidden rounded-lg border border-border bg-card">
            <img src={item.image} alt={item.alt} width={1400} height={935} loading="lazy" className="aspect-[3/2] w-full object-cover" />
            <figcaption className="p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Reference photograph</p>
              <h3 className="mt-2 font-display text-2xl font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              <a href={item.source} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-xs text-primary underline underline-offset-4">Photo source: Unsplash</a>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}