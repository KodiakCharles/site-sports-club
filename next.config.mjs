import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import { withSentryConfig } from '@sentry/nextjs'

const withNextIntl = createNextIntlPlugin('./src/i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    // CSP en mode report-only : on observe les violations sans bloquer le rendu.
    // Why: la vitrine + le tenant rendent du HTML dérivé du CMS via
    // `dangerouslySetInnerHTML` (Lexical → HTML). Une CSP stricte mitige les
    // XSS en cas de bypass de la whitelist d'URLs côté lexical.ts.
    // À durcir (passer en `Content-Security-Policy`) une fois les rapports
    // de violations triés.
    const csp = [
      "default-src 'self'",
      // unsafe-inline requis pour Next.js scripts inlinés + Payload UI
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://api.anthropic.com https://api.mailjet.com https://api.brevo.com https://*.windguru.cz https://api.openweathermap.org https://graph.facebook.com https://api.twitter.com https://graph.instagram.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')

    return [
      {
        source: '/((?!admin|api).*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'Content-Security-Policy-Report-Only', value: csp },
        ],
      },
    ]
  },
}

const composedConfig = withPayload(withNextIntl(nextConfig))

export default process.env.SENTRY_DSN
  ? withSentryConfig(composedConfig, {
      silent: true,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      disableLogger: true,
    })
  : composedConfig
