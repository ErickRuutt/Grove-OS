"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type Message = { role: "user" | "assistant"; content: string };

type FileSignal = {
  fileName: string;
  mimeType: string;
  uploadedAt: string;
  entities?: string[];
  keyFacts?: string[];
  relationships?: string[];
  dates?: string[];
  decisions?: string[];
};

type UploadedFile = {
  id: string;
  name: string;
  status: "analyzing" | "done" | "error";
  signal?: FileSignal;
  error?: string;
};

type BrainSource = {
  label: string;
  type: "interview" | "file";
  contribution: string;
};

type BrainSummary = {
  companyName?: string;
  whatTheyDo?: string;
  whoTheyServe?: string;
  keyProcesses?: string[];
  keyTools?: string[];
  howDecisionsAreMade?: string;
  informalKnowledge?: string[];
  whatMakesThemDifferent?: string;
  openQuestions?: string[];
  sources?: BrainSource[];
};

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

const ACCEPTED_TYPES = ".txt,.md,.json,.csv,.pdf";
const MAX_FILES = 5;

export default function InterviewPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => generateSessionId());
  const [summary, setSummary] = useState<BrainSummary | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [started, setStarted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteContent, setPasteContent] = useState("");
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function startInterview() {
    setStarted(true);
    setLoading(true);
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [], sessionId }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages([{ role: "assistant", content: data.message }]);
      }
    } catch {
      setMessages([
        {
          role: "assistant",
          content: "Sorry, I had trouble connecting. Please refresh and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, sessionId }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages([...newMessages, { role: "assistant", content: data.message }]);
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleExport() {
    setExportLoading(true);
    setExportError("");
    try {
      const res = await fetch("/api/interview/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Export failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `grove-brain-${sessionId}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExportLoading(false);
    }
  }

  async function generateSummary() {
    setSummarizing(true);
    setShowSummary(true);
    try {
      const res = await fetch("/api/interview/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, messages }),
      });
      const data = await res.json();
      setSummary(data.summary);
    } catch {
      setSummary({ companyName: "Error generating summary" });
    } finally {
      setSummarizing(false);
    }
  }

  async function uploadFile(file: File) {
    if (uploadedFiles.length >= MAX_FILES) return;

    const id = `file_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setUploadedFiles((prev) => [...prev, { id, name: file.name, status: "analyzing" }]);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sessionId", sessionId);

    try {
      const res = await fetch("/api/interview/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "done", signal: data.signal } : f))
      );
    } catch (err) {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, status: "error", error: err instanceof Error ? err.message : "Upload failed" }
            : f
        )
      );
    }
  }

  async function submitPaste() {
    if (!pasteContent.trim()) return;
    setPasteMode(false);

    const id = `paste_${Date.now()}`;
    const name = `pasted-text-${new Date().toLocaleTimeString()}.txt`;
    setUploadedFiles((prev) => [...prev, { id, name, status: "analyzing" }]);

    const formData = new FormData();
    formData.append("pasteText", pasteContent);
    formData.append("sessionId", sessionId);
    setPasteContent("");

    try {
      const res = await fetch("/api/interview/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, name: data.signal.fileName, status: "done", signal: data.signal } : f))
      );
    } catch (err) {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, status: "error", error: err instanceof Error ? err.message : "Upload failed" }
            : f
        )
      );
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.slice(0, MAX_FILES - uploadedFiles.length).forEach(uploadFile);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    files.slice(0, MAX_FILES - uploadedFiles.length).forEach(uploadFile);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeFile(id: string) {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  }

  const canSummarize = messages.filter((m) => m.role === "user").length >= 3;
  const analyzingCount = uploadedFiles.filter((f) => f.status === "analyzing").length;
  const doneCount = uploadedFiles.filter((f) => f.status === "done").length;

  return (
    <div
      style={{ background: "#0a0a0a", color: "#f0f0f0" }}
      className="min-h-screen flex flex-col"
    >
      {/* Header */}
      <header
        style={{ borderBottom: "1px solid #27272a", background: "rgba(10,10,10,0.9)" }}
        className="sticky top-0 z-50 backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold"
              style={{ background: "#22c55e", color: "#0a0a0a" }}
            >
              G
            </div>
            <span className="font-semibold">Grove</span>
          </Link>
          <div className="flex items-center gap-3">
            {started && uploadedFiles.length < MAX_FILES && (
              <button
                onClick={() => setShowUpload((v) => !v)}
                className="text-sm px-3 py-2 rounded-lg font-medium transition-all hover:opacity-90 flex items-center gap-1.5"
                style={{
                  border: "1px solid #27272a",
                  color: doneCount > 0 ? "#22c55e" : "#71717a",
                  background: "#111111",
                }}
              >
                <span>+</span>
                <span>
                  {doneCount > 0 ? `${doneCount} file${doneCount > 1 ? "s" : ""} loaded` : "Load data"}
                </span>
              </button>
            )}
            {canSummarize && !showSummary && (
              <button
                onClick={generateSummary}
                className="text-sm px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
                style={{
                  border: "1px solid rgba(34, 197, 94, 0.4)",
                  color: "#22c55e",
                  background: "rgba(34, 197, 94, 0.05)",
                }}
              >
                See your brain →
              </button>
            )}
            <span className="text-xs" style={{ color: "#71717a" }}>
              First-pass interview
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full px-4 py-6 gap-6">
        {/* Left column: chat + upload zone */}
        <div className="flex-1 flex flex-col min-h-0 gap-4">
          {!started ? (
            /* Landing state */
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <div className="text-5xl mb-6">🧠</div>
              <h1 className="text-3xl font-bold mb-4">
                Build your company brain
              </h1>
              <p
                className="text-lg max-w-md mb-8 leading-relaxed"
                style={{ color: "#71717a" }}
              >
                I&apos;ll interview you about how your company actually works —
                the decisions, the tools, the informal knowledge — and turn it
                into a structured brain your AI agents can use.
              </p>
              <div
                className="text-sm mb-8 p-4 rounded-xl max-w-sm w-full text-left space-y-2"
                style={{
                  background: "#111111",
                  border: "1px solid #27272a",
                }}
              >
                <p className="font-medium mb-3">What to expect:</p>
                {[
                  "6–8 focused questions",
                  "~15 minutes total",
                  "Upload docs to enrich the brain",
                  "A structured snapshot your agents can use",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span style={{ color: "#22c55e" }}>✓</span>
                    <span style={{ color: "#71717a" }}>{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={startInterview}
                className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:opacity-90"
                style={{ background: "#22c55e", color: "#0a0a0a" }}
              >
                Start the interview
              </button>
            </div>
          ) : (
            <>
              {/* Chat */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"
                        }`}
                        style={
                          msg.role === "user"
                            ? { background: "#22c55e", color: "#0a0a0a" }
                            : { background: "#18181b", border: "1px solid #27272a" }
                        }
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div
                        className="px-4 py-3 rounded-2xl rounded-bl-sm text-sm"
                        style={{ background: "#18181b", border: "1px solid #27272a" }}
                      >
                        <span className="flex gap-1 items-center" style={{ color: "#71717a" }}>
                          <span className="animate-pulse">●</span>
                          <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>●</span>
                          <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>●</span>
                        </span>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                <form
                  onSubmit={sendMessage}
                  className="flex gap-3 pt-4"
                  style={{ borderTop: "1px solid #27272a" }}
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your answer..."
                    disabled={loading}
                    className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: "#111111",
                      border: "1px solid #27272a",
                      color: "#f0f0f0",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="px-5 py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-40"
                    style={{ background: "#22c55e", color: "#0a0a0a" }}
                  >
                    Send
                  </button>
                </form>

                {canSummarize && !showSummary && (
                  <div className="pt-3 text-center">
                    <button
                      onClick={generateSummary}
                      className="text-xs underline transition-opacity hover:opacity-70"
                      style={{ color: "#22c55e" }}
                    >
                      Ready to see your company brain? →
                    </button>
                  </div>
                )}
              </div>

              {/* Upload panel */}
              {showUpload && (
                <div
                  className="rounded-2xl p-4 space-y-3"
                  style={{ background: "#111111", border: "1px solid #27272a" }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Load data into the brain</p>
                    <button
                      onClick={() => setShowUpload(false)}
                      className="text-xs hover:opacity-70"
                      style={{ color: "#71717a" }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Dropzone */}
                  {!pasteMode && (
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl p-6 text-center cursor-pointer transition-all"
                      style={{
                        border: `1px dashed ${dragging ? "#22c55e" : "#3f3f46"}`,
                        background: dragging ? "rgba(34,197,94,0.04)" : "transparent",
                      }}
                    >
                      <p className="text-sm" style={{ color: "#71717a" }}>
                        Drop files here or{" "}
                        <span style={{ color: "#22c55e" }}>browse</span>
                      </p>
                      <p className="text-xs mt-1" style={{ color: "#3f3f46" }}>
                        .txt · .md · .json · .csv · .pdf — max 10MB, {MAX_FILES} files
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={ACCEPTED_TYPES}
                        multiple
                        className="hidden"
                        onChange={handleFileInput}
                      />
                    </div>
                  )}

                  {/* Paste text mode */}
                  <div>
                    {!pasteMode ? (
                      <button
                        onClick={() => setPasteMode(true)}
                        className="text-xs hover:opacity-70 transition-opacity"
                        style={{ color: "#71717a" }}
                      >
                        Or paste text →
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <textarea
                          value={pasteContent}
                          onChange={(e) => setPasteContent(e.target.value)}
                          placeholder="Paste any text — meeting notes, docs, context..."
                          rows={5}
                          className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
                          style={{
                            background: "#0a0a0a",
                            border: "1px solid #27272a",
                            color: "#f0f0f0",
                          }}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={submitPaste}
                            disabled={!pasteContent.trim()}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium disabled:opacity-40 transition-all"
                            style={{ background: "#22c55e", color: "#0a0a0a" }}
                          >
                            Analyze text
                          </button>
                          <button
                            onClick={() => { setPasteMode(false); setPasteContent(""); }}
                            className="text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-70"
                            style={{ border: "1px solid #27272a", color: "#71717a" }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* File list */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {uploadedFiles.map((f) => (
                        <div
                          key={f.id}
                          className="flex items-center gap-2 text-xs"
                        >
                          <span
                            className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs"
                            style={{
                              background:
                                f.status === "done"
                                  ? "rgba(34,197,94,0.15)"
                                  : f.status === "error"
                                  ? "rgba(239,68,68,0.15)"
                                  : "rgba(113,113,122,0.15)",
                              color:
                                f.status === "done"
                                  ? "#22c55e"
                                  : f.status === "error"
                                  ? "#ef4444"
                                  : "#71717a",
                            }}
                          >
                            {f.status === "done" ? "✓" : f.status === "error" ? "✕" : "…"}
                          </span>
                          <span className="flex-1 truncate" style={{ color: f.status === "error" ? "#ef4444" : "#a1a1aa" }}>
                            {f.name}
                            {f.status === "analyzing" && (
                              <span style={{ color: "#71717a" }}> — analyzing...</span>
                            )}
                            {f.status === "error" && f.error && (
                              <span style={{ color: "#ef4444" }}> — {f.error}</span>
                            )}
                          </span>
                          <button
                            onClick={() => removeFile(f.id)}
                            className="flex-shrink-0 hover:opacity-70"
                            style={{ color: "#3f3f46" }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {analyzingCount > 0 && (
                    <p className="text-xs" style={{ color: "#71717a" }}>
                      Analyzing {analyzingCount} file{analyzingCount > 1 ? "s" : ""}... This will be included in your brain summary.
                    </p>
                  )}
                  {doneCount > 0 && analyzingCount === 0 && (
                    <p className="text-xs" style={{ color: "#22c55e" }}>
                      {doneCount} file{doneCount > 1 ? "s" : ""} ready — will be included when you generate your brain.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Brain summary panel */}
        {showSummary && (
          <div
            className="w-full md:w-80 flex-shrink-0 rounded-2xl p-5 space-y-4 overflow-y-auto"
            style={{
              background: "#111111",
              border: "1px solid #27272a",
              maxHeight: "calc(100vh - 120px)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🧠</span>
              <h2 className="font-semibold">Your company brain</h2>
            </div>

            {summarizing ? (
              <div className="text-sm" style={{ color: "#71717a" }}>
                <div className="animate-pulse space-y-2">
                  <div className="h-3 rounded" style={{ background: "#18181b", width: "80%" }} />
                  <div className="h-3 rounded" style={{ background: "#18181b", width: "60%" }} />
                  <div className="h-3 rounded" style={{ background: "#18181b", width: "70%" }} />
                </div>
                <p className="mt-3" style={{ color: "#71717a" }}>Building your brain...</p>
              </div>
            ) : summary ? (
              <div className="space-y-4 text-sm">
                {summary.companyName && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#22c55e" }}>Company</p>
                    <p>{summary.companyName}</p>
                  </div>
                )}
                {summary.whatTheyDo && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#22c55e" }}>What you do</p>
                    <p style={{ color: "#71717a" }}>{summary.whatTheyDo}</p>
                  </div>
                )}
                {summary.whoTheyServe && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#22c55e" }}>Who you serve</p>
                    <p style={{ color: "#71717a" }}>{summary.whoTheyServe}</p>
                  </div>
                )}
                {summary.whatMakesThemDifferent && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#22c55e" }}>Your edge</p>
                    <p style={{ color: "#71717a" }}>{summary.whatMakesThemDifferent}</p>
                  </div>
                )}
                {summary.keyProcesses && summary.keyProcesses.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#22c55e" }}>Key processes</p>
                    <ul className="space-y-1">
                      {summary.keyProcesses.map((p, i) => (
                        <li key={i} className="flex items-start gap-2" style={{ color: "#71717a" }}>
                          <span style={{ color: "#22c55e" }}>·</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {summary.keyTools && summary.keyTools.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#22c55e" }}>Tools & stack</p>
                    <div className="flex flex-wrap gap-1.5">
                      {summary.keyTools.map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-xs"
                          style={{ background: "#18181b", border: "1px solid #27272a" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {summary.howDecisionsAreMade && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#22c55e" }}>Decision-making</p>
                    <p style={{ color: "#71717a" }}>{summary.howDecisionsAreMade}</p>
                  </div>
                )}
                {summary.informalKnowledge && summary.informalKnowledge.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#22c55e" }}>Informal knowledge</p>
                    <ul className="space-y-1">
                      {summary.informalKnowledge.map((k, i) => (
                        <li key={i} className="flex items-start gap-2" style={{ color: "#71717a" }}>
                          <span style={{ color: "#22c55e" }}>·</span>
                          {k}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {summary.openQuestions && summary.openQuestions.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#71717a" }}>Gaps to fill</p>
                    <ul className="space-y-1">
                      {summary.openQuestions.map((q, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "#71717a" }}>
                          <span>?</span>
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sources / provenance */}
                {summary.sources && summary.sources.length > 0 && (
                  <div
                    className="pt-3 mt-1 space-y-2"
                    style={{ borderTop: "1px solid #27272a" }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#3f3f46" }}>Sources</p>
                    {summary.sources.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span
                          className="flex-shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-xs"
                          style={{
                            background: s.type === "file" ? "rgba(34,197,94,0.08)" : "#18181b",
                            color: s.type === "file" ? "#22c55e" : "#71717a",
                            border: `1px solid ${s.type === "file" ? "rgba(34,197,94,0.2)" : "#27272a"}`,
                          }}
                        >
                          {s.type === "file" ? "file" : "chat"}
                        </span>
                        <div>
                          <p style={{ color: "#a1a1aa" }}>{s.label}</p>
                          <p style={{ color: "#71717a" }}>{s.contribution}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className="pt-3 mt-1"
                  style={{ borderTop: "1px solid #27272a" }}
                >
                  <p className="text-xs" style={{ color: "#71717a" }}>
                    This is a first-pass brain. Continue the interview or load more files to add depth.
                  </p>
                </div>

                <div
                  className="pt-3 mt-1 space-y-2"
                  style={{ borderTop: "1px solid #27272a" }}
                >
                  <button
                    onClick={handleExport}
                    disabled={exportLoading}
                    className="w-full py-2.5 rounded-xl text-sm font-medium transition-colors"
                    style={{
                      background: exportLoading ? "#18181b" : "#22c55e",
                      color: exportLoading ? "#71717a" : "#000",
                      border: exportLoading ? "1px solid #27272a" : "none",
                      cursor: exportLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    {exportLoading ? "Building export…" : "Export full report"}
                  </button>
                  {exportError && (
                    <p className="text-xs" style={{ color: "#ef4444" }}>
                      {exportError}
                    </p>
                  )}
                  <p className="text-xs text-center" style={{ color: "#3f3f46" }}>
                    Zip bundle · summary · context graph · transcripts
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
