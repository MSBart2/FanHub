#!/usr/bin/env bash
# FanHub .NET — start backend + frontend
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

cleanup() {
  echo ""
  echo "Shutting down FanHub..."
  kill "$BACKEND_PID" 2>/dev/null
  wait "$BACKEND_PID" 2>/dev/null
  exit 0
}
trap cleanup INT TERM

# ── Backend ──────────────────────────────────────────────────────────────────
echo "▶ Starting backend (http://localhost:5265)..."
cd "$SCRIPT_DIR/Backend"
dotnet restore --nologo -q

# Install EF tool if not present
if ! dotnet ef --version > /dev/null 2>&1; then
  echo "  Installing dotnet-ef tool..."
  dotnet tool install --global dotnet-ef
fi

dotnet ef database update --no-build 2>/dev/null || dotnet ef database update
dotnet run &
BACKEND_PID=$!

# ── Wait for backend ──────────────────────────────────────────────────────────
echo "  Waiting for backend to be ready..."
for i in $(seq 1 30); do
  if curl -s http://localhost:5265/api/shows > /dev/null 2>&1; then
    echo "  ✓ Backend ready"
    break
  fi
  sleep 1
done

# ── Frontend ──────────────────────────────────────────────────────────────────
echo "▶ Starting frontend (http://localhost:3000)..."
cd "$SCRIPT_DIR/Frontend"
dotnet restore --nologo -q
dotnet run
