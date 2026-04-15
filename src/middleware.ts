import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['fr', 'en', 'es'],
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
  localeDetection: false,
})

export const config = {
  matcher: ['/((?!_next|_vercel|api|admin|.*\\..*).*)'],
}
