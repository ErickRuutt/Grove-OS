import test from "node:test";
import assert from "node:assert/strict";
import {
  FOLLOW_UP_CAP,
  LOW_CONFIDENCE_THRESHOLD,
  LOW_CONFIDENCE_FOLLOWUPS,
  getFollowUpsForConfidence,
  getClassificationConfidence,
  getLowConfidenceFollowUps,
} from "../lib/interview-confidence.js";

test("confidence below 0.85 returns deterministic follow-ups in configured order", () => {
  const transcript = "We are B2B and mostly software with subscription pricing.";
  const result = getLowConfidenceFollowUps(transcript.toLowerCase());

  assert.ok(result.confidence < LOW_CONFIDENCE_THRESHOLD);
  assert.deepEqual(result.followUps, [
    LOW_CONFIDENCE_FOLLOWUPS[2],
    LOW_CONFIDENCE_FOLLOWUPS[3],
    LOW_CONFIDENCE_FOLLOWUPS[5],
  ]);
});

test("high-confidence transcript (>= 0.85) does not trigger low-confidence follow-up path", () => {
  const transcript = "b2b software self-serve smb subscription compliance";
  const { confidence } = getClassificationConfidence(transcript);
  assert.equal(confidence, 1);
  assert.equal(confidence >= LOW_CONFIDENCE_THRESHOLD, true);
  const result = getLowConfidenceFollowUps(transcript);
  assert.equal(result.followUps.length, 0);
});

test("confidence strict threshold behavior: 5/6 triggers follow-up, 6/6 does not", () => {
  const fiveOfSix =
    "b2b software self-serve smb subscription";
  const lowResult = getLowConfidenceFollowUps(fiveOfSix);
  assert.equal(lowResult.confidence, 5 / 6);
  assert.equal(lowResult.confidence < LOW_CONFIDENCE_THRESHOLD, true);
  assert.equal(lowResult.followUps.length, 1);
  assert.equal(lowResult.followUps[0], LOW_CONFIDENCE_FOLLOWUPS[5]);

  const sixOfSix =
    "b2b software self-serve smb subscription compliance";
  const highResult = getLowConfidenceFollowUps(sixOfSix);
  assert.equal(highResult.confidence, 1);
  assert.equal(highResult.followUps.length, 0);
});

test("follow-up cap is deterministic and enforced", () => {
  const transcript = "";
  const result = getLowConfidenceFollowUps(transcript);
  assert.equal(result.followUps.length, FOLLOW_UP_CAP);
  assert.deepEqual(result.followUps, LOW_CONFIDENCE_FOLLOWUPS.slice(0, FOLLOW_UP_CAP));
});

test("strict numeric gate fixtures: 0.849 risks, 0.850 and 0.900 do not", () => {
  const missingFollowUps = [LOW_CONFIDENCE_FOLLOWUPS[0], LOW_CONFIDENCE_FOLLOWUPS[1]];

  const low = getFollowUpsForConfidence(0.849, missingFollowUps);
  assert.equal(low.confidence, 0.849);
  assert.equal(low.followUps.length, 2);
  assert.deepEqual(low.followUps, missingFollowUps);

  const boundary = getFollowUpsForConfidence(0.85, missingFollowUps);
  assert.equal(boundary.confidence, 0.85);
  assert.deepEqual(boundary.followUps, []);

  const high = getFollowUpsForConfidence(0.9, missingFollowUps);
  assert.equal(high.confidence, 0.9);
  assert.deepEqual(high.followUps, []);
  assert.equal(LOW_CONFIDENCE_THRESHOLD, 0.85);
});
