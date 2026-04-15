import type { CollectionConfig } from 'payload'
import { clubId } from '@/lib/utils/accessControl'

const Members: CollectionConfig = {
  slug: 'members',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Administration',
    defaultColumns: ['firstName', 'lastName', 'email', 'membershipType', 'status', 'club'],
    description: 'Adhérents et membres des clubs',
  },
  labels: {
    singular: 'Adhérent',
    plural: 'Adhérents',
  },
  access: {
    // Super admin voit tout, club_admin voit ses membres, membre voit uniquement son profil
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'members') return { id: { equals: (user as any).id } } as any
      if ((user as any).role === 'super_admin') return true
      return { club: { equals: clubId((user as any).club) } }
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return (user as any).role === 'super_admin' || (user as any).role === 'club_admin'
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'members') return { id: { equals: (user as any).id } } as any
      if ((user as any).role === 'super_admin') return true
      return { club: { equals: clubId((user as any).club) } }
    },
    delete: ({ req: { user } }) => (user as any)?.role === 'super_admin' || (user as any)?.role === 'club_admin',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'firstName', type: 'text', label: 'Prénom', required: true },
        { name: 'lastName', type: 'text', label: 'Nom', required: true },
      ],
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Téléphone',
    },
    {
      name: 'birthDate',
      type: 'date',
      label: 'Date de naissance',
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'address',
      type: 'group',
      label: 'Adresse',
      fields: [
        { name: 'street', type: 'text', label: 'Rue' },
        { type: 'row', fields: [
          { name: 'postalCode', type: 'text', label: 'Code postal' },
          { name: 'city', type: 'text', label: 'Ville' },
        ]},
      ],
    },
    {
      name: 'club',
      type: 'relationship',
      relationTo: 'clubs',
      label: 'Club',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Adhésion',
          fields: [
            {
              name: 'membershipType',
              type: 'select',
              label: "Type d'adhésion",
              required: true,
              defaultValue: 'adult',
              options: [
                { label: 'Adulte', value: 'adult' },
                { label: 'Jeune (< 18 ans)', value: 'youth' },
                { label: 'Famille', value: 'family' },
                { label: 'Découverte', value: 'discovery' },
                { label: 'Compétition', value: 'competition' },
              ],
            },
            {
              name: 'licenseNumber',
              type: 'text',
              label: 'Numéro de licence FFVoile',
              admin: { description: 'Numéro attribué par la Fédération Française de Voile' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'membershipStart',
                  type: 'date',
                  label: 'Début adhésion',
                  admin: { date: { pickerAppearance: 'dayOnly' } },
                },
                {
                  name: 'membershipExpiry',
                  type: 'date',
                  label: "Expiration adhésion",
                  admin: { date: { pickerAppearance: 'dayOnly' } },
                },
              ],
            },
            {
              name: 'status',
              type: 'select',
              label: 'Statut',
              required: true,
              defaultValue: 'pending',
              options: [
                { label: 'Actif', value: 'active' },
                { label: 'Expiré', value: 'expired' },
                { label: 'En attente', value: 'pending' },
                { label: 'Suspendu', value: 'suspended' },
              ],
            },
            {
              name: 'newsletterOptIn',
              type: 'checkbox',
              label: 'Accepte de recevoir les newsletters',
              defaultValue: true,
            },
          ],
        },
        {
          label: 'Notes',
          fields: [
            {
              name: 'notes',
              type: 'textarea',
              label: 'Notes internes',
              admin: { description: 'Visible uniquement par les admins' },
            },
          ],
        },
      ],
    },
  ],
}

export default Members
