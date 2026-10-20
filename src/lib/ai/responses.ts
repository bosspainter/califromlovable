import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, type ModelMessage } from "ai";

export function createResponsesCall(
  request: Request,
  config: { baseURL: string; apiKey: string; model: string },
  messages: ModelMessage[],
  instructions?: string,
) {
  const provider = createGoogleGenerativeAI({ apiKey: config.apiKey });
  const result = streamText({
    onError: ({ error }) => console.error("AI ERROR:", error),
    model: provider(config.model),
    ...(instructions ? { system: instructions } : {}),
    messages,
abortSignal: AbortSignal.any([request.signal, AbortSignal.timeout(45000)]),
  });
  return {
    result,
response: () =>
  result.toUIMessageStreamResponse({
    onError: (e) => (e instanceof Error ? e.message : String(e)),
  }),
  };
}