# Marketing Instrumentation Spec (MVP)

## Purpose
Define the minimum tracking and reporting layer needed to optimize for qualified pipeline, not vanity engagement.

## Scope
Website and inbound conversion flow through qualified demo and early pipeline progression.

## Event Schema (MVP)
| Event Name | Trigger | Required Properties | Owner |
| --- | --- | --- | --- |
| `session_source` | session start | `source`, `medium`, `campaign`, `landing_page`, `message_variant` | Product/Engineering |
| `cta_click` | any strategic CTA click | `page`, `module`, `cta_label`, `destination`, `message_variant` | Product/Engineering |
| `fit_assessment_started` | user starts fit flow | `entry_point`, `source`, `campaign`, `message_variant` | Product/Engineering |
| `fit_assessment_completed` | user submits fit flow | `entry_point`, `self_reported_team_size`, `self_reported_role`, `self_reported_owner_clarity` | Product/Engineering |
| `demo_requested` | demo form submitted | `source`, `campaign`, `message_variant`, `segment_guess` | Product/Engineering |
| `demo_qualified` | qualification decision logged | `qualified` (bool), `reason`, `owner_present` (bool), `timeline_days` | Sales Ops |
| `opportunity_created` | CRM opportunity opened | `source`, `segment`, `acv_band`, `message_variant` | Sales Ops |
| `opportunity_stage_2` | opportunity reaches stage 2 | `source`, `segment`, `message_variant` | Sales Ops |
| `closed_won` | deal marked won | `source`, `segment`, `message_variant`, `closed_days` | Sales Ops |
| `closed_lost_reason` | deal marked lost | `source`, `segment`, `reason_code`, `reason_detail` | Sales Ops |

## Canonical Definitions
- `message_variant`: stable ID for major framing differences in page/campaign copy.
- `qualified`: true only when pain, owner, timeline, and next step are explicit.
- `low_fit`: any inbound where workflow owner is absent or intent is novelty/demo-only.

## Weekly KPIs
- Qualified demo rate by source
- Stage 0 to qualified demo conversion by message variant
- Qualified demo to opportunity-created conversion by source
- Opportunity-created to stage-2 conversion by source
- Low-fit submission rate by source and campaign
- Closed-lost rate with reason breakdown by message variant

## Dashboard Views
1. Channel quality dashboard (Marketing)
- Source -> sessions -> fit starts -> fit completes -> demo requests -> qualified demos

2. Message performance dashboard (Marketing + Sales)
- Message variant -> qualified demo rate -> opportunity creation rate -> stage-2 rate

3. Fit leakage dashboard (Marketing + Sales + CS)
- Low-fit rate by campaign, disqualification reason trend, onboarding risk indicator

## Implementation Notes
- Pass `message_variant` from landing page through CRM record as hidden field.
- Keep a single enum for `closed_lost_reason` across Sales and Marketing reporting.
- Track all events first-party; avoid dependence on ad-platform-only conversion reporting.

## Data Gaps
- No current evidence in this workspace that these events are implemented.
- No source of truth yet for message-variant naming conventions.

## Cross-Silo Action Items
1. Product/Engineering
- Implement event tracking for MVP schema.
- Add hidden field plumbing for `message_variant` into fit and demo forms.

2. Sales Ops
- Enforce required fields for `demo_qualified` and `closed_lost_reason`.
- Standardize reason codes and audit weekly for missingness.

3. Marketing
- Register and document active message variants before each campaign launch.

## Revision History
- 2026-05-26: Created MVP instrumentation specification for qualified-pipeline optimization.
