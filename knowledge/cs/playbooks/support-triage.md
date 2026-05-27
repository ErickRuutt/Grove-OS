# Support Triage and Escalation Playbook

## Purpose
Resolve customer issues quickly while protecting trust and preserving workflow continuity.

## Scope
Inbound support requests from ticket creation through resolution and postmortem handoff.

## Inputs
- Ticket context and customer business impact statement
- Account tier, implementation stage, and known risks
- Product logs and incident status

## Decision Rules
- Classify each issue by severity (`sev1`, `sev2`, `sev3`) and business impact in first response.
- Acknowledge customer impact before technical detail.
- Escalate to engineering immediately for `sev1` and for repeated `sev2` failures in same workflow.
- Close ticket only after customer confirms workflow restoration or workaround acceptance.

## Examples
- `sev1`: workflow outage blocking critical operations; engineer engaged within 15 minutes.
- `sev2`: degraded workflow with workaround; escalation path confirmed in first update.

## Failure Modes
- Triage based on queue order instead of impact.
- Technical responses that ignore customer operational risk.
- Ticket closure without confirming business process recovery.

## Revision History
- 2026-05-26: Added triage severity model and escalation triggers.
