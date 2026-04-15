import Link from 'next/link'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { generatePageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({
    title: 'Politique de confidentialit\u00e9',
    description: 'Politique de confidentialit\u00e9 et protection des donn\u00e9es personnelles conform\u00e9ment au RGPD.',
    path: '/confidentialite',
    locale,
  })
}

function lexicalToHtml(content: unknown): string {
  if (!content || typeof content !== 'object') return ''
  const root = (content as { root?: { children?: unknown[] } }).root
  if (!root?.children) return ''
  const renderNode = (node: Record<string, unknown>): string => {
    if (node.type === 'text') return String(node.text ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    const children = (node.children as Record<string, unknown>[] | undefined ?? []).map(renderNode).join('')
    switch (node.type) {
      case 'heading': return `<h${node.tag ?? 2}>${children}</h${node.tag ?? 2}>`
      case 'paragraph': return `<p>${children}</p>`
      case 'list': return node.listType === 'number' ? `<ol>${children}</ol>` : `<ul>${children}</ul>`
      case 'listitem': return `<li>${children}</li>`
      case 'link': return `<a href="${String((node.fields as Record<string,unknown>)?.url ?? '#')}">${children}</a>`
      default: return children
    }
  }
  return (root.children as Record<string, unknown>[]).map(renderNode).join('')
}

export default async function ConfidentialitePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('privacy')
  const base = locale === 'fr' ? '' : `/${locale}`

  const payload = await getPayload({ config })
  const pageData = await payload.findGlobal({ slug: 'confidentialite-page' }).catch(() => null)
  const d = pageData as Record<string, unknown> | null

  const heroTitle = (d?.heroTitle as string) || t('hero_title')
  const htmlContent = d?.content ? lexicalToHtml(d.content) : null

  return (
    <div>
      <section className="page-hero" style={{ background: 'linear-gradient(135deg,#0a1628,#1a3a5c)' }}>
        <div className="container page-hero-content">
          <div className="breadcrumb"><Link href={base || '/'}>Accueil</Link> › {heroTitle}</div>
          <h1>{heroTitle}</h1>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: '760px' }}>
          <div className="legal-content">
            {htmlContent
              ? <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
              : <>
                  <h2>1. Responsable du traitement</h2>
                  <p>Le responsable du traitement est l&apos;association <strong>[Nom du club]</strong>. Contact : <a href="mailto:contact@votreclub.fr">contact@votreclub.fr</a>.</p>
                  <h2>2. Données collectées</h2>
                  <ul>
                    <li><strong>Formulaire de contact</strong> : nom, prénom, email, message</li>
                    <li><strong>Adhésion en ligne</strong> : nom, prénom, date de naissance, email, adresse, téléphone</li>
                    <li><strong>Espace adhérent</strong> : identifiant, mot de passe (hashé), historique des réservations</li>
                    <li><strong>Newsletter</strong> : adresse email uniquement</li>
                  </ul>
                  <h2>3. Finalités et bases légales</h2>
                  <ul>
                    <li><strong>Gestion des adhésions</strong> — exécution du contrat (art. 6.1.b RGPD)</li>
                    <li><strong>Réponse aux demandes de contact</strong> — intérêt légitime (art. 6.1.f)</li>
                    <li><strong>Newsletter</strong> — consentement (art. 6.1.a)</li>
                  </ul>
                  <h2>4. Vos droits</h2>
                  <p>Accès, rectification, effacement, portabilité, opposition. Contact : <a href="mailto:contact@votreclub.fr">contact@votreclub.fr</a> ou via l&apos;<Link href={`${base}/espace-adherent`}>espace adhérent</Link>.</p>
                  <h2>5. Sécurité</h2>
                  <p>Mots de passe hashés avec bcrypt. Communications chiffrées via HTTPS/TLS.</p>
                  <p style={{ marginTop: '32px', fontSize: '.85rem', color: '#64748b' }}>Dernière mise à jour : mars 2026</p>
                </>
            }
          </div>
        </div>
      </section>
    </div>
  )
}
