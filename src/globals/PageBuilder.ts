import type { GlobalConfig } from 'payload'

const PageBuilder: GlobalConfig = {
  slug: 'page-builder',
  label: 'Page Builder',
  admin: {
    group: 'Pages',
    description: 'Construisez des pages personnalisées avec des blocs',
  },
  fields: [
    {
      name: 'pages',
      type: 'array',
      label: 'Pages personnalisées',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titre de la page',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          label: 'Slug URL',
          required: true,
          admin: { description: 'Ex: evenement-special (accessible via /p/evenement-special)' },
        },
        {
          name: 'published',
          type: 'checkbox',
          label: 'Publié',
          defaultValue: false,
        },
        {
          name: 'blocks',
          type: 'blocks',
          label: 'Contenu',
          blocks: [
            // Hero Block
            {
              slug: 'hero',
              labels: { singular: 'Hero', plural: 'Hero' },
              fields: [
                { name: 'title', type: 'text', label: 'Titre', required: true },
                { name: 'subtitle', type: 'text', label: 'Sous-titre' },
                { name: 'backgroundImage', type: 'upload', relationTo: 'media', label: 'Image de fond' },
                { name: 'ctaLabel', type: 'text', label: 'Texte du bouton' },
                { name: 'ctaUrl', type: 'text', label: 'URL du bouton' },
              ],
            },
            // Text + Image Block
            {
              slug: 'text-image',
              labels: { singular: 'Texte + Image', plural: 'Texte + Image' },
              fields: [
                { name: 'title', type: 'text', label: 'Titre' },
                { name: 'text', type: 'richText', label: 'Texte' },
                { name: 'image', type: 'upload', relationTo: 'media', label: 'Image' },
                { name: 'imagePosition', type: 'select', label: 'Position image', defaultValue: 'right', options: [{ label: 'Gauche', value: 'left' }, { label: 'Droite', value: 'right' }] },
              ],
            },
            // Gallery Block
            {
              slug: 'gallery',
              labels: { singular: 'Galerie', plural: 'Galeries' },
              fields: [
                { name: 'title', type: 'text', label: 'Titre' },
                { name: 'columns', type: 'select', label: 'Colonnes', defaultValue: '3', options: [{ label: '2', value: '2' }, { label: '3', value: '3' }, { label: '4', value: '4' }] },
                { name: 'images', type: 'array', label: 'Images', fields: [
                  { name: 'image', type: 'upload', relationTo: 'media', label: 'Image', required: true },
                  { name: 'caption', type: 'text', label: 'Légende' },
                ] },
              ],
            },
            // Stats Block
            {
              slug: 'stats',
              labels: { singular: 'Chiffres clés', plural: 'Chiffres clés' },
              fields: [
                { name: 'items', type: 'array', label: 'Chiffres', fields: [
                  { name: 'value', type: 'text', label: 'Valeur', required: true },
                  { name: 'label', type: 'text', label: 'Label', required: true },
                ] },
              ],
            },
            // CTA Banner Block
            {
              slug: 'cta-banner',
              labels: { singular: 'Bannière CTA', plural: 'Bannières CTA' },
              fields: [
                { name: 'title', type: 'text', label: 'Titre', required: true },
                { name: 'subtitle', type: 'text', label: 'Sous-titre' },
                { name: 'buttonLabel', type: 'text', label: 'Texte du bouton', required: true },
                { name: 'buttonUrl', type: 'text', label: 'URL du bouton', required: true },
                { name: 'style', type: 'select', label: 'Style', defaultValue: 'primary', options: [{ label: 'Primaire (coloré)', value: 'primary' }, { label: 'Clair', value: 'light' }] },
              ],
            },
            // FAQ Block
            {
              slug: 'faq',
              labels: { singular: 'FAQ', plural: 'FAQ' },
              fields: [
                { name: 'title', type: 'text', label: 'Titre', defaultValue: 'Questions fréquentes' },
                { name: 'items', type: 'array', label: 'Questions', fields: [
                  { name: 'question', type: 'text', label: 'Question', required: true },
                  { name: 'answer', type: 'textarea', label: 'Réponse', required: true },
                ] },
              ],
            },
            // Video Block
            {
              slug: 'video',
              labels: { singular: 'Vidéo', plural: 'Vidéos' },
              fields: [
                { name: 'title', type: 'text', label: 'Titre' },
                { name: 'url', type: 'text', label: 'URL YouTube/Vimeo', required: true },
              ],
            },
            // Team Block
            {
              slug: 'team',
              labels: { singular: 'Équipe', plural: 'Équipes' },
              fields: [
                { name: 'title', type: 'text', label: 'Titre', defaultValue: 'Notre équipe' },
                { name: 'members', type: 'array', label: 'Membres', fields: [
                  { name: 'name', type: 'text', label: 'Nom', required: true },
                  { name: 'role', type: 'text', label: 'Poste' },
                  { name: 'photo', type: 'upload', relationTo: 'media', label: 'Photo' },
                ] },
              ],
            },
            // Partners Block
            {
              slug: 'partners',
              labels: { singular: 'Partenaires', plural: 'Partenaires' },
              fields: [
                { name: 'title', type: 'text', label: 'Titre', defaultValue: 'Nos partenaires' },
                { name: 'partners', type: 'array', label: 'Partenaires', fields: [
                  { name: 'name', type: 'text', label: 'Nom', required: true },
                  { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo' },
                  { name: 'url', type: 'text', label: 'Site web' },
                ] },
              ],
            },
            // Newsletter Block
            {
              slug: 'newsletter',
              labels: { singular: 'Newsletter', plural: 'Newsletter' },
              fields: [
                { name: 'title', type: 'text', label: 'Titre', defaultValue: 'Restez informé' },
                { name: 'subtitle', type: 'text', label: 'Sous-titre', defaultValue: 'Recevez les actualités du club par email' },
              ],
            },
            // Map Block
            {
              slug: 'map',
              labels: { singular: 'Carte', plural: 'Cartes' },
              fields: [
                { name: 'title', type: 'text', label: 'Titre' },
                { name: 'embedUrl', type: 'text', label: 'URL iframe Google Maps', required: true },
              ],
            },
            // Weather Block
            {
              slug: 'weather',
              labels: { singular: 'Météo', plural: 'Météo' },
              fields: [
                { name: 'title', type: 'text', label: 'Titre', defaultValue: 'Météo marine' },
              ],
            },
            // Rich Text Block
            {
              slug: 'richtext',
              labels: { singular: 'Texte riche', plural: 'Textes riches' },
              fields: [
                { name: 'content', type: 'richText', label: 'Contenu' },
              ],
            },
            // Divider Block
            {
              slug: 'divider',
              labels: { singular: 'Séparateur', plural: 'Séparateurs' },
              fields: [
                { name: 'style', type: 'select', label: 'Style', defaultValue: 'line', options: [{ label: 'Ligne', value: 'line' }, { label: 'Espace', value: 'space' }, { label: 'Vague', value: 'wave' }] },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default PageBuilder
