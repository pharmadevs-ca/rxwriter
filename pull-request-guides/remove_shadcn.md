# Remove shadcn/ui and Install Material-UI Sidebar

## Branch: rxwri-15

This branch removes all shadcn/ui components and replaces them with Material-UI, specifically implementing a permanent sidebar.

## Changes Made

### 1. Removed shadcn Components

**Files Deleted:**

- `components/ui/button.jsx`
- `components/ui/input.jsx`
- `components/ui/separator.jsx`
- `components/ui/skeleton.jsx`
- `components/ui/tooltip.jsx`
- `components.json` (shadcn configuration)

**Dependencies Removed:**

```bash
npm uninstall class-variance-authority clsx tailwind-merge @radix-ui/react-slot lucide-react
```

### 2. Installed Material-UI

**New Dependencies:**

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

### 3. Created Material-UI Sidebar

**New File:** `components/mui-sidebar.js`

- Permanent sidebar using MUI Drawer component
- 240px fixed width
- Navigation menu with icons (Home, Prescriptions, Profile, Settings)
- Uses Material-UI icons from `@mui/icons-material`

### 4. Updated Layout

**Modified:** `app/layout.js`

- Added MUI Box components for layout structure
- Integrated permanent sidebar

### 5. Updated Button Components

**Files Modified:**

- `app/page.js` - Changed Button import from shadcn to MUI
- `components/generated-prescription.js` - Changed Button import from shadcn to MUI

**Import Change:**

```javascript
// Before
import { Button } from '@/components/ui/button'

// After
import { Button } from '@mui/material'
```

## Key Technical Decisions

1. **Permanent Sidebar**: Used `variant="permanent"` for always-visible sidebar
2. **No Theme Provider**: Kept layout simple by using default MUI styling
3. **Client Component**: Marked sidebar as `'use client'` for interactivity
4. **Flexbox Layout**: Used MUI Box with flexbox for responsive layout

## Layout Structure

```
<Box sx={{ display: 'flex' }}>
  <MuiSidebar />                    // 240px fixed width
  <Box component='main' sx={{       // Main content area
    flexGrow: 1,
    p: 3,
    ml: '240px'
  }}>
    {children}
  </Box>
</Box>
```

## Result

- Complete removal of shadcn/ui dependency
- Clean Material-UI implementation
- Permanent sidebar navigation
- Responsive main content area
- Simplified component structure
