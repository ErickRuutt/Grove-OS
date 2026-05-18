import Link from "next/link";
import Nav from "../../components/Nav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sales Brain for B2B and B2C Revenue Teams — Grove",
  description:
    "How revenue teams use a Sales Brain to shorten discovery, improve follow-through, and get faster AI time-to-value.",
};

const articleStyles = {
  p: {
    fontSize: "18px",
    lineHeight: "1.75",
    color: "var(--text-secondary)",
    marginBottom: "24px",
  } as React.CSSProperties,
  h2: {
    fontSize: "28px",
    fontWeight: 600,
    letterSpacing: "-0.01em",
    lineHeight: "1.3",
    color: "var(--text-primary)",
    marginTop: "56px",
    marginBottom: "20px",
  } as React.CSSProperties,
};

export default function BlogPost() {
  return (
    <div style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <Nav />
      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ marginBottom: "48px" }}>
          <Link href="/blog" className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            ← Blog
          </Link>
        </div>
        <header style={{ marginBottom: "64px" }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-6" style={{ color: "var(--text-muted)" }}>
            May 2026
          </p>
          <h1 className="font-bold mb-6" style={{ fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.02em", lineHeight: "1.15" }}>
            Sales Brain for B2B and B2C Revenue Teams
          </h1>
          <p style={{ fontSize: "20px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
            Your reps do not need more generic AI copy. They need account-specific clarity at execution speed.
          </p>
        </header>

        <p style={articleStyles.p}>
          A Sales Brain turns historical deal knowledge into a reusable system. Objection patterns, discovery sequences,
          proof points, and disqualification logic become available to every rep instead of living in two people&apos;s heads.
        </p>

        <h2 style={articleStyles.h2}>Core files that make this work</h2>
        <p style={articleStyles.p}>
          Start with `discovery.md`, `objections.md`, `proof-by-segment.md`, `mutual-action-plan.md`, and `deal-review-rubric.md`.
          Feed these into your AI workflow and every output gets closer to your real revenue motion.
        </p>

        <h2 style={articleStyles.h2}>B2B use case</h2>
        <p style={articleStyles.p}>
          For B2B teams, use the Sales Brain to produce pre-call plans and post-call recaps that reflect your MEDDICC criteria,
          current risks, and executive sponsor strategy. That reduces manager rework and helps deals move with fewer stalls.
        </p>

        <h2 style={articleStyles.h2}>B2C use case</h2>
        <p style={articleStyles.p}>
          For B2C teams, use it to create consistent qualification and follow-up at high volume. The Brain keeps messaging focused
          on buyer intent and urgency signals, not broad scripts that ignore context.
        </p>

        <h2 style={articleStyles.h2}>Time-to-value benchmarks</h2>
        <p style={articleStyles.p}>
          In the first month, track: prep time per meeting, follow-up send time, and stage-conversion consistency.
          If your reps are faster but conversion quality drops, your Brain needs better proof and tighter disqualification rules.
        </p>

        <h2 style={articleStyles.h2}>Bottom line</h2>
        <p style={articleStyles.p}>
          A Sales Brain is not a script generator. It is a system for preserving what wins, exposing what fails, and making every rep
          better faster. That is what real AI leverage looks like in revenue teams.
        </p>
      </main>
    </div>
  );
}
