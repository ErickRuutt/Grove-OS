import Nav from "../components/Nav";

export default function IntegrationsPage() {
  return (
    <div style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <Nav />
      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "96px 24px" }}>
        <h1 className="font-bold mb-6" style={{ fontSize: "48px", letterSpacing: "-0.02em" }}>
          Integrations
        </h1>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", lineHeight: "1.7", marginBottom: "32px" }}>
          Grove connects to the tools your company already uses — Slack, Google Workspace, email, CRM, Linear, GitHub, calendar, and meetings.
        </p>
        <p style={{ fontSize: "16px", color: "var(--text-muted)" }}>
          Integration guides coming soon.
        </p>
      </main>
    </div>
  );
}
