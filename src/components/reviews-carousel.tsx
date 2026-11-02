import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { GOOGLE_PROFILE_URL, REVIEWS, type Review } from "@/data/google-reviews";

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < n ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40"}`} />
      ))}
    </span>
  );
}

function ReviewCard({ r }: { r: Review }) {
  const [open, setOpen] = useState(false);
  const long = r.text.length > 220;
  return (
    <figure
      data-card
      className="flex w-[85%] shrink-0 snap-start flex-col rounded-2xl border border-border bg-card p-6 shadow-sm sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
    >
      <Stars n={r.rating} />
      <blockquote className={`mt-3 whitespace-pre-line text-sm leading-relaxed ${open ? "" : "line-clamp-6"}`}>
        “{r.text}”
      </blockquote>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-2 self-start text-xs font-semibold text-primary hover:underline"
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
      <figcaption className="mt-auto flex items-center gap-3 pt-4 text-sm">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
          {r.author.charAt(0)}
        </span>
        <span>
          <span className="block font-semibold">{r.author}</span>
          <span className="block text-xs text-muted-foreground">Google review · {r.date}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function ReviewsCarousel({ reviews = REVIEWS }: { reviews?: Review[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const move = useCallback((dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = (card?.offsetWidth ?? 320) + 24;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => move(1), 4500);
    return () => clearInterval(t);
  }, [paused, move]);

  if (!reviews.length) return null;

  return (
    <section id="reviews" className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-center font-display text-3xl font-bold">What our customers say</h2>
      <p className="mt-2 text-center text-muted-foreground">Reviews from our Google Business profile</p>

      <div
        className="relative mt-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setTimeout(() => setPaused(false), 8000)}
      >
        <div
          ref={ref}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {reviews.map((r, i) => (
            <ReviewCard key={i} r={r} />
          ))}
        </div>  

        <button
          type="button"
          aria-label="Previous reviews"
          onClick={() => move(-1)}
          className="absolute -left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow md:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Next reviews"
          onClick={() => move(1)}
          className="absolute -right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow md:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <p className="mt-6 text-center">
        <a href={GOOGLE_PROFILE_URL} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary hover:underline">
          Read all reviews on Google
        </a>
      </p>
    </section>
  );
}