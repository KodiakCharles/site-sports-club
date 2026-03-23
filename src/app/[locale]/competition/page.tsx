import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

const regates = [
  { id: 1, name: 'Championnat départemental Optimist', date: '5 avr. 2026', location: 'Notre port', category: 'Optimist', status: 'upcoming', norUrl: '#' },
  { id: 2, name: 'Régate de printemps — Série habitable', date: '19 avr. 2026', location: 'Notre port', category: 'Habitable', status: 'upcoming', norUrl: '#' },
  { id: 3, name: 'Championnat de ligue Laser ILCA', date: '3 mai 2026', location: 'Déplacement', category: 'Laser', status: 'upcoming', norUrl: '#' },
  { id: 4, name: 'Coupe du club — Catamaran', date: '17 mai 2026', location: 'Notre port', category: 'Catamaran', status: 'upcoming', norUrl: '#' },
  { id: 5, name: 'Grand Prix régional Optimist', date: '14 mars 2026', location: 'Déplacement', category: 'Optimist', status: 'past', norUrl: '#' },
]

const palmares = [
  { year: 2025, title: 'Champion régional Optimist — Thomas L.', category: 'Optimist' },
  { year: 2025, title: 'Podium Championnat de France — Emma B.', category: 'Laser ILCA' },
  { year: 2024, title: 'Champion départemental Catamaran', category: 'Catamaran' },
  { year: 2024, title: 'Vainqueur coupe du club — série A', category: 'Habitable' },
]

export default async function CompetitionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('competition')
  const base = locale === 'fr' ? '' : `/${locale}`

  return (
    <div>
      <section className="page-hero" style={{ background: 'linear-gradient(135deg,#0d1f3c,#1d6fa4)' }}>
        <div className="container page-hero-content">
          <div className="breadcrumb"><Link href={base || '/'}>Accueil</Link> › {t('hero_title')}</div>
          <h1>{t('hero_title')}</h1>
          <p>{t('hero_subtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('calendar_title')}</h2>
            <p className="section-subtitle">
              {t('calendar_subtitle')}{' '}
              <a href="https://regates.ffvoile.fr" target="_blank" rel="noopener" className="link-ffv">regates.ffvoile.fr ↗</a>
            </p>
          </div>
          <div className="races-list">
            {regates.map((r) => (
              <div key={r.id} className={`race-row race-${r.status}`}>
                <div className="race-date">{r.date}</div>
                <div className="race-info">
                  <h3>{r.name}</h3>
                  <div className="race-meta">
                    <span>📍 {r.location}</span>
                    <span>⛵ {r.category}</span>
                  </div>
                </div>
                <div className="race-actions">
                  {r.status === 'upcoming' && (
                    <a href={r.norUrl} className="btn btn-outline btn-sm">{t('nor_btn')}</a>
                  )}
                  {r.status === 'past' && (
                    <span className="race-done-badge">{t('done_badge')}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="ffvoile-banner">
            <span>⚓</span>
            <div>
              <strong>{t('ffvoile_title')}</strong>
              <p>{t('ffvoile_text')}</p>
            </div>
            <a href="https://regates.ffvoile.fr" target="_blank" rel="noopener" className="btn btn-primary btn-sm">{t('ffvoile_btn')}</a>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('palmares_title')}</h2>
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
    </div>
  )
}
