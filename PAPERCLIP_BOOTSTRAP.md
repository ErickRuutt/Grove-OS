# Paperclip Bootstrap

Date: 2026-04-07
Source repo: `paperclipai/paperclip`

## What changed

Paperclip has an official local bootstrap path.

From the current upstream README and development guide:

- Quickstart: `npx paperclipai onboard --yes`
- One-command local run: `pnpm paperclipai run`
- Manual dev from repo: `git clone ... && pnpm install && pnpm dev`
- Instance isolation is officially supported with `PAPERCLIP_HOME` and `PAPERCLIP_INSTANCE_ID`

Sources:

- https://github.com/paperclipai/paperclip
- https://raw.githubusercontent.com/paperclipai/paperclip/master/README.md
- https://raw.githubusercontent.com/paperclipai/paperclip/master/doc/DEVELOPING.md

## Recommended model for this project

Use the official Paperclip repo directly, but run it against a clean, isolated
instance for this project.

That means:

- Paperclip code can live in its own repo checkout
- this project stays as the durable business/context repo
- runtime state is isolated with instance-specific env vars

## Best-practice structure

```text
/Users/erickruuttila/
  paperclip/                 # upstream Paperclip repo clone
  grove-project-starter/     # project context repo

~/.paperclip/instances/
  grove-project-starter/     # isolated runtime state
```

## Recommended bootstrap steps

### 1. Clone upstream Paperclip

```bash
cd /Users/erickruuttila
git clone https://github.com/paperclipai/paperclip.git
cd paperclip
pnpm install
```

### 2. Run Paperclip against this project's isolated instance

```bash
cd /Users/erickruuttila/paperclip
PAPERCLIP_HOME=/Users/erickruuttila/.paperclip \
PAPERCLIP_INSTANCE_ID=grove-project-starter \
pnpm paperclipai run
```

This follows Paperclip's supported local model:

- embedded Postgres
- local storage
- isolated workspaces
- separate instance state

## If you want to use the repo in dev mode

```bash
cd /Users/erickruuttila/paperclip
PAPERCLIP_HOME=/Users/erickruuttila/.paperclip \
PAPERCLIP_INSTANCE_ID=grove-project-starter \
pnpm dev
```

Per upstream docs, this starts:

- API server at `http://localhost:3100`
- UI served by the API server in dev middleware mode

## Why this is better than copying the default runtime

This gives you:

- supported Paperclip boot behavior
- embedded Postgres auto-managed by Paperclip
- a clean instance boundary
- no reuse of `default`
- no hidden state copied from the old runtime

## Operational rules

1. Keep `paperclip/` as infrastructure code.
2. Keep `grove-project-starter/` as the project brain and durable context.
3. Keep `~/.paperclip/instances/grove-project-starter/` as runtime state only.
4. Do not copy `default/db` into this instance.
5. Do not share secrets between instances.

## Optional hardening

After first boot:

- create a real `.env` from `.env.example`
- generate a fresh `PAPERCLIP_AGENT_JWT_SECRET`
- disable telemetry if desired with `PAPERCLIP_TELEMETRY_DISABLED=1`

## Health checks

Once running:

```bash
curl http://localhost:3100/api/health
curl http://localhost:3100/api/companies
```

Expected:

- `/api/health` returns `{"status":"ok"}`
- `/api/companies` returns a JSON array

## Recommended next move

Boot the isolated Paperclip instance first.

Then connect the new Grove project by creating the company/project structure in
Paperclip and using this repo as the durable context layer that informs the
agents, skills, and company configuration.
