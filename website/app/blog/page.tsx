import Link from "next/link";
import Nav from "../components/Nav";

export default function BlogPage() {
  return (
    <div style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <Nav />
      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "80px 24px" }}>
        <h1
          className="font-bold mb-4"
          style={{ fontSize: "48px", letterSpacing: "-0.02em" }}
        >
          Blog
        </h1>
        <p
          className="mb-16"
          style={{ fontSize: "18px", color: "var(--text-secondary)" }}
        >
          Thinking on company context, AI agents, and the future of organizational knowledge.
        </p>

        <article style={{ borderTop: "1px solid var(--border)", paddingTop: "48px" }}>
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            May 2026
          </p>
          <h2
            className="font-semibold mb-4"
            style={{ fontSize: "24px", letterSpacing: "-0.01em", lineHeight: "1.3" }}
          >
            <Link
              href="/blog/marketing-brain-playbook-for-faster-ai-time-to-value"
              style={{ color: "var(--text-primary)", textDecoration: "none" }}
            >
              Marketing Brain Playbook for Faster AI Time-to-Value
            </Link>
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "var(--text-secondary)",
              lineHeight: "1.65",
              marginBottom: "20px",
            }}
          >
            How to turn marketing knowledge into a reusable brain that ships qualified pipeline content faster.
          </p>
          <Link
            href="/blog/marketing-brain-playbook-for-faster-ai-time-to-value"
            className="text-sm font-semibold"
            style={{ color: "var(--accent)" }}
          >
            Read the article →
          </Link>
        </article>

        <article style={{ borderTop: "1px solid var(--border)", paddingTop: "48px", marginTop: "48px" }}>
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            May 2026
          </p>
          <h2
            className="font-semibold mb-4"
            style={{ fontSize: "24px", letterSpacing: "-0.01em", lineHeight: "1.3" }}
          >
            <Link
              href="/blog/sales-brain-for-b2b-and-b2c-revenue-teams"
              style={{ color: "var(--text-primary)", textDecoration: "none" }}
            >
              Sales Brain for B2B and B2C Revenue Teams
            </Link>
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "var(--text-secondary)",
              lineHeight: "1.65",
              marginBottom: "20px",
            }}
          >
            A practical model for shortening discovery cycles, improving follow-up quality, and reducing deal slippage.
          </p>
          <Link
            href="/blog/sales-brain-for-b2b-and-b2c-revenue-teams"
            className="text-sm font-semibold"
            style={{ color: "var(--accent)" }}
          >
            Read the article →
          </Link>
        </article>

        <article style={{ borderTop: "1px solid var(--border)", paddingTop: "48px", marginTop: "48px" }}>
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            May 2026
          </p>
          <h2
            className="font-semibold mb-4"
            style={{ fontSize: "24px", letterSpacing: "-0.01em", lineHeight: "1.3" }}
          >
            <Link
              href="/blog/cs-brain-how-to-accelerate-onboarding-time-to-value"
              style={{ color: "var(--text-primary)", textDecoration: "none" }}
            >
              CS Brain: How to Accelerate Onboarding Time-to-Value
            </Link>
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "var(--text-secondary)",
              lineHeight: "1.65",
              marginBottom: "20px",
            }}
          >
            Build repeatable onboarding, risk detection, and expansion workflows that keep customer outcomes moving.
          </p>
          <Link
            href="/blog/cs-brain-how-to-accelerate-onboarding-time-to-value"
            className="text-sm font-semibold"
            style={{ color: "var(--accent)" }}
          >
            Read the article →
          </Link>
        </article>

        <article style={{ borderTop: "1px solid var(--border)", paddingTop: "48px" }}>
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            April 2026
          </p>
          <h2
            className="font-semibold mb-4"
            style={{ fontSize: "24px", letterSpacing: "-0.01em", lineHeight: "1.3" }}
          >
            <Link
              href="/blog/what-it-means-for-agents-to-understand-a-company"
              style={{ color: "var(--text-primary)", textDecoration: "none" }}
            >
              What it means for agents to understand a company
            </Link>
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "var(--text-secondary)",
              lineHeight: "1.65",
              marginBottom: "20px",
            }}
          >
            Not search across its tools. Not retrieve its documents. Understand it.
            The way a great chief of staff understands the company after six months.
          </p>
          <Link
            href="/blog/what-it-means-for-agents-to-understand-a-company"
            className="text-sm font-semibold"
            style={{ color: "var(--accent)" }}
          >
            Read the article →
          </Link>
        </article>
      </main>

      <footer
        style={{
          background: "var(--bg-inverse)",
          borderTop: "1px solid rgba(247,246,243,0.08)",
          padding: "32px 24px",
          marginTop: "96px",
        }}
      >
        <div
          className="mx-auto flex items-center justify-between"
          style={{ maxWidth: "1120px" }}
        >
          <Link
            href="/"
            className="font-bold"
            style={{ color: "var(--text-inverse)" }}
          >
            Grove
          </Link>
          <p className="text-xs" style={{ color: "rgba(247,246,243,0.3)" }}>
            © 2026 Grove
          </p>
        </div>
      </footer>
    </div>
  );
}
