# Sales Taxonomy

## Purpose
Define canonical sales terms used across Grove knowledge pods so playbooks and QA stay semantically consistent.

## Scope
Applies to `knowledge/sales/*` content and any cross-silo references to revenue-stage language.

## Inputs
- Pipeline stages in CRM
- Discovery call notes
- Objection logs from real prospects
- Closed-won and closed-lost summaries

## Decision Rules
- Use `ICP` to mean a high-fit operator-led business team with clear process pain.
- Use `Qualified` only when pain, owner, timeline, and next step are explicit.
- Use `Risk` for blockers that can delay buying even when value is accepted.
- Use `Signal` for observable evidence, not speculation.

## Examples
- Qualified signal: "Ops lead owns rollout and has a 30-day decision window."
- Objection: "We already have ChatGPT" categorized as `Status quo + differentiation gap`.

## Failure Modes
- Treating curiosity as purchase intent.
- Using inconsistent stage names between discovery and follow-up.
- Calling an account ICP-fit without evidence.

## Revision History
- 2026-05-26: Seeded baseline taxonomy for Sales pod scaffold.
