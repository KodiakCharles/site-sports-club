import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('home')
  const tn = await getTranslations('nav')
  const base = locale === 'fr' ? '' : `/${locale}`

  const activities = [
    { key: 'Optimist', icon: '⛵', sub: 'Initiation dès 7 ans' },
    { key: 'Dériveur', icon: '🚤', sub: 'Laser, 420, RS Feva' },
    { key: 'Catamaran', icon: '🌊', sub: 'Vitesse & sensations' },
    { key: 'Planche à voile', icon: '🏄', sub: 'Windsurf & Wing foil' },
    { key: 'Foil', icon: '✈️', sub: 'La glisse ultime' },
    { key: 'Croisière', icon: '⚓', sub: 'Voile habitable' },
  ]

  const stageItems = [
    { title: 'Stage Optimist — Été', level: 'Initiation', date: '7–11 juil. 2026', spots: 8, price: 290 },
    { title: 'Stage Catamaran Adulte', level: 'Débutant', date: '14–18 juil. 2026', spots: 6, price: 340 },
    { title: 'Stage Laser Perfectionnement', level: 'Intermédiaire', date: '21–25 juil. 2026', spots: 4, price: 320 },
  ]

  return (
    <div>
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content container">
          <div className="hero-badge">⚓ {t('badge')}</div>
          <h1 className="hero-title">
            {t('title_1')}<br />
            <span>{t('title_2')}</span>
          </h1>
          <p className="hero-tagline">
            {t('tagline').split('\n').map((line: string, i: number) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </p>
          <div className="hero-actions">
            <Link href={`${base}/stages`} className="btn btn-primary btn-lg">{t('cta_stages')}</Link>
            <Link href={`${base}/le-club`} className="btn btn-outline btn-lg">{t('cta_discover')}</Link>
          </div>
        </div>
      </section>

      <section className="stats-bar">
        <div className="container stats-grid">
          {([['1 080', t('stats_clubs')],['+20 ans', t('stats_years')],['8', t('stats_supports')],['FR · EN · ES', t('stats_langs')]] as [string,string][]).map(([n,l]) => (
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
          <div className="stages-grid">
            {stageItems.map((s) => (
              <div key={s.title} className="stage-card">
                <div className="stage-level">{s.level}</div>
                <h3>{s.title}</h3>
                <div className="stage-meta">
                  <span>📅 {s.date}</span>
                  <span>👤 {s.spots} places</span>
                  <span>💶 {s.price} €</span>
                </div>
                <Link href={`${base}/stages`} className="btn btn-primary" style={{ marginTop: '16px', width: '100%', textAlign: 'center' }}>
                  {tn('register')}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('meteo_title')}</h2>
            <p className="section-subtitle">{t('meteo_subtitle')}</p>
          </div>
          <div className="meteo-placeholder">
            <p>🌬️ {t('meteo_placeholder')}</p>
            <p style={{ fontSize: '.85rem', color: '#94a3b8', marginTop: '8px' }}>{t('meteo_station')}</p>
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
          <Link href={`${base}/contact`} className="btn btn-primary" style={{ marginTop: '24px' }}>
            {t('map_cta')}
          </Link>
        </div>
      </section>
    </div>
  )
}
