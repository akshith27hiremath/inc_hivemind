# Hivemind Inc — Project Instructions

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (shadcn/ui planned)
- PostgreSQL + Drizzle ORM
- Docker + Google Cloud Run (us-central1)

---

## Architecture Rules

### Database connections
- NEVER create DB connections at module scope. Use `getDb()` from `src/db/index.ts`.
- `getDb()` is lazy — only connects on first call. Safe for Next.js static generation.
- Environment switching is automatic via `INSTANCE_UNIX_SOCKET`:
  - **Set** (Cloud Run): `postgres` driver uses Unix socket to Cloud SQL
  - **Not set** (local): connects via TCP to localhost (through Cloud SQL Auth Proxy)
- The `postgres` npm driver (porsager/postgres) CANNOT parse Unix socket paths in URLs. Socket path must be passed via the `host` option, never in the connection string.

### Fonts
- Self-hosted in `src/fonts/` via `next/font/local`. NEVER use `next/font/google` — it fails in Docker builds (no network).
- CSS variables: `--font-inter`, `--font-serif`, `--font-mono` (set on `<html>`)

### Landing page CSS
- All styles scoped under `.landing-page` wrapper class
- Renamed to avoid Tailwind collisions: `.container` → `.landing-container`, `@keyframes spin` → `@keyframes lp-spin`
- `:root` CSS variables reference next/font variables

### TypeScript
- Use arrow functions inside blocks (not `function` declarations) — strict mode requirement

---

## One-Time Setup (prerequisites)

These only need to be run once on a new machine:

```bash
# 1. Authenticate Docker to push to Artifact Registry
gcloud auth configure-docker us-central1-docker.pkg.dev

# 2. Set up Application Default Credentials (for Cloud SQL Auth Proxy)
gcloud auth application-default login

# 3. Set active project
gcloud config set project hivemind-inc

# 4. Create .env.local from template
cp .env.example .env.local
# Then fill in the real DATABASE_URL password
```

---

## Daily Commands

### Local development
```bash
npm run dev          # Next.js only (no DB access)
npm run dev:full     # Cloud SQL Auth Proxy + Next.js (full stack, needs ADC)
```

### Production deployment
```bash
npm run docker:test  # FIRST: verify Docker image on localhost:8080
npm run deploy       # Build → Docker → Push → Cloud Run (all 4 steps)
```
`deploy.sh` builds Next.js twice intentionally: once locally (fast fail on errors) then inside Docker (production image). This prevents wasting time on a 3-min Docker build + push only to discover a build error.

### Database schema changes
```bash
npm run db:push:prod  # Push Drizzle schema to Cloud SQL via Auth Proxy
npm run db:push       # Push to whatever DATABASE_URL is set (local use)
npm run db:generate   # Generate migration SQL files
npm run db:studio     # Open Drizzle Studio GUI
```
`db:push:prod` reads credentials from `.env.local` (never hardcoded in scripts). It auto-starts the Cloud SQL Auth Proxy if not already running.

---

## Cloud Operations

### Logs
```bash
# Recent logs (default 20 lines)
gcloud run services logs read hivemind-web --region=us-central1 --limit=50

# Stream live logs
gcloud beta run services logs tail hivemind-web --region=us-central1
```

### Service status
```bash
gcloud run services describe hivemind-web --region=us-central1
gcloud run revisions list --service=hivemind-web --region=us-central1
```

### Secrets
```bash
# View current secret
gcloud secrets versions access latest --secret=DATABASE_URL

# Update a secret (creates new version, next deploy picks it up)
echo -n "new-value" | gcloud secrets versions add DATABASE_URL --data-file=-
```

### Test the live API
```bash
# New signup
curl -X POST https://hivemind-web-453177499226.us-central1.run.app/api/waitlist \
  -H "Content-Type: application/json" -d '{"email":"test@example.com"}'

# Should return: {"message":"Welcome to the waitlist!","id":1}
# Duplicate:    {"message":"You are already on the waitlist!"}
# Invalid:     {"error":"Invalid email address"}
```

---

## GCP Config Reference

| Resource | Value |
|----------|-------|
| Project | hivemind-inc |
| Region | us-central1 |
| Cloud Run service | hivemind-web |
| Cloud Run URL | https://hivemind-web-453177499226.us-central1.run.app |
| Cloud SQL instance | hivemind-inc:us-central1:hivemind-db |
| Cloud SQL IP | 35.192.120.154 (do NOT connect directly — use Auth Proxy) |
| Artifact Registry | us-central1-docker.pkg.dev/hivemind-inc/hivemind-repo |
| Service account | hivemind-runner@hivemind-inc.iam.gserviceaccount.com |
| Secret Manager | DATABASE_URL (version 3 = current) |
| Cloud Run env vars | INSTANCE_UNIX_SOCKET=/cloudsql/hivemind-inc:us-central1:hivemind-db |

### How Cloud SQL connection works on Cloud Run
`--add-cloudsql-instances=hivemind-inc:us-central1:hivemind-db` in the deploy command mounts a Unix socket at `/cloudsql/hivemind-inc:us-central1:hivemind-db`. The `INSTANCE_UNIX_SOCKET` env var tells `db/index.ts` to pass this path as the `host` option to the `postgres` driver, bypassing TCP entirely.

### NEVER use Cloud SQL authorized-networks for dev
Your ISP uses CGNAT — your public IP rotates between requests. Authorized-networks will always time out. Use the Cloud SQL Auth Proxy instead (it tunnels through Google's API).

---

## Environment Variables

All env vars are documented in `.env.example` (single source of truth). Copy to `.env.local` for local dev.

| Variable | Purpose | Local | Production | Sensitive? |
|----------|---------|-------|------------|------------|
| `DATABASE_URL` | PostgreSQL connection string | `.env.local` | Secret Manager | Yes |
| `INSTANCE_UNIX_SOCKET` | Cloud SQL Unix socket path | Not set | `--set-env-vars` | No |
| `SMTP_USER` | Google Workspace account for sending email | `.env.local` | `--set-env-vars` | No |
| `SMTP_PASS` | Google App Password (16 chars) | `.env.local` | Secret Manager | Yes |
| `SMTP_FROM` | Display name + alias for outbound mail | `.env.local` | `--set-env-vars` | No |

**Convention**: Credentials go in Secret Manager (`--set-secrets`). Config goes in env vars (`--set-env-vars`). Both are set in `deploy.sh`.

---

## Deployment Checklist

1. `npm run build` — passes locally
2. `npm run docker:test` — verify app on localhost:8080 (DB calls won't work, but pages load)
3. `npm run deploy` — build, push, deploy to Cloud Run
4. Test live: `curl -X POST .../api/waitlist -H "Content-Type: application/json" -d '{"email":"verify@test.com"}'`
5. Check logs if anything fails: `gcloud run services logs read hivemind-web --region=us-central1`

---

## File Structure
```
scripts/
  deploy.sh          # Production deployment (build → push → deploy)
  dev.sh             # Local dev (proxy + next dev)
  docker-test.sh     # Local Docker verification on :8080
  db-push.sh         # Schema migration to Cloud SQL (reads creds from .env.local)
src/
  app/               # Next.js App Router pages + API routes
    api/waitlist/    # POST /api/waitlist endpoint
  components/        # React components
    landing/         # Ported landing page (LandingPage.tsx, LandingScripts.tsx, landing.css)
  db/                # Drizzle schema + lazy connection (getDb())
  fonts/             # Self-hosted .woff2 files (Inter, JetBrains Mono, Instrument Serif)
  lib/               # Utilities (email.ts placeholder for Phase 2)
  middleware.ts      # www → apex 301 redirect
```
