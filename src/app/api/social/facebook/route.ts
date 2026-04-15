import { NextRequest, NextResponse } from 'next/server'
import { resolveClub } from '@/lib/utils/tenant'
import { rateLimit, getClientIp } from '@/lib/utils/rateLimit'
import { redis } from '@/lib/utils/redis'

export type FacebookPost = {
  id: string
  message?: string
  story?: string
  fullPicture?: string
  createdTime: string
  permalink: string
}

/**
 * GET /api/social/facebook
 * Récupère les derniers posts de la page Facebook du club via Graph API v19.
 * Nécessite : facebookPageId + facebookAccessToken dans le back-office du club.
 * Cache Redis : 15 minutes.
 */
export async function GET(req: NextRequest) {
  const ip = getClientIp(req)
  const rl = rateLimit(`facebook:${ip}`, { limit: 30, windowMs: 60_000 })
  if (!rl.ok) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } })
  }

  const clubId = await resolveClub()
  if (!clubId) return NextResponse.json({ posts: [], error: 'Club not found' }, { status: 404 })

  // Cache Redis
  const cacheKey = `social:facebook:${clubId}`
  const cached = await redis.get(cacheKey)
  if (cached) return NextResponse.json({ posts: JSON.parse(cached) })

  const { getPayload } = await import('payload')
  const config = await import('@payload-config')
  const payload = await getPayload({ config: config.default })
  const club = await payload.findByID({ collection: 'clubs', id: clubId })
  const clubData = club as Record<string, unknown>

  const pageId = clubData.facebookPageId as string | undefined
  const token = clubData.facebookAccessToken as string | undefined

  if (!pageId || !token) {
    return NextResponse.json({ posts: [], message: 'Facebook not configured' })
  }

  try {
    const fields = 'id,message,story,full_picture,created_time,permalink_url'
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}/posts?fields=${fields}&limit=9&access_token=${token}`,
      { next: { revalidate: 900 } }
    )
    if (!res.ok) throw new Error(`Facebook API: ${res.status}`)

    const data = await res.json() as { data?: Array<Record<string, unknown>> }
    const posts: FacebookPost[] = (data.data ?? []).map((p) => ({
      id: p.id as string,
      message: p.message as string | undefined,
      story: p.story as string | undefined,
      fullPicture: p.full_picture as string | undefined,
      createdTime: p.created_time as string,
      permalink: p.permalink_url as string,
    }))

    await redis.setex(cacheKey, 900, JSON.stringify(posts))
    return NextResponse.json({ posts })
  } catch (err) {
    console.error('[Facebook API]', err)
    return NextResponse.json({ posts: [], error: 'Facebook fetch failed' })
  }
}
