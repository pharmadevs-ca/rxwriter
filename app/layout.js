import { Geist, Geist_Mono } from 'next/font/google'
import { Box } from '@mui/material'
import MuiSidebar from '@/components/mui-sidebar'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'RxWriter',
  description: 'My Next.js application',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Box sx={{ display: 'flex' }}>
          <MuiSidebar />
          <Box
            component='main'
            sx={{
              p: 3,
              ml: '240px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100vh',
            }}
          >
            {children}
          </Box>
        </Box>
      </body>
    </html>
  )
}
