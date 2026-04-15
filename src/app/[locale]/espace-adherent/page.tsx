import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import MemberPortal from '@/components/member/MemberPortal'

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
        <MemberPortal />
      </section>
    </div>
  )
}
