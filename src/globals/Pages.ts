import type { GlobalConfig } from 'payload'

// Page d'accueil
export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Page d\'accueil',
  admin: { group: 'Pages' },
  fields: [
    {
      name: 'heroTitle',
      type: 'text',
      label: 'Titre hero',
      defaultValue: 'Bienvenue au Club de Voile',
    },
    {
      name: 'heroSubtitle',
      type: 'textarea',
      label: 'Sous-titre hero',
      defaultValue: 'Voile légère, compétition, stages pour tous niveaux.',
    },
    {
      name: 'heroCtaLabel',
      type: 'text',
      label: 'Bouton principal',
      defaultValue: 'Voir nos stages',
    },
    {
      name: 'heroCtaSecondaryLabel',
      type: 'text',
      label: 'Bouton secondaire',
      defaultValue: 'Découvrir le club',
    },
    {
      name: 'activitiesTitle',
      type: 'text',
      label: 'Titre section activités',
      defaultValue: 'Nos supports nautiques',
    },
    {
      name: 'stagesTitle',
      type: 'text',
      label: 'Titre section stages',
      defaultValue: 'Prochains stages',
    },
    {
      name: 'meteoEnabled',
      type: 'checkbox',
      label: 'Afficher le widget météo',
      defaultValue: true,
    },
    {
      name: 'mapEnabled',
      type: 'checkbox',
      label: 'Afficher la carte',
      defaultValue: true,
    },
    {
      name: 'joinBadge',
      type: 'text',
      label: 'Section "Rejoindre" — badge',
      defaultValue: '⚓ Rejoignez-nous',
      admin: { description: 'Ex: ⚓ Rejoignez-nous' },
    },
    {
      name: 'joinTitle',
      type: 'text',
      label: 'Section "Rejoindre" — titre (après "Prenez le large avec")',
      defaultValue: 'Prenez le large avec',
    },
    {
      name: 'joinSubtitle',
      type: 'textarea',
      label: 'Section "Rejoindre" — sous-titre',
      defaultValue: 'Du premier bord à la régate, nous accompagnons tous les navigateurs. Licences, stages, location de bateaux — tout est ici.',
    },
    {
      name: 'joinPerks',
      type: 'array',
      label: 'Section "Rejoindre" — arguments (✅)',
      fields: [
        { name: 'label', type: 'text', label: 'Argument', required: true },
      ],
      defaultValue: [
        { label: 'École Française de Voile' },
        { label: 'Moniteurs diplômés' },
        { label: 'Flotte entretenue' },
        { label: 'Dès 7 ans' },
      ],
    },
    {
      name: 'joinCtaTitle',
      type: 'text',
      label: 'Carte "Essai" — titre',
      defaultValue: 'Essai gratuit',
    },
    {
      name: 'joinCtaText',
      type: 'textarea',
      label: 'Carte "Essai" — texte',
      defaultValue: 'Venez découvrir la voile lors d\'une séance découverte offerte pour les nouveaux adhérents.',
    },
    {
      name: 'joinCtaBtn',
      type: 'text',
      label: 'Carte "Essai" — bouton',
      defaultValue: 'Réserver ma séance',
    },
  ],
}

// Page Activités
export const ActivitesPage: GlobalConfig = {
  slug: 'activites-page',
  label: 'Page Activités',
  admin: { group: 'Pages' },
  fields: [
    { name: 'heroTitle', type: 'text', label: 'Titre', defaultValue: 'Nos activités nautiques' },
    { name: 'heroSubtitle', type: 'text', label: 'Sous-titre', defaultValue: 'Voile, kayak, foil — une pratique pour chaque profil' },
    {
      name: 'activities',
      type: 'array',
      label: 'Activités',
      fields: [
        { name: 'slug', type: 'text', label: 'Identifiant (slug)', required: true, admin: { description: 'Ex: optimist, laser, catamaran' } },
        { name: 'icon', type: 'text', label: 'Emoji / icône', defaultValue: '⛵' },
        { name: 'name', type: 'text', label: 'Nom', required: true },
        { name: 'age', type: 'text', label: 'Public / âge', defaultValue: 'Tous âges' },
        { name: 'level', type: 'text', label: 'Niveau(x)', defaultValue: 'Initiation → Perfectionnement' },
        { name: 'description', type: 'textarea', label: 'Description courte' },
        { name: 'color', type: 'text', label: 'Couleur accent (hex)', defaultValue: '#1d6fa4' },
        {
          name: 'showPricing',
          type: 'checkbox',
          label: 'Afficher les tarifs',
          defaultValue: true,
        },
        {
          type: 'row',
          fields: [
            { name: 'priceHour', type: 'number', label: 'Tarif / heure (€)' },
            { name: 'priceHalfDay', type: 'number', label: 'Tarif demi-journée (€)' },
            { name: 'priceFullDay', type: 'number', label: 'Tarif journée (€)' },
          ],
        },
        { name: 'priceNote', type: 'text', label: 'Note tarifaire', admin: { description: 'Ex: Équipement inclus' } },
      ],
      defaultValue: [
        { slug: 'optimist', icon: '⛵', name: 'Optimist', age: 'Dès 7 ans', level: 'Initiation', description: "Le dériveur monotype par excellence pour apprendre la voile.", color: '#0ea5e9', showPricing: true, priceHour: 15, priceHalfDay: 30, priceFullDay: 50, priceNote: 'Encadrement inclus' },
        { slug: 'deriveur', icon: '🚤', name: 'Dériveur', age: 'Dès 12 ans', level: 'Initiation → Compétition', description: 'Laser ILCA, 420, RS Feva — des bateaux légers pour progresser rapidement.', color: '#2dd4bf', showPricing: true, priceHour: 18, priceHalfDay: 35, priceFullDay: 60, priceNote: '' },
        { slug: 'catamaran', icon: '🌊', name: 'Catamaran', age: 'Dès 14 ans', level: 'Initiation → Perfectionnement', description: 'Vitesse, sensations et navigation en équipage.', color: '#f0b429', showPricing: true, priceHour: 25, priceHalfDay: 45, priceFullDay: 80, priceNote: 'Pour 2 personnes' },
        { slug: 'planche', icon: '🏄', name: 'Planche à voile', age: 'Dès 10 ans', level: 'Initiation → Perfectionnement', description: "Windsurf, planche à voile initiation. Équilibre, technique et liberté sur l'eau.", color: '#a78bfa', showPricing: true, priceHour: 15, priceHalfDay: 28, priceFullDay: 45, priceNote: '' },
        { slug: 'foil', icon: '✈️', name: 'Foil & Wing Foil', age: 'Dès 16 ans', level: 'Perfectionnement', description: 'La glisse ultime : voler au-dessus de l\'eau.', color: '#f472b6', showPricing: true, priceHour: 35, priceHalfDay: 60, priceFullDay: 100, priceNote: 'Niveau requis : intermédiaire' },
        { slug: 'croisiere', icon: '⚓', name: 'Voile habitable', age: 'Adultes', level: 'Initiation → Croisière', description: 'Navigation hauturière, stages croisière côtière. Permis côtier inclus.', color: '#4ade80', showPricing: true, priceHour: null, priceHalfDay: 80, priceFullDay: 150, priceNote: 'Sur réservation' },
        { slug: 'kayak', icon: '🛶', name: 'Kayak & SUP', age: 'Tous âges', level: 'Loisir', description: 'Kayak de mer et stand up paddle pour découvrir le littoral.', color: '#fb923c', showPricing: true, priceHour: 12, priceHalfDay: 22, priceFullDay: 38, priceNote: '' },
        { slug: 'yole', icon: '🚣', name: 'Yole', age: 'Dès 10 ans', level: 'Initiation', description: 'Navigation en équipage sur embarcation traditionnelle.', color: '#60a5fa', showPricing: true, priceHour: 10, priceHalfDay: 20, priceFullDay: 35, priceNote: 'En groupe' },
      ],
    },
    { name: 'pricingNote', type: 'text', label: 'Note générale tarifs', defaultValue: 'Tarifs réservés aux adhérents. Équipement de sécurité fourni.' },
    { name: 'introTitle', type: 'text', label: 'Titre intro', defaultValue: 'Tous les niveaux, tous les supports' },
    { name: 'introSubtitle', type: 'textarea', label: 'Sous-titre intro', defaultValue: 'Du premier bord en Optimist à la navigation hauturière, notre club propose une gamme complète d\'activités nautiques encadrées par des moniteurs diplômés d\'État.' },
    { name: 'efvTitle', type: 'text', label: 'Titre section EFV', defaultValue: 'Label École Française de Voile' },
    { name: 'efvSubtitle', type: 'textarea', label: 'Sous-titre section EFV', defaultValue: 'Notre club est labellisé EFV par la Fédération Française de Voile, garantissant une pédagogie adaptée, des moniteurs qualifiés et des bateaux entretenus.' },
    {
      name: 'efvFeatures',
      type: 'array',
      label: 'Atouts EFV',
      fields: [
        { name: 'icon', type: 'text', label: 'Emoji' },
        { name: 'title', type: 'text', label: 'Titre', required: true },
        { name: 'desc', type: 'text', label: 'Description' },
      ],
      defaultValue: [
        { icon: '🎓', title: 'Moniteurs diplômés', desc: 'BPJEPS, DE Voile, CQP Initiateur — un encadrement qualifié à chaque étape.' },
        { icon: '⛵', title: 'Flotte entretenue', desc: 'Bateaux révisés chaque saison, équipements de sécurité conformes FFVoile.' },
        { icon: '📋', title: 'Progression validée', desc: 'Carnet de voile FFVoile, passages de niveaux certifiés par les moniteurs.' },
        { icon: '🏅', title: 'Filière compétition', desc: 'Suivi individualisé pour les jeunes talents, déplacements organisés.' },
      ],
    },
  ],
}

// Page Tarifs
export const TarifsPage: GlobalConfig = {
  slug: 'tarifs-page',
  label: 'Page Tarifs',
  admin: { group: 'Pages' },
  fields: [
    { name: 'heroTitle', type: 'text', label: 'Titre', defaultValue: 'Tarifs & Adhésions' },
    { name: 'heroSubtitle', type: 'text', label: 'Sous-titre', defaultValue: 'Rejoignez-nous pour la saison' },
    {
      name: 'memberships',
      type: 'array',
      label: 'Cotisations',
      fields: [
        { name: 'type', type: 'text', label: 'Type d\'adhésion', required: true },
        { name: 'price', type: 'number', label: 'Prix annuel (€)', required: true },
        { name: 'description', type: 'text', label: 'Description' },
      ],
      defaultValue: [
        { type: 'Enfant (- 18 ans)', price: 180, description: 'Licence FFVoile incluse, assurance, accès aux cours collectifs' },
        { type: 'Adulte', price: 250, description: 'Licence FFVoile incluse, assurance, accès aux cours collectifs' },
        { type: 'Famille (2 adultes + enfants)', price: 420, description: 'Licence FFVoile pour chaque membre, tarif dégressif' },
        { type: 'Compétition', price: 320, description: 'Accès aux entraînements compétition + prise en charge déplacements régionaux' },
        { type: 'Loisir (sans licence)', price: 90, description: 'Accès limité aux sorties encadrées' },
      ],
    },
    {
      name: 'boatRentals',
      type: 'array',
      label: 'Location de bateaux',
      admin: { description: 'Visible uniquement si le module "Location de bateaux" est activé dans le club' },
      fields: [
        { name: 'boat', type: 'text', label: 'Type de bateau', required: true },
        { name: 'halfDay', type: 'number', label: 'Demi-journée (€)', required: true },
        { name: 'fullDay', type: 'number', label: 'Journée complète (€)', required: true },
      ],
      defaultValue: [
        { boat: 'Optimist', halfDay: 30, fullDay: 50 },
        { boat: 'Laser ILCA 6', halfDay: 40, fullDay: 70 },
        { boat: 'Catamaran (Hobie Cat)', halfDay: 60, fullDay: 100 },
        { boat: 'Dériveur 420', halfDay: 45, fullDay: 75 },
        { boat: 'Planche à voile', halfDay: 35, fullDay: 55 },
      ],
    },
    {
      name: 'financialAids',
      type: 'array',
      label: 'Aides financières',
      fields: [
        { name: 'label', type: 'text', label: 'Nom de l\'aide', required: true },
        { name: 'description', type: 'text', label: 'Description' },
      ],
      defaultValue: [
        { label: 'Pass Sport (gouvernement)', description: '50 € déduits sur la cotisation pour les jeunes éligibles' },
        { label: 'Coupon Sport CAF', description: 'Accepté pour les familles allocataires' },
        { label: 'Chèques Vacances ANCV', description: 'Acceptés pour les stages et la location' },
        { label: 'Tarif solidaire', description: 'Contactez-nous pour les situations particulières' },
      ],
    },
    { name: 'rentalNote', type: 'text', label: 'Note location', defaultValue: 'Réservation 48h à l\'avance. Permis bateau requis pour les dériveurs.' },
  ],
}

// Page Le Club
export const ClubPage: GlobalConfig = {
  slug: 'club-page',
  label: 'Page Le Club',
  admin: { group: 'Pages' },
  fields: [
    { name: 'heroTitle', type: 'text', label: 'Titre', defaultValue: 'Le Club' },
    { name: 'heroSubtitle', type: 'text', label: 'Sous-titre', defaultValue: 'Une passion partagée pour la voile depuis plus de 20 ans' },
    { name: 'historyTitle', type: 'text', label: 'Titre section histoire', defaultValue: 'Notre histoire' },
    { name: 'historyContent', type: 'richText', label: 'Contenu histoire' },
    {
      name: 'team',
      type: 'array',
      label: 'Équipe',
      fields: [
        { name: 'name', type: 'text', label: 'Nom', required: true },
        { name: 'role', type: 'text', label: 'Poste' },
        { name: 'diploma', type: 'text', label: 'Diplôme' },
        { name: 'icon', type: 'text', label: 'Emoji', defaultValue: '👤' },
      ],
      defaultValue: [
        { name: 'Marc Durand',   role: 'Directeur technique',  diploma: 'DE Voile',         icon: '👨‍✈️' },
        { name: 'Sophie Martin', role: 'Monitrice principale',  diploma: 'BPJEPS Voile',     icon: '👩‍✈️' },
        { name: 'Thomas Leroy',  role: 'Moniteur compétition',  diploma: 'BPJEPS Voile',     icon: '👨‍✈️' },
        { name: 'Emma Bernard',  role: 'Monitrice jeunes',      diploma: 'CQP Initiateur',   icon: '👩‍✈️' },
      ],
    },
    {
      name: 'partners',
      type: 'array',
      label: 'Partenaires',
      fields: [
        { name: 'name', type: 'text', label: 'Nom', required: true },
        { name: 'url', type: 'text', label: 'Site web' },
      ],
      defaultValue: [
        { name: 'Partenaire Principal', url: '' },
        { name: 'Sponsor Or',          url: '' },
        { name: 'Sponsor Argent',      url: '' },
        { name: 'Partenaire local',    url: '' },
      ],
    },
  ],
}

// Page Compétition
export const CompetitionPage: GlobalConfig = {
  slug: 'competition-page',
  label: 'Page Compétition',
  admin: { group: 'Pages' },
  fields: [
    { name: 'heroTitle', type: 'text', label: 'Titre', defaultValue: 'Compétition' },
    { name: 'heroSubtitle', type: 'text', label: 'Sous-titre', defaultValue: 'Régatez sous les couleurs du club' },
    {
      name: 'stats',
      type: 'array',
      label: 'Chiffres clés',
      fields: [
        { name: 'value', type: 'text', label: 'Valeur', required: true },
        { name: 'label', type: 'text', label: 'Label', required: true },
      ],
      defaultValue: [
        { value: '4+',      label: 'régates organisées par an' },
        { value: '10+',     label: 'podiums en 2025' },
        { value: '3',       label: 'catégories compétitives' },
        { value: 'FFVoile', label: 'affilié & homologué' },
      ],
    },
    {
      name: 'races',
      type: 'array',
      label: 'Calendrier des régates',
      fields: [
        { name: 'name',     type: 'text', label: 'Nom de la régate', required: true },
        { name: 'date',     type: 'text', label: 'Date affichée', admin: { description: 'Ex: 5 avr. 2026' } },
        { name: 'location', type: 'text', label: 'Lieu' },
        { name: 'category', type: 'text', label: 'Catégorie' },
        {
          name: 'status', type: 'select', label: 'Statut', defaultValue: 'upcoming',
          options: [{ label: 'À venir', value: 'upcoming' }, { label: 'Passée', value: 'past' }],
        },
        { name: 'norUrl', type: 'text', label: 'URL Notice de course (NOR)' },
      ],
      defaultValue: [
        { name: 'Championnat départemental Optimist',   date: '5 avr. 2026',  location: 'Notre port',   category: 'Optimist',  status: 'upcoming', norUrl: '' },
        { name: 'Régate de printemps — Série habitable',date: '19 avr. 2026', location: 'Notre port',   category: 'Habitable', status: 'upcoming', norUrl: '' },
        { name: 'Championnat de ligue Laser ILCA',      date: '3 mai 2026',   location: 'Déplacement',  category: 'Laser',     status: 'upcoming', norUrl: '' },
        { name: 'Coupe du club — Catamaran',            date: '17 mai 2026',  location: 'Notre port',   category: 'Catamaran', status: 'upcoming', norUrl: '' },
        { name: 'Grand Prix régional Optimist',         date: '14 mars 2026', location: 'Déplacement',  category: 'Optimist',  status: 'past',     norUrl: '' },
      ],
    },
    {
      name: 'palmares',
      type: 'array',
      label: 'Palmarès',
      fields: [
        { name: 'year',     type: 'number', label: 'Année', required: true },
        { name: 'title',    type: 'text',   label: 'Titre / résultat', required: true },
        { name: 'category', type: 'text',   label: 'Catégorie' },
      ],
      defaultValue: [
        { year: 2025, title: 'Champion régional Optimist — Thomas L.',   category: 'Optimist' },
        { year: 2025, title: 'Podium Championnat de France — Emma B.',   category: 'Laser ILCA' },
        { year: 2024, title: 'Champion départemental Catamaran',         category: 'Catamaran' },
        { year: 2024, title: 'Vainqueur coupe du club — série A',        category: 'Habitable' },
      ],
    },
    {
      name: 'trainingFeatures',
      type: 'array',
      label: 'Atouts filière compétition',
      fields: [
        { name: 'icon',  type: 'text', label: 'Emoji' },
        { name: 'title', type: 'text', label: 'Titre', required: true },
        { name: 'desc',  type: 'textarea', label: 'Description' },
      ],
      defaultValue: [
        { icon: '🎯', title: 'Entraînements ciblés',   desc: 'Séances techniques dédiées à la compétition, analyse vidéo, réglages de bateaux.' },
        { icon: '📅', title: 'Calendrier de régates',  desc: 'Organisation des déplacements sur les régates départementales, régionales et nationales.' },
        { icon: '👥', title: 'Suivi individuel',       desc: 'Un moniteur référent par skipper, objectifs personnalisés saison par saison.' },
        { icon: '🏅', title: 'Détection de talents',  desc: 'Lien direct avec la ligue régionale pour les espoirs et les pôles France.' },
      ],
    },
    { name: 'joinTitle', type: 'text', label: 'Titre section "Rejoindre la filière"', defaultValue: 'Rejoindre la filière compétition' },
    { name: 'joinSubtitle', type: 'textarea', label: 'Sous-titre section "Rejoindre la filière"', defaultValue: 'Vous voulez vous dépasser et mesurer votre niveau ? Notre encadrement compétition vous accompagne de la première régate au niveau national.' },
  ],
}

// Page Nous trouver
export const NousTrouverPage: GlobalConfig = {
  slug: 'nous-trouver-page',
  label: 'Page Nous trouver',
  admin: { group: 'Pages' },
  fields: [
    { name: 'heroTitle',    type: 'text', label: 'Titre',      defaultValue: 'Nous trouver' },
    { name: 'heroSubtitle', type: 'text', label: 'Sous-titre', defaultValue: 'Venez naviguer avec nous' },
    { name: 'mapEmbedUrl',  type: 'text', label: 'URL iframe Google Maps', admin: { description: 'Coller l\'URL d\'intégration depuis Google Maps → Partager → Intégrer' } },
    { name: 'directionsUrl',type: 'text', label: 'Lien itinéraire Google Maps' },
    {
      name: 'accessModes',
      type: 'array',
      label: 'Modes d\'accès',
      fields: [
        { name: 'icon',  type: 'text', label: 'Emoji', defaultValue: '🚗' },
        { name: 'label', type: 'text', label: 'Moyen', required: true },
        { name: 'desc',  type: 'text', label: 'Description' },
      ],
      defaultValue: [
        { icon: '🚗', label: 'En voiture',  desc: 'Parking gratuit sur place. GPS : 43.2951° N, -0.3703° W' },
        { icon: '🚌', label: 'En bus',      desc: 'Ligne 7 direction Lac — arrêt "Promenade du Lac"' },
        { icon: '🚴', label: 'À vélo',      desc: 'Piste cyclable depuis le centre-ville. Parking vélos sécurisé.' },
        { icon: '⛵', label: 'Par la mer',  desc: 'Accès direct depuis le plan d\'eau. Bouées visiteurs disponibles.' },
      ],
    },
    {
      name: 'windguruStationId', type: 'text', label: 'ID station Windguru',
      admin: { description: 'Identifiant numérique de la station Windguru pour les prévisions' },
    },
    { name: 'weatherSpotName', type: 'text', label: 'Nom du spot météo', defaultValue: 'Lac de Pau' },
  ],
}

// Page Mentions légales
export const MentionsLegalesPage: GlobalConfig = {
  slug: 'mentions-legales-page',
  label: 'Page Mentions légales',
  admin: { group: 'Pages' },
  fields: [
    { name: 'heroTitle', type: 'text', label: 'Titre', defaultValue: 'Mentions légales' },
    { name: 'content', type: 'richText', label: 'Contenu' },
  ],
}

// Page Confidentialité
export const ConfidentialitePage: GlobalConfig = {
  slug: 'confidentialite-page',
  label: 'Page Confidentialité',
  admin: { group: 'Pages' },
  fields: [
    { name: 'heroTitle', type: 'text', label: 'Titre', defaultValue: 'Politique de confidentialité' },
    { name: 'content', type: 'richText', label: 'Contenu' },
  ],
}

// Page Contact
export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Page Contact',
  admin: { group: 'Pages' },
  fields: [
    { name: 'heroTitle', type: 'text', label: 'Titre', defaultValue: 'Nous contacter' },
    { name: 'heroSubtitle', type: 'text', label: 'Sous-titre', defaultValue: "Une question ? L'équipe vous répond sous 48h" },
    { name: 'formTitle', type: 'text', label: 'Titre formulaire', defaultValue: 'Envoyer un message' },
    { name: 'recipientEmail', type: 'email', label: 'Email destinataire', defaultValue: 'contact@club-voile.fr' },
  ],
}
