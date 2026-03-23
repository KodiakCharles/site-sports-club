import Link from 'next/link'

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const base = locale === 'fr' ? '' : `/${locale}`
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  return (
    <div>
      <section className="page-hero" style={{ background: 'linear-gradient(135deg,#0a1628,#1a3a5c)' }}>
        <div className="container page-hero-content">
          <div className="breadcrumb">
            <Link href={base || '/'}>Accueil</Link> › <Link href={`${base}/actualites`}>Actualités</Link> › Article
          </div>
          <h1 style={{ maxWidth: '760px' }}>{title}</h1>
          <p>15 mars 2026 · Compétition</p>
        </div>
      </section>

      <section className="section">
        <div className="container content-grid">
          <article className="content-main">
            <p>Cet article est un contenu de démonstration. Dans la version finale, le contenu sera géré via le CMS (éditeur riche, images, galeries, vidéos embarquées).</p>
            <p style={{ marginTop: '16px' }}>Le blog supporte les catégories, les tags, la recherche full-text, le partage sur les réseaux sociaux et le SEO avancé (méta-description, Open Graph, schema.org).</p>
            <div style={{ marginTop: '32px', padding: '24px', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-gray-200)' }}>
              <strong style={{ color: 'var(--color-primary)' }}>Contenu à venir</strong>
              <p style={{ marginTop: '8px', fontSize: '.9rem', color: 'var(--color-text-muted)' }}>Ce bloc sera remplacé par le contenu rédigé dans le back-office Payload CMS.</p>
            </div>
            <div style={{ marginTop: '32px' }}>
              <Link href={`${base}/actualites`} className="btn btn-outline">← Retour aux actualités</Link>
            </div>
          </article>

          <div className="content-aside">
            <div className="info-card">
              <h3>Articles récents</h3>
              <ul className="contact-list">
                {['Inscriptions Été 2026 ouvertes', 'Nouveau matériel Wing Foil', 'AG 2026 — compte-rendu'].map(t => (
                  <li key={t}><Link href={`${base}/actualites`} style={{ color: 'var(--color-primary)' }}>{t}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
