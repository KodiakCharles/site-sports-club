/**
 * Base de connaissances par défaut, injectée à la création d'un club.
 * ~25-30 entrées par sport pour éviter le cold-start du chatbot LLM.
 *
 * Ces entrées sont génériques. Le club admin peut les éditer/supprimer ensuite.
 */

import type { Sport } from './sportConfig'

export type KBSeed = {
  question: string
  answer: string
  category:
    | 'general'
    | 'inscription'
    | 'stages'
    | 'competition'
    | 'tarifs'
    | 'materiel'
    | 'acces'
    | 'securite'
    | 'autre'
  keywords?: string
}

const COMMON: KBSeed[] = [
  {
    question: 'Quels sont les horaires d\'ouverture du club ?',
    answer:
      "Les horaires varient selon la saison et les activités. Consultez la page Contact ou Nous trouver pour les horaires d'accueil. Pour les entraînements et stages, voir la page dédiée.",
    category: 'acces',
    keywords: 'horaires, ouverture, accueil',
  },
  {
    question: 'Comment vous contacter ?',
    answer:
      "Vous trouverez nos coordonnées (email, téléphone, adresse) sur la page Contact. Nous répondons généralement sous 48h ouvrées.",
    category: 'general',
    keywords: 'contact, email, téléphone, adresse',
  },
  {
    question: 'Où se trouve le club ?',
    answer:
      "L'adresse complète et l'itinéraire sont sur la page Nous trouver, avec une carte Google Maps interactive.",
    category: 'acces',
    keywords: 'adresse, plan, itinéraire, carte',
  },
  {
    question: "Comment s'inscrire ?",
    answer:
      "L'inscription se fait via notre plateforme HelloAsso, accessible depuis la page Tarifs. Remplissez le formulaire en ligne, joignez les documents demandés, et payez en ligne. Confirmation par email.",
    category: 'inscription',
    keywords: 'inscription, helloasso, paiement',
  },
  {
    question: 'Quels documents pour inscrire mon enfant ?',
    answer:
      "Pour les mineurs : autorisation parentale, certificat médical de non-contre-indication à la pratique du sport (validité 1 an), photo d'identité, attestation responsabilité civile et règlement de la cotisation.",
    category: 'inscription',
    keywords: 'documents, certificat médical, mineur, enfant',
  },
  {
    question: 'Acceptez-vous les paiements échelonnés ?',
    answer:
      "Oui, HelloAsso permet le paiement en plusieurs fois (généralement 3x sans frais). Pour des modalités particulières, contactez le secrétariat.",
    category: 'tarifs',
    keywords: 'paiement, échelonné, plusieurs fois',
  },
  {
    question: 'Y a-t-il des aides financières ?',
    answer:
      "Le club accepte le Pass\u2019Sport (50€ pour les jeunes de 6 à 17 ans), les coupons sport ANCV, et certaines collectivités proposent des aides locales. Renseignez-vous auprès de votre mairie ou du secrétariat.",
    category: 'tarifs',
    keywords: 'aide, pass sport, ancv, financement',
  },
  {
    question: 'Comment annuler ou se faire rembourser ?',
    answer:
      "Les conditions de remboursement sont précisées dans le règlement intérieur du club. Contactez le secrétariat avec votre demande motivée.",
    category: 'inscription',
    keywords: 'annulation, remboursement',
  },
  {
    question: 'Le club organise-t-il des événements ouverts au public ?',
    answer:
      "Oui, plusieurs événements annuels (portes ouvertes, journée découverte, gala) sont ouverts à tous. Consultez la page Actualités pour les prochaines dates.",
    category: 'general',
    keywords: 'événement, portes ouvertes, journée découverte',
  },
  {
    question: 'Comment recevoir la newsletter ?',
    answer:
      "Inscrivez votre email dans le formulaire newsletter en bas de chaque page. Vous recevrez ~1 email par mois avec les actualités du club. Désinscription en 1 clic.",
    category: 'general',
    keywords: 'newsletter, email, abonnement',
  },
  {
    question: 'Le club recrute-t-il des bénévoles ?',
    answer:
      "Oui, le club fonctionne grâce à ses bénévoles. Contactez le bureau via la page Contact, en précisant vos disponibilités et compétences.",
    category: 'general',
    keywords: 'bénévole, bureau, aide',
  },
]

const VOILE_SPECIFIC: KBSeed[] = [
  {
    question: 'À partir de quel âge peut-on commencer la voile ?',
    answer:
      "Dès 7 ans en Optimist, le bateau d'initiation conçu pour les enfants. Pour les ados et adultes, plusieurs supports sont accessibles (Laser, catamaran, planche à voile, wingfoil).",
    category: 'inscription',
    keywords: 'âge, optimist, enfant, débutant',
  },
  {
    question: 'Faut-il savoir nager ?',
    answer:
      "Oui, savoir nager 25 mètres et s\u2019immerger est obligatoire pour la pratique. Une attestation peut vous être demandée (test au club ou certificat de natation).",
    category: 'securite',
    keywords: 'nager, natation, savoir nager, sécurité',
  },
  {
    question: 'Comment obtenir ma licence FFVoile ?',
    answer:
      "La licence FFVoile est incluse dans la cotisation annuelle. Elle est délivrée automatiquement à l'inscription et inclut l'assurance pratiquant.",
    category: 'inscription',
    keywords: 'licence, ffvoile, fédération',
  },
  {
    question: 'Que fournit le club ?',
    answer:
      "Le club fournit les bateaux, les gilets de sauvetage, les combinaisons (selon disponibilité) et tout l'équipement de sécurité. Prévoyez : tenue de bain, chaussures fermées qui peuvent aller à l'eau, vêtements chauds, lunettes de soleil, crème solaire.",
    category: 'materiel',
    keywords: 'équipement, gilet, combinaison, fournit',
  },
  {
    question: 'Quels supports proposez-vous ?',
    answer:
      "Cela dépend de la flotte du club. Consultez la page Activités et la liste des stages disponibles pour voir les supports proposés (Optimist, Laser ILCA, catamaran, planche à voile, wingfoil, croisière, etc.).",
    category: 'materiel',
    keywords: 'supports, optimist, laser, catamaran, wingfoil',
  },
  {
    question: "Y a-t-il des stages pendant les vacances scolaires ?",
    answer:
      "Oui, nous proposons des stages à chaque période de vacances scolaires (Toussaint, Noël, Hiver, Printemps, Été). Consultez la page Stages pour les dates et disponibilités.",
    category: 'stages',
    keywords: 'stage, vacances, toussaint, été',
  },
  {
    question: 'Quelles conditions météo pour naviguer ?',
    answer:
      "Le club décide de la sortie en fonction du vent, de l'état de la mer et du niveau des stagiaires. En général, on navigue jusqu'à 25 nœuds. Au-delà, le directeur technique peut annuler. Consultez le widget météo Windguru en bas de page.",
    category: 'securite',
    keywords: 'météo, vent, conditions, annulation',
  },
  {
    question: 'Le club organise-t-il des régates ?',
    answer:
      "Oui, le club organise plusieurs régates dans l'année et participe aux championnats départementaux et de ligue. Consultez la page Compétition pour le calendrier.",
    category: 'competition',
    keywords: 'régate, championnat, compétition',
  },
  {
    question: 'Comment progresser en compétition ?',
    answer:
      "La filière compétition est ouverte aux licenciés à partir de la fin de l'initiation. Entraînements spécifiques, suivi technique, encadrement par un entraîneur diplômé. Contactez le responsable compétition pour rejoindre.",
    category: 'competition',
    keywords: 'compétition, progresser, filière, entraînement',
  },
  {
    question: 'Peut-on louer un bateau ?',
    answer:
      "Si le module location est activé sur le site, oui. Consultez la page Tarifs pour les prix de location à la demi-journée et à la journée. Skipper diplômé requis pour l'habitable.",
    category: 'materiel',
    keywords: 'location, bateau, prix',
  },
  {
    question: "Qu'est-ce que le carnet de progression FFVoile ?",
    answer:
      "Le carnet de voile FFVoile permet de valider les niveaux techniques (Pass'voile, niveaux 1 à 5). Les moniteurs certifient les acquis lors des stages. C'est un suivi officiel reconnu par la fédération.",
    category: 'general',
    keywords: 'carnet, progression, niveau, ffvoile',
  },
  {
    question: 'Avez-vous une section handivoile ?',
    answer:
      "Renseignez-vous au club. Plusieurs clubs FFVoile sont équipés Hansa 303 et accueillent les pratiquants en situation de handicap.",
    category: 'general',
    keywords: 'handivoile, handicap, hansa, accessible',
  },
]

const RUGBY_SPECIFIC: KBSeed[] = [
  {
    question: 'À partir de quel âge peut-on commencer le rugby ?',
    answer:
      "L'école de rugby accueille les enfants dès 6 ans (catégorie U8). Le rugby éducatif (sans contact) jusqu'à U10, puis introduction progressive au plaquage.",
    category: 'inscription',
    keywords: 'âge, école rugby, U6, U8, baby-rugby, débutant',
  },
  {
    question: 'Le certificat médical est-il obligatoire ?',
    answer:
      "Oui. Pour les compétiteurs : certificat de non-contre-indication à la pratique du rugby en compétition, valable 3 ans si renouvellement sans interruption. Pour le rugby loisir/éducatif : certificat plus simple, ou questionnaire santé selon âge.",
    category: 'inscription',
    keywords: 'certificat médical, licence, visite, santé',
  },
  {
    question: 'Comment obtenir ma licence FFR ?',
    answer:
      "La licence FFR est incluse dans la cotisation annuelle. Inscription via HelloAsso : formulaire + certificat médical + photo + paiement. La licence est délivrée par la FFR et activée sous quelques jours.",
    category: 'inscription',
    keywords: 'licence, ffr, fédération, affiliation',
  },
  {
    question: 'Faut-il un équipement particulier ?',
    answer:
      "Tenue de sport (short, t-shirt, chaussettes hautes), crampons rugby ou chaussures de sport adaptées au terrain, protège-dents (obligatoire pour le contact), gourde. Le club peut prêter casque souple et épaulières aux débutants.",
    category: 'materiel',
    keywords: 'équipement, crampons, protège-dents, casque',
  },
  {
    question: "Quelles catégories d'âge avez-vous ?",
    answer:
      "École de rugby (U6, U8, U10, U12, U14), Cadets (U16), Juniors (U19), Seniors masculins, Seniors féminines (selon section), Loisir adultes. Consultez la page Activités pour les créneaux par catégorie.",
    category: 'general',
    keywords: 'catégories, U8, U10, cadets, juniors, seniors',
  },
  {
    question: 'Acceptez-vous les joueurs sans expérience ?',
    answer:
      "Absolument. La majorité de nos licenciés débutent au club. Les premières séances sont consacrées aux bases (passe, placage en sécurité, règles) avant toute mise en situation de match.",
    category: 'inscription',
    keywords: 'débutant, sans expérience, niveau',
  },
  {
    question: 'Quand ont lieu les entraînements ?',
    answer:
      "Les créneaux varient par catégorie. École de rugby le mercredi après-midi et samedi matin en général. Seniors le mardi et jeudi soir. Consultez la page Activités pour les horaires précis.",
    category: 'general',
    keywords: 'entraînement, horaires, créneaux',
  },
  {
    question: 'Y a-t-il une section féminine ?',
    answer:
      "Renseignez-vous auprès du club. Beaucoup de clubs développent leur section féminine (école de rugby filles, cadettes, seniors). Consultez la page Activités.",
    category: 'general',
    keywords: 'féminin, filles, féminines',
  },
  {
    question: 'Le rugby est-il dangereux pour les enfants ?',
    answer:
      "Le rugby éducatif (jusqu'à U10) se pratique sans contact (toucher 2 secondes ou flag rugby). Le contact est introduit progressivement avec un encadrement diplômé. Le protège-dents est obligatoire dès l'introduction du plaquage.",
    category: 'securite',
    keywords: 'danger, sécurité, blessure, contact, plaquage',
  },
  {
    question: 'Comment se déroule une journée de match ?',
    answer:
      "Convocation envoyée en début de semaine (groupe WhatsApp ou newsletter). Match à domicile ou extérieur, durée 2x30 à 2x40 min selon catégorie. Goûter offert pour les jeunes, troisième mi-temps conviviale.",
    category: 'competition',
    keywords: 'match, journée, convocation, domicile',
  },
  {
    question: 'Le club a-t-il une équipe seniors compétitive ?',
    answer:
      "Oui, l'équipe seniors évolue dans le championnat de sa série. Calendrier et résultats consultables sur la page Compétition. Les nouveaux joueurs (avec niveau) sont les bienvenus aux entraînements seniors.",
    category: 'competition',
    keywords: 'seniors, compétition, championnat, équipe',
  },
  {
    question: 'Que faire en cas de blessure ?',
    answer:
      "La licence FFR inclut une assurance individuelle accident. En cas de blessure : déclaration via l'entraîneur ou le bureau, formulaire à remplir, prise en charge selon contrat. Consultez le bureau pour les démarches.",
    category: 'securite',
    keywords: 'blessure, assurance, accident, déclaration',
  },
  {
    question: "Le club organise-t-il des stages pendant les vacances ?",
    answer:
      "Oui, plusieurs clubs organisent des stages de pré-saison (août) et des stages techniques aux vacances scolaires. Consultez la page Stages pour les dates et inscriptions.",
    category: 'stages',
    keywords: 'stage, vacances, pré-saison',
  },
  {
    question: 'Le club a-t-il un buvette / club-house ?',
    answer:
      "Oui, le club-house est ouvert lors des matchs à domicile et entraînements. Sandwichs, boissons, troisième mi-temps. C'est le cœur de la vie associative.",
    category: 'general',
    keywords: 'buvette, club-house, troisième mi-temps',
  },
]

const PELOTE_SPECIFIC: KBSeed[] = [
  {
    question: 'À partir de quel âge peut-on commencer la pelote ?',
    answer:
      "Dès 6-7 ans en initiation (paleta gomme, poteau bas). Le matériel est adapté à la taille des enfants. L'âge minimum officiel FFPB pour le compétition est généralement 8 ans.",
    category: 'inscription',
    keywords: 'âge, enfant, débutant, initiation',
  },
  {
    question: 'Quelle discipline pour débuter ?',
    answer:
      "La paleta gomme est idéale : la pelote rebondit bien, le geste est simple à apprendre, peu de risque de blessure. On peut ensuite passer à la main nue, à la paleta cuir ou à la chistera selon ses affinités.",
    category: 'materiel',
    keywords: 'débutant, discipline, paleta gomme, première fois',
  },
  {
    question: 'Quelles disciplines pratiquez-vous ?',
    answer:
      "Cela dépend du club. Les disciplines courantes : main nue, paleta gomme, paleta cuir, chistera (grand gant), pala, xare, cesta punta, frontenis. Consultez la page Activités pour la liste exacte.",
    category: 'general',
    keywords: 'disciplines, main nue, chistera, paleta, cesta punta',
  },
  {
    question: 'Faut-il une licence FFPB pour jouer en compétition ?',
    answer:
      "Oui, la licence FFPB est obligatoire pour toute compétition officielle (championnat, tournoi). Elle est incluse dans la cotisation annuelle du club et inclut l'assurance.",
    category: 'inscription',
    keywords: 'licence, ffpb, fédération, compétition',
  },
  {
    question: 'Le club fournit-il le matériel ?',
    answer:
      "Pour les débutants et l'école de pelote, oui : pala, chistera, casque, lunettes de protection. Les compétiteurs ont généralement leur propre matériel (sur conseil des moniteurs).",
    category: 'materiel',
    keywords: 'matériel, pala, chistera, débutant',
  },
  {
    question: 'Peut-on louer le fronton pour jouer entre amis ?',
    answer:
      "Selon les frontons. Beaucoup de clubs proposent la réservation de créneaux (1h ou plus) pour les licenciés et parfois pour le public. Renseignez-vous au club ou consultez la page Tarifs.",
    category: 'acces',
    keywords: 'fronton, réservation, location, créneau, jouer',
  },
  {
    question: 'La pelote est-elle dangereuse ?',
    answer:
      "Toutes les disciplines de pelote demandent de la rigueur de sécurité. Lunettes de protection obligatoires en compétition pour chistera, cesta punta et pala. Casque recommandé pour la cesta punta. Formation progressive et encadrée.",
    category: 'securite',
    keywords: 'danger, sécurité, lunettes, casque, blessure',
  },
  {
    question: "Qu'est-ce que la cesta punta ?",
    answer:
      "La cesta punta (ou jai alai) se joue avec un grand gant en osier. La pelote peut atteindre 300 km/h. Discipline spectaculaire, pratiquée principalement dans les clubs spécialisés (Hendaye, Saint-Jean-de-Luz, Biarritz). Lunettes et casque obligatoires.",
    category: 'general',
    keywords: 'cesta punta, jai alai, vitesse, gant',
  },
  {
    question: 'Quelle différence entre paleta gomme et paleta cuir ?',
    answer:
      "La paleta gomme se joue avec une pelote en caoutchouc qui rebondit bien — idéale pour débuter. La paleta cuir utilise une pelote plus dure (en cuir, noyau de bois), plus rapide, plus technique. Chacune a ses championnats officiels.",
    category: 'materiel',
    keywords: 'paleta, gomme, cuir, différence',
  },
  {
    question: 'Y a-t-il des cours pour adultes débutants ?',
    answer:
      "Oui, plusieurs clubs proposent des créneaux adultes débutants. La pelote se commence à tout âge. Consultez la page Activités pour les créneaux dédiés.",
    category: 'inscription',
    keywords: 'adulte, débutant, cours',
  },
  {
    question: 'Le club organise-t-il des galas ou tournois ouverts au public ?',
    answer:
      "Oui, particulièrement en été : galas estivaux, tournois inter-clubs, démonstrations de cesta punta. Entrée souvent libre ou billetterie sur place. Consultez la page Actualités.",
    category: 'general',
    keywords: 'gala, tournoi, événement, public',
  },
  {
    question: 'Comment se déroule un championnat de pelote ?',
    answer:
      "Selon la discipline, championnat individuel (main nue) ou en équipe (paleta, chistera). Phases qualificatives par ligue (Côte Basque, Adour-Atlantique, etc.) puis phases finales nationales. Voir page Compétition pour le calendrier.",
    category: 'competition',
    keywords: 'championnat, ligue, compétition, phase',
  },
  {
    question: 'Le club a-t-il une école de pelote ?',
    answer:
      "Oui, l'école de pelote accueille les enfants à partir de 6-7 ans. Encadrement diplômé, matériel adapté, progression structurée. Cours hebdomadaires + stages aux vacances.",
    category: 'general',
    keywords: 'école de pelote, enfants, cours',
  },
  {
    question: 'Parle-t-on euskara au club ?',
    answer:
      "Selon le club. Beaucoup de clubs du Pays Basque utilisent l'euskara dans la vie quotidienne. Le site web peut être disponible en bilingue français/euskara (option à activer).",
    category: 'general',
    keywords: 'euskara, basque, langue',
  },
]

const KB_BY_SPORT: Record<Sport, KBSeed[]> = {
  voile: [...COMMON, ...VOILE_SPECIFIC],
  rugby: [...COMMON, ...RUGBY_SPECIFIC],
  'pelote-basque': [...COMMON, ...PELOTE_SPECIFIC],
}

/**
 * Retourne les Q/R par défaut à injecter dans la KB d'un club nouvellement créé.
 * ~25 entrées par sport (12 communes + 12-15 spécifiques).
 */
export function getDefaultKnowledgeBase(sport: Sport): KBSeed[] {
  return KB_BY_SPORT[sport] ?? KB_BY_SPORT.voile
}
