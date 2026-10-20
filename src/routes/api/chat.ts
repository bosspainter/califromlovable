import "dotenv/config";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, type UIMessage } from "ai";
import { createResponsesCall } from "@/lib/ai/responses";

const hits = new Map<string, number[]>();
const LIMIT = 10;
const WINDOW =60 * 60 * 1000; // 1 minute

function isLimited(ip: string) {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  if (arr.length >= LIMIT) {
    hits.set(ip, arr);
    return true;
  }
  arr.push(now);
  hits.set(ip, arr);
  return false;
}

const INSTRUCTIONS = `You are the friendly paint advisor for Calipro Painting, a residential and commercial painting company.
Help visitors choose paint colours, finishes and sheens for exteriors, interiors, kitchen cabinets, offices and more.
Give practical, specific suggestions (name colour families and popular example shades, explain sheen choices, prep tips).
Keep answers short: under 150 words, using brief bullet points when helpful.
When relevant, gently suggest requesting a free quote from Calipro Painting using the form on this page.
Only answer questions about painting, colours, finishes and home/business improvement.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        console.log("chat start; key present:", Boolean(process.env["GOOGLE_GENERATIVE_AI_API_KEY"]));
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
        if (isLimited(ip)) return new Response("Too many questions. Please try again later.", { status: 429 });
        const apiKey = process.env['GOOGLE_GENERATIVE_AI_API_KEY'];
        if (!apiKey) return new Response("AI is not configured", { status: 500 });
        const { messages } = (await request.json()) as { messages: UIMessage[] };
        const modelMessages = await convertToModelMessages(messages.slice(-6));
        return createResponsesCall(
          request,
          { baseURL: "", apiKey, model: "gemini-3.5-flash-lite" },
          modelMessages,
          INSTRUCTIONS,
        ).response();
      },
    },
  },
});
