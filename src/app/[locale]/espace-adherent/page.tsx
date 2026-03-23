import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function EspaceAdherentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('member')
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
        <div className="container" style={{ maxWidth: '520px' }}>
          <div className="login-card">
            <h2>{t('login_title')}</h2>
            <p style={{ color: '#94a3b8', marginBottom: '24px', fontSize: '.95rem' }}>{t('login_subtitle')}</p>
            <form className="contact-form" action="/api/auth/signin" method="POST">
              <div className="form-group">
                <label htmlFor="email">{t('email')}</label>
                <input type="email" id="email" name="email" required placeholder="vous@exemple.fr" />
              </div>
              <div className="form-group">
                <label htmlFor="password">{t('password')}</label>
                <input type="password" id="password" name="password" required placeholder="••••••••" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', fontSize: '.9rem' }}>
                <label style={{ display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" name="remember" /> {t('remember')}
                </label>
                <a href="#" className="link-ffv">{t('forgot')}</a>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>{t('login_btn')}</button>
            </form>
            <div className="login-divider">{t('or')}</div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#94a3b8', fontSize: '.9rem', marginBottom: '12px' }}>{t('no_account')}</p>
              <Link href={`${base}/tarifs`} className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>{t('join_btn')}</Link>
            </div>
          </div>
          <div className="ffvoile-banner" style={{ marginTop: '24px' }}>
            <span>🔐</span>
            <div>
              <strong>{t('module_title')}</strong>
              <p>{t('module_text')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
