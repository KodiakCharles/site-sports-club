import { NextRequest, NextResponse } from 'next/server'
import { resolveClub } from '@/lib/utils/tenant'
import { rateLimit, getClientIp } from '@/lib/utils/rateLimit'
import type { InstagramPost } from '@/types'

/**
 * GET /api/social/instagram
 * Récupère les derniers posts Instagram du club via l'API Instagram Graph
 * Nécessite : instagramToken configuré dans le back-office du club
 */
export async function GET(req: NextRequest) {
  // Rate limiting : 30 req / minute par IP
  const ip = getClientIp(req)
  const rl = rateLimit(`instagram:${ip}`, { limit: 30, windowMs: 60_000 })
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
    )
  }

  const clubId = await resolveClub()
  if (!clubId) return NextResponse.json({ error: 'Club not found' }, { status: 404 })

  const { getPayload } = await import('payload')
  const config = await import('@payload-config')
  const payload = await getPayload({ config: config.default })
  const club = await payload.findByID({ collection: 'clubs', id: clubId })
  const clubData = club as Record<string, unknown> & { social?: { instagramToken?: string } }
  const token = clubData?.social?.instagramToken

  if (!token) {
    return NextResponse.json({ posts: [], message: 'Instagram not configured' })
  }

  try {
    const fields = 'id,media_url,thumbnail_url,media_type,caption,timestamp,permalink'
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=${fields}&limit=12&access_token=${token}`,
      { next: { revalidate: 900 } }
    )
    if (!res.ok) throw new Error(`Instagram API: ${res.status}`)
    const data = await res.json() as { data?: InstagramPost[] }
    const posts: InstagramPost[] = data.data ?? []
    return NextResponse.json({ posts })
  } catch (err) {
    console.error('[Instagram API]', err)
    return NextResponse.json({ posts: [], error: 'Instagram fetch failed' })
  }
}
