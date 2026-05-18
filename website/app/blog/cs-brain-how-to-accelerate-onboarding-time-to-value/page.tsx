import Link from "next/link";
import Nav from "../../components/Nav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CS Brain: How to Accelerate Onboarding Time-to-Value — Grove",
  description:
    "A Customer Success Brain helps teams shorten onboarding ramps, detect risk early, and build repeatable expansion plays.",
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
            CS Brain: How to Accelerate Onboarding Time-to-Value
          </h1>
          <p style={{ fontSize: "20px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
            If onboarding knowledge is scattered, customers wait longer for value and churn risk rises.
          </p>
        </header>

        <p style={articleStyles.p}>
          Customer Success teams run on pattern recognition: which launch plans work, which handoffs fail, and which early signals predict churn.
          A CS Brain captures those patterns so every CSM can execute like your strongest operator.
        </p>

        <h2 style={articleStyles.h2}>The minimum CS Brain schema</h2>
        <p style={articleStyles.p}>
          Start with `onboarding-plays.md`, `risk-signals.md`, `value-milestones.md`, `qbr-storylines.md`, and `expansion-triggers.md`.
          That gives AI enough structure to produce useful, consistent action plans.
        </p>

        <h2 style={articleStyles.h2}>B2B use case</h2>
        <p style={articleStyles.p}>
          In B2B, map success plans by stakeholder role and implementation maturity. Your Brain should know who needs what by week 2,
          where adoption normally stalls, and which milestone predicts renewal confidence.
        </p>

        <h2 style={articleStyles.h2}>B2C use case</h2>
        <p style={articleStyles.p}>
          In B2C, the volume is higher and the signals are noisier. Use the Brain to standardize intervention logic based on product behavior:
          activation gaps, support friction, and usage decay. You respond faster with fewer false alarms.
        </p>

        <h2 style={articleStyles.h2}>Time-to-value metrics that matter</h2>
        <p style={articleStyles.p}>
          Track time-to-first-value, time-to-second-use-case, and risk-to-recovery duration. These three metrics show whether your CS system is
          actually helping customers realize outcomes faster or just generating prettier updates.
        </p>

        <h2 style={articleStyles.h2}>Bottom line</h2>
        <p style={articleStyles.p}>
          A CS Brain gives your team durable execution quality: faster onboarding, earlier risk detection, and cleaner expansion motion.
          That is how AI moves from novelty to retention impact.
        </p>
      </main>
    </div>
  );
}
