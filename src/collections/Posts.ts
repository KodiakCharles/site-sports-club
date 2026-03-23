import type { CollectionConfig } from 'payload'

const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    group: 'Contenu',
    defaultColumns: ['title', 'category', 'status', 'publishedAt'],
  },
  labels: {
    singular: 'Article',
    plural: 'Articles',
  },
  versions: {
    drafts: true,
  },
  fields: [
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
      unique: true,
      admin: { description: 'Ex: resultats-championnat-2026' },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Catégorie',
      options: [
        { label: 'Compétition', value: 'competition' },
        { label: 'Stages', value: 'stages' },
        { label: 'Vie du club', value: 'vie-du-club' },
        { label: 'Distinctions', value: 'distinctions' },
        { label: 'Partenariat', value: 'partenariat' },
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
      name: 'publishedAt',
      type: 'date',
      label: 'Date de publication',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
  ],
}

export default Posts
