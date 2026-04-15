import Link from 'next/link'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { generatePageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({
    title: 'Mentions l\u00e9gales',
    description: 'Mentions l\u00e9gales du site : \u00e9diteur, h\u00e9bergement, propri\u00e9t\u00e9 intellectuelle et donn\u00e9es personnelles.',
    path: '/mentions-legales',
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

export default async function MentionsLegalesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('legal')
  const base = locale === 'fr' ? '' : `/${locale}`

  const payload = await getPayload({ config })
  const pageData = await payload.findGlobal({ slug: 'mentions-legales-page' }).catch(() => null)
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
                  <h2>Éditeur du site</h2>
                  <p><strong>Nom de l&apos;association :</strong> Club de Voile [À compléter]<br />
                  <strong>Forme juridique :</strong> Association loi 1901<br />
                  <strong>SIRET :</strong> [À compléter]<br />
                  <strong>Siège social :</strong> Port de plaisance, 00000 Votre-Ville<br />
                  <strong>Email :</strong> <a href="mailto:contact@votreclub.fr">contact@votreclub.fr</a><br />
                  <strong>Tél. :</strong> 06 00 00 00 00</p>
                  <h2>Directeur de la publication</h2>
                  <p>Le Président de l&apos;association.</p>
                  <h2>Hébergement</h2>
                  <p><strong>VoilePulse / Kodiak</strong> — Infrastructure hébergée en France (OVH Cloud, Roubaix).</p>
                  <h2>Propriété intellectuelle</h2>
                  <p>L&apos;ensemble des contenus publiés sur ce site est la propriété exclusive de l&apos;association. Toute reproduction est interdite sans accord écrit préalable.</p>
                  <h2>Données personnelles</h2>
                  <p>Consultez notre <Link href={`${base}/confidentialite`}>politique de confidentialité</Link> ou contactez-nous à <a href="mailto:contact@votreclub.fr">contact@votreclub.fr</a>.</p>
                  <h2>Cookies</h2>
                  <p>Ce site utilise des cookies fonctionnels et analytiques. Un bandeau de consentement vous permet de les accepter ou les refuser.</p>
                </>
            }
          </div>
        </div>
      </section>
    </div>
  )
}
