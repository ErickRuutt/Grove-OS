import Link from "next/link";
import Nav from "./components/Nav";

const TABLE_ROWS = [
  {
    capability: "When context is built",
    retrieval: "At query time",
    grove: "Continuously, before anyone asks",
  },
  {
    capability: "Conflict resolution",
    retrieval: "None — returns first match",
    grove: "Source-ranked, reasoned resolution",
  },
  {
    capability: "Identity unification",
    retrieval: "Treats fragments as separate entities",
    grove: "Unified identity across all mentions",
  },
  {
    capability: "Staleness awareness",
    retrieval: "Treats old docs like new ones",
    grove: "Tracks freshness, flags decay",
  },
  {
    capability: "Agent compatibility",
    retrieval: "Requires custom integration per agent",
    grove: "Any agent that reads files",
  },
  {
    capability: "Compounding value",
    retrieval: "Resets every query",
    grove: "Compounds every day",
  },
];

export default function Home() {
  return (
    <div style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <Nav />

      {/* Hero — dark */}
      <section
        style={{
          background: "var(--bg-inverse)",
          color: "var(--text-inverse)",
          padding: "160px 24px 120px",
        }}
      >
        <div
          className="mx-auto text-center"
          style={{ maxWidth: "760px" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-8"
            style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
          >
            Company context for AI agents
          </p>

          <h1
            className="font-bold leading-tight mb-8"
            style={{
              fontSize: "clamp(40px, 6vw, 64px)",
              color: "var(--text-inverse)",
              letterSpacing: "-0.02em",
            }}
          >
            Your agents have access.
            <br />
            They don&apos;t have understanding.
          </h1>

          <p
            className="mb-12 leading-relaxed"
            style={{
              fontSize: "20px",
              color: "rgba(247,246,243,0.65)",
              maxWidth: "600px",
              margin: "0 auto 48px",
            }}
          >
            Grove builds a continuously updated company brain — synthesized,
            conflict-resolved, source-grounded — delivered as files any agent
            can read.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center" style={{ marginTop: "48px" }}>
            <Link
              href="/interview"
              className="px-7 py-4 font-semibold text-sm"
              style={{
                background: "var(--bg-surface)",
                color: "var(--text-primary)",
              }}
            >
              Start building your company brain
            </Link>
            <Link
              href="/how-it-works"
              className="px-7 py-4 font-semibold text-sm"
              style={{
                color: "rgba(247,246,243,0.65)",
                background: "transparent",
              }}
            >
              Read how it works →
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props — light, 3 cards */}
      <section style={{ padding: "96px 24px" }}>
        <div className="mx-auto" style={{ maxWidth: "1120px" }}>
          <h2
            className="font-semibold mb-12"
            style={{ fontSize: "36px", letterSpacing: "-0.01em" }}
          >
            What makes Grove different
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                title: "Synthesis, not search",
                body: "Retrieval gives agents fragments. Grove gives them a worldview. Before your agent answers a single question, Grove has already resolved the conflicts, ranked the sources, and built a coherent picture of your company.",
              },
              {
                num: "02",
                title: "Any agent, no integration",
                body: "Grove surfaces your company brain as files on disk. Claude Code, Cursor, any agent already knows how to read files. No custom connectors. No per-agent setup. Just a filesystem that already knows your company.",
              },
              {
                num: "03",
                title: "A moat that compounds",
                body: "On day one, Grove knows a little. On day thirty, it has absorbed thousands of signals, unified identities across every tool, and resolved hundreds of conflicts. That understanding cannot be bought. It can only be grown.",
              },
            ].map((card) => (
              <div
                key={card.num}
                className="p-8"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <p
                  className="font-semibold mb-4"
                  style={{
                    fontSize: "13px",
                    color: "var(--accent)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {card.num}
                </p>
                <h3 className="font-semibold mb-3" style={{ fontSize: "20px" }}>
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: "16px",
                    color: "var(--text-secondary)",
                    lineHeight: "1.65",
                  }}
                >
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section — light, narrative */}
      <section
        style={{
          padding: "96px 24px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: "720px" }}>
          <h2
            className="font-semibold mb-8"
            style={{
              fontSize: "36px",
              letterSpacing: "-0.01em",
              lineHeight: "1.2",
            }}
          >
            The failure mode is not that agents can&apos;t find information.
          </h2>

          <div
            style={{
              fontSize: "18px",
              lineHeight: "1.75",
              color: "var(--text-secondary)",
            }}
          >
            <p className="mb-5">
              Your agents can search Slack, read Google Drive, query your CRM.
              You&apos;ve connected everything.
            </p>
            <p className="mb-5">
              Ask who owns your biggest customer relationship. You&apos;ll get a name
              from Gmail. Ask from a different agent and you&apos;ll get a different
              name. Ask about your top priorities and it pulls from whichever
              strategy doc it finds first — even if that doc is three pivots behind.
            </p>
            <p className="mb-5">
              The failure is not access. The failure is that agents find too much,
              can&apos;t tell what&apos;s current, can&apos;t resolve conflicts between sources,
              and confidently present a fragment as the whole truth.
            </p>

            <blockquote
              className="my-10"
              style={{
                borderLeft: "3px solid var(--accent)",
                paddingLeft: "20px",
                color: "var(--text-primary)",
                fontStyle: "normal",
                fontSize: "18px",
              }}
            >
              Retrieval is a scavenger hunt. Every time your agent needs context,
              it starts from zero. No accumulated knowledge. No sense of what
              changed. No concept of which source wins when they disagree.
            </blockquote>
          </div>

          <h2
            className="font-semibold mb-8"
            style={{
              fontSize: "36px",
              letterSpacing: "-0.01em",
              lineHeight: "1.2",
              marginTop: "64px",
            }}
          >
            Grove does the interpretive work.
          </h2>

          <div
            style={{
              fontSize: "18px",
              lineHeight: "1.75",
              color: "var(--text-secondary)",
            }}
          >
            <p className="mb-5">
              Grove runs continuously in the background — ingesting signal from
              your tools, resolving conflicts, unifying identity across fragmented
              mentions, tracking what&apos;s current and what&apos;s stale, combining sources
              into understanding that no single document contains.
            </p>
            <p>
              The output is a context graph: a synthesized, source-tracked
              representation of your company. Delivered as files. Updated daily.
              Any agent reads it when it boots up. No searching required.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table — light */}
      <section
        style={{
          padding: "96px 24px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: "960px" }}>
          <h2
            className="font-semibold mb-12"
            style={{ fontSize: "36px", letterSpacing: "-0.01em" }}
          >
            How Grove compares
          </h2>

          <div style={{ overflowX: "auto" }}>
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-strong)" }}>
                  <th
                    className="text-left py-4 pr-8 font-semibold text-sm"
                    style={{ color: "var(--text-secondary)", width: "30%" }}
                  >
                    Capability
                  </th>
                  <th
                    className="text-left py-4 pr-8 font-semibold text-sm"
                    style={{ color: "var(--text-secondary)", width: "35%" }}
                  >
                    Retrieval / RAG
                  </th>
                  <th
                    className="text-left py-4 font-semibold text-sm"
                    style={{
                      color: "var(--accent)",
                      width: "35%",
                      paddingLeft: "16px",
                      borderLeft: "2px solid var(--accent)",
                    }}
                  >
                    Grove
                  </th>
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: `1px solid var(--border)`,
                    }}
                  >
                    <td
                      className="py-4 pr-8 font-medium text-sm"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {row.capability}
                    </td>
                    <td
                      className="py-4 pr-8 text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {row.retrieval}
                    </td>
                    <td
                      className="py-4 text-sm font-medium"
                      style={{
                        color: "var(--text-primary)",
                        paddingLeft: "16px",
                        borderLeft: "2px solid var(--accent)",
                      }}
                    >
                      {row.grove}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Benchmark Callout — bordered */}
      <section
        style={{
          borderTop: "1px solid var(--border-strong)",
          borderBottom: "1px solid var(--border-strong)",
          background: "var(--bg-base)",
          padding: "80px 24px",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: "960px" }}>
          <h2
            className="font-semibold mb-6"
            style={{
              fontSize: "36px",
              letterSpacing: "-0.01em",
              maxWidth: "760px",
            }}
          >
            We&apos;re building the benchmark.
          </h2>
          <p
            style={{
              fontSize: "18px",
              color: "var(--text-secondary)",
              maxWidth: "640px",
              lineHeight: "1.7",
              marginBottom: "32px",
            }}
          >
            There is no standard today for testing whether an agent actually
            understands your company. We&apos;re changing that. Our context benchmark
            asks: given real company data across real tools, can a system
            accurately answer basic questions? Who&apos;s on the engineering team? What
            changed last week? Which source wins when Slack and the CRM disagree?
          </p>
          <Link
            href="/benchmark"
            className="text-sm font-semibold"
            style={{ color: "var(--accent)" }}
          >
            Learn about the benchmark →
          </Link>
        </div>
      </section>

      {/* Final CTA — dark */}
      <section
        style={{
          background: "var(--bg-inverse)",
          padding: "120px 24px",
        }}
      >
        <div className="mx-auto text-center" style={{ maxWidth: "640px" }}>
          <h2
            className="font-bold mb-6"
            style={{
              fontSize: "clamp(32px, 4vw, 40px)",
              color: "var(--text-inverse)",
              letterSpacing: "-0.02em",
              lineHeight: "1.2",
            }}
          >
            Your company needs a brain.
          </h2>
          <p
            className="mb-10"
            style={{
              fontSize: "20px",
              color: "rgba(247,246,243,0.65)",
              lineHeight: "1.6",
            }}
          >
            One that&apos;s continuously updated. Source-grounded. Conflict-resolved.
            That any agent can read from. That compounds every day it runs.
          </p>
          <Link
            href="/interview"
            className="inline-block px-7 py-4 font-semibold text-sm"
            style={{
              background: "var(--bg-surface)",
              color: "var(--text-primary)",
            }}
          >
            Start building your company brain
          </Link>
          <p
            className="mt-6 text-xs"
            style={{ color: "rgba(247,246,243,0.40)" }}
          >
            The companies that start building today will have six months of
            accumulated understanding that no amount of money can buy later.
          </p>
        </div>
      </section>

      {/* Footer — dark, 4-column */}
      <footer
        style={{
          background: "var(--bg-inverse)",
          borderTop: "1px solid rgba(247,246,243,0.08)",
          padding: "80px 24px 48px",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: "1120px" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div>
              <p
                className="font-bold text-lg mb-3"
                style={{ color: "var(--text-inverse)" }}
              >
                Grove
              </p>
              <p
                className="text-sm mb-6"
                style={{ color: "rgba(247,246,243,0.5)" }}
              >
                Access was the easy part.
              </p>
              <p
                className="text-xs"
                style={{ color: "rgba(247,246,243,0.3)" }}
              >
                © 2026 Grove
              </p>
            </div>

            {[
              {
                heading: "Product",
                links: ["How It Works", "Integrations", "Benchmark", "Pricing"],
                hrefs: ["/how-it-works", "/integrations", "/benchmark", "/pricing"],
              },
              {
                heading: "Docs",
                links: ["Getting Started", "Context Graph", "Filesystem Interface", "API Reference"],
                hrefs: ["/docs/getting-started", "/docs/context-graph", "/docs/filesystem-interface", "/docs/api"],
              },
              {
                heading: "Company",
                links: ["Blog", "GitHub", "Contact"],
                hrefs: ["/blog", "https://github.com", "mailto:hello@grove.so"],
              },
            ].map((col) => (
              <div key={col.heading}>
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-4"
                  style={{ color: "rgba(247,246,243,0.4)" }}
                >
                  {col.heading}
                </p>
                <ul className="space-y-3">
                  {col.links.map((label, i) => (
                    <li key={label}>
                      <Link
                        href={col.hrefs[i]}
                        className="text-sm"
                        style={{ color: "rgba(247,246,243,0.6)" }}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
