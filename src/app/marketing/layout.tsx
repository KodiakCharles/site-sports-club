import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import Footer from './components/Footer'
import './marketing.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.web-pulse.fr'),
  title: { template: '%s | Web Pulse', default: 'Web Pulse — Sites web SaaS pour clubs de sport' },
  description:
    'Le site web de votre club, prêt en 24h. Multi-sport, multi-tenant, conçu pour les fédérations. Voile, rugby, pelote — un seul SaaS.',
  openGraph: {
    title: 'Web Pulse — Sites web SaaS pour clubs de sport',
    description: 'Le site web de votre club, prêt en 24h. Voile, rugby, pelote — un seul SaaS.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Web Pulse',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.className}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
