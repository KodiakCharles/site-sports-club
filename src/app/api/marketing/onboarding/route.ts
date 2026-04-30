import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getPayload } from 'payload'
import config from '@payload-config'
import { isValidOrigin } from '@/lib/utils/csrf'
import { rateLimit, getClientIp } from '@/lib/utils/rateLimit'
import { sendMail } from '@/lib/utils/mailer'

const schema = z.object({
  organizationName: z.string().min(2).max(200),
  legalForm: z.enum(['association_1901', 'club_sportif', 'sas', 'sarl', 'autre']),
  siren: z.string().max(30).optional().default(''),
  address: z.string().min(10).max(500),
  sport: z.enum(['voile', 'rugby', 'pelote-basque', 'autre']),
  representativeName: z.string().min(2).max(200),
  representativeRole: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional().default(''),
  plan: z.enum(['essentiel', 'pulse']),
  paymentMode: z.enum(['monthly', 'annual']),
  cgvAccepted: z.literal(true),
  website: z.string().max(0).optional(), // honeypot
})

const PLAN_PRICES: Record<'essentiel' | 'pulse', number> = {
  essentiel: 29,
  pulse: 49,
}

const PLAN_LABELS: Record<'essentiel' | 'pulse', string> = {
  essentiel: 'Essentiel',
  pulse: 'Pulse',
}

const SPORT_LABELS: Record<string, string> = {
  voile: 'Voile',
  rugby: 'Rugby',
  'pelote-basque': 'Pelote basque',
  autre: 'Autre activité',
}

const LEGAL_LABELS: Record<string, string> = {
  association_1901: 'Association loi 1901',
  club_sportif: 'Club sportif amateur',
  sas: 'SAS / SASU',
  sarl: 'SARL',
  autre: 'Autre',
}

function uuid(): string {
  // Disponible dans Node 20+ et runtime Edge/Web crypto
  return globalThis.crypto.randomUUID()
}

export async function POST(req: NextRequest) {
  if (!isValidOrigin(req)) {
    return NextResponse.json({ error: 'Origine non autorisée' }, { status: 403 })
  }

  const ip = getClientIp(req)
  const rl = rateLimit(`onboarding:${ip}`, { limit: 5, windowMs: 10 * 60_000 })
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Trop de demandes. Réessayez plus tard.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }

  // Honeypot
  if (typeof body === 'object' && body !== null && (body as Record<string, unknown>).website) {
    return NextResponse.json({ success: true })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (typeof key === 'string' && !fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return NextResponse.json({ error: 'Données invalides', fields: fieldErrors }, { status: 400 })
  }

  const data = parsed.data
  const token = uuid()

  const payload = await getPayload({ config })

  try {
    const created = await payload.create({
      collection: 'onboarding-requests',
      // La collection a access.create:()=>false pour bloquer l'API REST native Payload.
      // Cette route est l'unique voie légitime — overrideAccess passe outre le gate.
      overrideAccess: true,
      data: {
        organizationName: data.organizationName,
        legalForm: data.legalForm,
        siren: data.siren,
        address: data.address,
        sport: data.sport,
        representativeName: data.representativeName,
        representativeRole: data.representativeRole,
        email: data.email,
        phone: data.phone,
        plan: data.plan,
        paymentMode: data.paymentMode,
        status: 'pending',
        token,
        ipAddress: ip,
        cgvAccepted: true,
      },
    })

    // ── Email de notification au super admin ─────────────────────────────
    try {
      const basePrice = PLAN_PRICES[data.plan]
      const annualGross = basePrice * 12
      const annualTotal =
        data.paymentMode === 'annual' ? Math.round(annualGross * 0.9 * 100) / 100 : annualGross

      const adminUrl = `${req.nextUrl.origin}/admin/collections/onboarding-requests/${created.id}`

      await sendMail({
        to: 'contact@web-pulse.fr',
        replyTo: data.email,
        subject: `[Web Pulse] Nouvelle demande de souscription — ${data.organizationName}`,
        html: `
          <h2>Nouvelle demande de souscription</h2>
          <p><strong>Structure :</strong> ${data.organizationName} (${LEGAL_LABELS[data.legalForm]})</p>
          <p><strong>SIREN/RNA :</strong> ${data.siren || '—'}</p>
          <p><strong>Adresse :</strong> ${data.address.replace(/\n/g, '<br/>')}</p>
          <p><strong>Activité :</strong> ${SPORT_LABELS[data.sport]}</p>
          <hr/>
          <p><strong>Représentant :</strong> ${data.representativeName} (${data.representativeRole})</p>
          <p><strong>Email :</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p><strong>Téléphone :</strong> ${data.phone || '—'}</p>
          <hr/>
          <p><strong>Formule :</strong> ${PLAN_LABELS[data.plan]} — ${basePrice} € HT/mois</p>
          <p><strong>Paiement :</strong> ${data.paymentMode === 'annual' ? "Annuel d'avance (-10%)" : 'Mensuel'} · engagement 12 mois</p>
          <p><strong>Total annuel HT :</strong> ${annualTotal.toFixed(2).replace('.', ',')} €</p>
          <hr/>
          <p>À traiter dans la console super admin :</p>
          <p><a href="${adminUrl}">${adminUrl}</a></p>
        `,
      })
    } catch (err) {
      // Ne bloque pas la confirmation utilisateur si l'email échoue
      console.error('[onboarding] notif super admin failed:', err)
    }

    // ── Accusé de réception client ───────────────────────────────────────
    try {
      await sendMail({
        to: { email: data.email, name: data.representativeName },
        subject: 'Votre demande de souscription Web Pulse a bien été reçue',
        html: `
          <p>Bonjour ${data.representativeName},</p>
          <p>Nous avons bien reçu votre demande de souscription pour <strong>${data.organizationName}</strong> (formule <strong>${PLAN_LABELS[data.plan]}</strong>).</p>
          <p>Nous vous renvoyons votre contrat de souscription par email <strong>sous 48h ouvrées</strong>. Aucun paiement automatique n'est mis en place : la facture vous sera adressée séparément.</p>
          <p>Pour toute question, vous pouvez nous joindre à <a href="mailto:contact@web-pulse.fr">contact@web-pulse.fr</a>.</p>
          <p>L'équipe Web Pulse</p>
          <hr/>
          <p style="font-size:12px;color:#6b7280">CGC SAS — RCS Dax 983 956 525 — 37B rue du Docteur Gronich, 40220 Tarnos</p>
        `,
      })
    } catch (err) {
      console.error('[onboarding] accusé client failed:', err)
    }

    return NextResponse.json({ success: true, token })
  } catch (err) {
    console.error('[onboarding] payload.create failed:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
