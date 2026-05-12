# Escalation Matrix — Support Silo

> **Business-specific**: Update team/agent names to match your actual Paperclip agents.
> The Support Agent reads this file to route escalated tickets.

## Routing Table

| Issue Type | Priority | Escalate To | SLA |
|------------|----------|-------------|-----|
| Billing dispute | High | Finance / CEO | 4 hours |
| Account access (locked out) | High | Engineering / CTO | 2 hours |
| Product bug (critical) | Critical | Engineering / CTO | 1 hour |
| Product bug (minor) | Medium | Engineering / CTO | 24 hours |
| Feature request | Low | Product / CEO | 72 hours |
| Legal / compliance | High | CEO | 4 hours |
| Partner / enterprise account | High | CEO | 4 hours |
| General question (no KB answer) | Low | Support Agent self-handles, then CTO if stuck | 24 hours |

## Escalation Comment Template

When creating a Paperclip escalation subtask, use this format:

```
## Escalation from Support

**Ticket ID**: [ticket-id]
**Issue Type**: [type from table above]
**Customer**: [customer name/id if known]
**Summary**: [1-2 sentence description]

**What was tried**:
- [step 1]
- [step 2]

**Why escalating**: [reason — outside KB, requires access, etc.]

**Priority**: [from table]
**SLA**: [from table]
```

## Severity Definitions

- **Critical**: Service down, data loss, security issue
- **High**: Customer blocked, major feature broken
- **Medium**: Feature degraded, workaround available
- **Low**: Question, minor issue, enhancement
