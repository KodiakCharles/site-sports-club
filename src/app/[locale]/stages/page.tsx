import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

const stages = [
  { id: 1, title: 'Stage Optimist — Printemps', support: 'Optimist', level: 'Initiation', audience: 'Enfants 7–12 ans', dates: '14–18 avr. 2026', spots: 10, spotsLeft: 4, price: 270, bookingUrl: '#' },
  { id: 2, title: 'Stage Dériveur Ados', support: 'Laser ILCA', level: 'Débutant', audience: 'Ados 12–17 ans', dates: '7–11 juil. 2026', spots: 8, spotsLeft: 6, price: 290, bookingUrl: '#' },
  { id: 3, title: 'Stage Catamaran Adulte', support: 'Catamaran', level: 'Initiation', audience: 'Adultes 18+', dates: '14–18 juil. 2026', spots: 6, spotsLeft: 2, price: 340, bookingUrl: '#' },
  { id: 4, title: 'Stage Laser Perfectionnement', support: 'Laser ILCA', level: 'Intermédiaire', audience: 'Ados/Adultes', dates: '21–25 juil. 2026', spots: 6, spotsLeft: 4, price: 320, bookingUrl: '#' },
  { id: 5, title: 'Stage Wing Foil Découverte', support: 'Wing Foil', level: 'Initiation', audience: 'Adultes 16+', dates: '28 juil.–1 août 2026', spots: 4, spotsLeft: 4, price: 390, bookingUrl: '#' },
  { id: 6, title: 'Stage Croisière Côtière', support: 'Voile habitable', level: 'Initiation', audience: 'Adultes 18+', dates: '4–8 août 2026', spots: 5, spotsLeft: 3, price: 450, bookingUrl: '#' },
  { id: 7, title: 'Stage Planche à voile', support: 'Windsurf', level: 'Initiation', audience: 'Dès 10 ans', dates: '11–15 août 2026', spots: 8, spotsLeft: 8, price: 280, bookingUrl: '#' },
  { id: 8, title: 'Stage Optimist Compétition', support: 'Optimist', level: 'Perfectionnement', audience: 'Enfants 9–14 ans', dates: '18–22 août 2026', spots: 8, spotsLeft: 1, price: 310, bookingUrl: '#' },
]

export default async function StagesPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('stages')
  const base = locale === 'fr' ? '' : `/${locale}`

  const filters = [
    t('filter_all'), t('filter_children'), t('filter_teens'), t('filter_adults'),
    t('filter_beginner'), t('filter_advanced'), t('filter_competition'),
  ]

  return (
    <div>
      <section className="page-hero" style={{ background: 'linear-gradient(135deg,#0a1628,#1a3a5c)' }}>
        <div className="container page-hero-content">
          <div className="breadcrumb"><Link href={base || '/'}>Accueil</Link> › {t('hero_title')}</div>
          <h1>{t('hero_title')}</h1>
          <p>{t('hero_subtitle')}</p>
        </div>
      </section>

      <section className="section-filters">
        <div className="container filters-bar">
          <span className="filter-label">{t('filter_label')}</span>
          {filters.map((f, i) => (
            <button key={f} className={`filter-btn${i === 0 ? ' active' : ''}`}>{f}</button>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="stages-list">
            {stages.map((s) => (
              <div key={s.id} className={`stage-row${s.spotsLeft <= 2 ? ' almost-full' : ''}`}>
                <div className="stage-row-info">
                  <div className="stage-row-support">{s.support}</div>
                  <h3>{s.title}</h3>
                  <div className="stage-row-meta">
                    <span>📅 {s.dates}</span>
                    <span>👤 {s.audience}</span>
                    <span>📊 {s.level}</span>
                  </div>
                </div>
                <div className="stage-row-right">
                  <div className="stage-spots">
                    <span className={`spots-badge${s.spotsLeft <= 2 ? ' urgent' : ''}`}>
                      {s.spotsLeft === 0 ? t('full') : `${s.spotsLeft} place${s.spotsLeft > 1 ? 's' : ''}`}
                    </span>
                  </div>
                  <div className="stage-price">{s.price} €</div>
                  <a href={s.bookingUrl} className={`btn btn-primary${s.spotsLeft === 0 ? ' btn-disabled' : ''}`}>
                    {s.spotsLeft === 0 ? t('full') : t('register')}
                  </a>
                </div>
              </div>
            ))}
          </div>

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
