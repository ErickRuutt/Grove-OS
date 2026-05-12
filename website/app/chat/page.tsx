"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = { role: "user" | "assistant"; content: string };

type RateLimitState =
  | { kind: "none" }
  | { kind: "soft"; retryAfterSec: number }
  | { kind: "hard" };

function generateSessionId() {
  return `cs_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function RateLimitOverlay({
  state,
  onDismiss,
}: {
  state: RateLimitState;
  onDismiss: () => void;
}) {
  const [countdown, setCountdown] = useState(
    state.kind === "soft" ? state.retryAfterSec : 0
  );

  useEffect(() => {
    if (state.kind !== "soft" || countdown <= 0) return;
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(t);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [state.kind, countdown]);

  const isSoft = state.kind === "soft";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(4px)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "#111111",
          border: "1px solid #27272a",
          borderRadius: "16px",
          padding: "40px 32px",
          maxWidth: "360px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "36px", marginBottom: "16px" }}>
          {isSoft ? "⏸" : "⚠"}
        </div>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#f0f0f0",
            marginBottom: "12px",
          }}
        >
          {isSoft ? "Taking a breather" : "Access paused"}
        </h2>
        <p style={{ fontSize: "15px", color: "#71717a", lineHeight: "1.65", marginBottom: "28px" }}>
          {isSoft
            ? countdown > 0
              ? `You've sent a lot of messages in a short window. Grove will be ready again in ${countdown} ${countdown === 1 ? "second" : "seconds"}.`
              : "You've sent a lot of messages in a short window. Grove will be ready again shortly."
            : "We've noticed unusual activity on your account. If you think this is a mistake, reach out and we'll sort it out."}
        </p>
        {isSoft && countdown <= 0 ? (
          <button
            onClick={onDismiss}
            style={{
              padding: "12px 28px",
              background: "#22c55e",
              color: "#0a0a0a",
              fontWeight: 600,
              fontSize: "14px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Got it
          </button>
        ) : isSoft ? (
          <button
            disabled
            style={{
              padding: "12px 28px",
              background: "#18181b",
              color: "#52525b",
              fontWeight: 600,
              fontSize: "14px",
              border: "1px solid #27272a",
              borderRadius: "8px",
              cursor: "not-allowed",
            }}
          >
            Got it
          </button>
        ) : (
          <a
            href="mailto:support@grove-os.com"
            style={{
              display: "inline-block",
              padding: "12px 28px",
              background: "#18181b",
              color: "#a1a1aa",
              fontWeight: 600,
              fontSize: "14px",
              border: "1px solid #27272a",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Contact support
          </a>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(generateSessionId);
  const [showTooltip, setShowTooltip] = useState(true);
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({ kind: "none" });
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading || rateLimitState.kind !== "none") return;

    if (showTooltip) setShowTooltip(false);

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, sessionId }),
      });

      if (res.status === 429) {
        const retryAfter = res.headers.get("Retry-After");
        const sec = retryAfter ? parseInt(retryAfter, 10) : 0;
        if (Number.isFinite(sec) && sec > 0) {
          setRateLimitState({ kind: "soft", retryAfterSec: sec });
        } else {
          setRateLimitState({ kind: "hard" });
        }
        setMessages(newMessages);
        return;
      }

      const data = await res.json();
      if (data.message) {
        setMessages([...newMessages, { role: "assistant", content: data.message }]);
      }
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function dismissRateLimit() {
    setRateLimitState({ kind: "none" });
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  const greeting = "Hi, I'm Grove. What would you like to know?";

  return (
    <div
      className="flex flex-col"
      style={{ background: "#0a0a0a", color: "#f0f0f0", height: "100dvh" }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid #1c1c1e",
          background: "rgba(10,10,10,0.95)",
          flexShrink: 0,
        }}
        className="sticky top-0 z-10 backdrop-blur-sm"
      >
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold"
              style={{ background: "#22c55e", color: "#0a0a0a" }}
            >
              G
            </div>
            <span className="font-semibold text-sm">Grove</span>
          </Link>
          <span className="text-xs" style={{ color: "#3f3f46" }}>
            Chat
          </span>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto relative" style={{ minHeight: 0 }}>
        {/* Rate-limit overlay — positioned over the chat area only */}
        {rateLimitState.kind !== "none" && (
          <RateLimitOverlay state={rateLimitState} onDismiss={dismissRateLimit} />
        )}

        <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
          {/* Grove greeting */}
          <div className="flex justify-start">
            <div
              className="max-w-[80%] px-5 py-4 text-sm leading-relaxed"
              style={{
                background: "#111111",
                border: "1px solid #1c1c1e",
                borderRadius: "16px",
                borderBottomLeftRadius: "4px",
                position: "relative",
              }}
            >
              {greeting}
              {showTooltip && messages.length === 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    background: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    fontSize: "12px",
                    color: "#71717a",
                    whiteSpace: "nowrap",
                    zIndex: 10,
                  }}
                >
                  Grove has context about your company. Ask anything.
                </div>
              )}
            </div>
          </div>

          {/* Message thread */}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className="max-w-[80%] px-5 py-4 text-sm leading-relaxed"
                style={
                  msg.role === "user"
                    ? {
                        background: "#22c55e",
                        color: "#0a0a0a",
                        borderRadius: "16px",
                        borderBottomRightRadius: "4px",
                      }
                    : {
                        background: "#111111",
                        border: "1px solid #1c1c1e",
                        borderRadius: "16px",
                        borderBottomLeftRadius: "4px",
                      }
                }
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div
                className="px-5 py-4 text-sm"
                style={{
                  background: "#111111",
                  border: "1px solid #1c1c1e",
                  borderRadius: "16px",
                  borderBottomLeftRadius: "4px",
                }}
              >
                <span className="flex gap-1 items-center" style={{ color: "#3f3f46" }}>
                  <span className="animate-pulse">●</span>
                  <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>●</span>
                  <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>●</span>
                </span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div
        style={{
          borderTop: "1px solid #1c1c1e",
          background: "#0a0a0a",
          flexShrink: 0,
          padding: "16px 24px",
        }}
      >
        <form onSubmit={sendMessage} className="max-w-3xl mx-auto flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Grove anything about your company..."
            disabled={loading || rateLimitState.kind !== "none"}
            className="flex-1 px-4 py-3 text-sm outline-none"
            style={{
              background: "#111111",
              border: "1px solid #1c1c1e",
              borderRadius: "10px",
              color: "#f0f0f0",
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || rateLimitState.kind !== "none"}
            className="px-5 py-3 font-semibold text-sm transition-all disabled:opacity-40"
            style={{
              background: "#22c55e",
              color: "#0a0a0a",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
