import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, type UIMessage } from "ai";
import { createResponsesCall } from "@/lib/ai/responses";

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
        const apiKey = process.env['LOVABLE_API_KEY'];
        if (!apiKey) return new Response("AI is not configured", { status: 500 });
        const { messages } = (await request.json()) as { messages: UIMessage[] };
        const modelMessages = await convertToModelMessages(messages.slice(-30));
        return createResponsesCall(
          request,
          { baseURL: "https://ai.gateway.lovable.dev/v1", apiKey, model: "openai/gpt-6-astra" },
          modelMessages,
          INSTRUCTIONS,
        ).response();
      },
    },
  },
});
