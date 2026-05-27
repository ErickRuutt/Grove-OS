# Email Lifecycle

## Purpose
Use lifecycle email to move leads from curiosity to qualified action with clear stage-appropriate messaging.

## Scope
Inbound nurture, post-demo follow-up, dormant reactivation, and customer expansion-trigger sequences.

## Inputs
- [icp-segmentation](../messaging/icp-segmentation.md)
- [value-props](../messaging/value-props.md)
- Sales stage definitions from `knowledge/sales/playbooks/qualification.md`
- Engagement and conversion metrics by sequence

## Decision Rules
- Sequence by intent stage: awareness, evaluation, decision, and activation.
- Each email must have one job: clarify pain, prove fit, or secure a next action.
- Use behavior-triggered branches rather than calendar-only drips when possible.
- Include explicit disqualification language where fit is weak.

## Examples
- Awareness email: frame common workflow failure pattern and invite self-qualification.
- Evaluation email: share role-specific proof + clear next-step CTA.
- Dormant email: acknowledge low urgency and offer a short fit check rather than a hard sell.

## Failure Modes
- Long nurture streams with no decision pressure or qualification moment.
- Sending identical messaging to high-fit and low-fit leads.
- Repeating product claims without adding proof or context.

## Revision History
- 2026-05-26: Added lifecycle framework and stage rules.
