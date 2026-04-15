import type { CollectionConfig } from 'payload'
import { clubId } from '@/lib/utils/accessControl'

const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Médias',
    defaultColumns: ['filename', 'club', 'alt', 'createdAt'],
  },
  labels: {
    singular: 'Média',
    plural: 'Médias',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return true // médias publics
      if (user.role === 'super_admin') return true
      return { club: { equals: clubId(user.club) } }
    },
    create: ({ req: { user } }) => !!user,
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
  upload: {
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'hero', width: 1600, height: 900, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'club',
      type: 'relationship',
      relationTo: 'clubs',
      label: 'Club',
      admin: {
        position: 'sidebar',
        condition: (_, __, { user }) => user?.role === 'super_admin',
      },
    },
    {
      name: 'alt',
      type: 'text',
      label: 'Texte alternatif',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Légende',
    },
  ],
}

export default Media
