const LOW_CONFIDENCE_THRESHOLD = 0.85;
const FOLLOW_UP_CAP = 5;

const LOW_CONFIDENCE_FOLLOWUPS = [
  "Is the company primarily B2B, B2C, or B2B2C?",
  "Is the business mainly software, services, ecommerce, or a hybrid?",
  "Do you sell mostly self-serve, sales-led, or both?",
  "Who is the primary customer: consumer, SMB, mid-market, or enterprise?",
  "Is revenue mainly subscription, transactional, retainer, or usage-based?",
  "Are there any compliance or regulated-industry constraints we should account for?",
];

const CLASSIFICATION_CHECKS = [
  /\bb2b\b|\bb2c\b|\bb2b2c\b|marketplace|agency|saas|services|ecommerce|media|community/,
  /software|service|managed service|physical product|hybrid|ecommerce/,
  /self-serve|sales-led|product-led|founder-led|channel-led|hybrid/,
  /consumer|smb|mid-market|enterprise|mixed/,
  /subscription|transactional|retainer|one-time|usage-based|hybrid/,
  /compliance|regulated|hipaa|sox|pci|gdpr|soc 2/,
];

function getClassificationConfidence(userTranscript) {
  const missingFollowUps = [];
  let satisfied = 0;

  for (let i = 0; i < CLASSIFICATION_CHECKS.length; i += 1) {
    const isMatched = CLASSIFICATION_CHECKS[i].test(userTranscript);
    if (isMatched) {
      satisfied += 1;
      continue;
    }
    missingFollowUps.push(LOW_CONFIDENCE_FOLLOWUPS[i]);
  }

  const confidence = satisfied / CLASSIFICATION_CHECKS.length;
  return { confidence, missingFollowUps };
}

function getLowConfidenceFollowUps(userTranscript) {
  const { confidence, missingFollowUps } = getClassificationConfidence(userTranscript);
  return getFollowUpsForConfidence(confidence, missingFollowUps);
}

function getFollowUpsForConfidence(confidence, missingFollowUps) {
  if (confidence >= LOW_CONFIDENCE_THRESHOLD) {
    return { confidence, followUps: [] };
  }

  return { confidence, followUps: missingFollowUps.slice(0, FOLLOW_UP_CAP) };
}

module.exports = {
  FOLLOW_UP_CAP,
  LOW_CONFIDENCE_THRESHOLD,
  LOW_CONFIDENCE_FOLLOWUPS,
  getFollowUpsForConfidence,
  getClassificationConfidence,
  getLowConfidenceFollowUps,
};
