# Grove Project Starter — Project Context

Status: Active — domain defined, team building in progress
Owner: Erick Ruuttila
Created: 2026-03-30
Updated: 2026-04-07

## Vision

Grove is an AI orchestration harness that lets businesses deploy trained, domain-specific AI agents across all of their organizational silos — sales, marketing, engineering, CS, support, and more — through a unified employee-facing interface.

Grove is the harness and framework. Agents are plugged into it. The business's own data, processes, and guardrails govern each agent.

## Problem

Businesses today use AI in a decentralized, uncoordinated way. There is no shared brain, no cross-silo awareness, no governed framework. Employees reinvent the wheel for every workflow instead of building on compounding AI infrastructure.

## Core Promise

Grove gives any business:
- A structured harness for deploying per-silo AI agents
- An interview system to extract business processes and build agents dynamically
- A singular interface employees use to access data, workflows, and skills
- Continuous compounding: new tools and knowledge accumulate over time
- Strong guardrails: agents operate only within the business's own data and environment

## Target User

Business operators and team leads who want AI that actually knows their business — not generic AI bolted on.

## Product Shape

- **Harness layer**: the framework that ties agent silos together
- **Interview engine**: extracts business processes from teams, builds agents dynamically
- **Silo agents**: trained per-department (CS, support, sales, marketing, engineering)
- **Unified interface**: employees ask questions, access workflows, escalate issues through one UI
- **CS brain**: first working instance (built)
- **Support brain**: next test domain (in progress)

## Current Phase

Building the support framework. Key capabilities:
- Track KPIs, tools, knowledge base
- Answer customer-facing questions (AEO optimization)
- Read and triage support tickets
- Escalate issues to correct teams

## Guardrails

- Grove is not an agent — it is the harness agents plug into
- Each business instance is isolated: no cross-tenant data leakage
- Agents are locked to the business's own information and environment
- Do not import another instance's `MEMORY.md`
- Do not share secrets across instances
