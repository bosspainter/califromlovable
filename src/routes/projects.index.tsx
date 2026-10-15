import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { postsQuery } from "@/lib/cms";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Recent Painting Projects | Calipro Painting" },
      { name: "description", content: "Stories and photos from Calipro Painting's recent residential and commercial painting projects." },
      { property: "og:title", content: "Recent Projects — Calipro Painting" },
      { property: "og:description", content: "See what we've been painting lately across the East Bay & North Bay." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { data } = useSuspenseQuery(postsQuery);
  const posts = data.filter((p) => p.published);
  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-14">
        <h1 className="font-display text-4xl font-bold">Recent projects</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">A closer look at jobs we've finished.</p>
        {posts.length === 0 && <p className="mt-10 text-muted-foreground">New project posts are coming soon.</p>}
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.id} to="/projects/$slug" params={{ slug: p.slug }} className="group block overflow-hidden rounded-lg border bg-card">
              {p.cover && <img src={p.cover} alt={p.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />}
              <div className="p-5">
                <h2 className="font-display text-lg font-bold group-hover:text-primary">{p.title}</h2>
                {p.excerpt && <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
