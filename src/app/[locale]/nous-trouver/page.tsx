import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function NousTrouverPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('find_us')
  const base = locale === 'fr' ? '' : `/${locale}`

  const access = [
    { icon: '🚗', label: t('access_car'), desc: t('access_car_desc') },
    { icon: '🚌', label: t('access_bus'), desc: t('access_bus_desc') },
    { icon: '🚴', label: t('access_bike'), desc: t('access_bike_desc') },
    { icon: '⛵', label: t('access_sea'), desc: t('access_sea_desc') },
  ]

  return (
    <div>
      <section className="page-hero" style={{ background: 'linear-gradient(135deg,#0a1628,#1d6fa4)' }}>
        <div className="container page-hero-content">
          <div className="breadcrumb"><Link href={base || '/'}>Accueil</Link> › {t('hero_title')}</div>
          <h1>{t('hero_title')}</h1>
          <p>{t('hero_subtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="map-placeholder" style={{ height: '420px', borderRadius: '12px', marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div style={{ fontSize: '3rem' }}>🗺️</div>
            <strong style={{ color: '#94a3b8' }}>{t('map_placeholder')}</strong>
            <p style={{ color: '#64748b', fontSize: '.9rem', textAlign: 'center', maxWidth: '400px' }}>{t('map_config')}</p>
            <a href="https://www.google.com/maps" target="_blank" rel="noopener" className="btn btn-outline btn-sm">{t('open_maps')}</a>
          </div>

          <div className="content-grid">
            <div className="content-main">
              <h2>{t('address_title')}</h2>
              <address style={{ fontStyle: 'normal', lineHeight: 1.8 }}>
                <strong>Club de Voile</strong><br />
                Port de plaisance, quai des voiliers<br />
                00000 Votre-Ville<br /><br />
                <a href="tel:+33600000000">06 00 00 00 00</a><br />
                <a href="mailto:contact@votreclub.fr">contact@votreclub.fr</a>
              </address>
              <h2 style={{ marginTop: '32px' }}>{t('access_title')}</h2>
              <div className="acces-list">
                {access.map((a) => (
                  <div key={a.label} className="acces-row">
                    <span className="acces-icon">{a.icon}</span>
                    <div><strong>{a.label}</strong><p>{a.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="content-aside">
              <div className="info-card">
                <h3>{t('hours_title')}</h3>
                <ul className="contact-list">
                  <li><strong>Lun – Ven</strong> : 9h – 18h</li>
                  <li><strong>Samedi</strong> : 9h – 13h</li>
                  <li><strong>Dimanche</strong> : Fermé sauf régate</li>
                </ul>
              </div>
              <div className="info-card" style={{ marginTop: '20px' }}>
                <h3>{t('gps_title')}</h3>
                <p style={{ fontFamily: 'monospace', fontSize: '.9rem' }}>48.000000° N<br />-2.000000° W</p>
                <a href="https://www.google.com/maps" target="_blank" rel="noopener" className="btn btn-outline btn-sm" style={{ marginTop: '12px' }}>{t('directions')}</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
