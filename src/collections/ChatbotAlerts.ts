import type { CollectionConfig } from 'payload'
import { clubId } from '@/lib/utils/accessControl'

const ChatbotAlerts: CollectionConfig = {
  slug: 'chatbot-alerts',
  admin: {
    useAsTitle: 'userQuestion',
    group: 'Chatbot',
    defaultColumns: ['userQuestion', 'status', 'priority', 'createdAt'],
    description: "Questions auxquelles l'IA n'a pas su répondre. Répondez pour alimenter la base de connaissances.",
  },
  labels: {
    singular: 'Alerte chatbot',
    plural: 'Alertes chatbot',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super_admin') return true
      return { club: { equals: clubId(user.club) } }
    },
    create: () => true, // Created by chatbot API (unauthenticated)
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
        readOnly: true,
      },
    },
    {
      name: 'userQuestion',
      type: 'textarea',
      label: "Question de l'utilisateur",
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'aiAttempt',
      type: 'textarea',
      label: "Tentative de réponse de l'IA",
      admin: {
        readOnly: true,
        description: "Ce que l'IA a répondu avant d'abandonner.",
      },
    },
    {
      name: 'aiReason',
      type: 'text',
      label: "Pourquoi l'IA a créé l'alerte",
      admin: {
        readOnly: true,
        description: "Ex : 'information manquante dans la KB', 'sujet hors scope'.",
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Statut',
      defaultValue: 'pending',
      options: [
        { label: '🔴 En attente de réponse', value: 'pending' },
        { label: '🟢 Répondue (ajoutée à la KB)', value: 'answered' },
        { label: '⚪ Ignorée', value: 'dismissed' },
      ],
    },
    {
      name: 'priority',
      type: 'select',
      label: 'Priorité',
      defaultValue: 'normal',
      options: [
        { label: 'Haute', value: 'high' },
        { label: 'Normale', value: 'normal' },
        { label: 'Basse', value: 'low' },
      ],
    },
    {
      name: 'adminAnswer',
      type: 'textarea',
      label: "Réponse de l'admin",
      admin: {
        description: "Rédigez ici la réponse. Lors de la sauvegarde avec statut 'Répondue', une entrée KB sera créée automatiquement.",
      },
    },
    {
      name: 'addToKnowledgeBase',
      type: 'checkbox',
      label: 'Ajouter à la base de connaissances',
      defaultValue: true,
      admin: {
        description: "Si coché, la réponse sera ajoutée à la KB pour que l'IA puisse répondre à l'avenir.",
      },
    },
    {
      name: 'kbCategory',
      type: 'select',
      label: 'Catégorie KB',
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
      name: 'sessionId',
      type: 'text',
      label: 'ID de session',
      admin: {
        readOnly: true,
        description: 'Identifiant anonyme pour regrouper les questions d\'une même conversation.',
        position: 'sidebar',
      },
    },
    {
      name: 'userContact',
      type: 'text',
      label: "Email de l'utilisateur (optionnel)",
      admin: {
        description: "Si l'utilisateur a laissé son email pour être recontacté.",
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req, operation }) => {
        // When admin marks alert as "answered" with an answer, create a KB entry
        if (operation !== 'update') return
        if (doc.status !== 'answered') return
        if (previousDoc?.status === 'answered') return // already processed
        if (!doc.addToKnowledgeBase) return
        if (!doc.adminAnswer || !doc.userQuestion) return

        try {
          await req.payload.create({
            collection: 'knowledge-base',
            data: {
              club: typeof doc.club === 'object' ? doc.club.id : doc.club,
              question: doc.userQuestion,
              answer: doc.adminAnswer,
              category: doc.kbCategory || 'general',
              source: 'alert-answer',
              status: 'active',
              relatedAlert: doc.id,
            },
          })
          req.payload.logger.info(`[ChatbotAlerts] KB entry created from alert ${doc.id}`)
        } catch (err) {
          req.payload.logger.error(`[ChatbotAlerts] Failed to create KB entry: ${err}`)
        }
      },
    ],
  },
}

export default ChatbotAlerts
