#!/usr/bin/env bash

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_CMD=(docker compose)
BACKEND_URL="http://localhost:3333/docs/"
FRONTEND_URL="http://localhost:3000"
TIMEOUT_SECONDS=120

wait_for_url() {
  local name="$1"
  local url="$2"
  local timeout="$3"
  local elapsed=0

  while ! curl -fsS "$url" >/dev/null 2>&1; do
    if (( elapsed >= timeout )); then
      echo "Timed out waiting for ${name} at ${url}."
      "${COMPOSE_CMD[@]}" ps
      exit 1
    fi

    sleep 2
    elapsed=$((elapsed + 2))
  done
}

cd "$PROJECT_ROOT"

echo "Starting environment with Docker Compose..."
"${COMPOSE_CMD[@]}" up --build -d

echo "Waiting for backend to become available..."
wait_for_url "backend" "$BACKEND_URL" "$TIMEOUT_SECONDS"

echo "Waiting for frontend to become available..."
wait_for_url "frontend" "$FRONTEND_URL" "$TIMEOUT_SECONDS"

cat <<'EOF'

Environment is ready.
Frontend: http://localhost:3000
Backend: http://localhost:3333
Swagger: http://localhost:3333/docs/
PostgreSQL: localhost:5433

To follow the logs:
docker compose logs -f

To stop the environment:
docker compose down
EOF
