import Link from "next/link";
import Nav from "../../components/Nav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketing Brain Playbook for Faster AI Time-to-Value — Grove",
  description:
    "A practical blueprint for using a Marketing Brain to ship better campaigns faster across B2B and B2C teams.",
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
            Marketing Brain Playbook for Faster AI Time-to-Value
          </h1>
          <p style={{ fontSize: "20px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
            Stop shipping random AI content. Start shipping useful content that matches your ICP and converts.
          </p>
        </header>

        <p style={articleStyles.p}>
          Most teams are using AI for marketing as an output shortcut, not an operating system. That gets you velocity, but not leverage.
          A Marketing Brain gives you both: faster output and tighter message quality.
        </p>
        <p style={articleStyles.p}>
          The model is simple. Encode the things your best marketers already know into structured files: who you serve, how buyers talk,
          what claims are safe, which examples actually convert, and what language to avoid.
        </p>

        <h2 style={articleStyles.h2}>What goes inside the Marketing Brain</h2>
        <p style={articleStyles.p}>
          Start with five files:
          `icp.md`, `positioning.md`, `proof.md`, `voice.md`, and `offers.md`.
          If your AI stack can read Markdown, it can use this.
        </p>
        <p style={articleStyles.p}>
          The point is not perfect documentation. The point is reducing the number of marketing decisions your team has to re-litigate every week.
        </p>

        <h2 style={articleStyles.h2}>B2B use case</h2>
        <p style={articleStyles.p}>
          In B2B, your cycle is slower and your trust threshold is higher. Use the Brain to generate campaign assets where every draft already
          includes persona context, objections, and approved proof. That cuts editing loops and keeps claims aligned with sales reality.
        </p>

        <h2 style={articleStyles.h2}>B2C use case</h2>
        <p style={articleStyles.p}>
          In B2C, speed and message fit matter most. Use the Brain to rapidly produce channel variants while preserving one core narrative.
          You get faster experimentation without letting tone and positioning drift every week.
        </p>

        <h2 style={articleStyles.h2}>Time-to-value metrics to track in the first 30 days</h2>
        <p style={articleStyles.p}>
          Track three things: draft-to-publish cycle time, first-pass acceptance rate, and qualified CTA conversion by source.
          If those are not improving, you have a process problem, not an AI problem.
        </p>

        <h2 style={articleStyles.h2}>Bottom line</h2>
        <p style={articleStyles.p}>
          AI can give you more content. A Marketing Brain gives you better decisions at scale.
          The winner is not the team with the most prompts. It is the team with the cleanest memory and the fastest learning loop.
        </p>
      </main>
    </div>
  );
}
