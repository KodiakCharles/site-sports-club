import Link from 'next/link'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { generatePageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({
    title: 'Activit\u00e9s nautiques',
    description: 'Optimist, d\u00e9riveur, catamaran, planche \u00e0 voile, foil, croisi\u00e8re, kayak. Toutes nos activit\u00e9s encadr\u00e9es par des moniteurs dipl\u00f4m\u00e9s.',
    path: '/activites',
    locale,
  })
}

type Activity = {
  slug: string
  icon: string
  name: string
  age: string
  level: string
  description: string
  color: string
  showPricing: boolean
  priceHour?: number | null
  priceHalfDay?: number | null
  priceFullDay?: number | null
  priceNote?: string
}

// Activités par défaut si le CMS n&apos;est pas encore configuré
const DEFAULT_ACTIVITIES: Activity[] = [
  { slug: 'optimist', icon: '⛵', name: 'Optimist', age: 'Dès 7 ans', level: 'Initiation', description: "Le dériveur monotype par excellence pour apprendre la voile. Idéal pour les jeunes en début d'apprentissage.", color: '#0ea5e9', showPricing: false },
  { slug: 'deriveur', icon: '🚤', name: 'Dériveur', age: 'Dès 12 ans', level: 'Initiation → Compétition', description: 'Laser ILCA, 420, RS Feva — des bateaux légers pour progresser rapidement et viser la compétition.', color: '#2dd4bf', showPricing: false },
  { slug: 'catamaran', icon: '🌊', name: 'Catamaran', age: 'Dès 14 ans', level: 'Initiation → Perfectionnement', description: 'Vitesse, sensations et navigation en équipage. Pour les amateurs de glisse à deux.', color: '#f0b429', showPricing: false },
  { slug: 'planche', icon: '🏄', name: 'Planche à voile', age: 'Dès 10 ans', level: 'Initiation → Perfectionnement', description: "Windsurf et planche à voile. Équilibre, technique et liberté totale sur l'eau.", color: '#a78bfa', showPricing: false },
  { slug: 'foil', icon: '✈️', name: 'Foil & Wing Foil', age: 'Dès 16 ans', level: 'Perfectionnement', description: "La glisse ultime : voler au-dessus de l'eau à des vitesses impressionnantes.", color: '#f472b6', showPricing: false },
  { slug: 'croisiere', icon: '⚓', name: 'Voile habitable', age: 'Adultes', level: 'Initiation → Croisière', description: 'Navigation hauturière, stages croisière côtière. Permis côtier et hauturier inclus dans le parcours.', color: '#4ade80', showPricing: false },
  { slug: 'kayak', icon: '🛶', name: 'Kayak & SUP', age: 'Tous âges', level: 'Loisir', description: 'Kayak de mer et stand up paddle pour découvrir le littoral à votre rythme.', color: '#fb923c', showPricing: false },
  { slug: 'yole', icon: '🚣', name: 'Yole', age: 'Dès 10 ans', level: 'Initiation', description: "Navigation en équipage sur embarcation traditionnelle. Esprit d'équipe garanti.", color: '#60a5fa', showPricing: false },
]

export default async function ActivitesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('activities')
  const base = locale === 'fr' ? '' : `/${locale}`

  const payload = await getPayload({ config })
  const pageData = await payload.findGlobal({ slug: 'activites-page' }).catch(() => null)

  const cmsActivities = (pageData?.activities as Activity[] | undefined) ?? []
  const activities = cmsActivities.length > 0 ? cmsActivities : DEFAULT_ACTIVITIES
  const pricingNote = (pageData?.pricingNote as string | undefined) ?? ''

  const introTitle    = (pageData?.introTitle    as string) || 'Tous les niveaux, tous les supports'
  const introSubtitle = (pageData?.introSubtitle as string) || 'Du premier bord en Optimist à la navigation hauturière, notre club propose une gamme complète d\'activités nautiques encadrées par des moniteurs diplômés d\'État.'
  const efvTitle      = (pageData?.efvTitle      as string) || 'Label École Française de Voile'
  const efvSubtitle   = (pageData?.efvSubtitle   as string) || 'Notre club est labellisé EFV par la Fédération Française de Voile, garantissant une pédagogie adaptée, des moniteurs qualifiés et des bateaux entretenus.'
  type EfvFeature = { icon?: string; title: string; desc?: string }
  const efvFeatures: EfvFeature[] = (pageData?.efvFeatures as EfvFeature[] | undefined)?.length
    ? (pageData!.efvFeatures as EfvFeature[])
    : [
        { icon: '🎓', title: 'Moniteurs diplômés', desc: 'BPJEPS, DE Voile, CQP Initiateur — un encadrement qualifié à chaque étape.' },
        { icon: '⛵', title: 'Flotte entretenue', desc: 'Bateaux révisés chaque saison, équipements de sécurité conformes FFVoile.' },
        { icon: '📋', title: 'Progression validée', desc: 'Carnet de voile FFVoile, passages de niveaux certifiés par les moniteurs.' },
        { icon: '🏅', title: 'Filière compétition', desc: 'Suivi individualisé pour les jeunes talents, déplacements organisés.' },
      ]

  return (
    <div>
      <section className="page-hero" style={{ background: 'linear-gradient(135deg,#071a2e,#0f3558,#1d6fa4)' }}>
        <div className="container page-hero-content">
          <div className="breadcrumb"><Link href={base || '/'}>Accueil</Link> › {t('hero_title')}</div>
          <h1>{(pageData?.heroTitle as string) || t('hero_title')}</h1>
          <p>{(pageData?.heroSubtitle as string) || t('hero_subtitle')}</p>
        </div>
      </section>

      {/* Intro */}
      <section className="section" style={{ paddingBottom: '0' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '24px' }}>
            <h2 className="section-title">{introTitle}</h2>
            <p className="section-subtitle">{introSubtitle}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="supports-grid">
            {activities.map((a) => (
              <div key={a.slug} className="support-card" style={{ '--accent': a.color } as React.CSSProperties}>
                <div className="support-icon">{a.icon}</div>
                <h2>{a.name}</h2>
                <div className="support-meta">
                  <span>👤 {a.age}</span>
                  <span>📊 {a.level}</span>
                </div>
                <p>{a.description}</p>

                {/* Tableau de tarifs si disponible */}
                {'showPricing' in a && a.showPricing && (a.priceHour || a.priceHalfDay || a.priceFullDay) && (
                  <div className="activity-pricing" style={{ marginTop: '12px' }}>
                    <table className="tarifs-table" style={{ fontSize: '.82rem' }}>
                      <thead>
                        <tr>
                          {a.priceHour && <th>/ heure</th>}
                          {a.priceHalfDay && <th>demi-journée</th>}
                          {a.priceFullDay && <th>journée</th>}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {a.priceHour && <td>{a.priceHour} €</td>}
                          {a.priceHalfDay && <td>{a.priceHalfDay} €</td>}
                          {a.priceFullDay && <td>{a.priceFullDay} €</td>}
                        </tr>
                      </tbody>
                    </table>
                    {a.priceNote && <p style={{ fontSize: '.8rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>{a.priceNote}</p>}
                  </div>
                )}

                <div style={{ marginTop: '16px' }}>
                  <Link href={`${base}/stages?support=${a.slug}`} className="btn btn-primary btn-sm">
                    {t('see_stages')}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {pricingNote && (
            <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '.9rem', color: 'var(--color-text-muted)' }}>
              ℹ️ {pricingNote}
            </p>
          )}
        </div>
      </section>

      {/* Bandeau École Française de Voile */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{efvTitle}</h2>
            <p className="section-subtitle">{efvSubtitle}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
            {efvFeatures.map((item) => (
              <div key={item.title} className="info-card" style={{ textAlign: 'center' }}>
                {item.icon && <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{item.icon}</div>}
                <h3 style={{ color: 'var(--color-navy)', fontWeight: 700, marginBottom: '8px', fontSize: '1rem' }}>{item.title}</h3>
                {item.desc && <p style={{ fontSize: '.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{item.desc}</p>}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`${base}/stages`} className="btn btn-primary btn-lg">
              Voir tous les stages
            </Link>
            <Link href={`${base}/tarifs`} className="btn btn-outline btn-lg">
              Tarifs &amp; adhésion
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
