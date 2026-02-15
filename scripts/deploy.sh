#!/usr/bin/env bash
set -euo pipefail

# Hivemind Inc — Production Deployment
# Usage: npm run deploy

IMAGE="us-central1-docker.pkg.dev/hivemind-inc/hivemind-repo/hivemind-web"
REGION="us-central1"
SERVICE="hivemind-web"

echo "=== Step 1/4: Building Next.js ==="
npm run build

echo ""
echo "=== Step 2/4: Docker build ==="
docker build -t "${IMAGE}:latest" .

echo ""
echo "=== Step 3/4: Pushing to Artifact Registry ==="
docker push "${IMAGE}:latest"

echo ""
echo "=== Step 4/4: Deploying to Cloud Run ==="
gcloud run deploy "$SERVICE" \
  --image="${IMAGE}:latest" \
  --region="$REGION" \
  --port=8080 \
  --min-instances=1 \
  --max-instances=3 \
  --memory=512Mi \
  --cpu=1 \
  --service-account=hivemind-runner@hivemind-inc.iam.gserviceaccount.com \
  --add-cloudsql-instances=hivemind-inc:us-central1:hivemind-db \
  --set-secrets=DATABASE_URL=DATABASE_URL:latest \
  --set-env-vars=INSTANCE_UNIX_SOCKET=/cloudsql/hivemind-inc:us-central1:hivemind-db \
  --allow-unauthenticated

echo ""
echo "=== Deployed ==="
gcloud run services describe "$SERVICE" --region="$REGION" --format="value(status.url)"
