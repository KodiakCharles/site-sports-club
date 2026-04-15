import Link from 'next/link'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import JsonLd from '@/components/seo/JsonLd'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { generateEventSchema } from '@/lib/seo/structured-data'
import { getClubData } from '@/lib/utils/clubData'
import { getSportConfig, type Sport } from '@/lib/utils/sportConfig'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.club-voile.fr'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({
    title: 'Comp\u00e9tition et r\u00e9gates',
    description: 'Calendrier des r\u00e9gates, r\u00e9sultats et palmar\u00e8s. Rejoignez la fili\u00e8re comp\u00e9tition de notre club de voile.',
    path: '/competition',
    locale,
  })
}

type Stat      = { value: string; label: string }
type Race      = { name: string; date?: string; location?: string; category?: string; status?: string; norUrl?: string }
type PalmaresItem = { year: number; title: string; category?: string }
type Feature   = { icon?: string; title: string; desc?: string }

const DEFAULT_STATS: Stat[] = [
  { value: '4+',      label: 'régates organisées par an' },
  { value: '10+',     label: 'podiums en 2025' },
  { value: '3',       label: 'catégories compétitives' },
  { value: 'FFVoile', label: 'affilié & homologué' },
]

const DEFAULT_RACES: Race[] = [
  { name: 'Championnat départemental Optimist',    date: '5 avr. 2026',  location: 'Notre port',  category: 'Optimist',  status: 'upcoming', norUrl: '#' },
  { name: 'Régate de printemps — Série habitable', date: '19 avr. 2026', location: 'Notre port',  category: 'Habitable', status: 'upcoming', norUrl: '#' },
  { name: 'Championnat de ligue Laser ILCA',       date: '3 mai 2026',   location: 'Déplacement', category: 'Laser',     status: 'upcoming', norUrl: '#' },
  { name: 'Coupe du club — Catamaran',             date: '17 mai 2026',  location: 'Notre port',  category: 'Catamaran', status: 'upcoming', norUrl: '#' },
  { name: 'Grand Prix régional Optimist',          date: '14 mars 2026', location: 'Déplacement', category: 'Optimist',  status: 'past',     norUrl: '#' },
]

const DEFAULT_PALMARES: PalmaresItem[] = [
  { year: 2025, title: 'Champion régional Optimist — Thomas L.',  category: 'Optimist' },
  { year: 2025, title: 'Podium Championnat de France — Emma B.',  category: 'Laser ILCA' },
  { year: 2024, title: 'Champion départemental Catamaran',        category: 'Catamaran' },
  { year: 2024, title: 'Vainqueur coupe du club — série A',       category: 'Habitable' },
]

const DEFAULT_FEATURES: Feature[] = [
  { icon: '🎯', title: 'Entraînements ciblés',   desc: 'Séances techniques dédiées à la compétition, analyse vidéo, réglages de bateaux.' },
  { icon: '📅', title: 'Calendrier de régates',  desc: 'Organisation des déplacements sur les régates départementales, régionales et nationales.' },
  { icon: '👥', title: 'Suivi individuel',       desc: 'Un moniteur référent par skipper, objectifs personnalisés saison par saison.' },
  { icon: '🏅', title: 'Détection de talents',  desc: 'Lien direct avec la ligue régionale pour les espoirs et les pôles France.' },
]

export default async function CompetitionPageRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('competition')
  const base = locale === 'fr' ? '' : `/${locale}`

  const payload = await getPayload({ config })
  const pageData = await payload.findGlobal({ slug: 'competition-page' }).catch(() => null)
  const d = pageData as Record<string, unknown> | null

  const clubData = await getClubData()
  const sport = (clubData?.club?.sport as Sport) ?? 'voile'
  const sc = getSportConfig(sport)

  const defaultHeroTitle = sport === 'voile'
    ? t('hero_title')
    : sport === 'rugby'
      ? 'Matchs & Championnat'
      : 'Parties & Championnat'
  const defaultHeroSubtitle = sport === 'voile'
    ? t('hero_subtitle')
    : `Calendrier, résultats et palmarès — ${sc.vocabulary.competitionPlural} du club`
  const defaultCalendarTitle = sport === 'voile'
    ? t('calendar_title')
    : sport === 'rugby'
      ? 'Calendrier des matchs 2026'
      : 'Calendrier des parties 2026'

  const heroTitle    = (d?.heroTitle    as string) || defaultHeroTitle
  const heroSubtitle = (d?.heroSubtitle as string) || defaultHeroSubtitle

  const stats:    Stat[]         = (d?.stats            as Stat[]          | undefined)?.length ? (d!.stats            as Stat[])          : DEFAULT_STATS
  const races:    Race[]         = (d?.races            as Race[]          | undefined)?.length ? (d!.races            as Race[])          : DEFAULT_RACES
  const palmares: PalmaresItem[] = (d?.palmares         as PalmaresItem[]  | undefined)?.length ? (d!.palmares         as PalmaresItem[])  : DEFAULT_PALMARES
  const features: Feature[]      = (d?.trainingFeatures as Feature[]       | undefined)?.length ? (d!.trainingFeatures as Feature[])       : DEFAULT_FEATURES
  const joinTitle    = (d?.joinTitle    as string) || 'Rejoindre la filière compétition'
  const joinSubtitle = (d?.joinSubtitle as string) || 'Vous voulez vous dépasser et mesurer votre niveau ? Notre encadrement compétition vous accompagne de la première régate au niveau national.'

  const upcomingRaces = races.filter((r) => r.status === 'upcoming')
  const eventSchemas = upcomingRaces.map((r) =>
    generateEventSchema(
      r.name,
      r.date || '',
      r.date || '',
      r.location || '',
      `${BASE_URL}/${locale}/competition`,
    ),
  )

  return (
    <div>
      {eventSchemas.length > 0 && <JsonLd data={eventSchemas} />}
      <section className="page-hero" style={{ background: 'linear-gradient(135deg,#071020,#0d2040,#1a5080)' }}>
        <div className="container page-hero-content">
          <div className="breadcrumb"><Link href={base || '/'}>Accueil</Link> › {heroTitle}</div>
          <h1>{heroTitle}</h1>
          <p>{heroSubtitle}</p>
        </div>
      </section>

      <div className="stats-bar">
        <div className="container stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat-item">
              <span className="stat-num">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{defaultCalendarTitle}</h2>
            <p className="section-subtitle">
              {t('calendar_subtitle')}{' '}
              <a href="https://regates.ffvoile.fr" target="_blank" rel="noopener" className="link-ffv">regates.ffvoile.fr ↗</a>
            </p>
          </div>
          <div className="races-list">
            {races.map((r, i) => (
              <div key={i} className={`race-row race-${r.status ?? 'upcoming'}`}>
                <div className="race-date">{r.date}</div>
                <div className="race-info">
                  <h3>{r.name}</h3>
                  <div className="race-meta">
                    {r.location && <span>📍 {r.location}</span>}
                    {r.category && <span>⛵ {r.category}</span>}
                  </div>
                </div>
                <div className="race-actions">
                  {r.status === 'upcoming' && r.norUrl && (
                    <a href={r.norUrl} className="btn btn-outline btn-sm">{t('nor_btn')}</a>
                  )}
                  {r.status === 'past' && (
                    <span className="race-done-badge">{t('done_badge')}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('palmares_title')}</h2>
            <p className="section-subtitle">Nos sportifs à l&apos;honneur — résultats officiels FFVoile</p>
          </div>
          <div className="palmares-list">
            {palmares.map((p, i) => (
              <div key={i} className="palmares-row">
                <span className="palmares-year">{p.year}</span>
                <span className="palmares-cat">{p.category}</span>
                <span className="palmares-title">🏆 {p.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{joinTitle}</h2>
            <p className="section-subtitle">{joinSubtitle}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', maxWidth: '960px', margin: '0 auto 40px' }}>
            {features.map((item) => (
              <div key={item.title} className="info-card">
                {item.icon && <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{item.icon}</div>}
                <h3 style={{ color: 'var(--color-navy)', fontWeight: 700, marginBottom: '8px', fontSize: '1rem' }}>{item.title}</h3>
                {item.desc && <p style={{ fontSize: '.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{item.desc}</p>}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`${base}/contact`} className="btn btn-primary btn-lg">
              Rejoindre la filière
            </Link>
            <Link href={`${base}/tarifs`} className="btn btn-outline btn-lg">
              Voir les tarifs
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
