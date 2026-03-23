import type { CollectionConfig } from 'payload'

const Stages: CollectionConfig = {
  slug: 'stages',
  admin: {
    useAsTitle: 'title',
    group: 'Contenu',
    defaultColumns: ['title', 'support', 'level', 'startDate', 'spotsLeft'],
  },
  labels: {
    singular: 'Stage',
    plural: 'Stages',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titre du stage',
      required: true,
    },
    {
      name: 'support',
      type: 'select',
      label: 'Support nautique',
      required: true,
      options: [
        { label: 'Optimist', value: 'optimist' },
        { label: 'Laser ILCA', value: 'laser' },
        { label: 'Catamaran', value: 'catamaran' },
        { label: 'Planche à voile / Windsurf', value: 'windsurf' },
        { label: 'Wing Foil / Foil', value: 'foil' },
        { label: 'Voile habitable / Croisière', value: 'croisiere' },
        { label: 'Kayak / SUP', value: 'kayak' },
        { label: 'Autre', value: 'autre' },
      ],
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
      label: 'URL d\'inscription',
    },
  ],
}

export default Stages
