#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BASE_URL="${BASE_URL:-http://127.0.0.1:3100}"
REMOTE_URL="${REMOTE_URL:-}"
ARTIFACT_DIR="${ARTIFACT_DIR:-$ROOT_DIR/.artifacts/visual-harness}"
SERVER_LOG="${SERVER_LOG:-/tmp/yinglit-visual-review.log}"

cd "$ROOT_DIR"

python3 scripts/crop_scenes.py
python3 scripts/visual_harness.py --mode assets --output-dir "$ARTIFACT_DIR"

npm run build
npm run start -- --hostname 127.0.0.1 --port 3100 >"$SERVER_LOG" 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT

for _ in $(seq 1 30); do
  if curl -sf "$BASE_URL" >/dev/null; then
    break
  fi
  sleep 1
done

python3 scripts/visual_harness.py --mode browser --base-url "$BASE_URL" --output-dir "$ARTIFACT_DIR/local"

if [[ -n "$REMOTE_URL" ]]; then
  if command -v vercel >/dev/null 2>&1; then
    vercel inspect "$REMOTE_URL" --wait >/dev/null
  fi
  python3 scripts/visual_harness.py --mode browser --base-url "$REMOTE_URL" --output-dir "$ARTIFACT_DIR/remote"
fi
