import Link from 'next/link'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { generatePageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({
    title: 'Le Club',
    description: 'D\u00e9couvrez notre club de voile : histoire, \u00e9quipe de moniteurs dipl\u00f4m\u00e9s et partenaires. Labellis\u00e9 \u00c9cole Fran\u00e7aise de Voile.',
    path: '/le-club',
    locale,
  })
}

type TeamMember = { name: string; role?: string; diploma?: string; icon?: string }
type Partner = { name: string; url?: string }

const DEFAULT_TEAM: TeamMember[] = [
  { name: 'Marc Durand',   role: 'Directeur technique',  diploma: 'DE Voile',       icon: '👨‍✈️' },
  { name: 'Sophie Martin', role: 'Monitrice principale', diploma: 'BPJEPS Voile',   icon: '👩‍✈️' },
  { name: 'Thomas Leroy',  role: 'Moniteur compétition', diploma: 'BPJEPS Voile',   icon: '👨‍✈️' },
  { name: 'Emma Bernard',  role: 'Monitrice jeunes',     diploma: 'CQP Initiateur', icon: '👩‍✈️' },
]

const DEFAULT_PARTNERS: Partner[] = [
  { name: 'Partenaire Principal' },
  { name: 'Sponsor Or' },
  { name: 'Sponsor Argent' },
  { name: 'Partenaire local' },
]

export default async function ClubPageRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('club')
  const base = locale === 'fr' ? '' : `/${locale}`

  const payload = await getPayload({ config })
  const pageData = await payload.findGlobal({ slug: 'club-page' }).catch(() => null)
  const d = pageData as Record<string, unknown> | null

  const heroTitle    = (d?.heroTitle    as string) || t('hero_title')
  const heroSubtitle = (d?.heroSubtitle as string) || t('hero_subtitle')
  const historyTitle = (d?.historyTitle as string) || t('history_title')
  const teamTitle    = (d?.teamTitle    as string) || t('team_title')
  const partnersTitle = (d?.partnersTitle as string) || t('partners_title')

  const team: TeamMember[]    = (d?.team     as TeamMember[]  | undefined)?.length ? (d!.team     as TeamMember[])   : DEFAULT_TEAM
  const partners: Partner[]   = (d?.partners as Partner[]     | undefined)?.length ? (d!.partners as Partner[])      : DEFAULT_PARTNERS

  return (
    <div>
      <section className="page-hero" style={{ background: 'linear-gradient(135deg,#0a1628,#1a3a5c)' }}>
        <div className="container page-hero-content">
          <div className="breadcrumb"><Link href={base || '/'}>Accueil</Link> › {heroTitle}</div>
          <h1>{heroTitle}</h1>
          <p>{heroSubtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="container content-grid">
          <div className="content-main">
            <h2>{historyTitle}</h2>
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
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{teamTitle}</h2>
            <p className="section-subtitle">{t('team_subtitle')}</p>
          </div>
          <div className="team-grid">
            {team.map((m) => (
              <div key={m.name} className="team-card">
                <div className="team-avatar">{m.icon ?? '👤'}</div>
                <h3>{m.name}</h3>
                <p className="team-role">{m.role}</p>
                {m.diploma && <span className="team-diploma">{m.diploma}</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container section-header">
          <h2 className="section-title">{partnersTitle}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', marginTop: '24px' }}>
            {partners.map((p) => (
              p.url
                ? <a key={p.name} href={p.url} target="_blank" rel="noopener" className="partner-placeholder">{p.name}</a>
                : <div key={p.name} className="partner-placeholder">{p.name}</div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
