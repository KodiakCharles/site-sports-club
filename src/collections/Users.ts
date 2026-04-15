import type { CollectionConfig } from 'payload'
import { clubId } from '@/lib/utils/accessControl'

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Administration',
    defaultColumns: ['email', 'firstName', 'lastName', 'role', 'club'],
  },
  labels: {
    singular: 'Utilisateur',
    plural: 'Utilisateurs',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super_admin') return true
      return { club: { equals: clubId(user.club) } }
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'super_admin' || user.role === 'club_admin'
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super_admin') return true
      return { club: { equals: clubId(user.club) } }
    },
    delete: ({ req: { user } }) => user?.role === 'super_admin',
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      label: 'Prénom',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Nom',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: 'Rôle',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Super Admin', value: 'super_admin' },
        { label: 'Admin Club', value: 'club_admin' },
        { label: 'Éditeur', value: 'editor' },
        { label: 'Contributeur', value: 'contributor' },
      ],
      access: {
        // Seul le super_admin peut assigner le rôle super_admin
        update: ({ req: { user } }) => user?.role === 'super_admin',
      },
    },
    {
      name: 'club',
      type: 'relationship',
      relationTo: 'clubs',
      label: 'Club',
      admin: {
        description: 'Club auquel cet utilisateur appartient (non requis pour super admin)',
        condition: (data) => data?.role !== 'super_admin',
      },
    },
  ],
}

export default Users
