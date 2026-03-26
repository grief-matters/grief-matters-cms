#!/usr/bin/env bash
set -euo pipefail

# Read stdin (hook input JSON)
input=$(cat)

# Check if the stop hook is already active (prevent infinite loop)
stop_hook_active=$(echo "$input" | jq -r '.stop_hook_active // false')
if [ "$stop_hook_active" = "true" ]; then
  exit 0
fi

# Auto-fix what we can
npm run format 2>/dev/null || true
npm run lint:fix 2>/dev/null || true

# Run all checks and capture failures
errors=""

format_output=$(npm run format:check 2>&1) || errors+="## Formatting errors\n${format_output}\n\n"
lint_output=$(npm run lint 2>&1) || errors+="## Lint errors\n${lint_output}\n\n"
typecheck_output=$(npm run typecheck 2>&1) || errors+="## Type errors\n${typecheck_output}\n\n"

# If all checks passed, allow stop
if [ -z "$errors" ]; then
  exit 0
fi

# Checks failed — block Claude from stopping and provide feedback
reason=$(printf '%s' "$errors" | jq -Rs .)
cat <<EOF
{"decision": "block", "reason": ${reason}}
EOF

exit 0
