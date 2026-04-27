import type { Metadata, Viewport } from 'next'
import './marketing.css'

export const metadata: Metadata = {
  title: { template: '%s | Web Pulse', default: 'Web Pulse — Sites web SaaS pour clubs de sport' },
  description:
    'Le site web de votre club, prêt en 24h. Multi-sport, multi-tenant, conçu pour les fédérations.',
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
