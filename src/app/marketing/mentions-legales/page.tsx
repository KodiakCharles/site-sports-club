import type { Metadata } from 'next'
import Link from 'next/link'
import LegalLayout from '../components/LegalLayout'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description:
    'Mentions légales du site Web Pulse — éditeur, hébergement, propriété intellectuelle, données personnelles.',
}

export default function MentionsLegales() {
  return (
    <LegalLayout
      title="Mentions légales"
      subtitle="Conformément à la loi n°2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique."
    >
      <h2>Éditeur du site</h2>
      <p>
        <strong>CGC</strong>
        <br />
        Société par actions simplifiée à associé unique au capital de 1&nbsp;000&nbsp;€
        <br />
        Siège social : 37B rue du Docteur Gronich – 40220 Tarnos
        <br />
        RCS Dax : 983&nbsp;956&nbsp;525
        <br />
        N°&nbsp;TVA intracommunautaire : FR&nbsp;22&nbsp;983&nbsp;956&nbsp;525
        <br />
        Présidente : société <strong>KODIAK</strong>, SAS, RCS Dax 982&nbsp;748&nbsp;675
        <br />
        Email : <a href="mailto:contact@web-pulse.fr">contact@web-pulse.fr</a>
      </p>

      <h2>Directeur de la publication</h2>
      <p>Le représentant légal de la société KODIAK, en sa qualité de Présidente de CGC.</p>

      <h2>Hébergement</h2>
      <p>
        <strong>Railway Corp.</strong>
        <br />
        548 Market St #46895 — San Francisco, CA 94104, États-Unis
        <br />
        Site : <a href="https://railway.app" target="_blank" rel="noopener">railway.app</a>
      </p>
      <p>
        Stockage des médias : <strong>Amazon Web Services (AWS S3)</strong> — région Europe (eu-north-1, Stockholm).
      </p>

      <h2>Service proposé</h2>
      <p>
        Le site <a href="https://www.web-pulse.fr">www.web-pulse.fr</a> propose un service logiciel en
        mode SaaS dénommé <strong>Web Pulse</strong>, destiné aux clubs sportifs et fédérations, pour
        l'édition de sites web vitrine, la gestion de contenu (articles, stages, calendrier compétitions),
        l'espace adhérent et les modules métier sport-spécifiques (voile, rugby, pelote basque). Chaque
        club Client dispose de son propre site, accessible sur son nom de domaine.
      </p>
      <p>
        Les conditions de souscription et d'utilisation sont définies dans les{' '}
        <Link href="/cgv">Conditions Générales de Vente</Link>.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus présents sur ce site et dans la solution (textes, images, code source,
        marque, logo, charte graphique) sont la propriété exclusive de SAS&nbsp;CGC ou de leurs auteurs
        respectifs, et sont protégés par les lois françaises et internationales relatives à la propriété
        intellectuelle. Toute reproduction, représentation ou exploitation, totale ou partielle, est
        interdite sans autorisation écrite préalable de SAS&nbsp;CGC.
      </p>
      <p>
        Les contenus créés par les Clients à l'aide de la solution (textes, articles, photos, logos
        de club) demeurent la propriété exclusive de leurs auteurs.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Les modalités de traitement des données personnelles sont décrites dans la{' '}
        <Link href="/confidentialite">Politique de confidentialité</Link>. SAS&nbsp;CGC agit en qualité
        de responsable de traitement pour les données collectées dans le cadre du site vitrine, et en
        qualité de sous-traitant pour les données traitées dans la solution pour le compte de ses
        Clients.
      </p>
      <p>
        Toute personne dispose d'un droit d'accès, de rectification, d'effacement, de portabilité,
        d'opposition et de limitation du traitement, à exercer auprès de{' '}
        <a href="mailto:contact@web-pulse.fr">contact@web-pulse.fr</a>. Une réclamation peut également
        être adressée à la <a href="https://www.cnil.fr" target="_blank" rel="noopener">CNIL</a>.
      </p>

      <h2>Technologies utilisées</h2>
      <ul>
        <li><strong>Next.js</strong> — framework React (MIT License)</li>
        <li><strong>Payload CMS</strong> — back-office de gestion de contenu (MIT License)</li>
        <li><strong>PostgreSQL</strong> — base de données relationnelle</li>
        <li><strong>Redis</strong> — cache applicatif et rate-limiting</li>
        <li><strong>AWS S3</strong> — stockage des médias (Europe)</li>
        <li><strong>Intelligence artificielle générative</strong> — pour le chatbot des sites Clients</li>
      </ul>

      <h2>Limitation de responsabilité</h2>
      <p>
        SAS&nbsp;CGC ne saurait être tenue responsable des dommages directs ou indirects résultant de
        l'utilisation du site ou de la solution, dans les limites définies par les{' '}
        <Link href="/cgv">CGV</Link>. Les contenus générés par l'intelligence artificielle (chatbot,
        suggestions éditoriales) sont fournis à titre d'aide et doivent faire l'objet d'une relecture
        avant publication.
      </p>

      <h2>Droit applicable</h2>
      <p>
        Les présentes mentions légales sont régies par le droit français. Tout litige sera soumis à la
        compétence exclusive du Tribunal de commerce de Dax.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question : <a href="mailto:contact@web-pulse.fr">contact@web-pulse.fr</a>.
      </p>
    </LegalLayout>
  )
}
