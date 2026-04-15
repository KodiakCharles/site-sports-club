import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import ChatbotWidget from '@/components/sections/ChatbotWidget'
import '../../styles/globals.css'
import { getPayload } from 'payload'
import config from '@payload-config'

// Multi-tenant : le club est résolu depuis le hostname à chaque request.
// Pas de pré-rendering au build time (DATABASE_URL pas requise au build).
export const dynamic = 'force-dynamic'
export const revalidate = 0

const inter = Inter({ subsets: ['latin'] })

const locales = ['fr', 'en', 'es']

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> }

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!locales.includes(locale)) notFound()
  const messages = await getMessages()

  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'club-settings' }).catch(() => null)
  const s = settings as Record<string, unknown> | null
  const logoMedia = s?.logo as { url?: string; alt?: string } | null | undefined
  const logoUrl = logoMedia?.url ?? null
  const logoText = (s?.logoText as string) || (s?.clubName as string) || 'ClubVoile'

  return (
    <html lang={locale} className="public-site" suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <a href="#main-content" className="skip-to-content">Aller au contenu</a>
          <Header locale={locale} logoUrl={logoUrl} logoText={logoText} />
          <main id="main-content" className="main-content">{children}</main>
          <Footer locale={locale} />
          <BottomNav locale={locale} />
          <ChatbotWidget />
        </NextIntlClientProvider>
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {})
                })
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
