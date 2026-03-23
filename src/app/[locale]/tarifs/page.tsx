import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

const licences = [
  { type: 'Enfant (- 18 ans)', price: 180, desc: 'Licence FFVoile incluse, assurance, accès aux cours collectifs' },
  { type: 'Adulte', price: 250, desc: 'Licence FFVoile incluse, assurance, accès aux cours collectifs' },
  { type: 'Famille (2 adultes + enfants)', price: 420, desc: 'Licence FFVoile pour chaque membre, tarif dégressif' },
  { type: 'Compétition', price: 320, desc: 'Accès aux entraînements compétition + prise en charge déplacements régionaux' },
  { type: 'Loisir (sans licence)', price: 90, desc: 'Accès limité aux sorties encadrées' },
]

const locations = [
  { boat: 'Optimist', halfDay: 30, fullDay: 50 },
  { boat: 'Laser ILCA 6', halfDay: 40, fullDay: 70 },
  { boat: 'Catamaran (Hobie Cat)', halfDay: 60, fullDay: 100 },
  { boat: 'Dériveur 420', halfDay: 45, fullDay: 75 },
  { boat: 'Planche à voile', halfDay: 35, fullDay: 55 },
]

const aides = [
  { label: 'Pass Sport (gouvernement)', desc: '50 € déduits sur la cotisation pour les jeunes éligibles' },
  { label: 'Coupon Sport CAF', desc: 'Accepté pour les familles allocataires' },
  { label: 'Chèque Vacances ANCV', desc: 'Accepté pour les stages et la location' },
  { label: 'Tarif solidaire', desc: 'Contactez-nous pour les situations particulières' },
]

export default async function TarifsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('prices')
  const base = locale === 'fr' ? '' : `/${locale}`

  return (
    <div>
      <section className="page-hero" style={{ background: 'linear-gradient(135deg,#0a2030,#1a4a6c)' }}>
        <div className="container page-hero-content">
          <div className="breadcrumb"><Link href={base || '/'}>Accueil</Link> › {t('hero_title')}</div>
          <h1>{t('hero_title')}</h1>
          <p>{t('hero_subtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('memberships_title')}</h2>
            <p className="section-subtitle">{t('memberships_subtitle')}</p>
          </div>
          <div className="tarifs-grid">
            {licences.map((l) => (
              <div key={l.type} className="tarif-card">
                <h3>{l.type}</h3>
                <div className="tarif-price">{l.price} <span>{t('per_year')}</span></div>
                <p>{l.desc}</p>
                <a href="#" className="btn btn-primary btn-sm" style={{ marginTop: '16px' }}>{t('register_btn')}</a>
              </div>
            ))}
          </div>
          <div className="booking-info" style={{ marginTop: '32px' }}>
            <h3>{t('helloasso_title')}</h3>
            <p>{t('helloasso_text')}</p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('rental_title')}</h2>
            <p className="section-subtitle">{t('rental_subtitle')}</p>
          </div>
          <div className="table-responsive">
            <table className="tarifs-table">
              <thead>
                <tr>
                  <th>{t('rental_boat')}</th>
                  <th>{t('rental_half')}</th>
                  <th>{t('rental_full')}</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((r) => (
                  <tr key={r.boat}>
                    <td>{r.boat}</td>
                    <td>{r.halfDay} €</td>
                    <td>{r.fullDay} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: '12px', fontSize: '.9rem', color: '#64748b' }}>{t('rental_note')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container section-header">
          <h2 className="section-title">{t('aids_title')}</h2>
          <p className="section-subtitle">{t('aids_subtitle')}</p>
          <div className="aides-list">
            {aides.map((a) => (
              <div key={a.label} className="aide-row">
                <strong>{a.label}</strong>
                <span>{a.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
