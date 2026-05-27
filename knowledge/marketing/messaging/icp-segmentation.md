# ICP Segmentation

## Purpose
Define which buyer segments are highest fit for Grove and how to identify and prioritize them.

## Scope
Segmentation criteria for demand capture, campaign targeting, and qualification handoff.

## Inputs
- [taxonomy](../../_shared/01-taxonomy.md)
- Sales discovery patterns from `knowledge/sales/playbooks/discovery.md`
- Funnel conversion by source and segment
- CS onboarding success/failure indicators

## Decision Rules
- Primary ICP: operator-led teams with repeatable workflows and clear owner accountability.
- Promote segments with operational pain + urgency + authority in one thread.
- De-prioritize segments asking for one-off chatbot novelty or experimentation without workflow ownership.
- Label segments as `Tier 1`, `Tier 2`, or `Low Fit` based on execution-readiness signals.

## Examples
- Tier 1: Operations lead at a 20-200 person company with broken cross-functional handoffs and a 30-60 day timeline.
- Tier 2: Team lead with clear pain but weak executive sponsorship.
- Low Fit: Individual contributor requesting a personal AI assistant with no process ownership.

## Failure Modes
- Treating all inbound AI interest as demand.
- Targeting job titles without validating operational ownership.
- Keeping paid audiences broad to preserve volume at the expense of conversion quality.

## Revision History
- 2026-05-26: Added initial segment tiers and qualification logic.
