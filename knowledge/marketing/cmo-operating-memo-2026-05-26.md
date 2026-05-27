# CMO Operating Memo (2026-05-26)

## Purpose
Translate Grove's marketing principles into immediate execution priorities, measurement, and cross-silo operating loops.

## Observations (Fact)
- The Marketing pod has solid strategic guardrails for positioning, ICP filtering, and channel behavior.
- The current artifacts are mostly framework-level; there are no live message assets, no active experiments, and no instrumentation spec.
- No website narrative map or page-level conversion flow is documented in this workspace.
- Shared standards in `_shared/` are Sales-labeled, but Marketing depends on them; cross-silo terminology governance is not yet explicit.

## Inferences (Need Validation)
- Message quality is likely to drift across channels because no source-of-truth narrative sequence exists yet.
- Lead quality risk is high if paid/content teams launch before disqualification language and qualification measurement are wired.
- Sales and Marketing may evaluate "quality" differently unless shared definitions are updated and enforced.

## Primary Recommendation
Build a single "Message-to-Market System" before scaling any channel volume.

This system should include:
1. A website narrative spec with section-by-section message intent.
2. A channel message matrix mapping ICP segment -> pain -> proof -> CTA -> disqualifier.
3. A minimum viable measurement layer tied to qualified pipeline, not clicks.

## 14-Day Priority Plan
1. Define Website Narrative Source of Truth.
- Deliverable: homepage sequence spec with hooks, proof blocks, CTA architecture, and explicit "not for" language.
- Owner: Marketing
- Dependencies: Product proof points, Sales top objections

2. Build Message Matrix v1.
- Deliverable: one table covering Tier 1 and Tier 2 ICPs across homepage, paid social, and lifecycle email.
- Owner: Marketing
- Dependencies: Sales discovery transcripts, CS onboarding failure patterns

3. Launch Instrumentation Baseline.
- Deliverable: event map + dashboard schema for traffic quality and conversion quality.
- Owner: Marketing + Product/Engineering
- Dependencies: analytics implementation support

4. Run Two Controlled Message Tests.
- Deliverable: A/B framing tests focused on fit quality (not CTR) in paid social and landing copy.
- Owner: Marketing
- Dependencies: baseline tracking and qualified-meeting attribution

## Minimum Instrumentation Spec
Track the following as first-party events and weekly rollups:
- `session_source`
- `cta_click` by page module and message variant
- `fit_assessment_started`
- `fit_assessment_completed`
- `demo_requested`
- `demo_qualified` (boolean + reason)
- `opportunity_created`
- `opportunity_stage_2`
- `closed_won`
- `closed_lost_reason`

Required calculated metrics:
- Qualified demo rate by source
- Stage 0 -> qualified demo conversion by message variant
- Qualified demo -> pipeline conversion by source
- Low-fit submission rate by source and campaign

## Cross-Silo Requests
1. Sales
- Provide the top 10 objection phrases from the last 30 days, verbatim.
- Provide three "won because" and three "lost because" summaries tied to process pain.

2. CS/Support
- Provide the five most common onboarding failure conditions tied to workflow ownership and process readiness.

3. Product/Engineering
- Confirm what business-memory and orchestration proof can be demonstrated today without roadmap language.
- Implement MVP event tracking for the instrumentation spec.

4. CEO
- Confirm primary growth objective for next 60 days:
  - more qualified pipeline now
  - clearer category narrative now
  - both, with explicit weighting

## Risks If Unaddressed
- High-volume, low-fit traffic increases CAC without improving qualified pipeline.
- Website and channel copy drift into generic "AI platform" language.
- Sales absorbs messaging debt through one-off objection handling instead of compounding narrative clarity.

## Decision Needed
Approve the 14-day priority sequence and assign cross-silo owners by date.
