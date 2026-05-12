import Link from "next/link";
import Nav from "../../components/Nav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What it means for agents to understand a company — Grove",
  description:
    "Not search across its tools. Not retrieve its documents. Understand it — the way a great chief of staff understands the company after six months.",
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
  blockquote: {
    borderLeft: "3px solid var(--accent)",
    paddingLeft: "20px",
    marginTop: "32px",
    marginBottom: "32px",
  } as React.CSSProperties,
};

export default function BlogPost() {
  return (
    <div style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <Nav />

      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ marginBottom: "48px" }}>
          <Link
            href="/blog"
            className="text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            ← Blog
          </Link>
        </div>

        <header style={{ marginBottom: "64px" }}>
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-6"
            style={{ color: "var(--text-muted)" }}
          >
            April 2026
          </p>
          <h1
            className="font-bold mb-6"
            style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              letterSpacing: "-0.02em",
              lineHeight: "1.15",
            }}
          >
            What it means for agents to understand a company
          </h1>
          <p
            style={{
              fontSize: "20px",
              color: "var(--text-secondary)",
              lineHeight: "1.6",
            }}
          >
            Not search across its tools. Not retrieve its documents. Understand it.
          </p>
        </header>

        <div>
          <p style={articleStyles.p}>
            The way a great chief of staff understands the company after six months.
            They know who actually makes decisions, not just who&apos;s on the org chart.
            They know which Slack channel has the real conversation and which one is
            performative. They know the CRM says the deal closed in March but the
            handshake happened in January over a dinner nobody documented. They know
            what changed last week and why it matters this week.
          </p>

          <p style={articleStyles.p}>
            That understanding comes from synthesis. Watching hundreds of signals
            across dozens of sources and building a model of reality that&apos;s more
            accurate than any single source.
          </p>

          <p style={articleStyles.p}>
            No agent does this today.
          </p>

          <p style={articleStyles.p}>
            You deploy agents across your company. You connect them to your tools
            with MCP servers or API integrations. Your agents can search Slack, read
            Google Drive, query your CRM. You&apos;ve given them access to everything.
          </p>

          <p style={articleStyles.p}>
            They still don&apos;t understand anything.
          </p>

          <p style={articleStyles.p}>
            Ask your agent who owns the relationship with your biggest customer. It
            searches Gmail, finds a recent thread, gives you a name. Ask it again
            from a different tool and you get a different name. Ask about your top
            priorities this quarter and it pulls from whatever strategic document it
            finds first, even if that document is six months old and three pivots
            behind.
          </p>

          <p style={articleStyles.p}>
            The failure mode is not that the agent can&apos;t find information. The
            failure mode is that it finds too much, can&apos;t tell what&apos;s current,
            can&apos;t resolve conflicts between sources, and confidently presents a
            fragment as the whole truth.
          </p>

          <p style={articleStyles.p}>
            Access means the agent can reach your data. Understanding means the
            agent knows what that data means in the context of everything else. A
            new employee with access to your Google Drive, Slack, and CRM has
            access. After six months of absorbing context, attending meetings,
            hearing the stories behind decisions, learning which sources matter and
            which are outdated, they have understanding.
          </p>

          <p style={articleStyles.p}>
            That transition is the entire game. Nobody is building it.
          </p>

          <h2 style={articleStyles.h2}>The industry framed the problem wrong.</h2>

          <p style={articleStyles.p}>
            The current framing is about retrieval. How do we get the right
            information to the agent at the right time? RAG pipelines, vector
            databases, semantic search, MCP servers. All retrieval infrastructure.
            All variations on the same idea: when the agent needs something, go
            find it.
          </p>

          <blockquote style={articleStyles.blockquote}>
            <p
              style={{
                fontSize: "18px",
                lineHeight: "1.7",
                color: "var(--text-primary)",
                fontStyle: "normal",
              }}
            >
              Retrieval is a scavenger hunt. Every time your agent needs context,
              it searches your tools from scratch. No prior understanding, no
              accumulated knowledge, no sense of what&apos;s changed since the last
              time it looked. Starting from zero, every single time.
            </p>
          </blockquote>

          <p style={articleStyles.p}>
            Imagine hiring a new employee every morning, giving them full access to
            every system, and asking them to make decisions by lunch. They&apos;ll find
            things. They&apos;ll be confidently wrong about half of it. You&apos;ll spend your
            afternoon correcting them.
          </p>

          <p style={articleStyles.p}>
            The alternative is synthesized understanding. A company brain. Instead
            of searching at runtime, you build a persistent model of the company
            that stays current as sources change. The agent doesn&apos;t search. It
            reads. It already knows.
          </p>

          <p style={articleStyles.p}>
            Retrieval says: find the answer when someone asks the question.
            Synthesized understanding says: maintain a continuously updated
            representation of reality so the answer already exists before anyone
            asks. The difference sounds subtle. In practice, it changes everything.
            Retrieval gives you fragments. Synthesis gives you a worldview.
          </p>

          <h2 style={articleStyles.h2}>
            Building that worldview requires solving problems the industry has mostly ignored.
          </h2>

          <p style={articleStyles.p}>
            Your company&apos;s data contradicts itself constantly. Slack says the
            project deadline is Friday. The Linear board says next Wednesday. The
            last meeting recording has the PM saying &ldquo;end of month.&rdquo; A retrieval
            system returns whichever it finds first. An understanding system
            resolves the conflict, determines which source is most authoritative,
            and presents a single answer with its reasoning.
          </p>

          <p style={articleStyles.p}>
            A person appears in your data as their email address in one system,
            their username in another, their full name in the CRM, a casual
            reference in a meeting transcript, and initials on a calendar invite.
            To a retrieval system, those are five unrelated text strings. To an
            understanding system, they&apos;re the same person, and everything they&apos;ve
            said across every channel gets unified under one identity.
          </p>

          <p style={articleStyles.p}>
            Information decays. The strategy doc from January is outdated. The team
            page hasn&apos;t been updated since the last reorg. The project status in
            the wiki was accurate two sprints ago. A retrieval system treats a
            six-month-old document with the same confidence as a message sent ten
            minutes ago. An understanding system tracks when information was last
            confirmed and knows what might be stale.
          </p>

          <p style={articleStyles.p}>
            Not all sources are equal. When the CEO&apos;s email says one thing and a
            random Slack thread says another, the email wins. When the signed
            contract says one thing and the CRM field says another, the contract
            wins. An understanding system needs a hierarchy of source authority. A
            retrieval system has no concept of this.
          </p>

          <p style={articleStyles.p}>
            And then there&apos;s the hardest problem: combining multiple sources into
            something none of them say individually. Nobody wrote a document that
            says &ldquo;the infrastructure migration is at risk because the lead engineer
            is out next week, the dependency on the payments team is unresolved, and
            the original timeline assumed we&apos;d have the new hire onboarded by now.&rdquo;
            That understanding only exists when you combine the project tracker, the
            calendar, the hiring pipeline, and last week&apos;s standup notes.
          </p>

          <p style={articleStyles.p}>
            These problems are not new. Intelligence analysts and investigative
            journalists do this work every day. Language models make it possible to
            do it computationally. Not perfectly, but well enough to be useful and
            improving fast.
          </p>

          <h2 style={articleStyles.h2}>
            The delivery mechanism matters more than people think.
          </h2>

          <p style={articleStyles.p}>
            Once you&apos;ve built a context graph — a synthesized, conflict-resolved,
            source-tracked representation of a company — how do you get it to
            agents?
          </p>

          <p style={articleStyles.p}>
            Files.
          </p>

          <p style={articleStyles.p}>
            Every agent already knows how to read files. Claude Code reads from a
            project directory. Cursor reads from your codebase. OpenClaw reads from
            its local filesystem. The filesystem is the one interface every agent
            already supports.
          </p>

          <p style={articleStyles.p}>
            A context graph that surfaces as a filesystem means any agent, from any
            vendor, using any framework, can read from it without custom
            integration. Just files on disk, structured and current, that the agent
            reads when it boots up.
          </p>

          <p style={articleStyles.p}>
            The filesystem is an architectural choice, not just a delivery
            mechanism. The context layer is decoupled from any specific agent,
            vendor, or workflow. Your company&apos;s understanding of itself lives in one
            place. Every agent reads from it. When you switch agents, add new tools,
            or change your stack, the context persists.
          </p>

          <p style={articleStyles.p}>
            But a filesystem full of static snapshots is a diary, not a brain. What
            makes it a brain is what happens before the files are written. The
            synthesis layer takes raw, messy, contradictory signal from Slack
            threads and email chains and meeting transcripts and does the
            interpretive work that previously only happened inside a person&apos;s head.
            It resolves conflicts, ranks sources, tracks what&apos;s current, builds
            identity across fragmented mentions. That interpretation is the product.
            The files are just the output.
          </p>

          <h2 style={articleStyles.h2}>
            There should be a way to test how well a system does this. There isn&apos;t.
          </h2>

          <p style={articleStyles.p}>
            We have benchmarks for code generation, mathematical reasoning,
            long-context recall, tool use, instruction following. No benchmark asks:
            given a company&apos;s real data across its real tools, can this system
            accurately answer basic questions about the company?
          </p>

          <p style={articleStyles.p}>
            Who&apos;s on the engineering team? What are the active projects? Who owns
            the Acme relationship? What changed in the last week? What&apos;s the current
            status of the infrastructure migration? Which source is correct when
            Slack and the CRM disagree?
          </p>

          <p style={articleStyles.p}>
            Any competent employee could answer these after a few weeks. No agent
            can answer them reliably today, because none of them are doing the
            synthesis work required.
          </p>

          <p style={articleStyles.p}>
            We&apos;re building a benchmark to test this. Not a memory benchmark that
            tests whether a system can recall facts from conversations. A context
            benchmark that tests whether a system can synthesize fragmented,
            contradictory, multi-source company data into accurate answers. Early
            results are humbling — for everyone, including us. But at least now
            there&apos;s a way to measure progress.
          </p>

          <h2 style={articleStyles.h2}>The real moat is time, not technology.</h2>

          <p style={articleStyles.p}>
            A context graph gets better every day it runs. Day one, it knows a
            little. Day thirty, it has absorbed thousands of messages, hundreds of
            documents, dozens of meetings. It has resolved conflicts, built identity
            maps, tracked what changed and what didn&apos;t. The understanding on day
            thirty is qualitatively different from day one.
          </p>

          <p style={articleStyles.p}>
            Every new data point makes the existing graph more valuable. A new Slack
            message doesn&apos;t just add one fact. It might confirm a project status,
            update a relationship, reveal a priority shift, and resolve a conflict
            between two older sources.
          </p>

          <p style={articleStyles.p}>
            You can&apos;t fast-forward this. You can&apos;t write a check and skip to month
            six. The understanding has to accumulate.
          </p>

          <p style={articleStyles.p}>
            The cost of waiting is not &ldquo;we don&apos;t have it yet.&rdquo; It&apos;s &ldquo;we&apos;re falling
            further behind every day we don&apos;t start.&rdquo; The company that starts
            building today will have six months of compounded understanding that no
            amount of money can buy later.
          </p>

          <p style={articleStyles.p}>
            That&apos;s the real moat. Not the technology, which can be replicated. The
            accumulated understanding of your specific company. That&apos;s proprietary.
            That compounds. And it only grows with time.
          </p>

          <h2 style={articleStyles.h2}>
            The industry spent 2025 giving agents access. 2026 is about understanding.
          </h2>

          <p style={articleStyles.p}>
            Connectors, MCP servers, tool integrations. That work was necessary.
            Access turned out to be the easy part.
          </p>

          <p style={articleStyles.p}>
            2026 is about understanding. Synthesizing what&apos;s in those tools into a
            coherent, current, trustworthy representation of reality. A
            representation every agent can read from. One that resolves conflicts
            instead of ignoring them, tracks sources instead of hallucinating them,
            stays current instead of going stale.
          </p>

          <p
            style={{
              ...articleStyles.p,
              color: "var(--text-primary)",
              fontWeight: 500,
            }}
          >
            Your company needs a brain.
          </p>

          <p style={articleStyles.p}>
            A continuously updated, source-grounded, conflict-resolved
            understanding of who you are, what you&apos;re doing, and how you work.
            Delivered as files any agent can read. Compounding every day.
          </p>
        </div>

        <div
          style={{
            marginTop: "80px",
            paddingTop: "48px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <p
            className="font-semibold mb-4"
            style={{ fontSize: "18px" }}
          >
            Ready to build your company brain?
          </p>
          <Link
            href="/interview"
            className="inline-block px-7 py-4 font-semibold text-sm"
            style={{
              background: "var(--bg-inverse)",
              color: "var(--text-inverse)",
            }}
          >
            Start the interview →
          </Link>
        </div>
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
