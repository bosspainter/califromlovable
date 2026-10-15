import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Droplets, Wrench, ShieldCheck } from "lucide-react";
import gutterImg from "@/assets/gutter.jpg";
import { CompanyBrand, ContactStrip } from "@/components/company-brand";

export const Route = createFileRoute("/gutter-cleaning")({
  head: () => ({
    meta: [
      { title: "Bay Area Gutter Cleaning & Repair | Calipro Painting" },
      {
        name: "description",
        content:
          "East Bay & North Bay gutter cleaning and repair from Calipro Painting — serving Concord, Walnut Creek, Oakland, and nearby cities. Clear debris, fix leaks and sagging sections, and protect your home. Call 669-666-4552 for a free quote.",
      },
      { property: "og:title", content: "Gutter Cleaning & Repair — Calipro Painting" },
      {
        property: "og:description",
        content:
          "Professional gutter cleaning and repair — clear debris, fix leaks, protect your home from water damage.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/gutter-cleaning" },
    ],
    links: [{ rel: "canonical", href: "/gutter-cleaning" }],
  }),
  component: GutterPage,
});

const included = [
  "Full gutter and downspout clean-out",
  "Leak sealing and joint repair",
  "Re-securing loose or sagging sections",
  "Downspout flushing and flow test",
  "Minor bracket and fascia fixes",
  "Debris hauled away — no mess left behind",
];

const why = [
  { icon: Droplets, text: "Prevent water damage to walls, foundations, and landscaping" },
  { icon: Wrench, text: "Small repairs done on the spot, before they become big ones" },
  { icon: ShieldCheck, text: "Fully insured crew, safe ladder work, every time" },
];

function GutterPage() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <ContactStrip />
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <CompanyBrand />
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-8 lg:grid-cols-2">
        <div>
          <p className="mb-4 inline-block rounded-full bg-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-secondary-foreground">
            Gutters
          </p>
          <h1 className="text-balance font-display text-5xl font-bold leading-tight">
            Gutter cleaning &amp; repair
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            Clogged or leaking gutters quietly damage your home. We clean them
            out, fix what's broken, and make sure water goes where it should —
            away from your house.
          </p>
          <div className="mt-8">
            <Link
              to="/"
              hash="contact"
              className="rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Request a free quote
            </Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl">
          <img
            src={gutterImg}
            alt="A Calipro crew member cleaning gutters on a two-story home"
            width={1200}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="bg-secondary/60 py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold">What's included</h2>
            <ul className="mt-8 space-y-4">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-semibold">
                  <span className="mt-0.5 rounded-full bg-primary/15 p-1.5 text-primary">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold">Why it matters</h2>
            <ul className="mt-8 space-y-6">
              {why.map((w) => (
                <li key={w.text} className="flex items-start gap-4">
                  <span className="rounded-2xl bg-accent/40 p-3 text-accent-foreground">
                    <w.icon className="h-5 w-5" />
                  </span>
                  <p className="pt-2 text-sm leading-relaxed text-muted-foreground">{w.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="text-balance font-display text-3xl font-bold">
          Ready to get your gutters sorted?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Send us a message and we'll come take a look — free quote, no pressure.
        </p>
        <Link
          to="/"
          hash="contact"
          className="mt-8 inline-block rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Contact us
        </Link>
      </section>
    </div>
  );
}
