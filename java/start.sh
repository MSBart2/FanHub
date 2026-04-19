#!/usr/bin/env bash
# FanHub Java — start backend + frontend
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

cleanup() {
  echo ""
  echo "Shutting down FanHub..."
  kill "$BACKEND_PID" 2>/dev/null
  wait "$BACKEND_PID" 2>/dev/null
  exit 0
}
trap cleanup INT TERM

# ── Backend ───────────────────────────────────────────────────────────────────
echo "▶ Starting backend (http://localhost:5265)..."
cd "$SCRIPT_DIR/backend"
chmod +x mvnw
./mvnw spring-boot:run &
BACKEND_PID=$!

# ── Wait for backend ──────────────────────────────────────────────────────────
echo "  Waiting for backend to be ready (this may take a minute on first run)..."
for i in $(seq 1 60); do
  if curl -s http://localhost:5265/api/shows > /dev/null 2>&1; then
    echo "  ✓ Backend ready"
    break
  fi
  sleep 2
done

# ── Frontend ──────────────────────────────────────────────────────────────────
echo "▶ Starting frontend (http://localhost:3000)..."
cd "$SCRIPT_DIR/frontend"
npm install --silent
npm start
