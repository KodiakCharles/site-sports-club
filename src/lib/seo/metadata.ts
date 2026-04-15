import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.club-voile.fr'
const locales = ['fr', 'en', 'es'] as const

interface PageMetadataParams {
  title: string
  description: string
  path: string
  locale: string
  clubName?: string
  imageUrl?: string
}

export function generatePageMetadata({
  title,
  description,
  path,
  locale,
  clubName = 'Club de Voile',
  imageUrl,
}: PageMetadataParams): Metadata {
  const url = `${BASE_URL}/${locale}${path}`
  const ogImage =
    imageUrl ||
    `${BASE_URL}/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description)}&clubName=${encodeURIComponent(clubName)}`

  const alternates: Record<string, string> = {}
  for (const loc of locales) {
    alternates[loc] = `${BASE_URL}/${loc}${path}`
  }

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: clubName,
      locale,
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
