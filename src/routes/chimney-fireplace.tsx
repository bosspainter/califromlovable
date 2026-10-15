import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Flame, Brush, ShieldCheck } from "lucide-react";
import chimneyImg from "@/assets/chimney.jpg";
import { CompanyBrand, ContactStrip } from "@/components/company-brand";

export const Route = createFileRoute("/chimney-fireplace")({
  head: () => ({
    meta: [
      { title: "Bay Area Chimney & Fireplace Cleaning | Calipro Painting" },
      {
        name: "description",
        content:
          "East Bay & North Bay chimney and fireplace cleaning and repair from Calipro Painting — serving Concord, Walnut Creek, Oakland, and nearby cities. Sweeping, masonry repairs, and safety checks. Call 669-666-4552 for a free quote.",
      },
      { property: "og:title", content: "Chimney & Fireplace Repair and Cleaning — Calipro Painting" },
      {
        property: "og:description",
        content:
          "Chimney sweeping, fireplace cleaning, and masonry repair — burn clean and safe all season.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/chimney-fireplace" },
    ],
    links: [{ rel: "canonical", href: "/chimney-fireplace" }],
  }),
  component: ChimneyPage,
});

const included = [
  "Full chimney sweep and creosote removal",
  "Fireplace and firebox deep cleaning",
  "Brick and mortar repointing",
  "Crown and cap repair",
  "Smoke and draft check",
  "Honest condition report with photos",
];

const why = [
  { icon: Flame, text: "A clean chimney burns better and drastically lowers fire risk" },
  { icon: Brush, text: "Soot and creosote removed properly, not just brushed around" },
  { icon: ShieldCheck, text: "Fully insured crew with careful, dust-controlled work indoors" },
];

function ChimneyPage() {
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
            Chimney &amp; Fireplace
          </p>
          <h1 className="text-balance font-display text-5xl font-bold leading-tight">
            Chimney &amp; fireplace repair and cleaning
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            A fireplace should be the coziest part of your home — not a worry.
            We sweep, clean, and repair chimneys and fireplaces so they burn
            clean, draw well, and stay safe.
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
            src={chimneyImg}
            alt="A clean, freshly repaired brick fireplace in a cozy living room"
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
          Book a sweep before the cold sets in
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Send us a message and we'll schedule a visit — free quote, no pressure.
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
