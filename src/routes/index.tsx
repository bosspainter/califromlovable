import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { sectionsQuery, galleryQuery, type Section } from "@/lib/cms";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Home, Building2, Paintbrush, Leaf, ShieldCheck, Sparkles, Star, Instagram, Droplets, Flame, Award, Phone, Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import heroImg from "@/assets/hero.jpg";
import painterImg from "@/assets/painter.jpg";
import { PaintAdvisor } from "@/components/paint-advisor";
import { ProjectGallery } from "@/components/project-gallery";
import { CompanyBrand, ContactStrip } from "@/components/company-brand";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bay Area Residential & Commercial Painting | Calipro Painting" },
        {
          name: "description",
          content:
            "Friendly, meticulous residential and commercial painting with 15+ years of experience serving Concord, Walnut Creek, Oakland, Berkeley, and cities across the East Bay & North Bay. Interiors, exteriors, gutters, and fireplaces — free quotes, tidy crews, lasting finishes.",
        },
         { property: "og:title", content: "Bay Area Painting — Calipro Painting" },
        {
          property: "og:description",
          content:
            "Residential & commercial painting with 15+ years of experience — serving the entire Bay Area. Free quotes, tidy crews, lasting finishes.",
        },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HousePainter",
        name: "Calipro Painting",
        telephone: "+1-669-666-4552",
        email: "contact@calipropainting.com",
        areaServed: [
          "Concord", "Walnut Creek", "Oakland", "Clayton", "Martinez", "Hercules",
          "Fairfield", "Antioch", "Danville", "San Ramon", "Hayward", "Berkeley",
        ].map((city) => ({ "@type": "City", name: `${city}, CA` }))
          .concat([{ "@type": "Place", name: "San Francisco Bay Area" }]),
        sameAs: ["https://instagram.com/calipro.painting"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Painting and property care services",
          itemListElement: ["Residential Painting", "Commercial Painting", "Colour Consulting", "Gutter Cleaning & Repair", "Chimney & Fireplace Cleaning and Repair"].map(name => ({
            "@type": "Offer", itemOffered: { "@type": "Service", name },
          })),
        },
      }),
    }],
  }),
  loader: async ({ context }) => {
    await Promise.all([context.queryClient.ensureQueryData(sectionsQuery), context.queryClient.ensureQueryData(galleryQuery)]);
  },
  component: Index,
});

const services = [
  {
    icon: Home,
    title: "Residential Painting",
    text: "Interior and exterior painting for homes of every size — careful prep, clean lines, and a finish that feels like new.",
  },
  {
    icon: Building2,
    title: "Commercial Painting",
    text: "Offices, shops, and multi-unit buildings painted on your schedule, with minimal disruption to your business.",
  },
  {
    icon: Paintbrush,
    title: "Colour Consulting",
    text: "Not sure where to start? We help you choose colours and finishes that suit your space, light, and style.",
  },
  {
    icon: Droplets,
    title: "Gutter Cleaning & Repair",
    text: "Clean-outs, leak sealing, and repairs that keep water flowing safely away from your home.",
    href: "/gutter-cleaning" as const,
  },
  {
    icon: Flame,
    title: "Chimney & Fireplace",
    text: "Sweeping, cleaning, and masonry repair so your fireplace burns clean and safe.",
    href: "/chimney-fireplace" as const,
  },
];

const promises = [
  { icon: Leaf, text: "Low-VOC, eco-friendly paint options" },
  { icon: ShieldCheck, text: "Fully licensed and insured crews" },
  { icon: Sparkles, text: "Spotless clean-up, every single day" },
];

function Index() {
  const { data: sections } = useSuspenseQuery(sectionsQuery);
  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      {/* Nav */}
      <ContactStrip />
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-3">
        <CompanyBrand />
        <nav className="flex w-full flex-wrap items-center justify-center gap-4 text-sm font-semibold lg:w-auto lg:justify-end">
          <a href="#services" className="transition-colors hover:text-primary">
            Services
          </a>
          <Link to="/gutter-cleaning" className="transition-colors hover:text-primary">
            Gutters
          </Link>
          <Link to="/chimney-fireplace" className="transition-colors hover:text-primary">
            Chimney
          </Link>
          <Link to="/gallery" className="transition-colors hover:text-primary">
            Gallery
          </Link>
          <Link to="/projects" className="transition-colors hover:text-primary">
            Projects
          </Link>
          <a href="#areas" className="transition-colors hover:text-primary">
            Areas
          </a>
          <a href="#advice" className="transition-colors hover:text-primary">
            Ask an expert
          </a>
          <Button asChild><a href="#contact">Free quote</a></Button>
        </nav>
      </header>

      {/* Hero */}
      <section className="portfolio-opening relative flex items-center justify-center overflow-hidden bg-photo-overlay text-photo-foreground">
        <img src={heroImg} alt="A freshly painted sage green living space" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-photo-overlay/65" />
        <div className="portfolio-opening-content relative mx-auto max-w-4xl px-6 py-14 text-center">
          <p className="mb-5 text-sm font-bold uppercase">Residential &amp; commercial painting · East Bay &amp; North Bay</p>
          <h1 className="text-balance font-display font-bold leading-tight">Calipro Painting</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed">A fresh coat changes everything. Careful prep, honest pricing, and finishes that last.</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-semibold">
            <span className="inline-flex items-center gap-2"><Award className="h-5 w-5" />15+ years experience</span>
            <span className="inline-flex items-center gap-2"><span className="flex">{Array.from({ length: 5 }, (_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</span>5.0 on Google</span>
          </div>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="h-12"><a href="#contact">Request a free quote</a></Button>
            <Button asChild size="lg" variant="secondary" className="h-12"><a href="#projects">View our projects</a></Button>
          </div>
        </div>
      </section>

      {sections.filter((s) => s.visible).map((sec) => <HomeSection key={sec.id} sec={sec} />)}

      {/* Footer */}
      <footer className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row">
        <span className="font-display font-bold text-foreground">
          Calipro Painting
        </span>
        <a href="tel:+16696664552" className="inline-flex items-center gap-2 font-semibold hover:text-primary">
          <Phone className="h-4 w-4" /> 669-666-4552
        </a>
        <a
          href="https://instagram.com/calipro.painting"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-semibold transition-colors hover:text-primary"
        >
          <Instagram className="h-4 w-4" /> @calipro.painting
        </a>
        <span>Serving the East Bay &amp; North Bay — done with care.</span>
        <Link to="/admin" className="text-xs hover:text-primary">Admin</Link>
      </footer>
    </div>
  );
}

function CustomSection({ sec }: { sec: Section & { image: string | null } }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className={sec.image ? "grid items-center gap-12 lg:grid-cols-2" : "mx-auto max-w-3xl text-center"}>
        {sec.image && <img src={sec.image} alt={sec.title} loading="lazy" className="h-auto w-full rounded-lg" />}
        <div>
          <h2 className="text-balance font-display text-4xl font-bold">{sec.title}</h2>
          {sec.subtitle && <p className="mt-4 text-lg text-muted-foreground">{sec.subtitle}</p>}
          {sec.body && <p className="mt-6 whitespace-pre-line leading-relaxed">{sec.body}</p>}
        </div>
      </div>
    </section>
  );
}

function HomeSection({ sec }: { sec: Section & { image: string | null } }) {
  const map: Record<string, () => ReactNode> = {
    before_after: () => <ProjectGallery title={sec.title} subtitle={sec.subtitle} />,
    services: () => (
<section id="services" className="bg-secondary/60 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-balance text-center font-display text-4xl font-bold">
            {sec.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
            {sec.subtitle}
          </p>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {services.map((s) => {
              const card = (
                <>
                  <div className="mb-5 inline-flex rounded-2xl bg-accent/40 p-3.5 text-accent-foreground">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {s.text}
                  </p>
                  {"href" in s && (
                    <span className="mt-4 inline-block text-sm font-bold text-primary">
                      Learn more →
                    </span>
                  )}
                </>
              );
              const cls = "rounded-3xl bg-card p-8 shadow-sm transition-shadow hover:shadow-md";
              return "href" in s ? (
                <Link key={s.title} to={s.href} className={cls}>
                  {card}
                </Link>
              ) : (
                <div key={s.title} className={cls}>
                  {card}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    ),
    about: () => (
<section id="about" className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl">
          <img
            src={painterImg}
            alt="One of our painters rolling a sage green wall"
            width={1200}
            height={912}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-balance font-display text-4xl font-bold">
            {sec.title}
          </h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">{sec.body}</p>
          <ul className="mt-8 space-y-4">
            {promises.map((p) => (
              <li key={p.text} className="flex items-center gap-3 text-sm font-semibold">
                <span className="rounded-full bg-secondary p-2 text-secondary-foreground">
                  <p.icon className="h-4 w-4" />
                </span>
                {p.text}
              </li>
            ))}
          </ul>
        </div>
      </section>
    ),
    areas: () => (
<section id="areas" className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-balance text-center font-display text-4xl font-bold">
          {sec.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">{sec.subtitle}</p>
        <ul className="mt-10 flex flex-wrap justify-center gap-3">
          {["Concord", "Walnut Creek", "Oakland", "Clayton", "Martinez", "Hercules", "Fairfield", "Antioch", "Danville", "San Ramon", "Hayward", "Berkeley"].map((city) => (
            <li
              key={city}
              className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-semibold"
            >
              <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
              {city}
            </li>
          ))}
        </ul>
      </section>
    ),
    advice: () => (
<section id="advice" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-display text-4xl font-bold">{sec.title}</h2>
        <p className="mt-4 mb-10 max-w-2xl text-muted-foreground">{sec.subtitle}</p>
        <PaintAdvisor />
      </section>
    ),
    contact: () => (
<section id="contact" className="bg-secondary/60 py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-balance font-display text-4xl font-bold">
              {sec.title}
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">{sec.subtitle}</p>
            <div className="mt-8 flex flex-col items-start gap-4">
              <a href="tel:+16696664552" className="inline-flex items-center gap-3 text-lg font-bold text-primary hover:underline">
                <Phone className="h-5 w-5" /> 669-666-4552
              </a>
              <a href="mailto:contact@calipropainting.com" className="inline-flex max-w-full items-center gap-3 text-sm font-semibold text-primary hover:underline">
                <Mail className="h-5 w-5 shrink-0" /><span className="break-all">contact@calipropainting.com</span>
              </a>
            </div>
          </div>
          <div className="rounded-3xl bg-card p-8 shadow-sm">
            <ContactForm />
          </div>
        </div>
      </section>
    ),
  };
  const render = sec.key ? map[sec.key] : undefined;
  return render ? <>{render()}</> : <CustomSection sec={sec} />;
}
