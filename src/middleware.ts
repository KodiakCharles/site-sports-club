import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

const intlMiddleware = createIntlMiddleware({
  locales: ['fr', 'en', 'es'],
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
  localeDetection: false,
})

const MARKETING_DOMAINS = (process.env.MARKETING_DOMAINS ?? 'web-pulse.fr,www.web-pulse.fr')
  .split(',')
  .map((d) => d.trim().toLowerCase())
  .filter(Boolean)

function isMarketingHost(host: string): boolean {
  return MARKETING_DOMAINS.includes(host)
}

export default function middleware(req: NextRequest) {
  const host = (req.headers.get('host') ?? '').replace(/:\d+$/, '').toLowerCase()

  if (isMarketingHost(host)) {
    const url = req.nextUrl.clone()
    // Évite la double-préfixation si la requête arrive déjà préfixée
    if (!url.pathname.startsWith('/marketing')) {
      url.pathname = url.pathname === '/' ? '/marketing' : `/marketing${url.pathname}`
    }
    return NextResponse.rewrite(url)
  }

  return intlMiddleware(req)
}

export const config = {
  // Exclut: assets Next, _vercel, /api, /admin, le dossier interne /marketing,
  // et tout chemin contenant un point (fichiers statiques).
  matcher: ['/((?!_next|_vercel|api|admin|marketing|.*\\..*).*)'],
}
