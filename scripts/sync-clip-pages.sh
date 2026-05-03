#!/usr/bin/env bash
# Sync Jekyll clip landing dirs + _data/clip_screens.yml from my-toybox Screen.swift (all cases).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEFAULT_SWIFT="${REPO_ROOT}/../my-toybox/Packages/Sources/MyToyboxScreens/Screen.swift"
SCREEN_SWIFT="${SCREEN_SWIFT:-$DEFAULT_SWIFT}"

if [[ ! -f "$SCREEN_SWIFT" ]]; then
  echo "error: Screen.swift not found: $SCREEN_SWIFT" >&2
  echo "Set SCREEN_SWIFT=/path/to/Screen.swift" >&2
  exit 1
fi

IDS_sorted="$(mktemp)"
cleanup() { rm -f "$IDS_sorted"; }
trap cleanup EXIT

grep -E '^[[:space:]]+case[[:space:]]+[A-Za-z0-9_]+' "$SCREEN_SWIFT" |
  sed -E 's/^[[:space:]]+case[[:space:]]+([A-Za-z0-9_]+).*/\1/' |
  sort -u >"$IDS_sorted"

if [[ ! -s "$IDS_sorted" ]]; then
  echo "error: no cases found in $SCREEN_SWIFT" >&2
  exit 1
fi

count=0
while IFS= read -r id; do
  [[ -z "$id" ]] && continue
  count=$((count + 1))
  dir="${REPO_ROOT}/${id}"
  mkdir -p "$dir"
  cat >"${dir}/index.html" <<EOF
---
layout: clip_landing
title: "MyToybox — ${id}"
clip_screen_id: ${id}
---
EOF
done <"$IDS_sorted"

{
  echo "# \`?screen=\` 用の既知 ID（Screen.swift の全 case と一致）。"
  echo "# 再生成: \`./scripts/sync-clip-pages.sh\`（手編集よりスクリプトを優先）。"
  echo "# App Clip が実際に開く先のサブセットは my-toybox の RouteCatalog を参照。"
  echo "ids:"
  while IFS= read -r id; do
    [[ -z "$id" ]] && continue
    echo "  - ${id}"
  done <"$IDS_sorted"
} >"${REPO_ROOT}/_data/clip_screens.yml"

echo "ok: ${count} screens from ${SCREEN_SWIFT}"
