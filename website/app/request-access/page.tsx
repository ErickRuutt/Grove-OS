"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "../components/Nav";

type FormState = "idle" | "loading" | "success" | "already_submitted" | "error";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function RequestAccessPage() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [fields, setFields] = useState({
    email: "",
    name: "",
    company: "",
    use_case: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fields.email || !fields.name || !fields.company || !fields.use_case) {
      setErrorMessage("Please fill in all fields so we can review your request.");
      return;
    }
    if (!isValidEmail(fields.email)) {
      setErrorMessage("Enter a valid work email address.");
      return;
    }

    setFormState("loading");

    try {
      const res = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const data = await res.json();

      if (res.ok) {
        setSubmittedEmail(fields.email);
        setFormState(
          data.status === "already_submitted" ? "already_submitted" : "success"
        );
      } else {
        setFormState("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setFormState("error");
      setErrorMessage("Network error. Please try again.");
    }
  };

  if (formState === "success" || formState === "already_submitted") {
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
          <div className="mx-auto text-center" style={{ maxWidth: "480px" }}>
            <div style={{ fontSize: "48px", marginBottom: "24px" }}>✉</div>
            <h1
              className="font-bold mb-4"
              style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.02em" }}
            >
              {formState === "already_submitted"
                ? "Already submitted."
                : "You're on the list."}
            </h1>
            <p style={{ fontSize: "17px", color: "rgba(247,246,243,0.6)", lineHeight: "1.7", marginBottom: "40px" }}>
              {formState === "already_submitted"
                ? `We already have your request. We'll reach out to ${submittedEmail} when your access is ready.`
                : "We've received your request and will review it shortly."}
            </p>

            <div
              style={{
                textAlign: "left",
                borderTop: "1px solid rgba(247,246,243,0.12)",
                paddingTop: "32px",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-6"
                style={{ color: "rgba(247,246,243,0.4)" }}
              >
                What happens next
              </p>
              {[
                {
                  n: "1",
                  title: "Review",
                  body: "We go through every request manually. Give us 24-48 hours.",
                },
                {
                  n: "2",
                  title: "Email",
                  body: `You'll hear from us at ${submittedEmail || "your email"} when your access is ready.`,
                },
                {
                  n: "3",
                  title: "Chat",
                  body: "Log in and start using Grove right away.",
                },
              ].map((step) => (
                <div key={step.n} className="flex gap-4 mb-6">
                  <span
                    className="flex-shrink-0 font-mono font-bold text-sm"
                    style={{ color: "var(--accent)", marginTop: "2px" }}
                  >
                    {step.n}
                  </span>
                  <div>
                    <p className="font-semibold mb-1" style={{ color: "var(--text-inverse)" }}>
                      {step.title}
                    </p>
                    <p style={{ fontSize: "15px", color: "rgba(247,246,243,0.55)" }}>
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-3 items-center">
              <Link
                href="/"
                style={{
                  fontSize: "14px",
                  color: "rgba(247,246,243,0.5)",
                  textDecoration: "underline",
                }}
              >
                Learn more about Grove
              </Link>
              <p style={{ fontSize: "13px", color: "rgba(247,246,243,0.3)" }}>
                Moving fast?{" "}
                <a href="mailto:access@grove-os.com" style={{ color: "rgba(247,246,243,0.45)" }}>
                  access@grove-os.com
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

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
            Get early access to Grove.
          </h1>

          <p className="mb-4" style={{ fontSize: "17px", color: "rgba(247,246,243,0.6)", lineHeight: "1.7" }}>
            Grove is a new kind of OS for companies that move fast. We&apos;re opening
            access carefully — tell us about your team.
          </p>

          <ul className="mb-10 space-y-2" style={{ fontSize: "15px", color: "rgba(247,246,243,0.55)" }}>
            {[
              "Chat with an AI that knows your company",
              "Private, audited, and secure",
              "Early access to features as they ship",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span style={{ color: "var(--accent)" }}>+</span>
                {item}
              </li>
            ))}
          </ul>

          <form onSubmit={handleSubmit} noValidate>
            {(
              [
                { id: "ra-email", name: "email", label: "Work email", type: "email", placeholder: "ada@company.com", autocomplete: "email" },
                { id: "ra-name", name: "name", label: "Full name", type: "text", placeholder: "Ada Lovelace", autocomplete: "name" },
                { id: "ra-company", name: "company", label: "Company", type: "text", placeholder: "Analytic Engine Co.", autocomplete: "organization" },
              ] as const
            ).map((f) => (
              <div key={f.id} className="mb-4">
                <label
                  htmlFor={f.id}
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 500,
                    marginBottom: "6px",
                    color: "rgba(247,246,243,0.55)",
                  }}
                >
                  {f.label}
                </label>
                <input
                  id={f.id}
                  name={f.name}
                  type={f.type}
                  required
                  autoComplete={f.autocomplete}
                  value={fields[f.name as keyof typeof fields]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  style={{
                    background: "rgba(247,246,243,0.08)",
                    border: "1px solid rgba(247,246,243,0.15)",
                    color: "var(--text-inverse)",
                    padding: "12px 14px",
                    fontSize: "14px",
                    width: "100%",
                    outline: "none",
                  }}
                />
              </div>
            ))}

            <div className="mb-6">
              <label
                htmlFor="ra-use-case"
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 500,
                  marginBottom: "6px",
                  color: "rgba(247,246,243,0.55)",
                }}
              >
                How will you use Grove?
              </label>
              <textarea
                id="ra-use-case"
                name="use_case"
                required
                rows={3}
                value={fields.use_case}
                onChange={handleChange}
                placeholder="Tell us about your team and what you're trying to solve..."
                style={{
                  background: "rgba(247,246,243,0.08)",
                  border: "1px solid rgba(247,246,243,0.15)",
                  color: "var(--text-inverse)",
                  padding: "12px 14px",
                  fontSize: "14px",
                  width: "100%",
                  outline: "none",
                  resize: "none",
                }}
              />
            </div>

            {errorMessage && (
              <p style={{ fontSize: "13px", color: "#f87171", marginBottom: "16px" }}>
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={formState === "loading"}
              style={{
                width: "100%",
                padding: "14px",
                background: "var(--bg-surface)",
                color: "var(--text-primary)",
                fontSize: "14px",
                fontWeight: 600,
                border: "none",
                cursor: formState === "loading" ? "not-allowed" : "pointer",
                opacity: formState === "loading" ? 0.7 : 1,
              }}
            >
              {formState === "loading" ? "Submitting…" : "Request access →"}
            </button>
          </form>

          <p
            className="mt-6 text-xs text-center"
            style={{ color: "rgba(247,246,243,0.35)" }}
          >
            We review every request. Expect a reply within 24-48 hours.
          </p>
        </div>
      </section>
    </div>
  );
}
