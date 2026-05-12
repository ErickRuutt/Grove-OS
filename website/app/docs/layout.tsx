import Link from "next/link";
import Nav from "../components/Nav";

const SIDEBAR_SECTIONS = [
  {
    title: "Getting Started",
    phase: 1,
    items: [
      { label: "What is Grove?", href: "/docs/getting-started" },
      { label: "Grove vs. RAG", href: "/docs/getting-started#vs-rag" },
      { label: "Quickstart", href: "/docs/getting-started#quickstart" },
      { label: "Context Graph overview", href: "/docs/getting-started#context-graph" },
    ],
  },
  { title: "Connecting Sources", phase: 2, items: [] },
  { title: "The Context Graph", phase: 2, items: [] },
  { title: "Filesystem Interface", phase: 2, items: [] },
  { title: "The Context Benchmark", phase: 2, items: [] },
  { title: "Administration", phase: 2, items: [] },
  { title: "API Reference", phase: 2, items: [] },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <Nav />

      <div
        className="mx-auto flex"
        style={{ maxWidth: "1280px", minHeight: "calc(100vh - 64px)" }}
      >
        {/* Left sidebar */}
        <aside
          className="hidden lg:block flex-shrink-0 sticky self-start"
          style={{
            width: "240px",
            top: "64px",
            height: "calc(100vh - 64px)",
            overflowY: "auto",
            padding: "32px 0",
            borderRight: "1px solid var(--border)",
          }}
        >
          {SIDEBAR_SECTIONS.map((section) => (
            <div key={section.title} style={{ marginBottom: "24px", paddingRight: "24px" }}>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{
                  color: section.phase === 1 ? "var(--text-secondary)" : "var(--text-muted)",
                  paddingLeft: "16px",
                }}
              >
                {section.title}
              </p>

              {section.phase === 1 ? (
                <ul>
                  {section.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="block text-sm py-1.5"
                        style={{
                          color: "var(--text-secondary)",
                          paddingLeft: "16px",
                        }}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  className="text-sm italic"
                  style={{
                    color: "var(--text-muted)",
                    paddingLeft: "16px",
                    paddingTop: "4px",
                  }}
                >
                  Coming soon
                </p>
              )}
            </div>
          ))}
        </aside>

        {/* Content */}
        <main
          className="flex-1 min-w-0"
          style={{ padding: "48px 48px 96px", maxWidth: "720px" }}
        >
          {children}
        </main>
      </div>

      <footer
        style={{
          background: "var(--bg-inverse)",
          borderTop: "1px solid rgba(247,246,243,0.08)",
          padding: "32px 24px",
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
