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
                components: {
                  Field: '@/components/admin/ColorPickerField#ColorPickerField',
                },
              },
            },
            {
              name: 'secondaryColor',
              type: 'text',
              label: 'Couleur secondaire',
              defaultValue: '#2eb8e6',
              admin: {
                components: {
                  Field: '@/components/admin/ColorPickerField#ColorPickerField',
                },
              },
            },
            {
              name: 'accentColor',
              type: 'text',
              label: "Couleur d'accentuation",
              defaultValue: '#f0b429',
              admin: {
                components: {
                  Field: '@/components/admin/ColorPickerField#ColorPickerField',
                },
              },
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
            { name: 'instagramUrl', type: 'text', label: 'Instagram (URL profil)' },
            { name: 'facebookUrl', type: 'text', label: 'Facebook (URL page)' },
            { name: 'twitterUrl', type: 'text', label: 'X / Twitter (URL profil)' },
            { name: 'youtubeUrl', type: 'text', label: 'YouTube (URL)' },
            { name: 'tiktokUrl', type: 'text', label: 'TikTok (URL)' },
            { name: 'twitterHandle', type: 'text', label: 'Identifiant X/Twitter', admin: { description: 'Ex: ClubVoilePau (sans @)' } },
            { name: 'facebookPageId', type: 'text', label: 'Facebook Page ID' },
            { name: 'facebookAccessToken', type: 'text', label: 'Facebook Access Token' },
            { name: 'twitterBearerToken', type: 'text', label: 'Twitter Bearer Token' },
          ],
        },
        {
          label: 'Modules',
          fields: [
            { name: 'weatherWidget', type: 'checkbox', label: 'Widget météo (Windguru)', defaultValue: true },
            { name: 'boatRental', type: 'checkbox', label: 'Location de bateaux', defaultValue: false },
            { name: 'memberSpace', type: 'checkbox', label: 'Espace adhérent', defaultValue: true },
            { name: 'multilingual', type: 'checkbox', label: 'Multilingue EN + ES', defaultValue: true },
            { name: 'windguruStationId', type: 'text', label: 'ID station Windguru' },
            { name: 'googleMapsApiKey', type: 'text', label: 'Clé API Google Maps' },
            { name: 'ga4MeasurementId', type: 'text', label: 'ID Google Analytics 4' },
            { name: 'helloassoUrl', type: 'text', label: 'URL HelloAsso du club' },
            { name: 'chatbotEnabled', type: 'checkbox', label: 'Chatbot FAQ', defaultValue: true },
            {
              name: 'chatbotMode',
              type: 'select',
              label: 'Mode du chatbot',
              options: [
                { label: 'Standard (FAQ)', value: 'standard' },
                { label: 'Expert (FFV + Météo)', value: 'expert' },
              ],
              defaultValue: 'standard',
            },
            {
              name: 'chatbotCustomFaq',
              type: 'array',
              label: 'FAQ personnalisée',
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'API',
          fields: [
            {
              name: 'apiEnabled',
              type: 'checkbox',
              label: 'Activer l\'API externe pour les articles',
              defaultValue: false,
            },
            {
              name: 'apiKey',
              type: 'text',
              label: 'Cle API',
              admin: {
                description:
                  'Cle secrete pour l\'authentification API. Generez-en une longue et aleatoire.',
              },
            },
            {
              name: 'apiAllowedOrigins',
              type: 'text',
              label: 'Origines autorisees (CORS)',
              admin: {
                description:
                  'Domaines separes par des virgules. Ex: https://app.example.com,https://other.com',
              },
            },
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
