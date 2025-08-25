'use client'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
} from '@mui/material'
import { Home, Settings, Person, Description } from '@mui/icons-material'

const drawerWidth = 240

const menuItems = [
  { text: 'Home', icon: <Home />, href: '/' },
  { text: 'Prescriptions', icon: <Description />, href: '/prescriptions' },
  { text: 'Profile', icon: <Person />, href: '/profile' },
  { text: 'Settings', icon: <Settings />, href: '/settings' },
]

export default function MuiSidebar() {
  return (
    <Drawer
      variant='permanent'
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar>
        <Typography variant='h6' noWrap component='div'>
          RxWriter
        </Typography>
      </Toolbar>

      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}
