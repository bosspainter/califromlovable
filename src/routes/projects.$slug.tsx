import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { postsQuery } from "@/lib/cms";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ context, params }) => {
    const posts = await context.queryClient.ensureQueryData(postsQuery);
    const post = posts.find((p) => p.slug === params.slug && p.published);
    if (!post) throw notFound();
    return { title: post.title, excerpt: post.excerpt };
  },
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} | Calipro Painting` },
          { name: "description", content: loaderData.excerpt || `${loaderData.title} — a Calipro Painting project.` },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.excerpt || "A Calipro Painting project." },
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Project not found | Calipro Painting" }, { name: "robots", content: "noindex" }],
    links: [{ rel: "canonical", href: `/projects/${params.slug}` }],
  }),
  notFoundComponent: () => (
    <div className="p-16 text-center">
      <p>This project could not be found.</p>
      <Link to="/projects" className="font-bold text-primary">All projects</Link>
    </div>
  ),
  component: PostPage,
});

function PostPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(postsQuery);
  const post = data.find((p) => p.slug === slug)!;
  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-6 py-14">
        <Link to="/projects" className="text-sm font-semibold text-primary">← All projects</Link>
        <h1 className="mt-4 font-display text-4xl font-bold">{post.title}</h1>
        {post.cover && <img src={post.cover} alt={post.title} className="mt-8 h-auto w-full rounded-lg" />}
        <div className="mt-8 whitespace-pre-line leading-relaxed">{post.body}</div>
      </article>
    </div>
  );
}
