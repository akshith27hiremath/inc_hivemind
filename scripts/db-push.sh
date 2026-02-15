#!/usr/bin/env bash
set -euo pipefail

# Hivemind Inc — Push Drizzle schema to Cloud SQL
# Usage: npm run db:push:prod
# Prereq: gcloud auth application-default login (one-time)
# Reads DATABASE_URL from .env.local (via grep, not source — avoids comment issues)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
INSTANCE="hivemind-inc:us-central1:hivemind-db"
PROXY_PORT=5432
STARTED_PROXY=false

# Read DATABASE_URL from .env.local
ENV_FILE="$PROJECT_DIR/.env.local"
if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: .env.local not found. Copy .env.example to .env.local and fill in DATABASE_URL."
  exit 1
fi
DB_URL=$(grep -E '^DATABASE_URL=' "$ENV_FILE" | cut -d'=' -f2-)
if [ -z "$DB_URL" ]; then
  echo "ERROR: DATABASE_URL not found in .env.local"
  exit 1
fi

# Check if proxy is already running (use curl timeout instead of nc for Windows compat)
if ! curl -s --max-time 1 http://localhost:${PROXY_PORT} >/dev/null 2>&1; then
  echo "Cloud SQL Auth Proxy not detected. Starting..."
  cloud-sql-proxy "$INSTANCE" --port="$PROXY_PORT" &
  PROXY_PID=$!
  STARTED_PROXY=true
  sleep 3

  if ! kill -0 "$PROXY_PID" 2>/dev/null; then
    echo "ERROR: Cloud SQL Auth Proxy failed to start."
    echo "Run: gcloud auth application-default login"
    exit 1
  fi
fi

echo "=== Pushing schema to Cloud SQL ==="
DATABASE_URL="$DB_URL" npx drizzle-kit push

if [ "$STARTED_PROXY" = true ]; then
  kill "$PROXY_PID" 2>/dev/null || true
fi

echo "=== Done ==="
