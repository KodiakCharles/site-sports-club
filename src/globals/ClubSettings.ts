import type { GlobalConfig } from 'payload'

const ClubSettings: GlobalConfig = {
  slug: 'club-settings',
  label: 'Paramètres du club',
  admin: {
    group: 'Configuration',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identité',
          fields: [
            {
              name: 'clubName',
              type: 'text',
              label: 'Nom du club',
              required: true,
              defaultValue: 'Club de Voile',
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo du club',
            },
            {
              name: 'logoText',
              type: 'text',
              label: 'Texte du logo (si pas d\'image)',
              defaultValue: 'ClubVoile',
            },
            {
              name: 'tagline',
              type: 'text',
              label: 'Accroche (hero)',
              defaultValue: 'Voile légère, compétition, stages pour tous niveaux.',
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Image hero (page d\'accueil)',
            },
          ],
        },
        {
          label: 'Couleurs',
          fields: [
            {
              name: 'primaryColor',
              type: 'text',
              label: 'Couleur principale',
              defaultValue: '#1d6fa4',
              admin: {
                description: 'Code hexadécimal ex: #1d6fa4',
                components: {},
              },
            },
            {
              name: 'secondaryColor',
              type: 'text',
              label: 'Couleur secondaire',
              defaultValue: '#2eb8e6',
              admin: { description: 'Code hexadécimal ex: #2eb8e6' },
            },
            {
              name: 'accentColor',
              type: 'text',
              label: 'Couleur d\'accentuation',
              defaultValue: '#f0b429',
              admin: { description: 'Code hexadécimal ex: #f0b429' },
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'address',
              type: 'text',
              label: 'Adresse',
              defaultValue: 'Port de plaisance, 00000 Votre-Ville',
            },
            {
              name: 'phone',
              type: 'text',
              label: 'Téléphone',
              defaultValue: '06 00 00 00 00',
            },
            {
              name: 'email',
              type: 'email',
              label: 'Email de contact',
              defaultValue: 'contact@club-voile.fr',
            },
            {
              name: 'gpsLat',
              type: 'number',
              label: 'Latitude GPS',
            },
            {
              name: 'gpsLng',
              type: 'number',
              label: 'Longitude GPS',
            },
            {
              type: 'row',
              fields: [
                { name: 'mondayFriday', type: 'text', label: 'Lun–Ven', defaultValue: '9h – 18h' },
                { name: 'saturday', type: 'text', label: 'Samedi', defaultValue: '9h – 13h' },
                { name: 'sunday', type: 'text', label: 'Dimanche', defaultValue: 'Fermé' },
              ],
            },
          ],
        },
        {
          label: 'Réseaux sociaux',
          fields: [
            { name: 'instagramUrl', type: 'text', label: 'Instagram (URL)' },
            { name: 'facebookUrl', type: 'text', label: 'Facebook (URL)' },
            { name: 'youtubeUrl', type: 'text', label: 'YouTube (URL)' },
            { name: 'tiktokUrl', type: 'text', label: 'TikTok (URL)' },
          ],
        },
        {
          label: 'Modules',
          fields: [
            { name: 'weatherWidget', type: 'checkbox', label: 'Widget météo (Windguru)', defaultValue: true },
            { name: 'boatRental', type: 'checkbox', label: 'Location de bateaux', defaultValue: false },
            { name: 'memberSpace', type: 'checkbox', label: 'Espace adhérent', defaultValue: true },
            { name: 'multilingual', type: 'checkbox', label: 'Multilingue EN + ES', defaultValue: true },
            { name: 'ffvoileIntegration', type: 'checkbox', label: 'Intégration API FFVoile', defaultValue: false },
            { name: 'windguruStationId', type: 'text', label: 'ID station Windguru' },
            { name: 'googleMapsApiKey', type: 'text', label: 'Clé API Google Maps' },
            { name: 'ga4MeasurementId', type: 'text', label: 'ID Google Analytics 4' },
            { name: 'helloassoUrl', type: 'text', label: 'URL HelloAsso du club' },
          ],
        },
        {
          label: 'Labels & certifications',
          fields: [
            { name: 'labelEfv', type: 'checkbox', label: 'École Française de Voile', defaultValue: true },
            { name: 'labelCompetition', type: 'checkbox', label: 'École de Compétition', defaultValue: false },
            { name: 'labelCroisiere', type: 'checkbox', label: 'École de Croisière', defaultValue: false },
            { name: 'founded', type: 'number', label: 'Année de création', defaultValue: 2001 },
            { name: 'membersCount', type: 'number', label: 'Nombre de licenciés', defaultValue: 300 },
            { name: 'boatsCount', type: 'number', label: 'Nombre de bateaux', defaultValue: 50 },
          ],
        },
      ],
    },
  ],
}

export default ClubSettings
