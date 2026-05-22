#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILLS_DIR="$ROOT_DIR/.codex/skills"
SKILL_CREATOR_DIR="${SKILL_CREATOR_DIR:-$HOME/.codex/skills/.system/skill-creator}"
VALIDATOR="$SKILL_CREATOR_DIR/scripts/quick_validate.py"

if ! command -v uv >/dev/null 2>&1; then
  echo "uv is required to run project skill validation without modifying system Python." >&2
  echo "Install uv first, then rerun: npm run skills:validate" >&2
  exit 1
fi

if [[ ! -f "$VALIDATOR" ]]; then
  echo "Skill validator not found: $VALIDATOR" >&2
  echo "Set SKILL_CREATOR_DIR to the local skill-creator directory if it is installed elsewhere." >&2
  exit 1
fi

if [[ ! -d "$SKILLS_DIR" ]]; then
  echo "No project skills directory found: $SKILLS_DIR" >&2
  exit 0
fi

found=0
while IFS= read -r skill_md; do
  found=1
  skill_dir="$(dirname "$skill_md")"
  rel_dir="${skill_dir#"$ROOT_DIR"/}"
  echo "Validating $rel_dir"
  uv run --with PyYAML -- python "$VALIDATOR" "$skill_dir"
done < <(find "$SKILLS_DIR" -mindepth 2 -maxdepth 2 -name SKILL.md | sort)

if [[ "$found" -eq 0 ]]; then
  echo "No project skills found under $SKILLS_DIR" >&2
  exit 0
fi

echo "Project skills are valid."
