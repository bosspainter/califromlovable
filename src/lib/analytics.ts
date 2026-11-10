declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const NOTIFY = new Set([
  "click_phone",
  "click_email",
  "click_instagram",
  "click_whatsapp",
  "click_free_quote",
  "form_submit",
]);
const COOLDOWN = 30 * 60 * 1000; // eyni ziyarətçi, eyni klik növü: 30 dəqiqədə 1 bildiriş

function notify(name: string, data: Record<string, unknown>) {
  if (!NOTIFY.has(name)) return;
  try {
    if (name !== "form_submit") {
      const key = `notify:${name}`;
      const last = Number(localStorage.getItem(key) ?? 0);
      if (Date.now() - last < COOLDOWN) return;
      localStorage.setItem(key, String(Date.now()));
    }
  } catch {
    // localStorage bloklanıbsa, yenə göndər
  }
  fetch("/api/notify", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ event: name, dev: import.meta.env.DEV, ...data }),
    keepalive: true,
  }).catch(() => {});
}

export function track(
  name: string,
  params: Record<string, unknown> = {},
  extra: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") return;
  notify(name, { ...params, ...extra });
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
    else if (href.includes("#contact")) track("click_free_quote", { place });
  };
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}