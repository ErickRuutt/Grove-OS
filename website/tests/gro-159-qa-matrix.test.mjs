/**
 * GRO-159 QA Matrix: deterministic fixture validation for confidence threshold behavior.
 *
 * Fixture mapping (discrete implementation: confidence = satisfied/6):
 *   low_confidence_0849  → 5/6 ≈ 0.8333 (nearest value below 0.85) → RISK PATH
 *   boundary_confidence_0850 → threshold concept; demonstrated with 6/6 = 1.0 >= 0.85 → NON-RISK PATH
 *   high_confidence_0900 → 6/6 = 1.0 → NON-RISK PATH
 *
 * Also covers: schema stability and malformed-confidence handling.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  LOW_CONFIDENCE_THRESHOLD,
  LOW_CONFIDENCE_FOLLOWUPS,
  getFollowUpsForConfidence,
  getClassificationConfidence,
  getLowConfidenceFollowUps,
} from "../lib/interview-confidence.js";

// Fixture: low_confidence_0849 — 5 of 6 criteria satisfied (confidence ≈ 0.833 < 0.85)
const FIXTURE_LOW_0849 = "b2b software self-serve smb subscription";
// Fixture: boundary_confidence_0850 — all 6 criteria satisfied (confidence = 1.0 >= 0.85)
const FIXTURE_BOUNDARY_0850 = "b2b software self-serve smb subscription compliance";
// Fixture: high_confidence_0900 — all 6 criteria satisfied, confidence = 1.0 >= 0.85
const FIXTURE_HIGH_0900 = "b2b software self-serve enterprise subscription hipaa";

// --- Deterministic fixture matrix ---

test("[0849-fixture] confidence 5/6 ≈ 0.833 is below threshold → risk path activated", () => {
  const { confidence, followUps } = getLowConfidenceFollowUps(FIXTURE_LOW_0849);
  assert.equal(confidence, 5 / 6);
  assert.ok(confidence < LOW_CONFIDENCE_THRESHOLD, `Expected ${confidence} < ${LOW_CONFIDENCE_THRESHOLD}`);
  assert.ok(followUps.length > 0, "Risk path must return at least one follow-up");
  assert.equal(followUps[0], LOW_CONFIDENCE_FOLLOWUPS[5], "First follow-up must be missing check[5] (compliance)");
});

test("[0850-fixture] confidence 6/6 = 1.0 is at/above threshold → non-risk path, no follow-ups", () => {
  const { confidence, followUps } = getLowConfidenceFollowUps(FIXTURE_BOUNDARY_0850);
  assert.equal(confidence, 1);
  assert.ok(confidence >= LOW_CONFIDENCE_THRESHOLD, `Expected ${confidence} >= ${LOW_CONFIDENCE_THRESHOLD}`);
  assert.equal(followUps.length, 0, "Non-risk path must return zero follow-ups");
});

test("[0900-fixture] confidence 6/6 = 1.0 (high-confidence) → non-risk path, no follow-ups", () => {
  const { confidence, followUps } = getLowConfidenceFollowUps(FIXTURE_HIGH_0900);
  assert.equal(confidence, 1);
  assert.ok(confidence >= LOW_CONFIDENCE_THRESHOLD);
  assert.equal(followUps.length, 0);
});

// --- Schema stability ---

test("[schema] output shape is identical across risk and non-risk branches", () => {
  const lowResult = getLowConfidenceFollowUps(FIXTURE_LOW_0849);
  const highResult = getLowConfidenceFollowUps(FIXTURE_HIGH_0900);

  // Both branches must return exactly { confidence: number, followUps: array }
  assert.ok(typeof lowResult.confidence === "number");
  assert.ok(Array.isArray(lowResult.followUps));
  assert.ok(typeof highResult.confidence === "number");
  assert.ok(Array.isArray(highResult.followUps));

  // Risk-path metadata (non-empty followUps) must be absent for high confidence
  assert.equal(highResult.followUps.length, 0, "Risk-path metadata must be absent for confidence >= 0.85");
});

test("[schema] getClassificationConfidence output shape stable regardless of input content", () => {
  const full = getClassificationConfidence(FIXTURE_BOUNDARY_0850);
  const empty = getClassificationConfidence("");

  assert.ok(typeof full.confidence === "number");
  assert.ok(Array.isArray(full.missingFollowUps));
  assert.ok(typeof empty.confidence === "number");
  assert.ok(Array.isArray(empty.missingFollowUps));
});

// --- Malformed-confidence handling ---

test("[malformed] empty transcript returns lowest confidence and full follow-up set (no throw)", () => {
  const { confidence, followUps } = getLowConfidenceFollowUps("");
  assert.equal(confidence, 0);
  assert.ok(followUps.length > 0, "Empty transcript must produce follow-ups");
  assert.ok(confidence < LOW_CONFIDENCE_THRESHOLD);
});

test("[malformed] null-like coerced input (empty string) does not throw or return undefined fields", () => {
  let result;
  assert.doesNotThrow(() => {
    result = getLowConfidenceFollowUps("");
  });
  assert.ok(result !== undefined);
  assert.ok(typeof result.confidence === "number");
  assert.ok(Array.isArray(result.followUps));
});

test("[malformed] numeric input coerced to string-like check does not throw", () => {
  // Passing a string representation of a number — should evaluate against regexes without crash
  assert.doesNotThrow(() => {
    getLowConfidenceFollowUps("0.849");
  });
});

test("[numeric-fixtures] literal 0.849/0.850/0.900 enforce strict < 0.85 gate", () => {
  const missingFollowUps = [LOW_CONFIDENCE_FOLLOWUPS[0], LOW_CONFIDENCE_FOLLOWUPS[4]];

  const low = getFollowUpsForConfidence(0.849, missingFollowUps);
  assert.equal(low.confidence, 0.849);
  assert.deepEqual(low.followUps, missingFollowUps);

  const boundary = getFollowUpsForConfidence(0.85, missingFollowUps);
  assert.equal(boundary.confidence, 0.85);
  assert.deepEqual(boundary.followUps, []);

  const high = getFollowUpsForConfidence(0.9, missingFollowUps);
  assert.equal(high.confidence, 0.9);
  assert.deepEqual(high.followUps, []);
});
