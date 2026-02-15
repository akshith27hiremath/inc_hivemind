#!/usr/bin/env bash
set -euo pipefail

# Hivemind Inc — Local Development with Cloud SQL
# Usage: npm run dev:full
# Prereq: gcloud auth application-default login (one-time)

INSTANCE="hivemind-inc:us-central1:hivemind-db"
PROXY_PORT=5432
PROXY_PID=""

cleanup() {
  if [ -n "$PROXY_PID" ]; then
    echo ""
    echo "Stopping Cloud SQL Auth Proxy (pid $PROXY_PID)..."
    kill "$PROXY_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

echo "=== Starting Cloud SQL Auth Proxy ==="
cloud-sql-proxy "$INSTANCE" --port="$PROXY_PORT" &
PROXY_PID=$!
sleep 3

# Verify proxy is running
if ! kill -0 "$PROXY_PID" 2>/dev/null; then
  echo "ERROR: Cloud SQL Auth Proxy failed to start."
  echo "Run: gcloud auth application-default login"
  exit 1
fi

echo "Proxy running on localhost:${PROXY_PORT} (pid $PROXY_PID)"
echo ""
echo "=== Starting Next.js dev server ==="
npm run dev
