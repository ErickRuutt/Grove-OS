# Paid Social

## Purpose
Run paid social programs that generate qualified pipeline from high-fit operator audiences.

## Scope
Campaign strategy, ad messaging, audience constraints, and optimization rules for paid social channels.

## Inputs
- [icp-segmentation](../messaging/icp-segmentation.md)
- [positioning](../messaging/positioning.md)
- Source-level conversion and downstream quality metrics
- Sales feedback on lead quality by campaign

## Decision Rules
- Target narrow operator cohorts before lookalike scale.
- Score campaigns on qualified meeting rate and pipeline quality, not CTR alone.
- Use contrastive hooks that pre-filter low-intent novelty seekers.
- Pause creatives that attract high click volume with low qualification outcomes.

## Examples
- Hook: "Your team has five AI tools and zero shared operating memory."
- CTA: "See if Grove fits your workflow architecture."
- Exclusion cue: "Not for teams shopping for chatbot experiments."

## Failure Modes
- Broad audience expansion before message-market fit is stable.
- Optimizing to cheap clicks that never progress to qualified pipeline.
- Creative drift away from core positioning due to performance pressure.

## Revision History
- 2026-05-26: Seeded paid social strategy and filtering guardrails.
