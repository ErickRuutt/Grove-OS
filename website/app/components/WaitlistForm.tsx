"use client";

import { useState } from "react";

interface WaitlistFormProps {
  source?: string;
  variant?: "dark" | "light";
  fromInterview?: boolean;
}

type FormState = "idle" | "loading" | "success" | "already_registered" | "error";

export default function WaitlistForm({
  source = "website",
  variant = "dark",
  fromInterview = false,
}: WaitlistFormProps) {
  const [formState, setFormState] = useState<FormState>("idle");
  const [fields, setFields] = useState({
    first_name: "",
    last_name: "",
    email: "",
    company: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const isDark = variant === "dark";
  const inputStyle = {
    background: isDark ? "rgba(247,246,243,0.08)" : "var(--bg-surface)",
    border: `1px solid ${isDark ? "rgba(247,246,243,0.15)" : "var(--border)"}`,
    color: isDark ? "var(--text-inverse)" : "var(--text-primary)",
    padding: "12px 14px",
    fontSize: "14px",
    width: "100%",
    outline: "none",
  };
  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: 500,
    marginBottom: "6px",
    color: isDark ? "rgba(247,246,243,0.55)" : "var(--text-secondary)",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, source }),
      });

      const data = await res.json();

      if (res.ok) {
        setFormState(data.status === "already_registered" ? "already_registered" : "success");
      } else {
        setFormState("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setFormState("error");
      setErrorMessage("Network error. Please try again.");
    }
  };

  if (formState === "success" || formState === "already_registered") {
    const isInterviewSuccess = formState === "success" && fromInterview;
    const isAlreadyRegistered = formState === "already_registered";

    return (
      <div
        style={{
          textAlign: "center",
          padding: "32px",
          border: `1px solid ${isDark ? "rgba(247,246,243,0.15)" : "var(--border)"}`,
          background: isDark ? "rgba(247,246,243,0.06)" : "var(--bg-surface)",
        }}
      >
        <p
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: isDark ? "var(--text-inverse)" : "var(--text-primary)",
            marginBottom: "8px",
          }}
        >
          {isInterviewSuccess
            ? "You're in."
            : isAlreadyRegistered
            ? "Already registered."
            : "You're on the list."}
        </p>
        <p
          style={{
            fontSize: "15px",
            color: isDark ? "rgba(247,246,243,0.55)" : "var(--text-secondary)",
            marginBottom: isInterviewSuccess ? "20px" : "0",
          }}
        >
          {isInterviewSuccess
            ? "Your access is confirmed. You can now start your Grove interview."
            : isAlreadyRegistered
            ? "You're already on the waitlist. We'll be in touch."
            : "We'll reach out when Grove is ready for your company."}
        </p>
        {isInterviewSuccess && (
          <a
            href="/interview"
            style={{
              display: "inline-block",
              padding: "12px 28px",
              background: isDark ? "var(--bg-surface)" : "var(--bg-inverse)",
              color: isDark ? "var(--text-primary)" : "var(--text-inverse)",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Start your interview →
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="wl-first-name" style={labelStyle}>
            First name
          </label>
          <input
            id="wl-first-name"
            name="first_name"
            type="text"
            required
            autoComplete="given-name"
            value={fields.first_name}
            onChange={handleChange}
            placeholder="Ada"
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="wl-last-name" style={labelStyle}>
            Last name
          </label>
          <input
            id="wl-last-name"
            name="last_name"
            type="text"
            required
            autoComplete="family-name"
            value={fields.last_name}
            onChange={handleChange}
            placeholder="Lovelace"
            style={inputStyle}
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="wl-email" style={labelStyle}>
          Work email
        </label>
        <input
          id="wl-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={fields.email}
          onChange={handleChange}
          placeholder="ada@analyticengine.com"
          style={inputStyle}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="wl-company" style={labelStyle}>
          Company
        </label>
        <input
          id="wl-company"
          name="company"
          type="text"
          required
          autoComplete="organization"
          value={fields.company}
          onChange={handleChange}
          placeholder="Analytic Engine Co."
          style={inputStyle}
        />
      </div>

      {formState === "error" && (
        <p
          style={{
            fontSize: "13px",
            color: "#e53e3e",
            marginBottom: "16px",
          }}
        >
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={formState === "loading"}
        style={{
          width: "100%",
          padding: "14px",
          background: isDark ? "var(--bg-surface)" : "var(--bg-inverse)",
          color: isDark ? "var(--text-primary)" : "var(--text-inverse)",
          fontSize: "14px",
          fontWeight: 600,
          border: "none",
          cursor: formState === "loading" ? "not-allowed" : "pointer",
          opacity: formState === "loading" ? 0.7 : 1,
        }}
      >
        {formState === "loading" ? "Joining…" : "Join the waitlist"}
      </button>
    </form>
  );
}
