#!/usr/bin/env bash
set -euo pipefail

# Hivemind Inc — Local Docker verification
# Usage: npm run docker:test
# Tests the production Docker image locally before deploying.
# Note: DB calls will fail (no Cloud SQL socket) — this tests the app itself.

IMAGE="us-central1-docker.pkg.dev/hivemind-inc/hivemind-repo/hivemind-web"

echo "=== Building Docker image ==="
docker build -t "${IMAGE}:latest" .

echo ""
echo "=== Running on http://localhost:8080 ==="
echo "(Ctrl+C to stop)"
docker run --rm -p 8080:8080 \
  -e DATABASE_URL="postgresql://postgres:unused@localhost/hivemind" \
  "${IMAGE}:latest"
