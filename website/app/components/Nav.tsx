"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Integrations", href: "/integrations" },
  { label: "Benchmark", href: "/benchmark" },
  { label: "Blog", href: "/blog" },
  { label: "Docs", href: "/docs" },
  { label: "Interview", href: "/interview" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{
        background: scrolled ? "var(--bg-surface)" : "var(--bg-base)",
        borderBottom: "1px solid var(--border)",
        boxShadow: scrolled ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
        transition: "background 150ms ease, box-shadow 150ms ease",
      }}
    >
      <div
        className="mx-auto px-6 flex items-center justify-between"
        style={{ maxWidth: "1120px", height: "64px" }}
      >
        <Link
          href="/"
          className="font-bold text-lg"
          style={{ color: "var(--text-primary)", textDecoration: "none" }}
        >
          Grove
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/waitlist"
            className="hidden md:block text-sm font-medium px-7 py-3"
            style={{
              background: "var(--bg-inverse)",
              color: "var(--text-inverse)",
            }}
          >
            Join waitlist
          </Link>
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: "var(--text-primary)" }}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-4"
          style={{ borderTop: "1px solid var(--border)", background: "var(--bg-surface)" }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-lg font-medium py-2"
              style={{ color: "var(--text-primary)" }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/waitlist"
            onClick={() => setMobileOpen(false)}
            className="text-sm font-medium px-7 py-4 text-center"
            style={{
              background: "var(--bg-inverse)",
              color: "var(--text-inverse)",
            }}
          >
            Join waitlist
          </Link>
        </div>
      )}
    </nav>
  );
}
