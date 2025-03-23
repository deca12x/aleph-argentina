# Ephemeral Chat Migration Instructions

This document provides instructions for migrating **ONLY** the ephemeral chat functionality (without user profile components) from the `feature/ephemeral-chat` branch to the `feature/clanpages-fix` branch.

## Migration Process

### Step 1: Commit or Stash Any Pending Changes

Before proceeding, make sure you don't have any uncommitted changes:

```bash
git status
```

If you have changes, either commit them:

```bash
git add .
git commit -m "Your commit message"
```

Or stash them:

```bash
git stash
```

### Step 2: Run the Updated Migration Script

```bash
./migrate-ephemeral-chat.sh
```

This script will:

1. Check that you're on the correct source branch (`feature/ephemeral-chat`)
2. Create a temporary branch from `feature/clanpages-fix`
3. Copy only the core ephemeral chat files from `feature/ephemeral-chat`
4. Commit the changes

### Step 3: Integrate the Chat Provider

The provider integration needs to be done carefully to avoid overwriting other changes:

```bash
./integrate-chat-provider.sh
```

This script will:

1. Create backups of the relevant files
2. Generate diff files to show the changes between branches
3. Provide a guide for safely integrating the chat provider

### Step 4: Resolve the Clan Page Conflict

The clan page needs manual edits to include only the chat-related functionality:

```bash
./resolve-clan-page-conflict.sh
```

This script will:

1. Create a backup of the clan page file
2. Generate a diff file showing the changes between branches
3. Provide a guide for resolving the conflict

### Step 5: Test the Functionality

Make sure to test that the ephemeral chat functionality works correctly on the temporary branch.

```bash
npm run dev
```

### Step 6: Merge Back to Your Target Branch

Once you're satisfied with the changes, merge back to the `feature/clanpages-fix` branch:

```bash
git checkout feature/clanpages-fix
git merge temp-ephemeral-migration
```

## Files Included in the Migration

### Core Files (Copied Directly)

- `components/chat/EphemeralChat.tsx`
- `context/EphemeralChatContext.tsx`
- `app/api/ephemeral-chat/route.ts`

### Files Requiring Manual Integration

- `components/providers/index.tsx` (add EphemeralChatProvider)
- `components/AppLayout.tsx` (add EphemeralChat component)
- `app/clans/[clanId]/page.tsx` (add event listener for chat)

## Troubleshooting

If anything goes wrong during the migration process, you can always abort:

```bash
git checkout feature/clanpages-fix
git branch -D temp-ephemeral-migration
```

This will take you back to the original state of the `feature/clanpages-fix` branch.

## Steps for Each Integration

### 1. Providers Integration

In `components/providers/index.tsx`:

- Add import: `import { EphemeralChatProvider } from "@/context/EphemeralChatContext";`
- Add provider in component tree:
  ```jsx
  <EphemeralChatProvider>{children}</EphemeralChatProvider>
  ```

### 2. AppLayout Integration

In `components/AppLayout.tsx`:

- Add import: `import EphemeralChat from "@/components/chat/EphemeralChat";`
- Add component: `{isInClanSpace && <EphemeralChat />}`

### 3. Clan Page Integration

In `app/clans/[clanId]/page.tsx`:

- Update the useEffect hook to include event listener for 'enterSpace'
- Make sure to use `handleEnterSpace` (not `handleEnterSpaceClick`)
- Focus only on chat-related functionality, not user profile changes
