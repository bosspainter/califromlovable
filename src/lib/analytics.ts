declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  if (import.meta.env.DEV) {
    console.log("[track]", name, params);
    return;
  }
  window.gtag?.("event", name, params);
}

export function initClickTracking() {
  const onClick = (e: MouseEvent) => {
    const el = (e.target as HTMLElement).closest("a,button") as HTMLElement | null;
    if (!el) return;
    const href = el.getAttribute("href") ?? "";
    const place = el.closest("footer")
      ? "footer"
      : el.closest("header, nav")
        ? "nav"
        : el.closest("#contact")
          ? "contact"
          : "page";
    if (href.startsWith("tel:")) track("click_phone", { place });
    else if (href.includes("instagram.com")) track("click_instagram", { place });
    else if (href.startsWith("mailto:")) track("click_email", { place });
    else if (href.includes("wa.me") || href.includes("whatsapp")) track("click_whatsapp", { place });
    else if (/free quote/i.test(el.textContent ?? "")) track("click_free_quote", { place });
  };
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}