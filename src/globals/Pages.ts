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
    { name: 'teamTitle', type: 'text', label: 'Titre section équipe', defaultValue: 'Notre équipe' },
    { name: 'partnersTitle', type: 'text', label: 'Titre section partenaires', defaultValue: 'Nos partenaires' },
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
