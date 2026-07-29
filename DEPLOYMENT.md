# Grove-OS Deployment Guide

## Stack
- Repo: `ErickRuutt/Grove-OS` (GitHub)
- Website: `website/` subdirectory (Next.js 16, pnpm)
- Hosting: Vercel
- Domain: `grove-os.com` (registered on Squarespace)

## Vercel Project Settings
These must be set correctly or the deploy will 404:

| Setting | Value |
|---|---|
| Root Directory | `website` |
| Framework Preset | `Next.js` |
| Build Command | `next build` (default) |
| Install Command | `pnpm install` (auto-detected) |

## Domain (Squarespace DNS)
Two records in Squarespace → Domains → grove-os.com → DNS Settings → Custom Records:

| Type | Host | Value |
|---|---|---|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

## Deploying Changes
1. Make changes in `website/`
2. Commit and push to `main` on `Grove-OS`
3. Vercel auto-deploys on push

## Dependencies (website/package.json)
- `next` 16.2.4
- `react` / `react-dom` 19.2.4
- `@anthropic-ai/sdk` — AI interview portal
- `@neondatabase/serverless` — Postgres (Neon)
- `stripe` — payments
- `archiver` — file archiving

## Environment Variables
Set in Vercel → project → Settings → Environment Variables.
Add any secrets here (Anthropic API key, Neon DB URL, Stripe keys) — never commit them.

## What Went Wrong During Initial Setup (for reference)
1. **Wrong repo imported** — Vercel needs root dir set to `website`, not the repo root
2. **Embedded git repo** — `website/` had its own `.git`, so Vercel couldn't read its files (treated as submodule). Fixed by removing `website/.git` and committing files as regular files.
3. **Framework preset was "Other"** — had to manually set to Next.js in Vercel project settings, then redeploy
