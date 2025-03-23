#!/bin/bash

# Script to migrate ONLY ephemeral chat functionality from feature/ephemeral-chat to feature/clanpages-fix
# Excludes user profile component changes

# Files to migrate - ONLY chat related components
EPHEMERAL_FILES=(
  "components/chat/EphemeralChat.tsx"
  "context/EphemeralChatContext.tsx"
  "app/api/ephemeral-chat/route.ts"
)

# Components with selective changes
MODIFIED_FILES=(
  "components/providers/index.tsx"
  "components/AppLayout.tsx"
)

# Check if we have uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  echo "You have uncommitted changes. Please commit or stash them before proceeding."
  exit 1
fi

# Make sure we're on feature/ephemeral-chat branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "feature/ephemeral-chat" ]; then
  echo "Please checkout the feature/ephemeral-chat branch first."
  exit 1
fi

# Create a temporary branch from feature/clanpages-fix
echo "Creating temporary branch from feature/clanpages-fix..."
git checkout feature/clanpages-fix
git checkout -b temp-ephemeral-migration

# Copy each chat-specific file from feature/ephemeral-chat
echo "Copying ephemeral chat files from feature/ephemeral-chat branch..."
for file in "${EPHEMERAL_FILES[@]}"; do
  echo "Copying $file..."
  git checkout feature/ephemeral-chat -- "$file"
done

echo "The following files need manual editing to include only chat functionality:"
for file in "${MODIFIED_FILES[@]}"; do
  echo "- $file"
done

# Handle the special case of page.tsx
echo "For the clan page, you'll need to manually resolve conflicts to include only the chat functionality."
echo "Use the resolve-clan-page-conflict.sh script as a starting point."

# Stage direct copies
git add ${EPHEMERAL_FILES[@]}

# Commit the changes
git commit -m "Migrate ephemeral chat functionality from feature/ephemeral-chat branch (without user profile)"

# Provide next steps
echo ""
echo "PARTIAL MIGRATION COMPLETED!"
echo "--------------------------"
echo "The core ephemeral chat files have been migrated to 'temp-ephemeral-migration' branch."
echo ""
echo "You still need to manually edit the following files to include only chat-related changes:"
for file in "${MODIFIED_FILES[@]}"; do
  echo "- $file"
done
echo ""
echo "For app/clans/[clanId]/page.tsx, you need to manually integrate the chat functionality"
echo "without affecting the user profile functionality from feature/clanpages-fix."
echo ""
echo "Next steps:"
echo "1. Run './resolve-clan-page-conflict.sh' to help with the page.tsx conflict"
echo "2. Compare and selectively merge changes in the provider and layout files:"
echo "   git diff feature/ephemeral-chat:components/providers/index.tsx temp-ephemeral-migration:components/providers/index.tsx"
echo "   git diff feature/ephemeral-chat:components/AppLayout.tsx temp-ephemeral-migration:components/AppLayout.tsx"
echo "3. Test the chat functionality locally"
echo "4. When satisfied, merge back to feature/clanpages-fix with:"
echo "   git checkout feature/clanpages-fix"
echo "   git merge temp-ephemeral-migration" 