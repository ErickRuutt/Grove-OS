# Support KPIs — Key Performance Indicators

> **Business-specific**: Adjust targets to match this business's goals.
> The Support Agent tracks and reports these metrics.

## KPI Definitions

| KPI | Definition | Target | Report Frequency |
|-----|------------|--------|-----------------|
| Ticket Volume | Total inbound tickets per week | Baseline TBD | Weekly |
| First Response Time | Time from ticket creation to first agent response | < 2 hours | Weekly |
| Resolution Time | Time from ticket creation to marked resolved | < 24 hours (medium), < 4 hours (high) | Weekly |
| Escalation Rate | % of tickets escalated to another team | < 20% | Weekly |
| CSAT | Customer satisfaction score (if collected) | > 4.0 / 5.0 | Monthly |
| First Contact Resolution | % resolved without escalation | > 80% | Weekly |

## Reporting Format

When reporting KPIs to CTO, use this structure:

```
## Support KPI Report — Week of [DATE]

| KPI | This Week | Target | Status |
|-----|-----------|--------|--------|
| Ticket Volume | X | baseline | on track / above / below |
| First Response Time | Xh Xm | < 2h | green / yellow / red |
| Resolution Time | Xh Xm | < 24h | green / yellow / red |
| Escalation Rate | X% | < 20% | green / yellow / red |
| First Contact Resolution | X% | > 80% | green / yellow / red |

**Highlights**: [what went well]
**Watch items**: [anything outside target]
**Recommendation**: [any changes needed]
```

## Tracking Note

Until a live ticket system integration is in place (Phase 2), KPIs are tracked manually by logging ticket interactions in Paperclip issue comments. The Support Agent maintains a running count and reports at week end.
