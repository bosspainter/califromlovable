import { createFileRoute } from "@tanstack/react-router";

const LABELS: Record<string, string> = {
  click_phone: "📞 Zəng düyməsinə klik",
  click_email: "✉️ Email linkinə klik",
  click_instagram: "📸 Instagram linkinə klik",
  click_whatsapp: "💬 WhatsApp linkinə klik",
  click_free_quote: "📝 Free quote düyməsinə klik",
};

const lastHit = new Map<string, number>();

const field = (title: string, value: unknown, max: number) => {
  const s = String(value ?? "").trim().slice(0, max);
  return s ? `${title}\n${s}\n\n` : "";
};

export const Route = createFileRoute("/api/notify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = process.env["TELEGRAM_BOT_TOKEN"];
        const chatId = process.env["TELEGRAM_CHAT_ID"];
        if (!token || !chatId) return new Response("not configured", { status: 500 });

        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
        const now = Date.now();
        if (now - (lastHit.get(ip) ?? 0) < 3000) return new Response("slow down", { status: 429 });
        lastHit.set(ip, now);

        const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
        const event = String(body.event);

        let text: string;
        if (event === "form_submit") {
          text = (
            "Hello, CaliPro\n\n" +
            "A new form has been submitted on your website. Details below.\n\n" +
            field("Name", body.name, 80) +
            field("Phone", body.phone, 40) +
            field("Email", body.email, 120) +
            field("Service", body.service, 80) +
            field("Message", body.message, 1000)
          ).trim();
        } else if (LABELS[event]) {
          const lines = [LABELS[event]];
          if (body.place) lines.push(`Yer: ${String(body.place).slice(0, 30)}`);
          text = lines.join("\n");
        } else {
          return new Response("bad event", { status: 400 });
        }

        if (body.dev) text = `🧪 TEST (lokal)\n${text}`;

        const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text }),
        });
        return new Response(null, { status: r.ok ? 204 : 502 });
      },
    },
  },
});