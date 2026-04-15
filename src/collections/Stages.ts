import type { CollectionConfig } from 'payload'
import { clubId } from '@/lib/utils/accessControl'
import { SPORTS, getSportConfig, type Sport } from '@/lib/utils/sportConfig'

const ALL_SUPPORTS = (Object.keys(SPORTS) as Sport[]).flatMap((sport) =>
  SPORTS[sport].supports.map((s) => ({
    label: `${SPORTS[sport].emoji} ${s.label}`,
    value: s.value,
  }))
)
const UNIQUE_SUPPORTS = Array.from(new Map(ALL_SUPPORTS.map((o) => [o.value, o])).values())

const Stages: CollectionConfig = {
  slug: 'stages',
  admin: {
    useAsTitle: 'title',
    group: 'Contenu',
    defaultColumns: ['title', 'club', 'support', 'level', 'startDate', 'spotsLeft'],
  },
  labels: {
    singular: 'Stage',
    plural: 'Stages',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super_admin') return true
      return { club: { equals: clubId(user.club) } }
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return ['super_admin', 'club_admin', 'editor'].includes(user.role)
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
      label: 'Titre du stage',
      required: true,
    },
    {
      name: 'support',
      type: 'select',
      label: 'Support / Discipline',
      required: true,
      options: UNIQUE_SUPPORTS,
      admin: {
        description:
          "La liste regroupe toutes les disciplines des 3 sports. Seules les disciplines du sport de votre club seront valid\u00e9es \u00e0 la sauvegarde.",
      },
      hooks: {
        beforeValidate: [
          async ({ data, req, value }) => {
            if (!value || !data?.club) return value
            const clubIdValue =
              typeof data.club === 'object' ? (data.club as { id: string | number }).id : data.club
            try {
              const club = await req.payload.findByID({
                collection: 'clubs',
                id: clubIdValue as string | number,
                depth: 0,
              })
              const sport = (club as { sport?: Sport }).sport
              if (!sport) return value
              const allowed = getSportConfig(sport).supports.map((s) => s.value)
              if (!allowed.includes(value as string)) {
                throw new Error(
                  `Le support "${value}" n'est pas valide pour un club de ${getSportConfig(sport).label}. Choisissez parmi : ${allowed.join(', ')}.`
                )
              }
            } catch (err) {
              if (err instanceof Error && err.message.startsWith('Le support')) throw err
              // If club lookup fails, let Payload's normal validation continue
            }
            return value
          },
        ],
      },
    },
    {
      name: 'level',
      type: 'select',
      label: 'Niveau',
      options: [
        { label: 'Initiation', value: 'initiation' },
        { label: 'Débutant', value: 'debutant' },
        { label: 'Intermédiaire', value: 'intermediaire' },
        { label: 'Perfectionnement', value: 'perfectionnement' },
        { label: 'Compétition', value: 'competition' },
      ],
    },
    {
      name: 'audience',
      type: 'text',
      label: 'Public cible',
      admin: { description: 'Ex: Enfants 7–12 ans' },
    },
    {
      type: 'row',
      fields: [
        { name: 'startDate', type: 'date', label: 'Date de début', required: true },
        { name: 'endDate', type: 'date', label: 'Date de fin', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'spots', type: 'number', label: 'Places totales', defaultValue: 8 },
        { name: 'spotsLeft', type: 'number', label: 'Places restantes', defaultValue: 8 },
        { name: 'price', type: 'number', label: 'Prix (€)', required: true },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description complète',
    },
    {
      name: 'bookingProvider',
      type: 'select',
      label: 'Système de réservation',
      defaultValue: 'helloasso',
      options: [
        { label: 'HelloAsso', value: 'helloasso' },
        { label: 'Yoplanning', value: 'yoplanning' },
        { label: 'Axyomes', value: 'axyomes' },
        { label: 'Lien externe', value: 'external' },
      ],
    },
    {
      name: 'bookingUrl',
      type: 'text',
      label: "URL d'inscription",
    },
  ],
}

export default Stages
