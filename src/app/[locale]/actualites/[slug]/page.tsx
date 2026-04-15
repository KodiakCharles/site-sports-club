import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getClubData, getPostBySlug, getPosts } from '@/lib/utils/clubData'
import { convertLexicalToHTML } from '@/lib/utils/lexical'
import JsonLd from '@/components/seo/JsonLd'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo/structured-data'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.club-voile.fr'

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const clubData = await getClubData()
  if (!clubData) return {}
  const post = await getPostBySlug(clubData.clubId, slug)
  if (!post) return {}
  const p = post as Record<string, unknown>
  const title = (p.title as string) || 'Article'
  const description = (p.excerpt as string) || ''
  const coverImage = p.coverImage as { url?: string } | null | undefined

  return generatePageMetadata({
    title,
    description,
    path: `/actualites/${slug}`,
    locale,
    imageUrl: coverImage?.url || undefined,
  })
}

const CATEGORY_LABELS: Record<string, string> = {
  competition: 'Compétition',
  stages: 'Stages',
  'vie-du-club': 'Vie du club',
  distinctions: 'Distinctions',
  partenariat: 'Partenariat',
}

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const base = locale === 'fr' ? '' : `/${locale}`

  const clubData = await getClubData()
  if (!clubData) notFound()

  const [post, recentPosts] = await Promise.all([
    getPostBySlug(clubData.clubId, slug),
    getPosts(clubData.clubId, 4),
  ])

  if (!post) notFound()

  const p = post as Record<string, unknown>
  const categoryLabel = CATEGORY_LABELS[p.category as string] ?? (p.category as string) ?? ''
  const publishedAt = p.publishedAt
    ? new Date(p.publishedAt as string).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  const otherPosts = (recentPosts as Record<string, unknown>[]).filter(r => r.id !== p.id).slice(0, 3)

  const articleUrl = `${BASE_URL}/${locale}/actualites/${slug}`
  const coverImage = p.coverImage as { url?: string } | null | undefined
  const articleSchema = generateArticleSchema(
    p.title as string,
    (p.excerpt as string) || '',
    coverImage?.url || `${BASE_URL}/icons/icon-192.png`,
    (p.publishedAt as string) || new Date().toISOString(),
    (p.updatedAt as string) || (p.publishedAt as string) || new Date().toISOString(),
    'Club de Voile',
    articleUrl,
  )
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Accueil', url: `${BASE_URL}/${locale}` },
    { name: 'Actualit\u00e9s', url: `${BASE_URL}/${locale}/actualites` },
    { name: p.title as string, url: articleUrl },
  ])

  return (
    <div>
      <JsonLd data={[articleSchema, breadcrumbSchema]} />
      <section className="page-hero" style={{ background: 'linear-gradient(135deg,#0a1628,#1a3a5c)' }}>
        <div className="container page-hero-content">
          <div className="breadcrumb">
            <Link href={base || '/'}>Accueil</Link> › <Link href={`${base}/actualites`}>Actualités</Link> › {categoryLabel}
          </div>
          <h1 style={{ maxWidth: '760px' }}>{p.title as string}</h1>
          {(publishedAt || categoryLabel) && (
            <p>{[publishedAt, categoryLabel].filter(Boolean).join(' · ')}</p>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container content-grid">
          <article className="content-main">
            {(p.excerpt as string | null) && (
              <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '32px', borderLeft: '4px solid var(--color-primary, #1d6fa4)', paddingLeft: '16px' }}>
                {p.excerpt as string}
              </p>
            )}

            {p.content ? (
              <div
                className="rich-content"
                dangerouslySetInnerHTML={{ __html: convertLexicalToHTML(p.content) }}
              />
            ) : (
              <p style={{ color: '#94a3b8' }}>Aucun contenu rédigé pour cet article.</p>
            )}

            <div style={{ marginTop: '40px' }}>
              <Link href={`${base}/actualites`} className="btn btn-outline">← Retour aux actualités</Link>
            </div>
          </article>

          <div className="content-aside">
            {otherPosts.length > 0 && (
              <div className="info-card">
                <h3>Articles récents</h3>
                <ul className="contact-list">
                  {otherPosts.map(r => (
                    <li key={r.id as string}>
                      <Link href={`${base}/actualites/${r.slug as string}`} style={{ color: 'var(--color-primary, #1d6fa4)' }}>
                        {r.title as string}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
