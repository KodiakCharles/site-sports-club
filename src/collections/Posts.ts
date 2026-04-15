import type { CollectionConfig } from 'payload'
import { clubId } from '@/lib/utils/accessControl'

const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    group: 'Contenu',
    defaultColumns: ['title', 'club', 'category', 'status', 'publishedAt'],
  },
  labels: {
    singular: 'Article',
    plural: 'Articles',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super_admin') return true
      return { club: { equals: clubId(user.club) } }
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return ['super_admin', 'club_admin', 'editor', 'contributor'].includes(user.role)
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super_admin') return true
      return { club: { equals: clubId(user.club) } }
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super_admin') return true
      return { club: { equals: clubId(user.club) } }
    },
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'club',
      type: 'relationship',
      relationTo: 'clubs',
      label: 'Club',
      required: true,
      admin: {
        position: 'sidebar',
        condition: (_, __, { user }) => user?.role === 'super_admin',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Titre',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug URL',
      required: true,
      admin: { description: 'Ex: resultats-championnat-2026' },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Catégorie',
      admin: {
        description:
          "Voile : compétition, stages. Rugby : match, école de rugby. Pelote : partie, championnat. Commun : vie du club, distinctions, partenariat.",
      },
      options: [
        // Commun à tous les sports
        { label: 'Vie du club', value: 'vie-du-club' },
        { label: 'Distinctions', value: 'distinctions' },
        { label: 'Partenariat', value: 'partenariat' },
        // Voile
        { label: 'Compétition (régate)', value: 'competition' },
        { label: 'Stages', value: 'stages' },
        // Rugby
        { label: 'Match / Résultat', value: 'match' },
        { label: 'École de rugby', value: 'ecole-rugby' },
        // Pelote basque
        { label: 'Partie / Résultat', value: 'partie' },
        { label: 'Championnat', value: 'championnat' },
      ],
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Résumé',
      admin: { description: 'Affiché dans la liste des articles (max 200 caractères)' },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Contenu',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Image de couverture',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Statut',
      defaultValue: 'draft',
      options: [
        { label: 'Brouillon', value: 'draft' },
        { label: 'Publié', value: 'published' },
      ],
    },
    {
      name: 'reviewStatus',
      type: 'select',
      label: 'Statut éditorial',
      defaultValue: 'writing',
      options: [
        { label: 'En rédaction', value: 'writing' },
        { label: 'En relecture', value: 'review' },
        { label: 'Approuvé', value: 'approved' },
        { label: 'Refusé', value: 'rejected' },
      ],
    },
    {
      name: 'reviewNotes',
      type: 'textarea',
      label: 'Notes de relecture',
      admin: {
        description: 'Notes internes pour la relecture — non visibles sur le site',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Date de publication',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'scheduledPublishAt',
      type: 'date',
      label: 'Publication programmée',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        description: "Si défini, l'article sera automatiquement publié à cette date.",
      },
    },
  ],
}

export default Posts
