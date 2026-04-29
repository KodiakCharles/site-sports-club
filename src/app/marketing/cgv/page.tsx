import type { Metadata } from 'next'
import Link from 'next/link'
import LegalLayout from '../components/LegalLayout'

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente',
  description:
    'CGV du service Web Pulse — souscription, formules, paiement, durée, résiliation, responsabilité.',
}

export default function CGV() {
  return (
    <LegalLayout
      title="Conditions Générales de Vente"
      subtitle="Service Web Pulse · Dernière mise à jour : avril 2026"
    >
      <h2>Article 1 — Identification de l'Éditeur</h2>
      <p>Le service <strong>Web Pulse</strong> est édité et exploité par :</p>
      <ul>
        <li>
          <strong>CGC</strong>, société par actions simplifiée à associé unique au capital de
          1&nbsp;000&nbsp;€
        </li>
        <li>Siège social : 37B rue du Docteur Gronich – 40220 Tarnos</li>
        <li>RCS Dax : 983&nbsp;956&nbsp;525</li>
        <li>N°&nbsp;TVA intracommunautaire : FR&nbsp;22&nbsp;983&nbsp;956&nbsp;525</li>
        <li>
          Représentée par sa Présidente, la société <strong>KODIAK</strong> (RCS Dax 982&nbsp;748&nbsp;675),
          elle-même représentée par son représentant légal en exercice
        </li>
        <li>
          Contact : <a href="mailto:contact@web-pulse.fr">contact@web-pulse.fr</a>
        </li>
      </ul>
      <p>
        Ci-après dénommée « <strong>l'Éditeur</strong> ».
      </p>

      <h2>Article 2 — Objet</h2>
      <p>
        Les présentes Conditions Générales de Vente (« CGV ») régissent les relations contractuelles
        entre l'Éditeur et toute personne morale (club sportif amateur, fédération, association loi
        1901, ou autre structure) souscrivant à la solution Web Pulse (le « Service »), ci-après le
        « Client ».
      </p>
      <p>
        Toute souscription au Service emporte acceptation pleine et entière des présentes CGV,
        lesquelles font partie intégrante du contrat de souscription signé entre les Parties.
      </p>

      <h2>Article 3 — Description du Service</h2>
      <p>
        Le Service est une solution logicielle accessible en mode SaaS (Software as a Service) à
        l'adresse <a href="https://www.web-pulse.fr">https://www.web-pulse.fr</a>, permettant à chaque
        Client de disposer d'un site web vitrine sur son propre nom de domaine, comprenant&nbsp;:
      </p>
      <ul>
        <li>
          la publication d'articles, de stages et de comptes rendus de compétition via un back-office
          dédié ;
        </li>
        <li>la gestion d'un espace adhérent (inscription, profil, opt-in newsletter) ;</li>
        <li>
          la mise à disposition de modules métier selon le sport choisi (météo marine pour la voile,
          réservation de frontons pour la pelote basque, etc.) ;
        </li>
        <li>l'accès multilingue (FR, EN, ES) selon la formule souscrite ;</li>
        <li>
          un chatbot conversationnel branché sur la base de connaissances du Client, selon la formule.
        </li>
      </ul>

      <h2>Article 4 — Formules et tarifs</h2>
      <p>Trois formules d'abonnement sont proposées, hors taxes :</p>
      <ul>
        <li>
          <strong>Formule Essentiel</strong> — 29&nbsp;€&nbsp;HT/mois — site complet multi-pages, CMS,
          newsletter, monolingue FR. Pas de fonctionnalités IA.
        </li>
        <li>
          <strong>Formule Pulse</strong> — 49&nbsp;€&nbsp;HT/mois — toutes les fonctionnalités
          Essentiel + chatbot IA, espace adhérent complet, multilingue FR/EN/ES, modules
          sport-spécifiques.
        </li>
        <li>
          <strong>Formule Sur mesure</strong> — sur devis — toutes les fonctionnalités Pulse +
          intégrations tierces (Yoplanning, HelloAsso, Axyomes…), templates emails personnalisés,
          account manager dédié, SLA garanti.
        </li>
      </ul>
      <p>
        Les prix s'entendent hors taxes. La TVA en vigueur est appliquée sur chaque facture,
        conformément à la réglementation française.
      </p>
      <p>
        <strong>Coût des tokens d'IA</strong> — Pour les formules incluant le chatbot IA, le coût des
        tokens consommés par le moteur d'intelligence artificielle est inclus dans la formule dans la
        limite d'un quota mensuel. Toute consommation au-delà de ce quota est facturée en sus selon un
        coefficient appliqué au coût réel constaté. Le Client peut consulter sa consommation en temps
        réel et paramétrer un plafond mensuel pour maîtriser son budget.
      </p>

      <h2>Article 5 — Durée et engagement</h2>
      <p>
        Le Contrat est conclu pour une durée ferme de douze (12) mois à compter de la date de
        souscription (« Engagement Annuel »).
      </p>
      <p>
        À l'issue de cette période, le Contrat est tacitement renouvelé par périodes successives de
        douze (12) mois, sauf dénonciation par lettre recommandée avec accusé de réception adressée
        par l'une des Parties au moins trente (30) jours avant l'échéance annuelle.
      </p>
      <p>
        Toute résiliation anticipée du fait du Client pendant la période d'Engagement Annuel rend
        exigibles l'intégralité des mensualités restant à courir jusqu'au terme de la période en cours.
      </p>

      <h2>Article 6 — Modalités de paiement</h2>
      <p>
        Le règlement s'effectue exclusivement par <strong>virement bancaire</strong>, selon l'une des
        deux modalités au choix du Client. <strong>Les deux modalités impliquent l'Engagement Annuel
        ferme de douze (12) mois</strong> défini à l'Article 5 :
      </p>
      <ul>
        <li>
          <strong>Paiement mensuel</strong> — à terme à échoir, à réception de la facture émise en
          début de chaque mois pendant toute la durée de l'Engagement Annuel ;
        </li>
        <li>
          <strong>Paiement annuel d'avance — remise de 10&nbsp;%</strong> — en une seule fois pour la
          totalité de l'Engagement Annuel, après application d'une remise commerciale de dix pour
          cent (10&nbsp;%) sur le total annuel. La facture est émise à la souscription.
        </li>
      </ul>
      <p>
        Les coordonnées bancaires sont communiquées au Client lors de la souscription et figurent dans
        le contrat de souscription.
      </p>
      <p>
        <strong>Retard de paiement</strong> — Tout retard entraîne, de plein droit et sans mise en
        demeure préalable, l'application d'intérêts au taux de trois fois le taux d'intérêt légal en
        vigueur, ainsi qu'une indemnité forfaitaire pour frais de recouvrement de 40&nbsp;€ (article
        D.&nbsp;441-5 du Code de commerce). En cas de non-règlement dans un délai de quinze (15) jours
        après mise en demeure restée infructueuse, l'Éditeur pourra suspendre l'accès au Service.
      </p>

      <h2>Article 7 — Mise à disposition du Service</h2>
      <p>
        L'Éditeur s'engage à mettre à disposition du Client la solution dans un délai maximum de sept
        (7) jours ouvrés à compter de la signature du contrat de souscription et de la réception du
        premier paiement. Le Client doit fournir le nom de domaine sur lequel son site sera accessible,
        ou en faire l'acquisition.
      </p>
      <p>
        L'accès se fait via les identifiants personnels remis au Client. Le Client est seul responsable
        de la confidentialité de ces identifiants et de tout usage qui en serait fait.
      </p>

      <h2>Article 8 — Disponibilité du Service</h2>
      <p>
        L'Éditeur s'engage à mettre en œuvre les moyens raisonnables pour assurer la disponibilité du
        Service 24h/24 et 7j/7. Toutefois, le Service peut être ponctuellement suspendu pour des
        raisons de maintenance, mises à jour, sécurité ou cas de force majeure.
      </p>
      <p>
        L'Éditeur ne saurait être tenu responsable des interruptions liées à des facteurs extérieurs
        (panne réseau, défaillance d'un fournisseur tiers, attaque informatique, etc.).
      </p>

      <h2>Article 9 — Obligations du Client</h2>
      <p>Le Client s'engage à :</p>
      <ul>
        <li>utiliser le Service conformément à sa destination et aux présentes CGV ;</li>
        <li>
          ne pas porter atteinte aux droits de tiers (droit à l'image, droit d'auteur, droit des
          marques, données personnelles) ;
        </li>
        <li>
          recueillir les autorisations nécessaires (droit à l'image, autorisations parentales pour
          les mineurs) avant tout upload de photo ou de contenu mettant en scène des personnes
          identifiables ;
        </li>
        <li>
          relire systématiquement les contenus générés par l'IA avant publication, l'IA étant un
          outil d'aide à la rédaction ;
        </li>
        <li>régler les sommes dues aux échéances convenues.</li>
      </ul>

      <h2>Article 10 — Propriété intellectuelle</h2>
      <p>
        La solution Web Pulse, son code source, sa documentation, sa marque, son nom de domaine et
        l'ensemble de ses composants demeurent la propriété exclusive de l'Éditeur. La souscription
        n'emporte aucune cession de droits, mais uniquement un droit d'usage personnel et non exclusif
        pendant la durée du Contrat.
      </p>
      <p>
        Les contenus créés par le Client (textes, articles, photos, logo de club, etc.) demeurent la
        propriété exclusive du Client. L'Éditeur ne revendique aucun droit sur ces contenus.
      </p>

      <h2>Article 11 — Données à caractère personnel</h2>
      <p>
        Dans le cadre de l'exécution du Contrat, l'Éditeur agit en qualité de <strong>sous-traitant</strong> des
        données traitées pour le compte du Client (responsable de traitement) au sens du Règlement (UE)
        2016/679 (RGPD).
      </p>
      <p>
        Les modalités du sous-traitement (catégories de données, finalités, mesures de sécurité,
        sous-traitants ultérieurs) sont détaillées dans la{' '}
        <Link href="/confidentialite">Politique de confidentialité</Link>. Une annexe contractuelle de
        sous-traitance (DPA) peut être signée à la demande du Client.
      </p>

      <h2>Article 12 — Responsabilité</h2>
      <p>
        L'Éditeur est tenu d'une obligation de moyens et s'engage à exécuter ses prestations avec tout
        le soin et la diligence en usage dans la profession.
      </p>
      <p>
        La responsabilité de l'Éditeur, toutes causes confondues, est expressément limitée au montant
        total des sommes effectivement payées par le Client au titre du Contrat sur les douze (12)
        mois précédant le fait générateur. L'Éditeur ne saurait être tenu responsable des dommages
        indirects, immatériels ou consécutifs (perte de chiffre d'affaires, perte de clientèle, perte
        de données, atteinte à la réputation).
      </p>
      <p>
        L'Éditeur ne saurait être tenu responsable de l'usage qui est fait des contenus générés par
        l'IA. Le Client demeure seul responsable de ses publications et de leur conformité aux lois
        et règlements applicables.
      </p>

      <h2>Article 13 — Résiliation</h2>
      <p>
        En cas de manquement grave de l'une des Parties, l'autre Partie pourra résilier le Contrat de
        plein droit, après mise en demeure restée infructueuse pendant trente (30) jours calendaires,
        sans préjudice de tous dommages et intérêts.
      </p>

      <h2>Article 14 — Confidentialité</h2>
      <p>
        Chacune des Parties s'engage à préserver la confidentialité des informations et documents
        auxquels elle a accès dans le cadre du Contrat, pendant toute la durée du Contrat ainsi que
        pendant trois (3) ans après son terme.
      </p>

      <h2>Article 15 — Modification des CGV</h2>
      <p>
        L'Éditeur se réserve la possibilité de modifier les présentes CGV à tout moment. Les
        modifications seront notifiées au Client au moins trente (30) jours avant leur entrée en
        vigueur. À défaut d'opposition exprimée pendant ce délai, les nouvelles CGV s'appliqueront de
        plein droit.
      </p>

      <h2>Article 16 — Droit applicable et juridiction</h2>
      <p>
        Les présentes CGV sont régies par le droit français. Tout litige relatif à leur formation,
        exécution, interprétation ou résiliation, à défaut d'accord amiable entre les Parties dans un
        délai de trente (30) jours, sera soumis à la compétence exclusive du{' '}
        <strong>Tribunal de commerce de Dax</strong>, nonobstant pluralité de défendeurs ou appel en
        garantie.
      </p>

      <p className="mt-10 p-4 bg-slate-800/50 rounded-lg text-sm text-slate-400">
        Pour toute question relative aux présentes CGV :{' '}
        <a href="mailto:contact@web-pulse.fr">contact@web-pulse.fr</a>.
      </p>
    </LegalLayout>
  )
}
