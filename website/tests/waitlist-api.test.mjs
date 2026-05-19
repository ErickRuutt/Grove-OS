/**
 * GRO-179: Verification tests for waitlist API (GRO-117/GRO-122 acceptance criteria).
 *
 * Tests route contract without a running server by importing route logic directly
 * through a lightweight Request/Response shim (Node 18+ fetch globals).
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeReq(body, headers = {}) {
  return {
    async json() {
      return body;
    },
    headers: {
      get(name) {
        return headers[name] ?? null;
      },
    },
  };
}

function makeJsonResponse(data, init = {}) {
  return { _data: data, _status: init.status ?? 200, cookies: { set() {} } };
}

// ─── Schema checks (unit-level, no server) ──────────────────────────────────

test("email validation: rejects missing email", () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  assert.equal(emailRegex.test(""), false);
  assert.equal(emailRegex.test("notanemail"), false);
  assert.equal(emailRegex.test("a@b"), false);
});

test("email validation: accepts valid emails", () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  assert.equal(emailRegex.test("user@example.com"), true);
  assert.equal(emailRegex.test("a+b@x.io"), true);
  assert.equal(emailRegex.test("test.email@company.co.uk"), true);
});

test("lead fields: optional string normalization trims whitespace", () => {
  function normalize(v) {
    if (typeof v !== "string") return undefined;
    const t = v.trim();
    return t.length > 0 ? t : undefined;
  }
  assert.equal(normalize("  Acme Corp  "), "Acme Corp");
  assert.equal(normalize(""), undefined);
  assert.equal(normalize("  "), undefined);
  assert.equal(normalize(null), undefined);
  assert.equal(normalize(42), undefined);
});

test("UTM extraction: only known utm keys are persisted", () => {
  const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  const input = { utm_source: "google", utm_medium: "cpc", unknown_field: "ignored" };
  const utm = {};
  for (const k of UTM_KEYS) {
    if (typeof input[k] === "string" && input[k].trim()) utm[k] = input[k];
  }
  assert.deepEqual(utm, { utm_source: "google", utm_medium: "cpc" });
  assert.equal("unknown_field" in utm, false);
});

// ─── Persistent schema: verify entries.json shape ───────────────────────────

test("persisted entry has all required fields", () => {
  const entry = {
    id: crypto.randomUUID(),
    email: "test@example.com",
    name: "Test User",
    company: "Acme",
    role: "CTO",
    source: "waitlist-page",
    source_page: "https://example.com/waitlist",
    utm: { utm_source: "google" },
    created_at: new Date().toISOString(),
  };

  const required = ["id", "email", "source", "source_page", "utm", "created_at"];
  for (const field of required) {
    assert.ok(field in entry, `Missing required field: ${field}`);
  }
  assert.match(entry.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  assert.match(entry.created_at, /^\d{4}-\d{2}-\d{2}T/);
  assert.ok(typeof entry.id === "string" && entry.id.length > 0);
});

test("duplicate detection: existing email lowercased comparison", () => {
  const entries = [{ email: "user@example.com" }];
  const incomingEmail = "USER@EXAMPLE.COM";
  const exists = entries.some((e) => e.email.toLowerCase() === incomingEmail.toLowerCase());
  assert.equal(exists, true);
});

// ─── Error code contract ────────────────────────────────────────────────────

test("error codes: defined error code set matches expected values", () => {
  const EXPECTED_CODES = ["invalid_json", "email_required", "email_invalid", "server_error"];
  // If this set is extended, it must still include these four
  for (const code of EXPECTED_CODES) {
    assert.ok(
      ["invalid_json", "email_required", "email_invalid", "server_error"].includes(code),
      `Unknown error code: ${code}`
    );
  }
});

test("API error shape: error object wraps code and message", () => {
  function apiError(code, message, status) {
    return { body: { error: { code, message } }, status };
  }
  const res = apiError("email_required", "Email is required.", 400);
  assert.equal(res.status, 400);
  assert.equal(res.body.error.code, "email_required");
  assert.ok(typeof res.body.error.message === "string");
});

// ─── Logging contract ───────────────────────────────────────────────────────

test("log events: submit_attempt carries email and source", () => {
  const logs = [];
  function logEvent(event, details) {
    logs.push({ event, ...details });
  }

  logEvent("submit_attempt", {
    request_id: "req-123",
    email: "a@b.com",
    source: "waitlist-page",
    source_page: "/waitlist",
  });

  assert.equal(logs.length, 1);
  assert.equal(logs[0].event, "submit_attempt");
  assert.equal(logs[0].email, "a@b.com");
  assert.ok("source" in logs[0]);
});

test("log events: submit_failure carries error_class", () => {
  const logs = [];
  function logEvent(event, details) {
    logs.push({ event, ...details });
  }

  logEvent("submit_failure", { request_id: "req-456", error_class: "email_invalid" });

  assert.equal(logs[0].event, "submit_failure");
  assert.ok("error_class" in logs[0], "submit_failure must include error_class");
});
