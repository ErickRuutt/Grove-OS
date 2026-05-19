"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function PermissionContent() {
  const searchParams = useSearchParams();
  const interviewSessionId = searchParams.get("interview_session_id");

  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "pending" | "not_found" | "rejected" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const downloadedRef = useRef(false);

  async function handleClaim(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !interviewSessionId || downloadedRef.current) return;

    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/payments/permission-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: interviewSessionId, email: email.trim() }),
      });

      if (res.ok) {
        downloadedRef.current = true;
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const disposition = res.headers.get("Content-Disposition") || "";
        const nameMatch = disposition.match(/filename="([^"]+)"/);
        a.download = nameMatch ? nameMatch[1] : "brain-protocol-export.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setState("done");
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (data.error === "pending") {
        setState("pending");
      } else if (data.error === "rejected") {
        setState("rejected");
      } else if (data.error === "no_request") {
        setState("not_found");
      } else {
        setState("error");
        setErrorMsg(data.message || data.error || "Something went wrong");
      }
    } catch {
      setState("error");
      setErrorMsg("Network error — please try again.");
    }
  }

  const cardStyle = {
    background: "#111111",
    border: "1px solid #27272a",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#09090b", color: "#fafafa" }}
    >
      <div className="w-full max-w-md rounded-2xl p-8 space-y-6 text-center" style={cardStyle}>
        <div className="space-y-2">
          <div className="text-4xl">🧠</div>
          <h1 className="text-2xl font-semibold">Claim your export</h1>
          <p style={{ color: "#71717a" }}>
            Enter the email address linked to your access approval to download your Brain Protocol export.
          </p>
        </div>

        {state === "idle" || state === "loading" || state === "error" ? (
          <form onSubmit={handleClaim} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={state === "loading"}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: "#18181b",
                border: "1px solid #27272a",
                color: "#fafafa",
              }}
            />
            <button
              type="submit"
              disabled={state === "loading" || !email.trim()}
              className="w-full py-3 rounded-xl font-medium transition-all disabled:opacity-40"
              style={{ background: "#22c55e", color: "#0a0a0a" }}
            >
              {state === "loading" ? "Checking access…" : "Download export"}
            </button>
            {state === "error" && errorMsg && (
              <p className="text-sm" style={{ color: "#ef4444" }}>{errorMsg}</p>
            )}
          </form>
        ) : state === "done" ? (
          <div className="space-y-4">
            <div
              className="rounded-xl p-4 text-sm"
              style={{ background: "#052e16", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e" }}
            >
              Download started. Check your downloads folder for your Brain Protocol export zip.
            </div>
            <Link
              href="/interview"
              className="block text-sm underline hover:opacity-70"
              style={{ color: "#71717a" }}
            >
              Start a new interview
            </Link>
          </div>
        ) : state === "pending" ? (
          <div className="space-y-4">
            <div
              className="rounded-xl p-4 text-sm"
              style={{ background: "#1c1917", border: "1px solid #27272a", color: "#a1a1aa" }}
            >
              Your access request is pending approval. You will be notified when it is approved.
            </div>
            <Link
              href="/request-access"
              className="block text-sm underline hover:opacity-70"
              style={{ color: "#71717a" }}
            >
              Check request status
            </Link>
          </div>
        ) : state === "not_found" ? (
          <div className="space-y-4">
            <div
              className="rounded-xl p-4 text-sm"
              style={{ background: "#1c1917", border: "1px solid #27272a", color: "#a1a1aa" }}
            >
              No access request found for that email. Request access to get approved.
            </div>
            <Link
              href="/request-access"
              className="inline-block px-6 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: "#22c55e", color: "#0a0a0a" }}
            >
              Request access
            </Link>
          </div>
        ) : state === "rejected" ? (
          <div className="space-y-4">
            <div
              className="rounded-xl p-4 text-sm"
              style={{ background: "#1c1917", border: "1px solid #27272a", color: "#a1a1aa" }}
            >
              Your access request was not approved. Contact us if you believe this is an error.
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function PermissionPage() {
  return (
    <Suspense>
      <PermissionContent />
    </Suspense>
  );
}
