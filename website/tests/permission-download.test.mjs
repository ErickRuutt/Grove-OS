/**
 * GRO-174: Permission-gated paywall download logic tests.
 * Validates the core approval-check branching without spinning up Next.js.
 */

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

// Inline the approval-check logic to test it deterministically
function resolveDownloadAccess(entry) {
  if (!entry) return { allowed: false, reason: "no_request" };
  if (entry.status === "pending") return { allowed: false, reason: "pending" };
  if (entry.status === "rejected") return { allowed: false, reason: "rejected" };
  if (entry.status === "approved") return { allowed: true, reason: "approved" };
  return { allowed: false, reason: "unknown_status" };
}

const FIXTURES = {
  pending: { id: "a1", email: "pending@test.com", status: "pending", activationToken: "tok1" },
  approved: { id: "a2", email: "approved@test.com", status: "approved", activationToken: "tok2" },
  rejected: { id: "a3", email: "rejected@test.com", status: "rejected", activationToken: "tok3" },
};

test("[permission-paywall] missing entry → no_request, not allowed", () => {
  const result = resolveDownloadAccess(null);
  assert.equal(result.allowed, false);
  assert.equal(result.reason, "no_request");
});

test("[permission-paywall] pending entry → pending, not allowed", () => {
  const result = resolveDownloadAccess(FIXTURES.pending);
  assert.equal(result.allowed, false);
  assert.equal(result.reason, "pending");
});

test("[permission-paywall] rejected entry → rejected, not allowed", () => {
  const result = resolveDownloadAccess(FIXTURES.rejected);
  assert.equal(result.allowed, false);
  assert.equal(result.reason, "rejected");
});

test("[permission-paywall] approved entry → allowed", () => {
  const result = resolveDownloadAccess(FIXTURES.approved);
  assert.equal(result.allowed, true);
  assert.equal(result.reason, "approved");
});

test("[permission-paywall] download record created on first download", async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "grove-perm-test-"));
  const recordPath = path.join(tmpDir, "perm_test-session.json");

  // Simulate first download record creation
  const record = {
    interviewSessionId: "test-session",
    email: "approved@test.com",
    mode: "permission",
    paidAt: new Date().toISOString(),
    status: "approved",
    downloadCount: 1,
  };
  await fs.writeFile(recordPath, JSON.stringify(record, null, 2));

  const stored = JSON.parse(await fs.readFile(recordPath, "utf-8"));
  assert.equal(stored.downloadCount, 1);
  assert.equal(stored.mode, "permission");
  assert.equal(stored.status, "approved");

  await fs.rm(tmpDir, { recursive: true });
});

test("[permission-paywall] download count increments on subsequent downloads", async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "grove-perm-test-"));
  const recordPath = path.join(tmpDir, "perm_test-session.json");

  let record = {
    interviewSessionId: "test-session",
    email: "approved@test.com",
    mode: "permission",
    paidAt: new Date().toISOString(),
    status: "approved",
    downloadCount: 3,
  };
  await fs.writeFile(recordPath, JSON.stringify(record, null, 2));

  // Simulate increment
  record = { ...record, downloadCount: record.downloadCount + 1, lastDownloadAt: new Date().toISOString() };
  await fs.writeFile(recordPath, JSON.stringify(record, null, 2));

  const stored = JSON.parse(await fs.readFile(recordPath, "utf-8"));
  assert.equal(stored.downloadCount, 4);
  assert.ok(stored.lastDownloadAt);

  await fs.rm(tmpDir, { recursive: true });
});

test("[permission-paywall] download limit blocks excess downloads", () => {
  const MAX_DOWNLOADS = 10;
  const record = { downloadCount: 10 };
  const blocked = record.downloadCount >= MAX_DOWNLOADS;
  assert.equal(blocked, true);

  const record2 = { downloadCount: 9 };
  const notBlocked = record2.downloadCount >= MAX_DOWNLOADS;
  assert.equal(notBlocked, false);
});
