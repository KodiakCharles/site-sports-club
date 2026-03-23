import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { resolveClub } from '@/lib/utils/tenant'
import { isValidOrigin } from '@/lib/utils/csrf'
import { rateLimit, getClientIp } from '@/lib/utils/rateLimit'

const schema = z.object({
  email: z.string().email(),
  firstName: z.string().max(100).optional(),
  locale: z.enum(['fr', 'en', 'es']).default('fr'),
})

export async function POST(req: NextRequest) {
  // CSRF
  if (!isValidOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Rate limiting : 3 inscriptions / 1 heure par IP
  const ip = getClientIp(req)
  const rl = rateLimit(`newsletter:${ip}`, { limit: 3, windowMs: 60 * 60_000 })
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
    )
  }

  const body = await req.json() as unknown
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const clubId = await resolveClub()
  if (!clubId) return NextResponse.json({ error: 'Club not found' }, { status: 404 })

  const { email, firstName, locale } = parsed.data

  const { getPayload } = await import('payload')
  const config = await import('@payload-config')
  const payload = await getPayload({ config: config.default })
  const club = await payload.findByID({ collection: 'clubs', id: clubId })

  const clubData = club as Record<string, unknown> & {
    integrations?: { newsletterApiKey?: string; newsletterListId?: string }
  }
  const apiKey = clubData?.integrations?.newsletterApiKey
  const listId = clubData?.integrations?.newsletterListId

  if (!apiKey || !listId) {
    return NextResponse.json({ message: 'Newsletter not configured for this club' })
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: firstName ?? '', LOCALE: locale },
        listIds: [parseInt(listId)],
        updateEnabled: true,
      }),
    })

    if (!res.ok && res.status !== 204) {
      const err = await res.json() as { message?: string }
      throw new Error(err.message ?? 'Brevo error')
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Newsletter]', err)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
