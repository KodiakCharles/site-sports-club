import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { resolveClub } from '@/lib/utils/tenant'

const schema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  locale: z.enum(['fr', 'en', 'es']).default('fr'),
})

export async function POST(req: NextRequest) {
  // Vérification CSRF
  const origin = req.headers.get('origin')
  const host = req.headers.get('host')
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } catch {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  const body = await req.json()
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
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
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
