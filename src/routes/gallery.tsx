import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { galleryQuery } from "@/lib/cms";
import { GalleryGrid } from "@/components/project-gallery";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Painting Project Gallery | Calipro Painting" },
      { name: "description", content: "Photos of Calipro Painting's interior, exterior, and before-and-after painting work across the East Bay & North Bay." },
      { property: "og:title", content: "Project Gallery — Calipro Painting" },
      { property: "og:description", content: "Real Calipro Painting work: interiors, exteriors, and before & after transformations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(galleryQuery),
  component: GalleryPage,
});

const tabs = [
  { id: "all", label: "All work" },
  { id: "general", label: "Our work" },
  { id: "before_after", label: "Before & after" },
] as const;

function GalleryPage() {
  const { data } = useSuspenseQuery(galleryQuery);
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("all");
  const items = tab === "all" ? data : data.filter((g) => g.category === tab);
  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-14">
        <h1 className="text-center font-display text-4xl font-bold">Gallery</h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">Our painting work and before &amp; after transformations.</p>
        <div className="my-10 flex flex-wrap justify-center gap-2">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`rounded-full border px-4 py-2 text-sm font-semibold ${tab === t.id ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary"}`}>
              {t.label}
            </button>
          ))}
        </div>
        {items.length ? <GalleryGrid items={items} /> : <p className="text-center text-muted-foreground">No photos here yet.</p>}
      </main>
    </div>
  );
}
