import Link from 'next/link'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getClubData } from '@/lib/utils/clubData'
import { generatePageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({
    title: 'Tarifs et adh\u00e9sion',
    description: 'Tarifs des cotisations, location de bateaux et aides financi\u00e8res. Adh\u00e9rez en ligne via HelloAsso.',
    path: '/tarifs',
    locale,
  })
}

export default async function TarifsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('prices')
  const base = locale === 'fr' ? '' : `/${locale}`

  const payload = await getPayload({ config })
  const [tarifsData, clubData] = await Promise.all([
    payload.findGlobal({ slug: 'tarifs-page' }).catch(() => null),
    getClubData(),
  ])

  const memberships = (tarifsData?.memberships as { type: string; price: number; description: string }[] | undefined) ?? []
  const boatRentals = (tarifsData?.boatRentals as { boat: string; halfDay: number; fullDay: number }[] | undefined) ?? []
  const financialAids = (tarifsData?.financialAids as { label: string; description: string }[] | undefined) ?? []
  const rentalNote = (tarifsData?.rentalNote as string | undefined) ?? ''
  const showBoatRental = !!(clubData?.club as Record<string, unknown> | undefined)?.moduleBoatRental

  return (
    <div>
      <section className="page-hero" style={{ background: 'linear-gradient(135deg,#0a2030,#1a4a6c)' }}>
        <div className="container page-hero-content">
          <div className="breadcrumb"><Link href={base || '/'}>Accueil</Link> › {t('hero_title')}</div>
          <h1>{(tarifsData?.heroTitle as string) || t('hero_title')}</h1>
          <p>{(tarifsData?.heroSubtitle as string) || t('hero_subtitle')}</p>
        </div>
      </section>

      {/* Cotisations */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('memberships_title')}</h2>
            <p className="section-subtitle">{t('memberships_subtitle')}</p>
          </div>
          <div className="tarifs-grid">
            {memberships.map((l) => (
              <div key={l.type} className="tarif-card">
                <h3>{l.type}</h3>
                <div className="tarif-price">{l.price} <span>{t('per_year')}</span></div>
                <p>{l.description}</p>
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

      {/* Location de bateaux — conditionné au module */}
      {showBoatRental && boatRentals.length > 0 && (
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
                  {boatRentals.map((r) => (
                    <tr key={r.boat}>
                      <td>{r.boat}</td>
                      <td>{r.halfDay} €</td>
                      <td>{r.fullDay} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rentalNote && <p style={{ marginTop: '12px', fontSize: '.9rem', color: '#64748b' }}>{rentalNote}</p>}
          </div>
        </section>
      )}

      {/* Aides financières */}
      {financialAids.length > 0 && (
        <section className="section">
          <div className="container section-header">
            <h2 className="section-title">{t('aids_title')}</h2>
            <p className="section-subtitle">{t('aids_subtitle')}</p>
            <div className="aides-list">
              {financialAids.map((a) => (
                <div key={a.label} className="aide-row">
                  <strong>{a.label}</strong>
                  <span>{a.description}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
