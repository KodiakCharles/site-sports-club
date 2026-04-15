import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.club-voile.fr'
const locales = ['fr', 'en', 'es'] as const

const staticPages = [
  { path: '', changeFrequency: 'weekly' as const, priority: 1.0 },
  { path: '/le-club', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/activites', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/stages', changeFrequency: 'weekly' as const, priority: 0.9 },
  { path: '/competition', changeFrequency: 'weekly' as const, priority: 0.8 },
  { path: '/tarifs', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/actualites', changeFrequency: 'daily' as const, priority: 0.8 },
  { path: '/contact', changeFrequency: 'yearly' as const, priority: 0.6 },
  { path: '/nous-trouver', changeFrequency: 'yearly' as const, priority: 0.6 },
  { path: '/mentions-legales', changeFrequency: 'yearly' as const, priority: 0.3 },
  { path: '/confidentialite', changeFrequency: 'yearly' as const, priority: 0.3 },
]

function buildAlternates(path: string) {
  const languages: Record<string, string> = {}
  for (const locale of locales) {
    languages[locale] = `${BASE_URL}/${locale}${path}`
  }
  return { languages }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Static pages per locale
  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: buildAlternates(page.path),
      })
    }
  }

  // Dynamic posts from Payload
  try {
    const payload = await getPayload({ config })

    const posts = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      limit: 1000,
      select: { slug: true, updatedAt: true },
    })

    for (const post of posts.docs) {
      const p = post as Record<string, unknown>
      const slug = p.slug as string
      if (!slug) continue

      for (const locale of locales) {
        entries.push({
          url: `${BASE_URL}/${locale}/actualites/${slug}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt as string) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: buildAlternates(`/actualites/${slug}`),
        })
      }
    }

    // Dynamic stages from Payload
    const stages = await payload.find({
      collection: 'stages',
      limit: 1000,
      select: { slug: true, updatedAt: true },
    })

    for (const stage of stages.docs) {
      const s = stage as Record<string, unknown>
      const slug = s.slug as string
      if (!slug) continue

      for (const locale of locales) {
        entries.push({
          url: `${BASE_URL}/${locale}/stages/${slug}`,
          lastModified: s.updatedAt ? new Date(s.updatedAt as string) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: buildAlternates(`/stages/${slug}`),
        })
      }
    }
  } catch {
    // Payload not available at build time — return static entries only
  }

  return entries
}
