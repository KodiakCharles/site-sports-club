import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  // Pas de template/default ici : chaque sous-layout (marketing, [locale])
  // définit son propre titrage, sport-aware côté tenant et marque-mère
  // côté vitrine. Sinon le template traverse jusqu'aux pages enfants et
  // produit des titres incohérents (« Web Pulse … | VoilePulse »).
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
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
