import type { CollectionConfig } from 'payload'
import { clubId } from '@/lib/utils/accessControl'

const KnowledgeBase: CollectionConfig = {
  slug: 'knowledge-base',
  admin: {
    useAsTitle: 'question',
    group: 'Chatbot',
    defaultColumns: ['question', 'category', 'source', 'status', 'updatedAt'],
    description: "Base de connaissances utilisée par le chatbot IA. L'admin peut ajouter des Q/R, et l'IA peut proposer de nouvelles entrées qui doivent être validées.",
  },
  labels: {
    singular: 'Entrée Knowledge Base',
    plural: 'Knowledge Base',
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
      name: 'question',
      type: 'text',
      label: 'Question',
      required: true,
      admin: {
        description: 'Question type ou mots-clés. Ex : "Comment obtenir ma licence ?"',
      },
    },
    {
      name: 'answer',
      type: 'textarea',
      label: 'Réponse',
      required: true,
      admin: {
        description: 'Réponse à fournir au chatbot. Concise et factuelle.',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Catégorie',
      defaultValue: 'general',
      options: [
        { label: 'Général', value: 'general' },
        { label: 'Inscription / Licence', value: 'inscription' },
        { label: 'Stages & formations', value: 'stages' },
        { label: 'Compétition / Régates', value: 'competition' },
        { label: 'Tarifs', value: 'tarifs' },
        { label: 'Matériel / Flotte', value: 'materiel' },
        { label: 'Accès / Horaires', value: 'acces' },
        { label: 'Sécurité', value: 'securite' },
        { label: 'Autre', value: 'autre' },
      ],
    },
    {
      name: 'keywords',
      type: 'text',
      label: 'Mots-clés (optionnel)',
      admin: {
        description: "Séparés par des virgules. Aide l'IA à trouver l'entrée. Ex : licence, ffvoile, fédération",
      },
    },
    {
      name: 'source',
      type: 'select',
      label: 'Source',
      defaultValue: 'manual',
      options: [
        { label: 'Saisie manuelle', value: 'manual' },
        { label: 'Réponse admin à une alerte', value: 'alert-answer' },
        { label: 'Proposée par l\'IA', value: 'ai-generated' },
      ],
      admin: {
        description: "Origine de l'entrée. Les entrées 'ai-generated' doivent être validées.",
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Statut',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'En attente de validation', value: 'pending-review' },
        { label: 'Archivée', value: 'archived' },
      ],
      admin: {
        description: "Seules les entrées 'active' sont utilisées par le chatbot.",
      },
    },
    {
      name: 'relatedAlert',
      type: 'relationship',
      relationTo: 'chatbot-alerts',
      label: 'Alerte associée',
      admin: {
        description: "Si cette entrée a été créée en réponse à une alerte chatbot.",
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'usageCount',
      type: 'number',
      label: 'Utilisations',
      defaultValue: 0,
      admin: {
        description: "Nombre de fois où l'IA a utilisé cette entrée.",
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
}

export default KnowledgeBase
