import type { CollectionConfig } from 'payload'
import { clubId } from '@/lib/utils/accessControl'

const Newsletters: CollectionConfig = {
  slug: 'newsletters',
  admin: {
    useAsTitle: 'subject',
    group: 'Administration',
    defaultColumns: ['subject', 'club', 'status', 'sentAt', 'recipientCount'],
    description: 'Newsletters envoyées aux membres des clubs',
  },
  labels: {
    singular: 'Newsletter',
    plural: 'Newsletters',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if ((user as any).role === 'super_admin') return true
      return { club: { equals: clubId((user as any).club) } }
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return (user as any).role === 'super_admin' || (user as any).role === 'club_admin'
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if ((user as any).role === 'super_admin') return true
      return { club: { equals: clubId((user as any).club) } }
    },
    delete: ({ req: { user } }) =>
      (user as any)?.role === 'super_admin' || (user as any)?.role === 'club_admin',
  },
  fields: [
    {
      name: 'subject',
      type: 'text',
      label: 'Objet',
      required: true,
    },
    {
      name: 'club',
      type: 'relationship',
      relationTo: 'clubs',
      label: 'Club',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Contenu',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Statut',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Brouillon', value: 'draft' },
        { label: 'Envoyée', value: 'sent' },
      ],
      admin: {
        readOnly: true,
        description: 'Mis à jour automatiquement lors de l\'envoi',
      },
    },
    {
      name: 'sentAt',
      type: 'date',
      label: 'Envoyée le',
      admin: {
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'recipientCount',
      type: 'number',
      label: 'Nombre de destinataires',
      admin: {
        readOnly: true,
        description: 'Calculé automatiquement lors de l\'envoi',
      },
    },
  ],
}

export default Newsletters
