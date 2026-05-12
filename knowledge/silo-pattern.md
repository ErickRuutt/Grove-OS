# Grove Silo Pattern — Reusability Contract

## What Is a Silo?

A silo is a self-contained Grove module that gives a business domain (support, sales, marketing, engineering, etc.) its own dedicated AI agent, knowledge base, and escalation routing — all locked to the specific business's data and environment.

The silo pattern is the repeatable template. Every domain in Grove is built the same way.

## The Five Steps

### Step 1: Hire the Silo Agent

Create a Paperclip agent for the domain:
- Role: domain name (e.g., `support`, `sales`)
- Reports to: CTO
- Instructions path: `agents/{silo}/AGENTS.md`

Use the `paperclip-create-agent` skill. After hiring, set the instructions path:

```
PATCH /api/agents/{agentId}/instructions-path
{ "path": "agents/{silo}/AGENTS.md" }
```

### Step 2: Write the Agent Brain

Create `agents/{silo}/AGENTS.md`. It must include:
- **Role** — what this agent owns and does not own
- **Core Rules** — knowledge lockdown, escalation policy
- **Primary Workflow** — step-by-step process for the main task (e.g., ticket triage)
- **Escalation Rules** — when and how to escalate
- **Context Sources** — which `knowledge/{silo}/` files to read
- **Chain of Command** — who to escalate to when stuck

### Step 3: Populate the Knowledge Base

Create `knowledge/{silo}/` with these four files:

| File | Purpose |
|------|---------|
| `sops.md` | Standard operating procedures — how to do the work |
| `faq.md` | Known Q&A pairs the agent can answer directly |
| `escalation-matrix.md` | Routing table: issue type → team/agent, SLA |
| `kpis.md` | KPI definitions, targets, and reporting format |

All files are stubs on day one. The business fills them in. The agent operates only within these files.

### Step 4: Wire Data Connectors (Phase 2)

For Phase 1, the agent works from Paperclip tasks and comments. For Phase 2, integrate:
- Ticket system (read-only: fetch open tickets)
- KPI feed (read-only: fetch current metrics)

Connectors are swapped in without changing the agent brain.

### Step 5: Validate

Run a test scenario:
1. Create a Paperclip issue simulating a real ticket
2. Assign it to the silo agent
3. Verify the agent triages, resolves or escalates, and updates correctly
4. CTO reviews and signs off

---

## Domain-Specific Notes

Each silo may have a `knowledge/{silo}/notes.md` for deviations from this pattern. Keep deviations minimal. If a deviation feels necessary, consider whether the pattern itself needs updating.

---

## Reference Implementation

The **Support Silo** is the first implementation. Use it as the reference for all future silos:
- `agents/support/AGENTS.md`
- `knowledge/support/sops.md`
- `knowledge/support/faq.md`
- `knowledge/support/escalation-matrix.md`
- `knowledge/support/kpis.md`

---

*Maintained by: CTO*
*Last updated: 2026-04-07*
