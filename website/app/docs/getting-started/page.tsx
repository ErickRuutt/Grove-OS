import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Getting Started — Grove Docs",
  description: "Get started with Grove: connect your first data source and understand how the context graph works.",
};

export default function GettingStartedPage() {
  return (
    <article>
      <nav
        className="text-xs mb-8"
        style={{ color: "var(--text-muted)" }}
      >
        Docs &rsaquo; Getting Started
      </nav>

      <h1
        className="font-bold mb-4"
        style={{
          fontSize: "36px",
          letterSpacing: "-0.02em",
          lineHeight: "1.2",
        }}
      >
        Getting Started
      </h1>

      <p
        style={{
          fontSize: "18px",
          color: "var(--text-secondary)",
          lineHeight: "1.7",
          marginBottom: "48px",
        }}
      >
        Grove builds a continuously updated, conflict-resolved understanding of
        your company — delivered as files any agent can read. This guide covers
        the core concepts and gets you set up with your first data source.
      </p>

      <section id="what-is-grove" style={{ marginBottom: "56px" }}>
        <h2
          className="font-semibold mb-4"
          style={{ fontSize: "24px", letterSpacing: "-0.01em" }}
        >
          What is Grove?
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "var(--text-secondary)",
            lineHeight: "1.7",
            marginBottom: "16px",
          }}
        >
          Grove is the context layer that turns your company&apos;s scattered data
          into a brain every agent already knows how to read. Instead of
          searching at query time, Grove continuously synthesizes signal from
          your existing tools — Slack, email, CRM, docs, meetings — and
          surfaces the result as structured files on disk.
        </p>
        <p
          style={{
            fontSize: "16px",
            color: "var(--text-secondary)",
            lineHeight: "1.7",
          }}
        >
          Any agent that reads files can consume Grove&apos;s output without custom
          integration. No connectors, no per-agent setup. Just a filesystem
          that already knows your company, updated daily.
        </p>
      </section>

      <section id="vs-rag" style={{ marginBottom: "56px" }}>
        <h2
          className="font-semibold mb-4"
          style={{ fontSize: "24px", letterSpacing: "-0.01em" }}
        >
          How Grove is different from RAG
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "var(--text-secondary)",
            lineHeight: "1.7",
            marginBottom: "24px",
          }}
        >
          Retrieval-augmented generation (RAG) searches for relevant content
          when a question is asked. Grove maintains a continuously updated
          representation of your company <em>before</em> anyone asks.
        </p>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-strong)" }}>
                <th
                  className="text-left py-3 pr-6 font-semibold"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Capability
                </th>
                <th
                  className="text-left py-3 pr-6 font-semibold"
                  style={{ color: "var(--text-secondary)" }}
                >
                  RAG
                </th>
                <th
                  className="text-left py-3 pl-4 font-semibold"
                  style={{
                    color: "var(--accent)",
                    borderLeft: "2px solid var(--accent)",
                  }}
                >
                  Grove
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["When context is built", "At query time", "Continuously"],
                ["Conflict resolution", "None", "Source-ranked"],
                ["Identity unification", "No", "Yes"],
                ["Staleness awareness", "No", "Yes"],
                ["Agent compatibility", "Custom per agent", "Any file reader"],
                ["Compounding value", "Resets every query", "Grows daily"],
              ].map(([cap, rag, grove], i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td
                    className="py-3 pr-6 font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {cap}
                  </td>
                  <td className="py-3 pr-6" style={{ color: "var(--text-secondary)" }}>
                    {rag}
                  </td>
                  <td
                    className="py-3 pl-4 font-medium"
                    style={{
                      color: "var(--text-primary)",
                      borderLeft: "2px solid var(--accent)",
                    }}
                  >
                    {grove}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="quickstart" style={{ marginBottom: "56px" }}>
        <h2
          className="font-semibold mb-4"
          style={{ fontSize: "24px", letterSpacing: "-0.01em" }}
        >
          Quickstart: connect your first data source
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "var(--text-secondary)",
            lineHeight: "1.7",
            marginBottom: "24px",
          }}
        >
          The fastest way to get started with Grove is the company interview.
          It takes about 15 minutes and produces a first-pass context graph
          from a structured conversation about how your company actually works.
        </p>

        <ol
          style={{
            paddingLeft: "0",
            listStyle: "none",
          }}
        >
          {[
            {
              step: "01",
              title: "Start the interview",
              body: "Navigate to /interview. Grove's AI will ask you 6–8 focused questions about your team, tools, processes, and informal knowledge.",
            },
            {
              step: "02",
              title: "Review your context graph",
              body: "After the interview, Grove produces a structured snapshot of what it learned — company name, key processes, decision patterns, tools, and open questions.",
            },
            {
              step: "03",
              title: "Connect live data sources",
              body: "Once you have a working baseline, connect Slack, Google Workspace, email, or CRM to keep the graph continuously updated.",
            },
          ].map((item) => (
            <li
              key={item.step}
              className="flex gap-5 mb-6"
            >
              <span
                className="flex-shrink-0 font-semibold text-sm"
                style={{
                  color: "var(--accent)",
                  fontFamily: "var(--font-mono)",
                  paddingTop: "2px",
                }}
              >
                {item.step}
              </span>
              <div>
                <p className="font-semibold mb-1" style={{ fontSize: "16px" }}>
                  {item.title}
                </p>
                <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="context-graph" style={{ marginBottom: "56px" }}>
        <h2
          className="font-semibold mb-4"
          style={{ fontSize: "24px", letterSpacing: "-0.01em" }}
        >
          Understanding the context graph
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "var(--text-secondary)",
            lineHeight: "1.7",
            marginBottom: "16px",
          }}
        >
          The context graph is Grove&apos;s core output: a synthesized,
          source-tracked representation of your company. It resolves conflicts
          between sources, unifies identity across fragmented mentions, tracks
          freshness, and surfaces cross-source inferences that no single
          document contains.
        </p>
        <p
          style={{
            fontSize: "16px",
            color: "var(--text-secondary)",
            lineHeight: "1.7",
          }}
        >
          The graph is surfaced as structured files on disk. Every agent that
          reads files — Claude Code, Cursor, OpenClaw, or any custom agent —
          can consume it without custom integration. The files are updated daily
          as new signals come in from your connected sources.
        </p>
      </section>

      <div
        style={{
          borderTop: "1px solid var(--border)",
          paddingTop: "32px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div style={{ textAlign: "right" }}>
          <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
            Next
          </p>
          <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
            Connecting Sources — Coming soon
          </p>
        </div>
      </div>
    </article>
  );
}
