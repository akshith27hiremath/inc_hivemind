# ADR-001: Environment Variables & Secrets Management

**Status:** Accepted
**Date:** 2026-02-16
**Decision Makers:** Akshith Hiremath

## Context

The Hivemind web app runs on Google Cloud Run and needs configuration for database credentials, SMTP email, and runtime settings. We needed a consistent, trackable approach that:

- Separates secrets (credentials) from config (non-sensitive settings)
- Works identically in local dev and production
- Has a single source of truth for what env vars exist
- Follows industry conventions (12-Factor App)

Google Secret Manager was already in use for `DATABASE_URL`. Adding SMTP required a decision on how to handle multiple secrets and env vars going forward.

## Decision

### Three-tier system

| Tier | What goes here | Local dev | Production (Cloud Run) |
|------|---------------|-----------|----------------------|
| **Secret Manager** | Credentials (passwords, API keys, connection strings) | `.env.local` | `--set-secrets` in `deploy.sh` |
| **Env vars** | Non-sensitive config (email addresses, feature flags, socket paths) | `.env.local` | `--set-env-vars` in `deploy.sh` |
| **Code** | Defaults, fallbacks | Hardcoded in source | Same |

### Files

| File | Purpose | In git? |
|------|---------|---------|
| `.env.example` | **Single source of truth** for all env vars. Documents name, purpose, which tier it belongs to, and placeholder values. | Yes |
| `.env.local` | Real values for local development. | No (gitignored) |
| `deploy.sh` | Production values via `--set-secrets` and `--set-env-vars` flags. | Yes |
| `CLAUDE.md` | Reference table of all vars with their tier classification. | Yes |

### Current inventory

| Variable | Tier | Purpose |
|----------|------|---------|
| `DATABASE_URL` | Secret Manager | PostgreSQL connection string |
| `SMTP_PASS` | Secret Manager | Google App Password for email |
| `INSTANCE_UNIX_SOCKET` | Env var | Cloud SQL Unix socket path (Cloud Run only) |
| `SMTP_USER` | Env var | Google Workspace account (`akshith@hivemind.inc`) |
| `SMTP_FROM` | Env var | Display name + alias (`"Hivemind" <welcome@hivemind.inc>`) |

### Adding a new variable

1. Add it to `.env.example` with the appropriate `[Secret Manager]` or `[Cloud Run env]` tag
2. Add the real value to `.env.local`
3. If Secret Manager: `gcloud secrets create NAME --data-file=-` + grant IAM to service account
4. Add to `deploy.sh`: `--set-secrets` for credentials, `--set-env-vars` for config
5. Update the reference table in `CLAUDE.md`

## Consequences

**Positive:**
- One place to check what env vars exist (`.env.example`)
- Clear separation: credentials never in `--set-env-vars`, config never in Secret Manager
- `deploy.sh` is the single deploy artifact — all prod config is visible in one file
- New team members can `cp .env.example .env.local` and know exactly what to fill in

**Negative:**
- Adding a new secret requires 5 steps (could automate later)
- `deploy.sh` env var lines get long with many vars (readable enough for now)

**Risks:**
- If `.env.example` falls out of sync with `deploy.sh`, confusion follows. Mitigated by keeping both in the same commit when adding vars.
