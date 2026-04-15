import Link from 'next/link'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getClubData, getUpcomingStages } from '@/lib/utils/clubData'
import SocialWall from '@/components/sections/SocialWall'
import JsonLd from '@/components/seo/JsonLd'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo/structured-data'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.club-voile.fr'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const clubData = await getClubData()
  const s = clubData?.settings as Record<string, unknown> ?? {}
  const c = clubData?.club as Record<string, unknown> ?? {}
  const clubName = (s.clubName as string) ?? (c.name as string) ?? 'Club de Voile'

  return generatePageMetadata({
    title: `${clubName} — Voile, stages et comp\u00e9tition`,
    description: (s.tagline as string) ?? 'Club de voile affili\u00e9 FFVoile. Stages, cours, comp\u00e9tition et location de bateaux pour tous les niveaux.',
    path: '',
    locale,
    clubName,
  })
}

const SUPPORT_ICONS: Record<string, string> = {
  optimist: '⛵',
  laser: '🚤',
  catamaran: '🌊',
  windsurf: '🏄',
  foil: '✈️',
  croisiere: '⚓',
  kayak: '🛶',
  autre: '⚓',
}

const LEVEL_LABELS: Record<string, string> = {
  initiation: 'Initiation',
  debutant: 'Débutant',
  intermediaire: 'Intermédiaire',
  perfectionnement: 'Perfectionnement',
  competition: 'Compétition',
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('home')
  const tn = await getTranslations('nav')
  const base = locale === 'fr' ? '' : `/${locale}`

  const clubData = await getClubData()
  const upcomingStages = clubData ? await getUpcomingStages(clubData.clubId, 3) : []

  const s = clubData?.settings as Record<string, unknown> ?? {}
  const c = clubData?.club as Record<string, unknown> ?? {}

  // Textes configurables depuis le CMS, avec fallback
  const heroTitle = (s.heroTitle as string) ?? t('title_1')
  const heroSubtitle = (s.tagline as string) ?? t('tagline')
  const clubName = (s.clubName as string) ?? (c.name as string) ?? 'Club de Voile'
  const founded = s.founded as number | undefined
  const membersCount = s.membersCount as number | undefined
  const boatsCount = s.boatsCount as number | undefined

  const homePage = clubData?.homePage as Record<string, unknown> ?? {}

  const joinBadge    = (homePage.joinBadge    as string)    ?? '⚓ Rejoignez-nous'
  const joinTitle    = (homePage.joinTitle    as string)    ?? 'Prenez le large avec'
  const joinSubtitle = (homePage.joinSubtitle as string)    ?? 'Du premier bord à la régate, nous accompagnons tous les navigateurs. Licences, stages, location de bateaux — tout est ici.'
  const joinPerks    = (homePage.joinPerks    as { label: string }[] | undefined) ?? [
    { label: 'École Française de Voile' },
    { label: 'Moniteurs diplômés' },
    { label: 'Flotte entretenue' },
    { label: 'Dès 7 ans' },
  ]
  const joinCtaTitle = (homePage.joinCtaTitle as string) ?? 'Essai gratuit'
  const joinCtaText  = (homePage.joinCtaText  as string) ?? 'Venez découvrir la voile lors d\'une séance découverte offerte pour les nouveaux adhérents.'
  const joinCtaBtn   = (homePage.joinCtaBtn   as string) ?? 'Réserver ma séance'

  const activities = [
    { key: 'Optimist', icon: '⛵', sub: 'Initiation dès 7 ans' },
    { key: 'Dériveur', icon: '🚤', sub: 'Laser, 420, RS Feva' },
    { key: 'Catamaran', icon: '🌊', sub: 'Vitesse & sensations' },
    { key: 'Planche à voile', icon: '🏄', sub: 'Windsurf & Wing foil' },
    { key: 'Foil', icon: '✈️', sub: 'La glisse ultime' },
    { key: 'Croisière', icon: '⚓', sub: 'Voile habitable' },
  ]

  const orgSchema = generateOrganizationSchema(
    clubName,
    BASE_URL,
    `${BASE_URL}/icons/icon-192.png`,
    '',
    '',
    '',
  )
  const siteSchema = generateWebSiteSchema(clubName, BASE_URL)

  return (
    <div>
      <JsonLd data={[orgSchema, siteSchema]} />
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content container">
          <div className="hero-badge">⚓ {t('badge')}</div>
          <h1 className="hero-title">
            {heroTitle}<br />
            <span>{clubName}</span>
          </h1>
          <p className="hero-tagline">{heroSubtitle}</p>
          <div className="hero-actions">
            <Link href={`${base}/stages`} className="btn btn-primary btn-lg">{t('cta_stages')}</Link>
            <Link href={`${base}/le-club`} className="btn btn-outline btn-lg">{t('cta_discover')}</Link>
          </div>
        </div>
      </section>

      <section className="stats-bar">
        <div className="container stats-grid">
          {([
            [membersCount ? String(membersCount) : '—', 'licenciés'],
            [founded ? String(founded) : '—', 'année de création'],
            [boatsCount ? String(boatsCount) : '—', 'bateaux'],
          ] as [string, string][]).map(([n, l]) => (
            <div key={l} className="stat-item">
              <span className="stat-num">{n}</span>
              <span className="stat-label">{l}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('activities_title')}</h2>
            <p className="section-subtitle">{t('activities_subtitle')}</p>
          </div>
          <div className="activities-grid">
            {activities.map((a) => (
              <div key={a.key} className="activity-card">
                <div className="activity-icon">{a.icon}</div>
                <h3>{a.key}</h3>
                <p>{a.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('stages_title')}</h2>
            <p className="section-subtitle">{t('stages_subtitle')}</p>
          </div>
          {upcomingStages.length > 0 ? (
            <div className="stages-grid">
              {upcomingStages.map((stage) => {
                const st = stage as Record<string, unknown>
                const startDate = st.startDate ? new Date(st.startDate as string).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''
                const endDate = st.endDate ? new Date(st.endDate as string).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
                const dateRange = startDate && endDate ? `${startDate} – ${endDate}` : startDate
                return (
                  <div key={st.id as string} className="stage-card">
                    <div className="stage-level">{LEVEL_LABELS[st.level as string] ?? st.level as string}</div>
                    <h3>{st.title as string}</h3>
                    <div className="stage-meta">
                      {dateRange && <span>📅 {dateRange}</span>}
                      {st.spotsLeft !== undefined && <span>👤 {st.spotsLeft as number} places</span>}
                      {st.price !== undefined && <span>💶 {st.price as number} €</span>}
                    </div>
                    <Link href={`${base}/stages`} className="btn btn-primary" style={{ marginTop: '16px', width: '100%', textAlign: 'center' }}>
                      {tn('register')}
                    </Link>
                  </div>
                )
              })}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#94a3b8' }}>Aucun stage à venir pour le moment.</p>
          )}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link href={`${base}/stages`} className="btn btn-outline">{t('cta_stages')}</Link>
          </div>
        </div>
      </section>

      {/* Section Rejoindre le club — remplace le widget météo déplacé dans le footer */}
      <section className="join-section">
        <div className="container">
          <div className="join-section-inner">
            <div className="join-text">
              <div className="join-badge">{joinBadge}</div>
              <h2 className="join-title">
                {joinTitle}<br />
                <span>{clubName}</span>
              </h2>
              <p className="join-subtitle">{joinSubtitle}</p>
              <div className="join-perks">
                {joinPerks.map((p) => (
                  <div key={p.label} className="join-perk">
                    <span className="join-perk-icon">✅</span>
                    <span>{p.label}</span>
                  </div>
                ))}
              </div>
              <div className="join-actions">
                <Link href={`${base}/tarifs`} className="btn btn-primary btn-lg">
                  Voir les tarifs &amp; adhésion
                </Link>
                <Link href={`${base}/contact`} className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,.4)', color: '#fff' }}>
                  Nous contacter
                </Link>
              </div>
            </div>
            <div className="join-cta-card">
              <div className="join-cta-icon">⛵</div>
              <h3>{joinCtaTitle}</h3>
              <p>{joinCtaText}</p>
              <Link href={`${base}/contact`} className="btn btn-primary">
                {joinCtaBtn}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container section-header">
          <h2 className="section-title">{t('map_title')}</h2>
          <p className="section-subtitle">{t('map_subtitle')}</p>
          <div className="maps-placeholder">
            <p>🗺️ {t('map_placeholder')}</p>
          </div>
          <Link href={`${base}/nous-trouver`} className="btn btn-primary" style={{ marginTop: '24px' }}>
            {t('map_cta')}
          </Link>
        </div>
      </section>

      <SocialWall
        instagramUrl={s.instagramUrl as string | undefined}
        facebookUrl={s.facebookUrl as string | undefined}
        twitterUrl={s.twitterUrl as string | undefined}
        twitterHandle={s.twitterHandle as string | undefined}
        hasInstagram={!!(s.instagramToken || (c as Record<string, unknown>).instagramToken)}
        hasFacebook={!!(s.facebookPageId && s.facebookAccessToken)}
        hasTwitter={!!(s.twitterHandle && s.twitterBearerToken)}
      />
    </div>
  )
}
