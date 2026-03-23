import type { CollectionConfig } from 'payload'

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Administration',
  },
  labels: {
    singular: 'Utilisateur',
    plural: 'Utilisateurs',
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
    },
  ],
}

export default Users
