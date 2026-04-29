/**
 * Génération du contrat de souscription Web Pulse en PDF.
 *
 * Utilisé par la route GET /api/admin/onboarding/[id]/contract-pdf (super_admin only).
 * Inspiré de l'équivalent Python (reportlab) du projet agent-community-manager.
 */

import PDFDocument from 'pdfkit'

type Plan = 'essentiel' | 'pulse'
type PaymentMode = 'monthly' | 'annual'

export interface OnboardingForPdf {
  organizationName: string
  legalForm: string
  siren?: string | null
  address: string
  sport: string
  representativeName: string
  representativeRole: string
  email: string
  phone?: string | null
  plan: Plan
  paymentMode: PaymentMode
  discountPercent?: number | null
  discountNote?: string | null
}

export interface BankSettings {
  bankAccountHolder?: string | null
  bankHolderAddress?: string | null
  bankIban?: string | null
  bankBic?: string | null
  bankName?: string | null
  bankDomiciliation?: string | null
  bankSwiftPartnerBic?: string | null
}

const PLAN_PRICES: Record<Plan, number> = { essentiel: 29, pulse: 49 }
const ANNUAL_DISCOUNT = 0.1

const COLOR_PRIMARY = '#f59e0b'
const COLOR_DARK = '#0f172a'
const COLOR_GREY = '#475569'
const COLOR_BORDER = '#cbd5e1'

const LEGAL_LABELS: Record<string, string> = {
  association_1901: 'Association loi 1901',
  club_sportif: 'Club sportif amateur',
  sas: 'SAS / SASU',
  sarl: 'SARL',
  autre: 'Autre',
}

const SPORT_LABELS: Record<string, string> = {
  voile: 'Voile',
  rugby: 'Rugby',
  'pelote-basque': 'Pelote basque',
  autre: 'Autre activité',
}

function formatPrice(amount: number): string {
  return amount.toFixed(2).replace('.', ',') + ' €'
}

function checkbox(checked: boolean): string {
  // Helvetica (police par défaut de pdfkit) ne supporte pas les glyphes Unicode
  // ☑/☐ — on retombe sur de l'ASCII universellement rendu.
  return checked ? '[X]' : '[ ]'
}

interface Pricing {
  baseMonthly: number
  discountPercent: number
  discountAmount: number
  finalMonthly: number
  annualGross: number
  annualDiscountAmount: number
  annualTotal: number
}

function computePricing(req: OnboardingForPdf): Pricing {
  const baseMonthly = PLAN_PRICES[req.plan]
  const discountPercent = req.discountPercent ?? 0
  const discountAmount = Math.round(baseMonthly * discountPercent) / 100
  const finalMonthly = Math.round((baseMonthly - discountAmount) * 100) / 100
  const annualGross = Math.round(finalMonthly * 12 * 100) / 100
  const annualDiscountAmount =
    req.paymentMode === 'annual' ? Math.round(annualGross * ANNUAL_DISCOUNT * 100) / 100 : 0
  const annualTotal = Math.round((annualGross - annualDiscountAmount) * 100) / 100
  return {
    baseMonthly,
    discountPercent,
    discountAmount,
    finalMonthly,
    annualGross,
    annualDiscountAmount,
    annualTotal,
  }
}

export async function renderContractPdf(
  req: OnboardingForPdf,
  bank: BankSettings = {},
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 56, bottom: 56, left: 62, right: 62 },
      info: {
        Title: `Contrat de souscription — ${req.organizationName}`,
        Author: 'CGC SAS — Web Pulse',
      },
    })

    const chunks: Buffer[] = []
    doc.on('data', (c: Buffer) => chunks.push(c))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const pricing = computePricing(req)

    // ── Titre ───────────────────────────────────────────────────────────
    doc
      .font('Helvetica-Bold')
      .fontSize(20)
      .fillColor(COLOR_PRIMARY)
      .text('CONTRAT DE SOUSCRIPTION', { align: 'center' })
      .moveDown(0.2)
    doc
      .font('Helvetica-Oblique')
      .fontSize(11)
      .fillColor(COLOR_GREY)
      .text('Service Web Pulse', { align: 'center' })
      .moveDown(1.4)

    h1(doc, 'ENTRE LES SOUSSIGNÉS')
    body(
      doc,
      "La société CGC, société par actions simplifiée à associé unique au capital de 1 000 euros, dont le siège social est situé 37B rue du Docteur Gronich – 40220 Tarnos, immatriculée au Registre du Commerce et des Sociétés de Dax sous le numéro 983 956 525, représentée par la société KODIAK, société par actions simplifiée dont le siège social est situé 37B rue du Docteur Gronich – 40220 Tarnos, immatriculée au Registre du Commerce et des Sociétés de Dax sous le numéro 982 748 675, en sa qualité de Présidente, elle-même représentée par son représentant légal en exercice, dûment habilité aux fins des présentes.",
    )
    body(doc, "Ci-après dénommée « l'Éditeur »")
    body(doc, 'ET')

    const sirenPart = req.siren ? `immatriculée sous le numéro ${req.siren}, ` : ''
    body(
      doc,
      `La structure ${req.organizationName}, ${LEGAL_LABELS[req.legalForm] ?? req.legalForm}, dont le siège social est situé ${req.address.replace(/\n/g, ', ')}, ${sirenPart}représentée par ${req.representativeName} en sa qualité de ${req.representativeRole}, dûment habilité(e) aux fins des présentes.`,
    )
    body(doc, 'Ci-après dénommée « le Client »')
    body(doc, 'Ci-après dénommées ensemble « les Parties ».')

    // ── Préambule ───────────────────────────────────────────────────────
    h1(doc, 'PRÉAMBULE')
    body(
      doc,
      `L'Éditeur édite et exploite une solution logicielle accessible en mode SaaS (Software as a Service), dénommée « Web Pulse », accessible à l'adresse https://www.web-pulse.fr. Cette solution permet aux clubs sportifs amateurs et aux associations à but non lucratif (loi 1901) de disposer d'un site internet sur leur propre nom de domaine, avec back-office de publication, modules métier (${SPORT_LABELS[req.sport] ?? req.sport}) et fonctionnalités sport-spécifiques.`,
    )
    body(
      doc,
      "Le Client souhaite souscrire à cette solution dans les conditions définies au présent contrat (ci-après le « Contrat ») et accepter les Conditions Générales de Vente (CGV) accessibles à l'adresse https://www.web-pulse.fr/cgv, qui en font partie intégrante.",
    )
    body(doc, 'EN CONSÉQUENCE, IL A ÉTÉ CONVENU CE QUI SUIT :')

    // ── Article 1 ───────────────────────────────────────────────────────
    h1(doc, 'ARTICLE 1 — OBJET')
    body(
      doc,
      "Le présent Contrat a pour objet de définir les conditions dans lesquelles l'Éditeur met à la disposition du Client la solution Web Pulse, dans la formule choisie ci-après, ainsi que les obligations réciproques des Parties.",
    )

    // ── Article 2 ───────────────────────────────────────────────────────
    h1(doc, 'ARTICLE 2 — FORMULE SOUSCRITE')
    body(doc, 'Le Client souscrit à la formule indiquée ci-dessous :')

    h2(doc, `${checkbox(req.plan === 'essentiel')}  Formule ESSENTIEL — 29,00 € HT / mois`)
    bullets(doc, [
      'Site web complet multi-pages sur votre nom de domaine',
      'Back-office CMS pour publier articles, stages, comptes rendus',
      'Inscription newsletter et formulaire de contact',
      'Multilingue FR uniquement',
      'Support email',
    ])

    h2(doc, `${checkbox(req.plan === 'pulse')}  Formule PULSE — 49,00 € HT / mois`)
    bullets(doc, [
      'Toutes les fonctionnalités Essentiel incluses',
      'Chatbot IA branché sur votre base de connaissances',
      'Espace adhérent complet (inscription, profil, opt-in)',
      'Multilingue FR / EN / ES',
      'Modules sport-spécifiques (météo marine, réservation fronton, location matériel…)',
      'Support prioritaire',
    ])

    // Encadré tarif
    if (pricing.discountPercent > 0 || req.paymentMode === 'annual') {
      doc.moveDown(0.3)
      body(doc, 'Tarif applicable', { bold: true })
      body(doc, `Prix mensuel HT de référence : ${formatPrice(pricing.baseMonthly)} HT`)
      if (pricing.discountPercent > 0) {
        body(
          doc,
          `Remise commerciale consentie : ${pricing.discountPercent}%${
            req.discountNote ? ' — ' + req.discountNote : ''
          }`,
        )
        body(
          doc,
          `Prix mensuel HT après remise commerciale : ${formatPrice(pricing.finalMonthly)} HT`,
        )
      }
      if (req.paymentMode === 'annual') {
        body(
          doc,
          `Remise paiement annuel d'avance : -10% sur le total annuel (soit ${formatPrice(pricing.annualDiscountAmount)} HT économisés)`,
        )
        body(doc, `Total annuel HT à régler : ${formatPrice(pricing.annualTotal)} HT`, { bold: true })
      } else {
        body(
          doc,
          `Total annuel HT : ${formatPrice(pricing.annualTotal)} HT (12 × ${formatPrice(pricing.finalMonthly)})`,
          { bold: true },
        )
      }
    }

    // ── Article 3 — Durée & Engagement ─────────────────────────────────
    h1(doc, 'ARTICLE 3 — DURÉE & ENGAGEMENT')
    body(
      doc,
      "Le présent Contrat est conclu pour une durée ferme et irrévocable de douze (12) mois à compter de la date de souscription, ci-après l'« Engagement Annuel », quelle que soit la modalité de paiement retenue à l'Article 4.",
    )
    body(
      doc,
      "À l'issue de cette période initiale, le Contrat est tacitement renouvelé par périodes successives de douze (12) mois, sauf dénonciation par l'une des Parties par lettre recommandée avec accusé de réception adressée au moins trente (30) jours calendaires avant l'échéance annuelle.",
    )
    body(
      doc,
      "Toute résiliation anticipée du fait du Client pendant la période d'Engagement Annuel rend exigibles l'intégralité des mensualités restant à courir jusqu'au terme de la période en cours.",
    )

    // ── Article 4 — Prix & paiement ────────────────────────────────────
    h1(doc, 'ARTICLE 4 — PRIX ET MODALITÉS DE PAIEMENT')
    h2(doc, '4.1 — Prix')
    body(
      doc,
      "Les prix mentionnés à l'Article 2 s'entendent hors taxes. La TVA en vigueur sera appliquée sur chaque facture conformément à la réglementation française.",
    )

    h2(doc, '4.2 — Modalité de paiement retenue')
    body(
      doc,
      `${checkbox(req.paymentMode === 'monthly')}  Paiement mensuel — règlement à terme à échoir, par virement bancaire, à réception de la facture émise en début de chaque mois pendant toute la durée de l'Engagement Annuel.`,
    )
    body(
      doc,
      `${checkbox(req.paymentMode === 'annual')}  Paiement annuel d'avance (-10%) — règlement en une seule fois de la totalité de l'Engagement Annuel (soit ${formatPrice(pricing.annualTotal)} HT, après application de la remise de 10%), par virement bancaire, à réception de la facture émise à la souscription.`,
    )

    h2(doc, '4.3 — Coordonnées bancaires')
    body(doc, 'Les paiements sont effectués par virement sur le compte bancaire suivant :')
    const placeholder = '[À renseigner via /admin/globals/platform-settings]'
    const bankLines = [
      `Titulaire du compte : ${bank.bankAccountHolder || placeholder}`,
    ]
    if (bank.bankHolderAddress) {
      bankLines.push(`Adresse du titulaire : ${bank.bankHolderAddress}`)
    }
    bankLines.push(
      `IBAN : ${bank.bankIban || placeholder}`,
      `BIC / SWIFT : ${bank.bankBic || placeholder}`,
      `Banque : ${bank.bankName || placeholder}`,
    )
    if (bank.bankDomiciliation) {
      bankLines.push(`Domiciliation : ${bank.bankDomiciliation}`)
    }
    if (bank.bankSwiftPartnerBic) {
      bankLines.push(
        `Pour les virements SWIFT internationaux, BIC partenaire : ${bank.bankSwiftPartnerBic}`,
      )
    }
    bullets(doc, bankLines)

    h2(doc, '4.4 — Retard de paiement')
    body(
      doc,
      "Tout retard de paiement entraînera, de plein droit et sans mise en demeure préalable, l'application d'intérêts de retard au taux de trois fois le taux d'intérêt légal en vigueur, ainsi qu'une indemnité forfaitaire pour frais de recouvrement de 40 euros (article D. 441-5 du Code de commerce). En cas de non-règlement dans un délai de quinze (15) jours après mise en demeure restée infructueuse, l'Éditeur pourra suspendre l'accès au service, sans préjudice de sa faculté de résilier le Contrat aux torts du Client.",
    )

    if (req.plan === 'pulse') {
      h2(doc, '4.5 — Coût des tokens d\'IA')
      body(
        doc,
        "Pour la formule Pulse, le coût des tokens consommés par le moteur d'intelligence artificielle (chatbot) est inclus dans la formule dans la limite d'un quota mensuel défini aux CGV. Toute consommation au-delà de ce quota est facturée en sus selon un coefficient appliqué au coût réel constaté. Le Client peut consulter sa consommation en temps réel et paramétrer un plafond mensuel.",
      )
    }

    // ── Article 5 — Mise à disposition ─────────────────────────────────
    h1(doc, 'ARTICLE 5 — MISE À DISPOSITION DU SERVICE')
    body(
      doc,
      "L'Éditeur s'engage à mettre à disposition du Client la solution dans un délai maximum de sept (7) jours ouvrés à compter de la signature du présent Contrat et de la réception du premier paiement. L'accès se fait via les identifiants personnels remis au Client. Le Client est seul responsable de la confidentialité de ces identifiants.",
    )

    // ── Article 6 — Obligations du Client ──────────────────────────────
    h1(doc, 'ARTICLE 6 — OBLIGATIONS DU CLIENT')
    body(doc, "Le Client s'engage à :")
    bullets(doc, [
      'utiliser le service conformément à sa destination et aux CGV ;',
      "ne pas porter atteinte aux droits de tiers (image, auteur, marques, données personnelles) ;",
      "recueillir les autorisations nécessaires (droit à l'image, autorisations parentales) avant tout upload ;",
      "relire systématiquement les contenus générés par l'IA avant publication, le cas échéant ;",
      'régler les sommes dues aux échéances convenues.',
    ])

    // ── Article 7 — PI ─────────────────────────────────────────────────
    h1(doc, 'ARTICLE 7 — PROPRIÉTÉ INTELLECTUELLE')
    body(
      doc,
      "La solution Web Pulse, son code source, sa documentation, sa marque et son nom de domaine demeurent la propriété exclusive de l'Éditeur. Le Contrat n'emporte aucune cession de droits, mais uniquement un droit d'usage personnel et non exclusif pendant la durée du Contrat.",
    )
    body(
      doc,
      'Les contenus créés ou téléversés par le Client (textes, articles, photos, logos) demeurent la propriété exclusive du Client.',
    )

    // ── Article 8 — RGPD ───────────────────────────────────────────────
    h1(doc, 'ARTICLE 8 — DONNÉES À CARACTÈRE PERSONNEL')
    body(
      doc,
      "L'Éditeur agit en qualité de sous-traitant des données traitées pour le compte du Client (responsable de traitement) au sens du RGPD. Les modalités sont définies dans la Politique de confidentialité accessible à l'adresse https://www.web-pulse.fr/confidentialite. Une annexe de sous-traitance (DPA) peut être signée à la demande du Client.",
    )

    // ── Article 9 — Responsabilité ─────────────────────────────────────
    h1(doc, 'ARTICLE 9 — RESPONSABILITÉ')
    body(
      doc,
      "L'Éditeur est tenu d'une obligation de moyens. Sa responsabilité est expressément limitée au montant total des sommes effectivement payées par le Client au titre du Contrat sur les douze (12) mois précédant le fait générateur. L'Éditeur ne saurait en aucun cas être tenu responsable des dommages indirects ou immatériels.",
    )

    // ── Article 10 — Résiliation ──────────────────────────────────────
    h1(doc, 'ARTICLE 10 — RÉSILIATION')
    body(
      doc,
      "En cas de manquement grave de l'une des Parties, l'autre Partie pourra résilier le Contrat de plein droit, après mise en demeure restée infructueuse pendant trente (30) jours calendaires, sans préjudice de tous dommages et intérêts.",
    )

    // ── Article 11 — Confidentialité ──────────────────────────────────
    h1(doc, 'ARTICLE 11 — CONFIDENTIALITÉ')
    body(
      doc,
      "Chacune des Parties s'engage à préserver la confidentialité des informations et documents auxquels elle a accès dans le cadre du Contrat, pendant toute sa durée et pendant trois (3) ans après son terme.",
    )

    // ── Article 12 — Juridiction ──────────────────────────────────────
    h1(doc, 'ARTICLE 12 — DROIT APPLICABLE & JURIDICTION')
    body(
      doc,
      "Le présent Contrat est régi par le droit français. Tout litige relatif à sa formation, son exécution, son interprétation ou sa résiliation, à défaut d'accord amiable dans un délai de trente (30) jours, sera soumis à la compétence exclusive du Tribunal de commerce de Dax, nonobstant pluralité de défendeurs ou appel en garantie.",
    )

    // ── Signatures ────────────────────────────────────────────────────
    doc.moveDown(1)
    h1(doc, 'SIGNATURES')
    body(
      doc,
      'Fait à _____________________________, le ____ / ____ / __________, en deux (2) exemplaires originaux, dont un remis à chaque Partie.',
    )
    doc.moveDown(0.6)

    drawSignatureTable(doc, req)

    doc.moveDown(1.2)
    doc
      .font('Helvetica-Oblique')
      .fontSize(8.5)
      .fillColor(COLOR_GREY)
      .text(
        'Contrat prêt à être signé. Merci de retourner les deux exemplaires paraphés et signés à : contact@web-pulse.fr.',
        { align: 'left' },
      )

    doc.end()
  })
}

// ── Helpers de mise en page ──────────────────────────────────────────────
function h1(doc: PDFKit.PDFDocument, text: string): void {
  doc.moveDown(0.8)
  doc.font('Helvetica-Bold').fontSize(12.5).fillColor(COLOR_PRIMARY).text(text)
  doc.moveDown(0.2)
}

function h2(doc: PDFKit.PDFDocument, text: string): void {
  doc.moveDown(0.4)
  doc.font('Helvetica-Bold').fontSize(11).fillColor(COLOR_DARK).text(text)
  doc.moveDown(0.1)
}

function body(doc: PDFKit.PDFDocument, text: string, opts?: { bold?: boolean }): void {
  doc
    .font(opts?.bold ? 'Helvetica-Bold' : 'Helvetica')
    .fontSize(10)
    .fillColor(COLOR_DARK)
    .text(text, { align: 'justify' })
  doc.moveDown(0.3)
}

function bullets(doc: PDFKit.PDFDocument, items: string[]): void {
  doc.font('Helvetica').fontSize(10).fillColor(COLOR_DARK)
  for (const item of items) {
    doc.text(`• ${item}`, { indent: 14, align: 'left' })
    doc.moveDown(0.1)
  }
  doc.moveDown(0.2)
}

function drawSignatureTable(doc: PDFKit.PDFDocument, req: OnboardingForPdf): void {
  const startX = doc.page.margins.left
  const usableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right
  const colWidth = usableWidth / 2
  const headerHeight = 28
  const cellHeight = 150
  let y = doc.y

  // En-têtes (fond couleur primaire)
  doc.rect(startX, y, usableWidth, headerHeight).fill(COLOR_PRIMARY)
  doc
    .fillColor('#ffffff')
    .font('Helvetica-Bold')
    .fontSize(10)
    .text("Pour l'Éditeur — CGC SAS", startX, y + 9, { width: colWidth, align: 'center' })
  doc.text(`Pour le Client — ${req.organizationName}`, startX + colWidth, y + 9, {
    width: colWidth,
    align: 'center',
  })

  y += headerHeight

  // Cellules
  doc.rect(startX, y, colWidth, cellHeight).stroke(COLOR_BORDER)
  doc.rect(startX + colWidth, y, colWidth, cellHeight).stroke(COLOR_BORDER)

  doc
    .fillColor(COLOR_DARK)
    .font('Helvetica')
    .fontSize(9)
    .text(
      'Représentée par la société KODIAK SAS,\nPrésidente, elle-même représentée\npar son représentant légal en exercice\n\nDate : ____ / ____ / ________\n\nLu et approuvé,\n\n\nSignature :',
      startX + 12,
      y + 12,
      { width: colWidth - 24 },
    )
  doc.text(
    `${req.representativeName}\nQualité : ${req.representativeRole}\n\nDate : ____ / ____ / ________\n\nLu et approuvé,\n\n\nSignature :`,
    startX + colWidth + 12,
    y + 12,
    { width: colWidth - 24 },
  )

  doc.y = y + cellHeight + 8
}
