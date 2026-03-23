import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import '../../styles/globals.css'

const locales = ['fr', 'en', 'es']

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> }

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!locales.includes(locale)) notFound()
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Header locale={locale} />
      <main className="main-content">{children}</main>
      <Footer locale={locale} />
    </NextIntlClientProvider>
  )
}
