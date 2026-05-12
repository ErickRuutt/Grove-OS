import Nav from "../components/Nav";
import Link from "next/link";

export default function BenchmarkPage() {
  return (
    <div style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <Nav />
      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "96px 24px" }}>
        <h1 className="font-bold mb-6" style={{ fontSize: "48px", letterSpacing: "-0.02em" }}>
          The context benchmark
        </h1>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", lineHeight: "1.7", marginBottom: "32px" }}>
          There is no standard today for testing whether an agent actually understands your company. We&apos;re building one.
        </p>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: "1.7", marginBottom: "24px" }}>
          Our context benchmark asks: given real company data across real tools, can a system accurately answer basic questions? Who&apos;s on the engineering team? What changed last week? Which source wins when Slack and the CRM disagree?
        </p>
        <p style={{ fontSize: "16px", color: "var(--text-muted)" }}>
          Early access waitlist and detailed results coming soon.{" "}
          <Link href="/interview" style={{ color: "var(--accent)" }}>
            Start building your brain →
          </Link>
        </p>
      </main>
    </div>
  );
}
