import type { GlobalConfig } from 'payload'

/**
 * PlatformSettings — singleton réservé au super_admin.
 *
 * Stocke les coordonnées bancaires de l'éditeur (CGC SAS) utilisées dans
 * le PDF du contrat de souscription (Article 4.3). Évite de hardcoder
 * l'IBAN dans le code ou de le coller dans une env var.
 *
 * Édité via /admin/globals/platform-settings (groupe « Super Admin »).
 */
const PlatformSettings: GlobalConfig = {
  slug: 'platform-settings',
  label: 'Paramètres plateforme',
  admin: {
    group: 'Super Admin',
    description:
      'Coordonnées bancaires de CGC SAS pour les contrats de souscription. Visible et éditable uniquement par le super_admin.',
  },
  access: {
    read: ({ req: { user } }) => (user as any)?.role === 'super_admin',
    update: ({ req: { user } }) => (user as any)?.role === 'super_admin',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Coordonnées bancaires CGC',
          description:
            'Ces informations apparaissent automatiquement dans l\'Article 4.3 du contrat de souscription PDF généré pour chaque client.',
          fields: [
            {
              name: 'bankAccountHolder',
              type: 'text',
              label: 'Titulaire du compte',
              defaultValue: 'CGC',
            },
            {
              name: 'bankHolderAddress',
              type: 'textarea',
              label: 'Adresse du titulaire',
              defaultValue: '37 bis rue du docteur Gronich, 40220 Tarnos',
            },
            {
              name: 'bankIban',
              type: 'text',
              label: 'IBAN',
              defaultValue: 'FR76 1695 8000 0169 9133 2993 045',
            },
            {
              name: 'bankBic',
              type: 'text',
              label: 'BIC / SWIFT',
              defaultValue: 'QNTOFRP1XXX',
            },
            {
              name: 'bankName',
              type: 'text',
              label: 'Banque',
              defaultValue: 'Qonto',
            },
            {
              name: 'bankDomiciliation',
              type: 'text',
              label: 'Domiciliation',
              defaultValue: 'Qonto (Olinda SAS), 18 rue de Navarin, 75009 Paris, France',
            },
            {
              name: 'bankSwiftPartnerBic',
              type: 'text',
              label: 'BIC partenaire SWIFT',
              defaultValue: 'TRWIBEB3XXX',
              admin: {
                description:
                  'BIC à fournir aux banques émettrices pour les virements SWIFT internationaux.',
              },
            },
          ],
        },
      ],
    },
  ],
}

export default PlatformSettings
