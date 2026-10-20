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
    model: provider(config.model),
    ...(instructions ? { system: instructions } : {}),
    messages,
    abortSignal: request.signal,
  });
  return {
    result,
    response: () => result.toUIMessageStreamResponse(),
  };
}