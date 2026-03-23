import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function ConfidentialitePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('privacy')
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
          </div>
        </div>
      </section>
    </div>
  )
}
