#!/usr/bin/env bash
# Batch-migrate simple route files from TanStack Router to react-router-dom
# This script handles the mechanical transformations:
# 1. Remove createLazyFileRoute import and usage
# 2. Replace @tanstack/react-router imports with react-router-dom
# 3. "function X()" → "export default function X()"

cd "$(dirname "$0")/.."

FILES=(
  "src/routes/packages.lazy.tsx"
  "src/routes/forgot-password.lazy.tsx"
  "src/routes/disclaimer.lazy.tsx"
  "src/routes/cookie-policy.lazy.tsx"
  "src/routes/terms-and-conditions.lazy.tsx"
  "src/routes/privacy-policy.lazy.tsx"
  "src/routes/courses/index.lazy.tsx"
  "src/routes/_auth/dashboard.lazy.tsx"
  "src/routes/_auth/profile.lazy.tsx"
  "src/routes/_auth/wallet.lazy.tsx"
  "src/routes/_auth/tank.lazy.tsx"
  "src/routes/_auth/transactions.lazy.tsx"
  "src/routes/_auth/commissions.lazy.tsx"
  "src/routes/_auth/rank-reward.lazy.tsx"
  "src/routes/_auth/membership.lazy.tsx"
  "src/routes/_auth/genealogy.lazy.tsx"
  "src/routes/_auth/library.lazy.tsx"
  "src/routes/_auth/nova-pro.lazy.tsx"
  "src/routes/_auth/support.lazy.tsx"
)

for f in "${FILES[@]}"; do
  if [ ! -f "$f" ]; then
    echo "SKIP (not found): $f"
    continue
  fi

  # Step 1: Remove the "export const Route = createLazyFileRoute(...)({ component: ... });" lines
  sed -i '/^export const Route = createLazyFileRoute/d' "$f"

  # Step 2: Remove lines that only have "component: ...,?" and closing braces of the Route config
  sed -i '/^  component:/d' "$f"
  sed -i '/^});$/d' "$f"

  # Step 3: Replace '@tanstack/react-router' import source with 'react-router-dom'
  sed -i "s|from ['\"]@tanstack/react-router['\"]|from 'react-router-dom'|g" "$f"

  # Step 4: Remove createLazyFileRoute from import lines
  sed -i 's/createLazyFileRoute,\s*//g' "$f"
  sed -i 's/,\s*createLazyFileRoute//g' "$f"
  sed -i '/^import { createLazyFileRoute }$/d' "$f"
  # Handle single-import lines
  sed -i "/^import { createLazyFileRoute } from/d" "$f"

  # Step 5: Convert "function ComponentName()" to "export default function ComponentName()"
  # Match function declarations that are NOT already exported
  sed -i 's/^function \([A-Z][a-zA-Z]*\)()/export default function \1()/g' "$f"

  # Step 6: Remove createFileRoute import and any Route export using it
  sed -i 's/createFileRoute,\s*//g' "$f"
  sed -i 's/,\s*createFileRoute//g' "$f"
  sed -i "/^import { createFileRoute } from/d" "$f"

  # Step 7: Replace navigate({ to: "..." }) with navigate("...")
  sed -i "s/navigate({ to: \"\([^\"]*\)\" })/navigate(\"\1\")/g" "$f"
  # Handle navigate({ to: "...", ... }) with search/replace params - leave for manual
  
  # Step 8: Replace useSearch with useSearchParams where needed
  sed -i 's/useSearch,\s*/useSearchParams, /g' "$f"
  sed -i 's/,\s*useSearch/,useSearchParams/g' "$f"

  echo "DONE: $f"
done

echo "Migration complete!"
