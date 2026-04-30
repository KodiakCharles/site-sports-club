import type { CollectionConfig } from 'payload'

const OnboardingRequests: CollectionConfig = {
  slug: 'onboarding-requests',
  admin: {
    useAsTitle: 'organizationName',
    group: 'Super Admin',
    defaultColumns: ['organizationName', 'plan', 'paymentMode', 'status', 'email', 'createdAt'],
    description: 'Demandes de souscription saisies via /onboarding (vitrine), validées par le super admin.',
  },
  labels: {
    singular: 'Demande de souscription',
    plural: 'Demandes de souscription',
  },
  access: {
    read: ({ req: { user } }) => (user as any)?.role === 'super_admin',
    // Toujours bloquer la création via l'API REST native Payload (/api/onboarding-requests).
    // La seule voie de création légitime est la route custom POST /api/marketing/onboarding,
    // qui fait CSRF + rate-limit + honeypot + Zod + CGV + email, puis appelle
    // payload.create({ ..., overrideAccess: true }) pour passer ce gate.
    create: () => false,
    update: ({ req: { user } }) => (user as any)?.role === 'super_admin',
    delete: ({ req: { user } }) => (user as any)?.role === 'super_admin',
  },
  fields: [
    // ── Identité de la structure ─────────────────────────────────────────
    {
      name: 'organizationName',
      type: 'text',
      label: 'Raison sociale',
      required: true,
      maxLength: 200,
    },
    {
      name: 'legalForm',
      type: 'select',
      label: 'Forme juridique',
      required: true,
      defaultValue: 'association_1901',
      options: [
        { label: 'Association loi 1901', value: 'association_1901' },
        { label: 'Club sportif amateur', value: 'club_sportif' },
        { label: 'SAS / SASU', value: 'sas' },
        { label: 'SARL', value: 'sarl' },
        { label: 'Autre', value: 'autre' },
      ],
    },
    {
      name: 'siren',
      type: 'text',
      label: 'SIREN / RNA (optionnel)',
      maxLength: 30,
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Adresse complète',
      required: true,
    },
    {
      name: 'sport',
      type: 'select',
      label: 'Sport / activité',
      required: true,
      defaultValue: 'voile',
      options: [
        { label: 'Voile', value: 'voile' },
        { label: 'Rugby', value: 'rugby' },
        { label: 'Pelote basque', value: 'pelote-basque' },
        { label: 'Autre activité', value: 'autre' },
      ],
    },

    // ── Représentant ─────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        { name: 'representativeName', type: 'text', label: 'Nom du représentant', required: true, maxLength: 200 },
        { name: 'representativeRole', type: 'text', label: 'Fonction', required: true, maxLength: 100 },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', label: 'Email', required: true },
        { name: 'phone', type: 'text', label: 'Téléphone', maxLength: 30 },
      ],
    },

    // ── Souscription ─────────────────────────────────────────────────────
    {
      name: 'plan',
      type: 'select',
      label: 'Formule',
      required: true,
      options: [
        { label: 'Essentiel — 29€ HT/mois', value: 'essentiel' },
        { label: 'Pulse — 49€ HT/mois', value: 'pulse' },
      ],
    },
    {
      name: 'paymentMode',
      type: 'select',
      label: 'Modalité de paiement',
      required: true,
      defaultValue: 'monthly',
      options: [
        { label: 'Mensuel (engagement 12 mois)', value: 'monthly' },
        { label: "Annuel d'avance (engagement 12 mois, -10%)", value: 'annual' },
      ],
    },
    {
      name: 'discountPercent',
      type: 'number',
      label: 'Remise commerciale (%)',
      defaultValue: 0,
      min: 0,
      max: 100,
      admin: {
        description: 'Remise commerciale appliquée par le super admin avant envoi du contrat (0-100). NB : la remise -10% pour paiement annuel est calculée séparément.',
      },
    },
    {
      name: 'discountNote',
      type: 'text',
      label: 'Justification de la remise',
      maxLength: 300,
    },

    // ── Workflow ─────────────────────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      label: 'Statut',
      required: true,
      defaultValue: 'pending',
      index: true,
      options: [
        { label: 'En attente de validation', value: 'pending' },
        { label: 'Validée (à envoyer)', value: 'validated' },
        { label: 'Contrat envoyé', value: 'sent' },
        { label: 'Signée et active', value: 'signed' },
        { label: 'Rejetée', value: 'rejected' },
      ],
    },
    {
      name: 'notesAdmin',
      type: 'textarea',
      label: 'Notes internes',
      admin: { description: 'Visible uniquement par le super admin' },
    },
    {
      name: 'rejectionReason',
      type: 'textarea',
      label: 'Motif de rejet',
    },

    // ── Lien éventuel avec le club créé manuellement ─────────────────────
    {
      name: 'club',
      type: 'relationship',
      relationTo: 'clubs',
      label: 'Club lié',
      admin: {
        description: 'Renseigné manuellement après réception du contrat signé et création du club tenant.',
      },
    },

    // ── Métadonnées ──────────────────────────────────────────────────────
    {
      name: 'token',
      type: 'text',
      label: 'Jeton public (UUID)',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Jeton public utilisé pour la page /onboarding/merci/<token>',
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      label: 'IP de soumission',
      admin: { readOnly: true },
    },
    {
      name: 'cgvAccepted',
      type: 'checkbox',
      label: 'CGV acceptées',
      defaultValue: false,
    },
    {
      name: 'validatedAt',
      type: 'date',
      label: 'Date de validation',
      admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'sentAt',
      type: 'date',
      label: 'Date d\'envoi du contrat',
      admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
  ],
  timestamps: true,
}

export default OnboardingRequests
