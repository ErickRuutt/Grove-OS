import Nav from "../components/Nav";
import WaitlistForm from "../components/WaitlistForm";

export const metadata = {
  title: "Join the waitlist — Grove",
  description:
    "Get early access to Grove: the company brain that keeps your AI agents continuously informed.",
};

interface Props {
  searchParams: Promise<{ from?: string }>;
}

export default async function WaitlistPage({ searchParams }: Props) {
  const params = await searchParams;
  const fromInterview = params.from === "interview";

  return (
    <div style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <Nav />

      <section
        style={{
          background: "var(--bg-inverse)",
          color: "var(--text-inverse)",
          padding: "120px 24px 140px",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: "480px" }}>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-6"
            style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
          >
            Early access
          </p>

          <h1
            className="font-bold mb-5"
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              lineHeight: "1.15",
              letterSpacing: "-0.02em",
              color: "var(--text-inverse)",
            }}
          >
            {fromInterview
              ? "You need access to use the interview tool."
              : "Get first access to Grove."}
          </h1>

          <p
            className="mb-10"
            style={{
              fontSize: "17px",
              color: "rgba(247,246,243,0.6)",
              lineHeight: "1.7",
            }}
          >
            {fromInterview
              ? "Grove’s interview tool is in early access. Request a spot below — once approved, you’ll go straight to the interview."
              : "We’re onboarding a small group of early companies. Leave your details and we’ll reach out when a spot opens up."}
          </p>

          <WaitlistForm
            source={fromInterview ? "interview-gate" : "waitlist-page"}
            variant="dark"
            fromInterview={fromInterview}
          />
        </div>
      </section>
    </div>
  );
}
