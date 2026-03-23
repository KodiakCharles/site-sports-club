import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('contact')
  const base = locale === 'fr' ? '' : `/${locale}`

  return (
    <div>
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
            <div className="info-card">
              <h3>{t('coordinates')}</h3>
              <ul className="contact-list">
                <li><strong>{t('address_label')}</strong><br />Port de plaisance, quai des voiliers<br />00000 Votre-Ville</li>
                <li><strong>Téléphone</strong><br /><a href="tel:+33600000000">06 00 00 00 00</a></li>
                <li><strong>Email</strong><br /><a href="mailto:contact@votreclub.fr">contact@votreclub.fr</a></li>
              </ul>
            </div>
            <div className="info-card" style={{ marginTop: '20px' }}>
              <h3>{t('hours_title')}</h3>
              <ul className="contact-list">
                <li><strong>{t('hours_weekday')}</strong><br />{t('hours_weekday_val')}</li>
                <li><strong>{t('hours_saturday')}</strong><br />{t('hours_saturday_val')}</li>
                <li><strong>{t('hours_sunday')}</strong><br />{t('hours_sunday_val')}</li>
              </ul>
            </div>
            <div className="info-card" style={{ marginTop: '20px' }}>
              <h3>{t('social_title')}</h3>
              <div className="social-links-inline">
                <a href="#" className="social-btn">Facebook</a>
                <a href="#" className="social-btn">Instagram</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
