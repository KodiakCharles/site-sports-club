import Link from 'next/link'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import JsonLd from '@/components/seo/JsonLd'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { generateLocalBusinessSchema } from '@/lib/seo/structured-data'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.club-voile.fr'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({
    title: 'Contact',
    description: 'Contactez notre club de voile. T\u00e9l\u00e9phone, email, formulaire de contact et horaires d\'ouverture.',
    path: '/contact',
    locale,
  })
}

const SOCIAL_CONFIG = [
  { key: 'facebookUrl',   label: 'Facebook',   icon: '📘' },
  { key: 'instagramUrl',  label: 'Instagram',  icon: '📸' },
  { key: 'twitterUrl',    label: 'X / Twitter',icon: '🐦' },
  { key: 'youtubeUrl',    label: 'YouTube',    icon: '▶️' },
  { key: 'tiktokUrl',     label: 'TikTok',     icon: '🎵' },
]

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('contact')
  const base = locale === 'fr' ? '' : `/${locale}`

  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'club-settings' }).catch(() => null)
  const s = settings as Record<string, unknown> | null

  const address = (s?.address as string) || 'Port de plaisance, quai des voiliers'
  const phone   = (s?.phone as string) || '06 00 00 00 00'
  const email   = (s?.email as string) || 'contact@votreclub.fr'
  const monday  = (s?.mondayFriday as string) || '9h – 18h'
  const saturday = (s?.saturday as string) || '9h – 13h'
  const sunday   = (s?.sunday as string) || 'Fermé'

  const socials = SOCIAL_CONFIG.filter(({ key }) => s?.[key])

  const localBusinessSchema = generateLocalBusinessSchema(
    (s?.clubName as string) || 'Club de Voile',
    address,
    phone,
    email,
    0,
    0,
    `${BASE_URL}/${locale}/contact`,
  )

  return (
    <div>
      <JsonLd data={localBusinessSchema} />
      <section className="page-hero" style={{ background: 'linear-gradient(135deg,#0a2030,#1d6fa4)' }}>
        <div className="container page-hero-content">
          <div className="breadcrumb"><Link href={base || '/'}>Accueil</Link> › {t('hero_title')}</div>
          <h1>{t('hero_title')}</h1>
          <p>{t('hero_subtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container content-grid">
          <div className="content-main">
            <h2>{t('form_title')}</h2>
            <form className="contact-form" action="/api/contact" method="POST">
              <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">{t('first_name')} *</label>
                  <input type="text" id="firstName" name="firstName" required placeholder="Jean" />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">{t('last_name')} *</label>
                  <input type="text" id="lastName" name="lastName" required placeholder="Dupont" />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">{t('email')} *</label>
                <input type="email" id="email" name="email" required placeholder="jean.dupont@exemple.fr" />
              </div>
              <div className="form-group">
                <label htmlFor="subject">{t('subject')} *</label>
                <select id="subject" name="subject" required>
                  <option value="">{t('subject_placeholder')}</option>
                  <option value="adhesion">{t('subject_membership')}</option>
                  <option value="stage">{t('subject_stage')}</option>
                  <option value="competition">{t('subject_competition')}</option>
                  <option value="location">{t('subject_rental')}</option>
                  <option value="autre">{t('subject_other')}</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="message">{t('message')} *</label>
                <textarea id="message" name="message" required rows={6} placeholder={t('message_placeholder')} maxLength={2000} />
              </div>
              <div className="form-group form-check">
                <input type="checkbox" id="rgpd" name="rgpd" required />
                <label htmlFor="rgpd">{t('rgpd')} (<Link href={`${base}/confidentialite`}>{t('privacy_link')}</Link>)</label>
              </div>
              <button type="submit" className="btn btn-primary">{t('send_btn')}</button>
            </form>
          </div>

          <div className="content-aside">
            {/* Coordonnées depuis le CMS */}
            <div className="info-card">
              <h3>{t('coordinates')}</h3>
              <ul className="contact-list">
                <li><strong>{t('address_label')}</strong><br />{address}</li>
                <li><strong>Téléphone</strong><br /><a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a></li>
                <li><strong>Email</strong><br /><a href={`mailto:${email}`}>{email}</a></li>
              </ul>
            </div>

            {/* Horaires depuis le CMS */}
            <div className="info-card" style={{ marginTop: '20px' }}>
              <h3>{t('hours_title')}</h3>
              <ul className="contact-list">
                <li><strong>{t('hours_weekday')}</strong><br />{monday}</li>
                <li><strong>{t('hours_saturday')}</strong><br />{saturday}</li>
                <li><strong>{t('hours_sunday')}</strong><br />{sunday}</li>
              </ul>
            </div>

            {/* Réseaux sociaux — seulement ceux remplis dans le CMS */}
            {socials.length > 0 && (
              <div className="info-card" style={{ marginTop: '20px' }}>
                <h3>{t('social_title')}</h3>
                <div className="social-links-stack">
                  {socials.map(({ key, label, icon }) => (
                    <a
                      key={key}
                      href={s![key] as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link-row"
                    >
                      <span className="social-link-icon">{icon}</span>
                      <span className="social-link-label">{label}</span>
                      <span className="social-link-arrow">→</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
