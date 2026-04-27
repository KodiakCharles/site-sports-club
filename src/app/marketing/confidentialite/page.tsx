import type { Metadata } from 'next'
import LegalLayout from '../components/LegalLayout'

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description:
    'Politique de confidentialité du service Web Pulse — traitement des données personnelles, RGPD, vos droits.',
}

export default function Confidentialite() {
  return (
    <LegalLayout
      title="Politique de confidentialité"
      subtitle="Dernière mise à jour : avril 2026"
    >
      <p>
        La présente politique décrit comment la société <strong>CGC</strong> (SASU au capital de
        1&nbsp;000&nbsp;€, RCS Dax 983&nbsp;956&nbsp;525), éditrice du service Web Pulse (le
        « Service »), traite les données à caractère personnel dans le respect du Règlement (UE)
        2016/679 du 27 avril 2016 (« RGPD ») et de la loi n°&nbsp;78-17 du 6 janvier 1978 modifiée.
      </p>

      <h2>1. Responsable du traitement et qualités</h2>
      <p>CGC intervient à deux titres distincts :</p>
      <ul>
        <li>
          <strong>Responsable de traitement</strong> — pour les données collectées sur son site
          vitrine (formulaire de contact, identifiants des comptes administrateurs, données de
          connexion, journaux de sécurité).
        </li>
        <li>
          <strong>Sous-traitant</strong> — pour les données traitées dans le Service pour le compte
          de ses Clients (clubs sportifs, associations, fédérations), lesquels demeurent responsables
          de traitement des données de leurs adhérents et visiteurs.
        </li>
      </ul>
      <p>
        Coordonnées : CGC, 37B rue du Docteur Gronich – 40220 Tarnos —{' '}
        <a href="mailto:contact@web-pulse.fr">contact@web-pulse.fr</a>.
      </p>

      <h2>2. Données collectées</h2>
      <p>
        <strong>Sur le site vitrine et dans le cadre de la souscription</strong> :
      </p>
      <ul>
        <li>
          Données d'identification du Client : raison sociale, SIREN/RNA, adresse, nom et fonction
          du signataire
        </li>
        <li>Coordonnées : email, téléphone</li>
        <li>Données de facturation : montant, date, références bancaires</li>
        <li>Données de connexion : adresse IP, user-agent, journaux d'accès</li>
      </ul>
      <p>
        <strong>Dans le Service (sous-traitance pour le compte du Client)</strong> :
      </p>
      <ul>
        <li>
          Identifiants des utilisateurs (administrateurs, éditeurs, contributeurs, adhérents) : nom,
          prénom, email, photo de profil (optionnel)
        </li>
        <li>Données d'adhésion : numéro d'adhérent, type de licence, opt-in newsletter</li>
        <li>
          Contenus créés : articles, médias (photos, vidéos), résultats de compétition uploadés par
          le Client
        </li>
        <li>Données de connexion et journaux d'audit</li>
        <li>
          Métadonnées d'usage du chatbot IA (formules Pulse et Sur mesure) : questions posées,
          réponses générées
        </li>
        <li>Date et heure du consentement RGPD</li>
      </ul>

      <h2>3. Finalités et bases légales</h2>
      <ul>
        <li>
          <strong>Exécution du contrat</strong> (art. 6.1.b RGPD) — gestion des comptes, accès au
          Service, facturation, support.
        </li>
        <li>
          <strong>Intérêt légitime</strong> (art. 6.1.f RGPD) — sécurité du Service, prévention de la
          fraude, statistiques internes anonymisées.
        </li>
        <li>
          <strong>Consentement</strong> (art. 6.1.a RGPD) — recueilli auprès des adhérents et
          visiteurs pour leur inscription à la newsletter et l'utilisation de cookies non essentiels.
        </li>
        <li>
          <strong>Obligation légale</strong> (art. 6.1.c RGPD) — conservation des factures et
          obligations comptables.
        </li>
      </ul>

      <h2>4. Durée de conservation</h2>
      <ul>
        <li>
          Données de comptes actifs : pendant toute la durée de l'abonnement, puis suppression dans
          un délai de trente (30) jours suivant la résiliation.
        </li>
        <li>Médias et contenus uploadés : selon la politique d'archivage du Client (paramétrable).</li>
        <li>Données de facturation : 10 ans (obligation comptable et fiscale).</li>
        <li>Journaux de connexion : 12 mois maximum.</li>
        <li>Demandes via le formulaire de contact : 3 ans.</li>
      </ul>

      <h2>5. Destinataires et sous-traitants ultérieurs</h2>
      <p>
        Vos données peuvent être transmises aux sous-traitants suivants, sélectionnés pour leurs
        garanties en matière de sécurité et conformité RGPD :
      </p>
      <ul>
        <li>
          <strong>Railway Corp.</strong> (États-Unis) — hébergement de l'application. Transferts
          encadrés par les Clauses Contractuelles Types (CCT) de la Commission européenne.
        </li>
        <li>
          <strong>Amazon Web Services (AWS S3)</strong> — stockage des médias en Europe (région
          eu-north-1, Stockholm).
        </li>
        <li>
          <strong>Mailjet</strong> (France, groupe OVH) — envoi des emails transactionnels (contact,
          newsletter).
        </li>
        <li>
          <strong>Fournisseur d'IA générative</strong> — uniquement pour les formules Pulse et Sur
          mesure : traitement des questions posées au chatbot et génération de réponses sur la base
          des Q/R officielles définies par le Client. Aucune donnée personnelle d'adhérent n'est
          volontairement transmise dans les prompts.
        </li>
      </ul>
      <p>CGC ne vend ni ne cède les données à des tiers à des fins commerciales.</p>

      <h2>6. Sécurité</h2>
      <ul>
        <li>Mots de passe stockés sous forme de hash (bcrypt).</li>
        <li>Chiffrement TLS sur toutes les communications, HSTS activé.</li>
        <li>Chiffrement des champs sensibles en base de données (clés Fernet).</li>
        <li>Limitation des tentatives de connexion (rate limiting par IP).</li>
        <li>Politique de sécurité des contenus (CSP) restrictive.</li>
        <li>Hébergement et stockage en Europe pour les médias.</li>
        <li>Honeypot et validation Zod sur tous les formulaires publics.</li>
      </ul>

      <h2>7. Vos droits</h2>
      <p>Conformément au RGPD, toute personne concernée dispose des droits suivants :</p>
      <ul>
        <li>
          <strong>Droit d'accès</strong> — obtenir une copie des données la concernant.
        </li>
        <li>
          <strong>Droit de rectification</strong> — corriger les données inexactes via le profil ou
          par demande.
        </li>
        <li>
          <strong>Droit à l'effacement</strong> — demander la suppression du compte et des données
          associées.
        </li>
        <li>
          <strong>Droit à la portabilité</strong> — recevoir ses données dans un format structuré et
          lisible.
        </li>
        <li>
          <strong>Droit d'opposition</strong> — s'opposer à certains traitements fondés sur l'intérêt
          légitime.
        </li>
        <li>
          <strong>Droit à la limitation</strong> — demander la limitation temporaire du traitement.
        </li>
        <li>
          <strong>Droit de retrait du consentement</strong> — à tout moment, sans effet rétroactif.
        </li>
      </ul>
      <p>
        Pour exercer ces droits, écrire à <a href="mailto:contact@web-pulse.fr">contact@web-pulse.fr</a>.
        Une réponse est apportée dans un délai maximal d'un mois. À défaut de réponse satisfaisante,
        une réclamation peut être adressée à la{' '}
        <a href="https://www.cnil.fr" target="_blank" rel="noopener">CNIL</a>.
      </p>
      <p>
        Les adhérents et visiteurs des sites Clients doivent en priorité s'adresser à l'administrateur
        de leur club ou fédération (responsable de traitement).
      </p>

      <h2>8. Cookies</h2>
      <p>
        Le site vitrine et les sites Clients utilisent uniquement des cookies strictement nécessaires
        au fonctionnement (cookie de session JWT, cookie CSRF, cookie de préférence linguistique).
        Aucun cookie de tracking publicitaire ou tiers n'est déposé. Si le Client active Google
        Analytics 4 (formules Pulse et Sur mesure), un bandeau de consentement RGPD-compliant est
        affiché.
      </p>

      <h2>9. Modification de la présente politique</h2>
      <p>
        CGC se réserve la possibilité de modifier la présente politique afin de l'adapter à toute
        évolution légale, jurisprudentielle ou technique. Les modifications substantielles seront
        notifiées aux Clients par email avec un préavis de trente (30) jours.
      </p>

      <p className="mt-10 p-4 bg-slate-800/50 rounded-lg text-sm text-slate-400">
        Délégué à la protection des données (DPO) : non désigné à ce jour. Contact unique pour toute
        question relative à la protection des données :{' '}
        <a href="mailto:contact@web-pulse.fr">contact@web-pulse.fr</a>.
      </p>
    </LegalLayout>
  )
}
