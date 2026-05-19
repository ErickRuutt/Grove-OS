"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const stripeSessionId = searchParams.get("stripe_session_id");
  const interviewSessionId = searchParams.get("interview_session_id");

  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const downloadedRef = useRef(false);

  const handleDownload = async () => {
    if (!stripeSessionId || !interviewSessionId) {
      setErrorMsg("Missing session information.");
      setDownloadState("error");
      return;
    }

    setDownloadState("loading");
    try {
      const res = await fetch(
        `/api/payments/download?stripe_session_id=${stripeSessionId}&interview_session_id=${interviewSessionId}`
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Download failed");
      }

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
      setDownloadState("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Download failed");
      setDownloadState("error");
    }
  };

  // Auto-trigger download on first load
  useEffect(() => {
    if (!downloadedRef.current && stripeSessionId && interviewSessionId) {
      downloadedRef.current = true;
      handleDownload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripeSessionId, interviewSessionId]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#09090b", color: "#fafafa" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 space-y-6 text-center"
        style={{ background: "#111111", border: "1px solid #27272a" }}
      >
        <div className="space-y-2">
          <div className="text-4xl">🧠</div>
          <h1 className="text-2xl font-semibold">Payment confirmed</h1>
          <p style={{ color: "#71717a" }}>
            Your Brain Protocol export is ready. Your download should start automatically.
          </p>
        </div>

        <div
          className="rounded-xl p-4 space-y-2 text-sm text-left"
          style={{ background: "#18181b", border: "1px solid #27272a" }}
        >
          <p className="font-medium">What&apos;s included</p>
          <ul className="space-y-1" style={{ color: "#71717a" }}>
            <li>· Executive summary (Markdown)</li>
            <li>· Structured insights (JSON)</li>
            <li>· Context graph: entities, claims, conflicts</li>
            <li>· Full interview transcript</li>
            <li>· Source document excerpts</li>
            <li>· Manifest with checksums</li>
          </ul>
        </div>

        {downloadState === "loading" && (
          <div className="space-y-2">
            <div className="animate-pulse h-2 rounded" style={{ background: "#27272a" }} />
            <p className="text-sm" style={{ color: "#71717a" }}>
              Generating your export...
            </p>
          </div>
        )}

        {downloadState === "done" && (
          <p className="text-sm" style={{ color: "#22c55e" }}>
            Download started. Check your downloads folder.
          </p>
        )}

        {downloadState === "error" && (
          <div
            className="rounded-lg p-3 text-sm"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#ef4444",
            }}
          >
            {errorMsg || "Download failed. Please try again."}
          </div>
        )}

        <div className="space-y-3">
          {downloadState !== "loading" && (
            <button
              onClick={handleDownload}
              className="w-full py-3 rounded-xl font-medium transition-colors"
              style={{ background: "#22c55e", color: "#000", cursor: "pointer" }}
            >
              {downloadState === "done" ? "Download again" : "Download export"}
            </button>
          )}

          <p className="text-xs" style={{ color: "#3f3f46" }}>
            Up to 5 downloads available. Save your link.
          </p>

          <Link
            href="/"
            className="block text-sm transition-colors"
            style={{ color: "#71717a" }}
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div style={{ background: "#09090b", minHeight: "100vh" }} />}>
      <SuccessContent />
    </Suspense>
  );
}
