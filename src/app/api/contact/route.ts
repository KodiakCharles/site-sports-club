import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { resolveClub } from '@/lib/utils/tenant'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(2000),
  // Honeypot anti-spam (doit rester vide)
  website: z.string().max(0).optional(),
})

export async function POST(req: NextRequest) {
  // Vérification CSRF : l'Origin doit correspondre au Host
  const origin = req.headers.get('origin')
  const host = req.headers.get('host')
  if (origin && host) {
    try {
      const originHost = new URL(origin).host
      if (originHost !== host) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } catch {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  let body: Record<string, unknown>
  const contentType = req.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    body = await req.json() as Record<string, unknown>
  } else if (contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await req.formData()
    const firstName = formData.get('firstName') as string ?? ''
    const lastName = formData.get('lastName') as string ?? ''
    body = {
      name: `${firstName} ${lastName}`.trim(),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      website: formData.get('_gotcha'),
    }
  } else {
    return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 })
  }

  // Anti-spam honeypot
  if (body.website) return NextResponse.json({ success: true })

  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const clubId = await resolveClub()
  if (!clubId) return NextResponse.json({ error: 'Club not found' }, { status: 404 })

  const { getPayload } = await import('payload')
  const config = await import('@payload-config')
  const payload = await getPayload({ config: config.default })
  const club = await payload.findByID({ collection: 'clubs', id: clubId })
  const clubData = club as Record<string, unknown> & { contact?: { email?: string }; name?: string }
  const clubEmail = clubData?.contact?.email

  if (!clubEmail) return NextResponse.json({ error: 'Club email not configured' }, { status: 500 })

  const { name, email, phone, subject, message } = parsed.data

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'noreply@voileweb.fr',
    to: clubEmail,
    reply_to: email,
    subject: `[Contact] ${subject}`,
    html: `
      <h2>Nouveau message de contact</h2>
      <p><strong>Nom :</strong> ${name}</p>
      <p><strong>Email :</strong> ${email}</p>
      ${phone ? `<p><strong>Téléphone :</strong> ${phone}</p>` : ''}
      <p><strong>Objet :</strong> ${subject}</p>
      <hr/>
      <p>${message.replace(/\n/g, '<br/>')}</p>
    `,
  })

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'noreply@voileweb.fr',
    to: email,
    subject: `Votre message a bien été reçu`,
    html: `<p>Bonjour ${name},</p><p>Nous avons bien reçu votre message et vous répondrons dans les meilleurs délais.</p>`,
  })

  return NextResponse.json({ success: true })
}
