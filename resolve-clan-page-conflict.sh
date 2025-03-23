#!/bin/bash

# Script to resolve the merge conflict in app/clans/[clanId]/page.tsx
# This script focuses only on integrating chat functionality (not user profile)

TARGET_FILE="app/clans/[clanId]/page.tsx"

# Make sure we're on the temporary branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "temp-ephemeral-migration" ]; then
  echo "Please checkout the temp-ephemeral-migration branch first."
  exit 1
fi

echo "Creating a resolved version of the clan page with only chat functionality..."

# Create a backup of the current file
cp "$TARGET_FILE" "${TARGET_FILE}.backup"

# Let's look at the differences between the branches
echo "Comparing the clan page file between branches..."
git diff feature/ephemeral-chat:app/clans/\[clanId\]/page.tsx feature/clanpages-fix:app/clans/\[clanId\]/page.tsx > clan-page-diff.txt

# Guide for manual integration
echo ""
echo "===== MANUAL INTEGRATION GUIDE ====="
echo ""
echo "1. Open ${TARGET_FILE}.backup in your editor"
echo "2. Look at clan-page-diff.txt to identify the chat-specific changes"
echo "3. Make these specific changes to add chat functionality:"
echo ""
echo "   a. In the useEffect hook where it has the conflict, use this pattern:"
echo ""
echo '   useEffect(() => {'
echo '     if (isMantleClan) {'
echo '       checkWalletConnection();'
echo '       dispatchChatEvent(false);'
echo '       '
echo '       // Add event listener for enterSpace event from the chat component'
echo '       const handleEnterSpaceEvent = () => {'
echo '         handleEnterSpace();'
echo '       };'
echo '       '
echo '       document.addEventListener(\'enterSpace\', handleEnterSpaceEvent);'
echo '       '
echo '       return () => {'
echo '         dispatchChatEvent(true);'
echo '         document.removeEventListener(\'enterSpace\', handleEnterSpaceEvent);'
echo '       };'
echo '     }'
echo '   }, [isMantleClan]);'
echo ""
echo "   b. Make sure you're using handleEnterSpace, not handleEnterSpaceClick"
echo ""
echo "   c. Keep your integration focused only on chat functionality, not user profile"
echo ""
echo "4. Test the functionality"
echo "5. When satisfied, commit the changes"
echo ""
echo "The diff file (clan-page-diff.txt) shows all differences between the branches"
echo "to help you identify chat-specific changes." 