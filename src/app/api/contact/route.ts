import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { resolveClub } from '@/lib/utils/tenant'
import { isValidOrigin } from '@/lib/utils/csrf'
import { rateLimit, getClientIp } from '@/lib/utils/rateLimit'
import { Resend } from 'resend'

const getResend = () => new Resend(process.env.RESEND_API_KEY)

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(2000),
  website: z.string().max(0).optional(), // honeypot
})

export async function POST(req: NextRequest) {
  // CSRF
  if (!isValidOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Rate limiting : 5 requêtes / 10 minutes par IP
  const ip = getClientIp(req)
  const rl = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60_000 })
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
    )
  }

  let body: Record<string, unknown>
  const contentType = req.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    body = await req.json() as Record<string, unknown>
  } else if (contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await req.formData()
    const firstName = (formData.get('firstName') as string) ?? ''
    const lastName = (formData.get('lastName') as string) ?? ''
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

  // Honeypot anti-spam
  if (body.website) return NextResponse.json({ success: true })

  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const clubId = await resolveClub()
  if (!clubId) return NextResponse.json({ error: 'Club not found' }, { status: 404 })

  const { getPayload } = await import('payload')
  const config = await import('@payload-config')
  const payload = await getPayload({ config: config.default })
  const club = await payload.findByID({ collection: 'clubs', id: clubId })
  const clubData = club as Record<string, unknown> & {
    contact?: { email?: string }
    name?: string
  }
  const clubEmail = clubData?.contact?.email

  if (!clubEmail) return NextResponse.json({ error: 'Club email not configured' }, { status: 500 })

  const { name, email, phone, subject, message } = parsed.data

  await getResend().emails.send({
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

  await getResend().emails.send({
    from: process.env.EMAIL_FROM ?? 'noreply@voileweb.fr',
    to: email,
    subject: `Votre message a bien été reçu`,
    html: `<p>Bonjour ${name},</p><p>Nous avons bien reçu votre message et vous répondrons dans les meilleurs délais.</p>`,
  })

  return NextResponse.json({ success: true })
}
