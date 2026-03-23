import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function ClubPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('club')
  const base = locale === 'fr' ? '' : `/${locale}`

  const team = [
    { name: 'Marc Durand', role: 'Directeur technique', diploma: 'DE Voile', icon: '👨‍✈️' },
    { name: 'Sophie Martin', role: 'Monitrice principale', diploma: 'BPJEPS Voile', icon: '👩‍✈️' },
    { name: 'Thomas Leroy', role: 'Moniteur compétition', diploma: 'BPJEPS Voile', icon: '👨‍✈️' },
    { name: 'Emma Bernard', role: 'Monitrice jeunes', diploma: 'CQP Initiateur', icon: '👩‍✈️' },
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

      <section className="section">
        <div className="container content-grid">
          <div className="content-main">
            <h2>{t('history_title')}</h2>
            <p>{t('history_1')}</p>
            <p style={{ marginTop: '16px' }}>Labelisé <strong>École Française de Voile</strong>, {t('history_2').replace('Labelisé École Française de Voile, ', '')}</p>
            <div className="club-stats-row">
              {([['300+', t('stat_members')], ['20+', t('stat_coaches')], ['50+', t('stat_boats')], ['1 label', t('stat_label')]] as [string,string][]).map(([n, l]) => (
                <div key={l} className="club-stat">
                  <span className="club-stat-num">{n}</span>
                  <span className="club-stat-label">{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="content-aside">
            <div className="info-card">
              <h3>🏷️ {t('labels_title')}</h3>
              <ul className="label-list">
                <li>✅ {t('label_efv')}</li>
                <li>✅ {t('label_comp')}</li>
                <li>✅ {t('label_croisiere')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('team_title')}</h2>
            <p className="section-subtitle">{t('team_subtitle')}</p>
          </div>
          <div className="team-grid">
            {team.map((m) => (
              <div key={m.name} className="team-card">
                <div className="team-avatar">{m.icon}</div>
                <h3>{m.name}</h3>
                <p className="team-role">{m.role}</p>
                <span className="team-diploma">{m.diploma}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container section-header">
          <h2 className="section-title">{t('partners_title')}</h2>
          {['Partenaire Principal', 'Sponsor Or', 'Sponsor Argent', 'Partenaire local'].map((p) => (
            <div key={p} className="partner-placeholder">{p}</div>
          ))}
        </div>
      </section>
    </div>
  )
}
