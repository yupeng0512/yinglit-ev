#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-https://www.yinglitech.com}"
BASE_URL="${BASE_URL%/}"

node "$PWD/.codex/skills/monitor-yinglitech-geo/scripts/collect-public-signals.mjs" "$BASE_URL"
