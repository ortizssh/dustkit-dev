import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Dustkit Dev',
    template: '%s | Dustkit Dev',
  },
  description: 'Universal monorepo for Dustkey projects',
  keywords: ['dustkit', 'monorepo', 'nextjs', 'react', 'supabase'],
  authors: [{ name: 'Dustkit Team' }],
  creator: 'Dustkit Team',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Dustkit Dev',
    description: 'Universal monorepo for Dustkey projects',
    siteName: 'Dustkit Dev',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dustkit Dev',
    description: 'Universal monorepo for Dustkey projects',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased min-h-screen bg-white`}>
        <Providers>
          <div className="relative">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}