import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: { template: '%s | VoilePulse', default: 'VoilePulse — Sites pour clubs de voile' },
  description: 'Solution digitale pour les clubs affiliés à la Fédération Française de Voile.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Club de Voile',
  },
  icons: {
    apple: '/icons/icon-192.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1d6fa4',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// Le root layout ne rend pas <html>/<body> — chaque route group le fait :
// - (payload) : via RootLayout de Payload (fournit son propre <html><body>)
// - [locale]  : via LocaleLayout (fournit son propre <html><body>)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
