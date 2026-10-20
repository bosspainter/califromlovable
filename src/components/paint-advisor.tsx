import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import { Paintbrush, Plus, SendHorizontal, MessageSquare } from "lucide-react";

const MAX_PER_CHAT = 5;
const MAX_CHATS = 3;
const MAX_TOTAL = 10;
const WINDOW = 60 * 60 * 1000; // 1 hour

function canASK(){
  try {
    const now = Date.now();
    const arr: number[] = JSON.parse(localStorage.getItem("pa_hits") ?? "[]").filter((t: number) => now - t < WINDOW);
    if (arr.length >= MAX_TOTAL) {
      localStorage.setItem("pa_hits", JSON.stringify(arr));
      return false;
    }
    arr.push(now);
    localStorage.setItem("pa_hits", JSON.stringify(arr));
    return true;
  } catch (e) {
    return true; // Allow asking if there's an error
  }
}

const SUGGESTIONS = [
  "What colour is best for my house exterior?",
  "Which paint finish is best for kitchen cabinets?",
  "What colours make a small room feel bigger?",
  "Best colours for a modern office?",
];

type Thread = { id: string; title: string };

function ChatWindow({ id, onFirstMessage }: { id: string; onFirstMessage: (t: string) => void }) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status, error } = useChat({
    id,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const busy = status === "submitted" || status === "streaming";
  const [bloacked, setBlocked] = useState(false);
  const userCount = messages.filter((m) => m.role === "user").length;
  const limitReached = userCount >= MAX_PER_CHAT || bloacked;

  useEffect(() => {
    const container = messagesRef.current;
    if (messages.length === 0 || !container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages, status]);
  useEffect(() => {
    if (messages.length > 0 && !busy) inputRef.current?.focus({ preventScroll: true });
  }, [busy, messages.length]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || busy || limitReached) return;
    if(!canASK()){
      setBlocked(true);
      return;
    }
    if (messages.length === 0) onFirstMessage(t);
    sendMessage({ text: t });
    setInput("");
  };

  return (
    <div className="flex h-[520px] flex-col">
      <div ref={messagesRef} className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-muted-foreground">Ask anything about colours, finishes or prep. Try:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-sm hover:bg-secondary"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex gap-3"}>
            {m.role === "assistant" && (
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Paintbrush className="h-4 w-4" />
              </div>
            )}
            <div
              className={
                m.role === "user"
                  ? "max-w-[80%] rounded-2xl bg-primary px-4 py-2 text-primary-foreground"
                  : "prose prose-sm max-w-none text-foreground"
              }
            >
              {m.parts.map((p, i) =>
                p.type === "text" ? (
                  m.role === "user" ? <span key={i}>{p.text}</span> : <ReactMarkdown key={i}>{p.text}</ReactMarkdown>
                ) : null,
              )}
            </div>
          </div>
        ))}
        {status === "submitted" && <p className="text-sm text-muted-foreground">Mixing up an answer…</p>}
        {error && <p className="text-sm text-destructive">Sorry, something went wrong. Please try again.</p>}
      {
        limitReached && (
          <p className="text-sm text-muted-foreground">
            Questions limit reached. Please start a new chat or try again later.
          </p>
        )
      }
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-end gap-2 border-t border-border p-3"
      >
        <textarea
          ref={inputRef}
          value={input}
          disabled={limitReached}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          rows={1}
          placeholder="e.g. What colour should I paint my front door?"
          className="flex-1 resize-none rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          disabled={busy || limitReached || !input.trim()}
          aria-label="Send"
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
        >
          <SendHorizontal className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}

export function PaintAdvisor() {
  const [threads, setThreads] = useState<Thread[]>([{ id: "chat-1", title: "New chat" }]);
  const [active, setActive] = useState("chat-1");
  const [counter, setCounter] = useState(1);

  const newChat = () => {
    if (threads.length >= MAX_CHATS) return;
    const id = `chat-${counter + 1}`;
    setCounter((c) => c + 1);
    setThreads((t) => [{ id, title: "New chat" }, ...t]);
    setActive(id);
  };

  return (
    <div className="grid overflow-hidden rounded-3xl border border-border bg-card shadow-sm md:grid-cols-[220px_1fr]">
      <aside className="border-b border-border bg-secondary/50 p-3 md:border-b-0 md:border-r">
        <button
          onClick={newChat}
          disabled={threads.length >= MAX_CHATS}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> New question
        </button>
        <div className="flex gap-2 overflow-x-auto md:flex-col">
          {threads.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex items-center gap-2 truncate rounded-lg px-3 py-2 text-left text-sm ${
                t.id === active ? "bg-background font-semibold" : "hover:bg-background/60"
              }`}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span className="truncate">{t.title}</span>
            </button>
          ))}
        </div>
      </aside>
      {threads.map((t) => (
        <div key={t.id} className={t.id === active ? "block" : "hidden"}>
          <ChatWindow
            id={t.id}
            onFirstMessage={(title) =>
              setThreads((ts) => ts.map((x) => (x.id === t.id ? { ...x, title: title.slice(0, 40) } : x)))
            }
          />
        </div>
      ))}
    </div>
  );
}
