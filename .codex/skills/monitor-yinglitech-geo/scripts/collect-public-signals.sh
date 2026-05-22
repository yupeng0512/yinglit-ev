#!/usr/bin/env bash
set -euo pipefail

if [[ "$#" -eq 0 ]]; then
  set -- "https://www.yinglitech.com"
fi

node "$PWD/.codex/skills/monitor-yinglitech-geo/scripts/collect-public-signals.mjs" "$@"
