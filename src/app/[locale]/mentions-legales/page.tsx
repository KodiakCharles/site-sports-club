import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function MentionsLegalesPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('legal')
  const base = locale === 'fr' ? '' : `/${locale}`

  return (
    <div>
      <section className="page-hero" style={{ background: 'linear-gradient(135deg,#0a1628,#1a3a5c)' }}>
        <div className="container page-hero-content">
          <div className="breadcrumb"><Link href={base || '/'}>Accueil</Link> › {t('hero_title')}</div>
          <h1>{t('hero_title')}</h1>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: '760px' }}>
          <div className="legal-content">
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
            <p><strong>VoileWeb / Kodiak</strong> — Infrastructure hébergée en France (OVH Cloud, Roubaix).</p>
            <h2>Propriété intellectuelle</h2>
            <p>L&apos;ensemble des contenus publiés sur ce site est la propriété exclusive de l&apos;association. Toute reproduction est interdite sans accord écrit préalable.</p>
            <h2>Données personnelles</h2>
            <p>Consultez notre <Link href={`${base}/confidentialite`}>politique de confidentialité</Link> ou contactez-nous à <a href="mailto:contact@votreclub.fr">contact@votreclub.fr</a>.</p>
            <h2>Cookies</h2>
            <p>Ce site utilise des cookies fonctionnels et analytiques. Un bandeau de consentement vous permet de les accepter ou les refuser.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
