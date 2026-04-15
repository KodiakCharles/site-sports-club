import Link from 'next/link'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getClubData, getStages } from '@/lib/utils/clubData'
import { getSportConfig, type Sport } from '@/lib/utils/sportConfig'
import JsonLd from '@/components/seo/JsonLd'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { generateCourseSchema } from '@/lib/seo/structured-data'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.club-voile.fr'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({
    title: 'Stages de voile',
    description: 'D\u00e9couvrez nos stages de voile pour tous niveaux : initiation, perfectionnement et comp\u00e9tition. Moniteurs dipl\u00f4m\u00e9s d\'\u00c9tat.',
    path: '/stages',
    locale,
  })
}

function supportLabelFor(sport: Sport, supportValue: string): string {
  const match = getSportConfig(sport).supports.find(s => s.value === supportValue)
  return match?.label ?? supportValue
}

const LEVEL_LABELS: Record<string, string> = {
  initiation: 'Initiation',
  debutant: 'Débutant',
  intermediaire: 'Intermédiaire',
  perfectionnement: 'Perfectionnement',
  competition: 'Compétition',
}

function formatDateRange(startDate?: string, endDate?: string): string {
  if (!startDate) return ''
  const start = new Date(startDate)
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
  if (!endDate) return start.toLocaleDateString('fr-FR', opts)
  const end = new Date(endDate)
  return `${start.toLocaleDateString('fr-FR', opts)} – ${end.toLocaleDateString('fr-FR', { ...opts, year: 'numeric' })}`
}

export default async function StagesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('stages')
  const base = locale === 'fr' ? '' : `/${locale}`

  const clubData = await getClubData()
  const stages = clubData ? await getStages(clubData.clubId, 30) : []
  const sport = (clubData?.club?.sport as Sport) ?? 'voile'
  const sc = getSportConfig(sport)
  const heroTitle = sport === 'voile' ? t('hero_title') : sport === 'rugby' ? 'Nos entraînements' : 'Nos parties'
  const heroSubtitle = sport === 'voile'
    ? t('hero_subtitle')
    : `Consultez le planning ${sc.vocabulary.sessionPlural} du club`

  const courseSchemas = stages.map((stage) => {
    const st = stage as Record<string, unknown>
    return generateCourseSchema(
      (st.title as string) || '',
      '',
      (st.price as number) ?? 0,
      'EUR',
      (st.startDate as string) || '',
      (st.endDate as string) || '',
      'Club de Voile',
      `${BASE_URL}/${locale}/stages`,
    )
  })

  return (
    <div>
      {courseSchemas.length > 0 && <JsonLd data={courseSchemas} />}
      <section className="page-hero" style={{ background: 'linear-gradient(135deg,#0a1628,#1a3a5c)' }}>
        <div className="container page-hero-content">
          <div className="breadcrumb"><Link href={base || '/'}>Accueil</Link> › {heroTitle}</div>
          <h1>{heroTitle}</h1>
          <p>{heroSubtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {stages.length > 0 ? (
            <div className="stages-list">
              {stages.map((stage) => {
                const s = stage as Record<string, unknown>
                const spotsLeft = s.spotsLeft as number | undefined
                const almostFull = spotsLeft !== undefined && spotsLeft <= 2
                const dateRange = formatDateRange(s.startDate as string, s.endDate as string)

                return (
                  <div key={s.id as string} className={`stage-row${almostFull ? ' almost-full' : ''}`}>
                    <div className="stage-row-info">
                      <div className="stage-row-support">{supportLabelFor(sport, s.support as string)}</div>
                      <h3>{s.title as string}</h3>
                      <div className="stage-row-meta">
                        {dateRange && <span>📅 {dateRange}</span>}
                        {(s.audience as string | null) && <span>👤 {s.audience as string}</span>}
                        {(s.level as string | null) && <span>📊 {LEVEL_LABELS[s.level as string] ?? s.level as string}</span>}
                      </div>
                    </div>
                    <div className="stage-row-right">
                      <div className="stage-spots">
                        <span className={`spots-badge${almostFull ? ' urgent' : ''}`}>
                          {spotsLeft === 0
                            ? t('full')
                            : spotsLeft !== undefined
                              ? `${spotsLeft} place${spotsLeft > 1 ? 's' : ''}`
                              : '—'}
                        </span>
                      </div>
                      <div className="stage-price">{s.price !== undefined ? `${s.price as number} €` : '—'}</div>
                      {s.bookingUrl ? (
                        <a
                          href={s.bookingUrl as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`btn btn-primary${spotsLeft === 0 ? ' btn-disabled' : ''}`}
                        >
                          {spotsLeft === 0 ? t('full') : t('register')}
                        </a>
                      ) : (
                        <Link href={`${base}/contact`} className="btn btn-outline">
                          {t('register')}
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Aucun stage à venir pour le moment.</p>
              <Link href={`${base}/contact`} className="btn btn-primary">Nous contacter</Link>
            </div>
          )}

          <div className="booking-info">
            <h3>💳 {t('booking_title')}</h3>
            <p>{t('booking_text')}</p>
            <p style={{ marginTop: '8px', fontSize: '.9rem', color: '#64748b' }}>{t('booking_alt')}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
