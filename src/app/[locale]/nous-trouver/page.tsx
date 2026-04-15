import Link from 'next/link'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import JsonLd from '@/components/seo/JsonLd'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { generateLocalBusinessSchema } from '@/lib/seo/structured-data'
import GoogleMap from '@/components/sections/GoogleMap'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.club-voile.fr'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({
    title: 'Nous trouver',
    description: 'Acc\u00e8s, localisation et m\u00e9t\u00e9o marine. Retrouvez notre club de voile sur la carte et planifiez votre visite.',
    path: '/nous-trouver',
    locale,
  })
}

type AccessMode = { icon?: string; label: string; desc?: string }

const FORECAST = [
  { day: 'Lun', date: '31/03', wind: 12, gust: 18, dir: 'NW', wave: 0.4, rain: 0, temp: 17 },
  { day: 'Mar', date: '01/04', wind: 18, gust: 26, dir: 'W',  wave: 0.7, rain: 2, temp: 15 },
  { day: 'Mer', date: '02/04', wind: 22, gust: 31, dir: 'WSW',wave: 1.1, rain: 8, temp: 14 },
  { day: 'Jeu', date: '03/04', wind: 10, gust: 14, dir: 'SW', wave: 0.5, rain: 1, temp: 16 },
  { day: 'Ven', date: '04/04', wind: 8,  gust: 12, dir: 'S',  wave: 0.3, rain: 0, temp: 18 },
  { day: 'Sam', date: '05/04', wind: 15, gust: 20, dir: 'NW', wave: 0.6, rain: 0, temp: 17 },
  { day: 'Dim', date: '06/04', wind: 20, gust: 28, dir: 'N',  wave: 0.9, rain: 3, temp: 14 },
]

function windColor(knots: number) {
  if (knots < 10) return '#4ade80'
  if (knots < 16) return '#facc15'
  if (knots < 22) return '#fb923c'
  return '#f87171'
}

function windLabel(knots: number) {
  if (knots < 10) return 'Faible'
  if (knots < 16) return 'Modéré'
  if (knots < 22) return 'Frais'
  return 'Fort'
}

const DEFAULT_ACCESS: AccessMode[] = [
  { icon: '🚗', label: 'En voiture', desc: 'Parking gratuit sur place. GPS : 43.2951° N, -0.3703° W' },
  { icon: '🚌', label: 'En bus',     desc: 'Ligne 7 direction Lac — arrêt "Promenade du Lac"' },
  { icon: '🚴', label: 'À vélo',     desc: 'Piste cyclable depuis le centre-ville. Parking vélos sécurisé.' },
  { icon: '⛵', label: 'Par la mer', desc: 'Accès direct depuis le plan d\'eau. Bouées visiteurs disponibles.' },
]

const DEFAULT_MAP_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2876.123456789!2d-0.3703!3d43.2951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDE3JzQyLjQiTiAwwrAyMicoOS4yIlc!5e0!3m2!1sfr!2sfr!4v1234567890"
const DEFAULT_DIRECTIONS_URL = "https://maps.google.com/?q=Pau+lac"

export default async function NousTrouverPageRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('find_us')
  const base = locale === 'fr' ? '' : `/${locale}`

  const payload = await getPayload({ config })
  const pageData = await payload.findGlobal({ slug: 'nous-trouver-page' }).catch(() => null)
  const d = pageData as Record<string, unknown> | null

  const settings = await payload.findGlobal({ slug: 'club-settings' }).catch(() => null)
  const s = settings as Record<string, unknown> | null

  const heroTitle     = (d?.heroTitle       as string) || t('hero_title')
  const heroSubtitle  = (d?.heroSubtitle    as string) || t('hero_subtitle')
  const mapEmbedUrl   = (d?.mapEmbedUrl     as string) || DEFAULT_MAP_URL
  const directionsUrl = (d?.directionsUrl   as string) || DEFAULT_DIRECTIONS_URL
  const spotName      = (d?.weatherSpotName as string) || 'Lac de Pau'

  const accessModes: AccessMode[] = (d?.accessModes as AccessMode[] | undefined)?.length
    ? (d!.accessModes as AccessMode[])
    : DEFAULT_ACCESS

  const address   = (s?.address   as string) || '1 Promenade du Lac, 64000 Pau'
  const monday    = (s?.mondayFriday as string) || '9h – 18h'
  const saturday  = (s?.saturday  as string) || '9h – 13h'
  const sunday    = (s?.sunday    as string) || 'Fermé sauf régate'

  const clubName = (s?.clubName as string) || 'Club de Voile'
  const lat = (d?.latitude as number) || 43.2951
  const lng = (d?.longitude as number) || -0.3703
  const localBusinessSchema = generateLocalBusinessSchema(
    clubName,
    address,
    (s?.phone as string) || '',
    (s?.email as string) || '',
    lat,
    lng,
    `${BASE_URL}/${locale}/nous-trouver`,
  )

  return (
    <div>
      <JsonLd data={localBusinessSchema} />
      <section className="page-hero" style={{ background: 'linear-gradient(135deg,#0a1628,#1d6fa4)' }}>
        <div className="container page-hero-content">
          <div className="breadcrumb"><Link href={base || '/'}>Accueil</Link> › {heroTitle}</div>
          <h1>{heroTitle}</h1>
          <p>{heroSubtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="map-weather-grid">

            {/* Colonne gauche — Carte */}
            <div className="map-col">
              <h2 className="col-title">📍 Localisation</h2>
              <GoogleMap
                embedUrl={mapEmbedUrl}
                directionsUrl={directionsUrl}
                clubName={clubName}
                address={address}
                lat={lat}
                lng={lng}
              />

              <div className="acces-list" style={{ marginTop: '24px' }}>
                {accessModes.map((a) => (
                  <div key={a.label} className="acces-row">
                    <span className="acces-icon">{a.icon ?? '📍'}</span>
                    <div><strong>{a.label}</strong>{a.desc && <p>{a.desc}</p>}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne droite — Windguru */}
            <div className="weather-col">
              <h2 className="col-title">🌬️ Prévisions météo — {spotName}</h2>
              <div className="windguru-widget">
                <div className="wg-header">
                  <span className="wg-source">Source : Windguru (démo)</span>
                  <span className="wg-updated">Mis à jour à 06h00</span>
                </div>

                <div className="wg-forecast">
                  {FORECAST.map((f) => (
                    <div key={f.day} className="wg-day">
                      <div className="wg-day-label">
                        <span className="wg-day-name">{f.day}</span>
                        <span className="wg-day-date">{f.date}</span>
                      </div>
                      <div className="wg-wind" style={{ color: windColor(f.wind) }}>
                        <span className="wg-wind-speed">{f.wind}</span>
                        <span className="wg-wind-unit">kt</span>
                        <div className="wg-wind-badge" style={{ background: windColor(f.wind) }}>{windLabel(f.wind)}</div>
                      </div>
                      <div className="wg-gust">↑ {f.gust} kt</div>
                      <div className="wg-dir">{f.dir}</div>
                      <div className="wg-wave">🌊 {f.wave}m</div>
                      <div className="wg-rain">{f.rain > 0 ? `🌧 ${f.rain}mm` : '☀️'}</div>
                      <div className="wg-temp">🌡 {f.temp}°</div>
                    </div>
                  ))}
                </div>

                <div className="wg-legend">
                  <span style={{ color: '#4ade80' }}>● &lt;10kt Faible</span>
                  <span style={{ color: '#facc15' }}>● 10–16kt Modéré</span>
                  <span style={{ color: '#fb923c' }}>● 16–22kt Frais</span>
                  <span style={{ color: '#f87171' }}>● &gt;22kt Fort</span>
                </div>

                <div className="wg-footer">
                  <a href="https://www.windguru.cz" target="_blank" rel="noopener" className="btn btn-outline btn-sm">
                    Prévisions complètes sur Windguru →
                  </a>
                </div>
              </div>

              <div className="info-card" style={{ marginTop: '20px' }}>
                <h3>{t('hours_title')}</h3>
                <ul className="contact-list">
                  <li><strong>Lun – Ven</strong> : {monday}</li>
                  <li><strong>Samedi</strong> : {saturday}</li>
                  <li><strong>Dimanche</strong> : {sunday}</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
