# Remove shadcn/ui and Install Material-UI Sidebar

## Branch: rxwri-15

This branch removes all shadcn/ui components and replaces them with Material-UI, specifically implementing a permanent sidebar.

## 🚨 Important: Setup Required

When switching to this branch, you MUST run:

```bash
git checkout rxwri-15
npm install
```

**Why?** This branch changes the packages we use, so you need to install the new ones.

## What Changed

### 1. Removed Old UI Library (shadcn)

We deleted these files:

- All files in `components/ui/` folder
- `components.json` config file

### 2. Added New UI Library (Material-UI)

We installed these new packages:

- `@mui/material` - Main Material-UI components
- `@emotion/react` & `@emotion/styled` - Required for Material-UI styling
- `@mui/icons-material` - Icons for the sidebar

### 3. Created New Sidebar

**New File:** `components/mui-sidebar.js`

- Always visible sidebar on the left
- 240px wide
- Has menu items: Home, Prescriptions, Profile, Settings
- Uses Material-UI design

### 4. Updated Button Components

Changed button imports in these files:

- `app/page.js`
- `components/generated-prescription.js`

**Before:**

```javascript
import { Button } from '@/components/ui/button'
```

**After:**

```javascript
import { Button } from '@mui/material'
```

## How It Works Now

### Layout Structure

```
┌─────────────┬──────────────────────┐
│   Sidebar   │    Main Content      │
│   (240px)   │   (rest of screen)   │
│             │                      │
│ • Home      │   Your page content  │
│ • Profile   │   appears here and   │
│ • Settings  │   is centered        │
│             │                      │
└─────────────┴──────────────────────┘
```

### What You Get

- ✅ Modern Material-UI design
- ✅ Always visible sidebar
- ✅ Centered page content
- ✅ Responsive layout
- ✅ No more shadcn dependencies

## For Developers: Technical Details

### Files Changed

- `app/layout.js` - Added sidebar and centered layout
- `app/page.js` - Updated button import
- `components/mui-sidebar.js` - New sidebar component from https://mui.com/material-ui/react-drawer/#permanent-drawer
- `components/generated-prescription.js` - Updated button import

### Key Code Changes

**Layout Structure:**

```javascript
// app/layout.js
<Box sx={{ display: 'flex' }}>
  <MuiSidebar /> // Sidebar on left
  <Box component='main'>
    {' '}
    // Main content area
    {children} // Your pages go here
  </Box>
</Box>
```

**Button Usage:**

```javascript
// Before: shadcn button
import { Button } from '@/components/ui/button'

// After: Material-UI button
import { Button } from '@mui/material'
```

### Why This Works Better

- **Simpler**: Less custom CSS, uses proven Material-UI components
- **Consistent**: All components follow Material Design standards
- **Maintained**: Material-UI is actively developed by Google
- **Accessible**: Built-in accessibility features

## 📋 Pull Request Review Guide

### For Reviewers: How to Test This Branch

If you're reviewing this pull request, here's how to pull and test the changes:

#### Step 1: Pull the Branch

```bash
# Make sure you're in the project directory
cd your-project-name

# Fetch the latest changes
git fetch origin

# Switch to the branch
git checkout rxwri-15

# Install the new dependencies (REQUIRED!)
npm install
```

#### Step 2: Start the Development Server

```bash
npm run dev
```

#### Step 3: What to Test

**✅ Visual Check:**

- Open `http://localhost:3000`
- You should see a sidebar on the left with menu items
- Main content should be centered in the remaining space
- No console errors in browser dev tools

**✅ Functionality Check:**

- Click the "Generate Prescription" button - it should work
- Sidebar should always be visible (doesn't hide/collapse)
- Page content should be centered horizontally and vertically

**✅ Code Check:**

- No import errors when starting the app
- All Material-UI components load properly
- No references to old shadcn components

#### Step 4: Common Issues & Solutions

**Problem:** `Module not found` errors
**Solution:** Make sure you ran `npm install` after checking out the branch

**Problem:** Sidebar not showing
**Solution:** Check browser console for errors, ensure all MUI packages installed

**Problem:** Content not centered
**Solution:** This is expected behavior - content centers within the available space after the sidebar

#### Step 5: Going Back to Main Branch

```bash
# Switch back to main branch
git checkout main

# Reinstall original dependencies
npm install
```

### Review Checklist

- [ ] Branch pulls without conflicts
- [ ] `npm install` runs successfully
- [ ] App starts without errors (`npm run dev`)
- [ ] Sidebar appears on the left side
- [ ] Main content is centered
- [ ] Buttons work (Material-UI styling)
- [ ] No console errors in browser
- [ ] Code follows project conventions
