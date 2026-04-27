import type { CollectionConfig } from 'payload'
import { clubId } from '@/lib/utils/accessControl'
import { getDefaultKnowledgeBase } from '@/lib/utils/defaultKnowledgeBase'
import type { Sport } from '@/lib/utils/sportConfig'

const Clubs: CollectionConfig = {
  slug: 'clubs',
  admin: {
    useAsTitle: 'name',
    group: 'Super Admin',
    defaultColumns: ['name', 'sport', 'domain', 'lifecycle', 'createdAt'],
    description: 'Gestion des clubs multi-sport (voile, rugby, pelote basque)',
    components: {
      edit: {
        beforeDocumentControls: ['@/components/admin/SwitchClubButton#SwitchClubButton'],
      },
    },
  },
  labels: {
    singular: 'Club',
    plural: 'Clubs',
  },
  versions: {
    drafts: {
      autosave: {
        interval: 3000, // sauvegarde automatique toutes les 3 secondes
      },
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super_admin') return true
      return { id: { equals: clubId(user.club) } }
    },
    create: ({ req: { user } }) => user?.role === 'super_admin',
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super_admin') return true
      return { id: { equals: clubId(user.club) } }
    },
    delete: ({ req: { user } }) => user?.role === 'super_admin',
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return
        const sport = (doc as { sport?: Sport }).sport
        if (!sport) return

        try {
          const existing = await req.payload.count({
            collection: 'knowledge-base',
            where: { club: { equals: doc.id } },
          })
          if (existing.totalDocs > 0) return // déjà initialisé (ex: re-création)

          const seed = getDefaultKnowledgeBase(sport)
          for (const entry of seed) {
            await req.payload.create({
              collection: 'knowledge-base',
              data: {
                club: doc.id,
                question: entry.question,
                answer: entry.answer,
                category: entry.category,
                keywords: entry.keywords,
                source: 'manual',
                status: 'active',
              },
            })
          }
          req.payload.logger.info(
            `[Clubs.afterChange] Pre-seeded ${seed.length} KB entries for new ${sport} club ${doc.id}`
          )
        } catch (err) {
          req.payload.logger.error(`[Clubs.afterChange] KB pre-seed failed: ${err}`)
        }
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nom du club',
      required: true,
    },
    {
      name: 'sport',
      type: 'select',
      label: 'Sport',
      required: true,
      defaultValue: 'voile',
      options: [
        { label: '⛵  Voile', value: 'voile' },
        { label: '🏉  Rugby', value: 'rugby' },
        { label: '🤾  Pelote basque', value: 'pelote-basque' },
      ],
      admin: {
        description:
          'Fixé à la création. Détermine la marque affichée (VoilePulse / RugbyPulse / PelotePulse), le vocabulaire, les supports/disciplines, la fédération et les modules disponibles.',
      },
    },
    {
      name: 'domain',
      type: 'text',
      label: 'Domaine',
      required: true,
      unique: true,
      admin: { description: 'Ex: club-rugby-biarritz.fr (sans https://)' },
    },
    {
      name: 'lifecycle',
      type: 'select',
      label: 'Statut',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Actif', value: 'active' },
        { label: 'Suspendu', value: 'suspended' },
        { label: 'En attente', value: 'pending' },
      ],
      admin: {
        description: "Cycle de vie du club (renommé depuis 'status' pour éviter une collision avec le _status de versioning Payload).",
      },
    },
    {
      name: 'plan',
      type: 'select',
      label: 'Forfait',
      required: true,
      defaultValue: 'essentiel',
      options: [
        { label: 'Essentiel (49€ HT/mois — sans IA)', value: 'essentiel' },
        { label: 'Pulse (99€ HT/mois — toutes fonctionnalités IA)', value: 'pulse' },
        { label: 'Sur mesure (intégrations spécifiques — sur devis)', value: 'surmesure' },
      ],
      admin: {
        description: 'Détermine les fonctionnalités disponibles pour ce club',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identité',
          fields: [
            { name: 'tagline', type: 'text', label: 'Accroche' },
            { name: 'address', type: 'text', label: 'Adresse' },
            { name: 'phone', type: 'text', label: 'Téléphone' },
            { name: 'email', type: 'email', label: 'Email de contact' },
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
          ],
        },
        {
          label: 'Modules',
          fields: [
            {
              name: 'moduleWeather',
              type: 'checkbox',
              label: 'Widget météo (Windguru) — voile uniquement',
              defaultValue: true,
              admin: { condition: (data) => data?.sport === 'voile' },
            },
            {
              name: 'moduleBoatRental',
              type: 'checkbox',
              label: 'Location de bateaux — voile uniquement',
              defaultValue: false,
              admin: { condition: (data) => data?.sport === 'voile' },
            },
            {
              name: 'moduleEquipmentRental',
              type: 'checkbox',
              label: 'Location de matériel',
              defaultValue: false,
              admin: {
                condition: (data) => data?.sport === 'rugby' || data?.sport === 'pelote-basque',
              },
            },
            {
              name: 'moduleBooking',
              type: 'checkbox',
              label: 'Réservation de fronton — pelote basque uniquement',
              defaultValue: false,
              admin: { condition: (data) => data?.sport === 'pelote-basque' },
            },
            { name: 'moduleMemberSpace', type: 'checkbox', label: 'Espace adhérent', defaultValue: true },
            { name: 'moduleMultilingual', type: 'checkbox', label: 'Multilingue EN + ES', defaultValue: false },
          ],
        },
        {
          label: 'Intégrations',
          fields: [
            { name: 'windguruStationId', type: 'text', label: 'ID station Windguru' },
            { name: 'googleMapsApiKey', type: 'text', label: 'Clé API Google Maps' },
            { name: 'ga4MeasurementId', type: 'text', label: 'ID Google Analytics 4' },
            { name: 'helloassoUrl', type: 'text', label: 'URL HelloAsso' },
            { name: 'yoplanningKey', type: 'text', label: 'Clé Yoplanning' },
            { name: 'instagramToken', type: 'text', label: 'Token Instagram' },
            { name: 'newsletterApiKey', type: 'text', label: 'Clé API newsletter (Brevo/Mailchimp)' },
            { name: 'newsletterListId', type: 'text', label: 'ID liste newsletter' },
          ],
        },
        {
          label: 'Réseaux sociaux',
          fields: [
            { name: 'instagramUrl', type: 'text', label: 'Instagram (URL profil)' },
            { name: 'facebookUrl', type: 'text', label: 'Facebook (URL page)' },
            { name: 'twitterUrl', type: 'text', label: 'X / Twitter (URL profil)' },
            { name: 'youtubeUrl', type: 'text', label: 'YouTube (URL)' },
            { name: 'twitterHandle', type: 'text', label: 'Identifiant X/Twitter', admin: { description: 'Ex: ClubVoilePau (sans @)' } },
            { name: 'facebookPageId', type: 'text', label: 'Facebook Page ID', admin: { description: 'Identifiant numérique de la page Facebook' } },
            { name: 'facebookAccessToken', type: 'text', label: 'Facebook Access Token', admin: { description: 'Token d\'accès page (long-lived) — gardez-le secret' } },
            { name: 'twitterBearerToken', type: 'text', label: 'Twitter Bearer Token', admin: { description: 'Depuis developer.twitter.com — accès API v2' } },
          ],
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes internes',
      admin: {
        description: 'Visible uniquement par le super admin',
        condition: (_, siblingData, { user }) => user?.role === 'super_admin',
      },
    },
  ],
}

export default Clubs
