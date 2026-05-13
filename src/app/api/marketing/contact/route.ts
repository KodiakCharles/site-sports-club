import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { isValidOrigin } from '@/lib/utils/csrf'
import { rateLimit, getClientIp } from '@/lib/utils/rateLimit'
import { sendMail } from '@/lib/utils/mailer'

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  organizationName: z.string().max(200).optional().default(''),
  phone: z.string().max(30).optional().default(''),
  sport: z.enum(['', 'voile', 'rugby', 'pelote-basque', 'autre']).optional().default(''),
  subject: z.enum(['demo', 'devis', 'question', 'autre']).optional().default('demo'),
  message: z.string().min(10).max(4000),
  website: z.string().max(0).optional(),
})

const SUBJECT_LABELS: Record<string, string> = {
  demo: 'Demande de démo',
  devis: 'Demande de devis sur mesure',
  question: 'Question',
  autre: 'Autre',
}

const SPORT_LABELS: Record<string, string> = {
  voile: 'Voile',
  rugby: 'Rugby',
  'pelote-basque': 'Pelote basque',
  autre: 'Autre activité',
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(req: NextRequest) {
  if (!isValidOrigin(req)) {
    return NextResponse.json({ error: 'Origine non autorisée' }, { status: 403 })
  }

  const ip = getClientIp(req)
  const rl = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60_000 })
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
  const subjectLabel = SUBJECT_LABELS[data.subject]
  const sportLabel = data.sport ? SPORT_LABELS[data.sport] ?? '—' : '—'
  const orgLabel = data.organizationName || '—'
  const phoneLabel = data.phone || '—'
  const messageHtml = escapeHtml(data.message).replace(/\n/g, '<br/>')

  try {
    await sendMail({
      to: 'contact@web-pulse.fr',
      replyTo: data.email,
      subject: `[Web Pulse] ${subjectLabel} — ${escapeHtml(data.name)}${data.organizationName ? ` (${escapeHtml(data.organizationName)})` : ''}`,
      html: `
        <h2>Nouveau message via le formulaire de contact</h2>
        <p><strong>Sujet :</strong> ${escapeHtml(subjectLabel)}</p>
        <hr/>
        <p><strong>Nom :</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email :</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
        <p><strong>Club / association :</strong> ${escapeHtml(orgLabel)}</p>
        <p><strong>Téléphone :</strong> ${escapeHtml(phoneLabel)}</p>
        <p><strong>Sport :</strong> ${escapeHtml(sportLabel)}</p>
        <hr/>
        <p><strong>Message :</strong></p>
        <p>${messageHtml}</p>
        <hr/>
        <p style="font-size:12px;color:#6b7280">IP : ${escapeHtml(ip)}</p>
      `,
    })
  } catch (err) {
    console.error('[contact] notif super admin failed:', err)
    return NextResponse.json(
      { error: "L'envoi de l'email a échoué. Réessayez plus tard." },
      { status: 502 },
    )
  }

  try {
    await sendMail({
      to: { email: data.email, name: data.name },
      subject: 'Votre message a bien été reçu — Web Pulse',
      html: `
        <p>Bonjour ${escapeHtml(data.name)},</p>
        <p>Nous avons bien reçu votre message et nous vous répondrons <strong>sous 24h ouvrables</strong>.</p>
        <p>Pour rappel, voici votre demande :</p>
        <blockquote style="border-left:3px solid #f59e0b;padding:8px 14px;color:#475569;background:#fffbeb">
          <strong>${escapeHtml(subjectLabel)}</strong><br/>
          ${messageHtml}
        </blockquote>
        <p>À très vite,<br/>L'équipe Web Pulse</p>
        <hr/>
        <p style="font-size:12px;color:#6b7280">CGC SAS — RCS Dax 983 956 525 — 37B rue du Docteur Gronich, 40220 Tarnos<br/>
        <a href="https://www.web-pulse.fr">www.web-pulse.fr</a> · <a href="mailto:contact@web-pulse.fr">contact@web-pulse.fr</a></p>
      `,
    })
  } catch (err) {
    console.error('[contact] accusé client failed:', err)
  }

  return NextResponse.json({ success: true })
}
