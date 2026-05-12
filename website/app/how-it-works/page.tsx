import Nav from "../components/Nav";
import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <Nav />
      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "96px 24px" }}>
        <h1 className="font-bold mb-6" style={{ fontSize: "48px", letterSpacing: "-0.02em" }}>
          How it works
        </h1>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", lineHeight: "1.7", marginBottom: "32px" }}>
          A deep dive into synthesis vs. retrieval, how Grove builds your company brain, and what makes it different from every other approach.
        </p>
        <p style={{ fontSize: "16px", color: "var(--text-muted)" }}>
          Full content coming soon.{" "}
          <Link href="/blog/what-it-means-for-agents-to-understand-a-company" style={{ color: "var(--accent)" }}>
            Read our founding article →
          </Link>
        </p>
      </main>
    </div>
  );
}
