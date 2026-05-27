# Incident Communication Protocol

## Purpose
Maintain trust during incidents with predictable, honest, and useful customer communication.

## Scope
Customer-facing communication for service incidents affecting one or more active accounts.

## Inputs
- Incident commander updates
- Confirmed scope, impact, and current mitigation status
- Account priority and affected workflows

## Decision Rules
- Send first customer update within 15 minutes of confirmed incident impact.
- Use plain language: what is broken, who is affected, what is being done, next update time.
- Avoid speculative root-cause claims before verification.
- Continue updates on committed cadence until resolution and post-incident summary are delivered.

## Examples
- Initial update template: impact summary + mitigation status + next update timestamp.
- Resolution update: service restored + customer action required (if any) + postmortem ETA.

## Failure Modes
- Silent periods during active incidents.
- Overconfident updates that later require retractions.
- Closing incident communication without preventive follow-up.

## Revision History
- 2026-05-26: Seeded incident comms protocol and cadence rules.
