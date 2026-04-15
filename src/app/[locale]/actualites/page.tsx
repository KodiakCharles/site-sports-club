import Link from 'next/link'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getClubData, getPosts } from '@/lib/utils/clubData'
import { generatePageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({
    title: 'Actualit\u00e9s',
    description: 'Toutes les actualit\u00e9s du club : comp\u00e9titions, stages, vie du club et distinctions.',
    path: '/actualites',
    locale,
  })
}

const CATEGORY_LABELS: Record<string, string> = {
  competition: 'Compétition',
  stages: 'Stages',
  'vie-du-club': 'Vie du club',
  distinctions: 'Distinctions',
  partenariat: 'Partenariat',
}

export default async function ActualitesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('news')
  const base = locale === 'fr' ? '' : `/${locale}`

  const clubData = await getClubData()
  const posts = clubData ? await getPosts(clubData.clubId, 12) : []

  return (
    <div>
      <section className="page-hero" style={{ background: 'linear-gradient(135deg,#0a1628,#1a3a5c)' }}>
        <div className="container page-hero-content">
          <div className="breadcrumb"><Link href={base || '/'}>Accueil</Link> › {t('hero_title')}</div>
          <h1>{t('hero_title')}</h1>
          <p>{t('hero_subtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {posts.length > 0 ? (
            <div className="blog-grid">
              {posts.map((post) => {
                const p = post as Record<string, unknown>
                const categoryKey = p.category as string
                const categoryLabel = CATEGORY_LABELS[categoryKey] ?? categoryKey ?? ''
                const publishedAt = p.publishedAt
                  ? new Date(p.publishedAt as string).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                  : ''

                return (
                  <article key={p.id as string} className="blog-card">
                    <div className="blog-img-placeholder"><span>{categoryLabel}</span></div>
                    <div className="blog-body">
                      <div className="blog-meta">
                        {categoryLabel && <span className="blog-cat">{categoryLabel}</span>}
                        {publishedAt && <span className="blog-date">{publishedAt}</span>}
                      </div>
                      <h2>{p.title as string}</h2>
                      {(p.excerpt as string | null) && <p>{p.excerpt as string}</p>}
                      <Link href={`${base}/actualites/${p.slug as string}`} className="btn btn-outline btn-sm" style={{ marginTop: '12px' }}>
                        {t('read_more')}
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
              <p style={{ fontSize: '1.1rem' }}>Aucune actualité publiée pour le moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
