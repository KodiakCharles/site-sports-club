import { NextRequest, NextResponse } from 'next/server'
import { resolveClub } from '@/lib/utils/tenant'
import { rateLimit, getClientIp } from '@/lib/utils/rateLimit'
import { redis } from '@/lib/utils/redis'

export type Tweet = {
  id: string
  text: string
  createdAt: string
  url: string
  mediaUrl?: string
}

/**
 * GET /api/social/twitter
 * Récupère les derniers tweets du compte X/Twitter du club via API v2.
 * Nécessite : twitterHandle + twitterBearerToken dans le back-office du club.
 * Cache Redis : 15 minutes.
 *
 * Note : l'API Twitter v2 est accessible en free tier pour la lecture de tweets
 * d'un compte public (endpoint /2/users/by/username/:username/tweets).
 */
export async function GET(req: NextRequest) {
  const ip = getClientIp(req)
  const rl = rateLimit(`twitter:${ip}`, { limit: 30, windowMs: 60_000 })
  if (!rl.ok) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } })
  }

  const clubId = await resolveClub()
  if (!clubId) return NextResponse.json({ tweets: [], error: 'Club not found' }, { status: 404 })

  const cacheKey = `social:twitter:${clubId}`
  const cached = await redis.get(cacheKey)
  if (cached) return NextResponse.json({ tweets: JSON.parse(cached) })

  const { getPayload } = await import('payload')
  const config = await import('@payload-config')
  const payload = await getPayload({ config: config.default })
  const club = await payload.findByID({ collection: 'clubs', id: clubId })
  const clubData = club as Record<string, unknown>

  const handle = clubData.twitterHandle as string | undefined
  const bearerToken = clubData.twitterBearerToken as string | undefined

  if (!handle || !bearerToken) {
    return NextResponse.json({ tweets: [], message: 'Twitter not configured' })
  }

  try {
    // 1. Récupérer l'ID utilisateur depuis le handle
    const userRes = await fetch(
      `https://api.twitter.com/2/users/by/username/${handle}`,
      { headers: { Authorization: `Bearer ${bearerToken}` }, next: { revalidate: 3600 } }
    )
    if (!userRes.ok) throw new Error(`Twitter user lookup: ${userRes.status}`)
    const userData = await userRes.json() as { data?: { id: string } }
    const userId = userData.data?.id
    if (!userId) throw new Error('Twitter user not found')

    // 2. Récupérer les tweets récents
    const fields = 'created_at,text,attachments'
    const mediaFields = 'url,preview_image_url,type'
    const expansions = 'attachments.media_keys'
    const tweetsRes = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=10&tweet.fields=${fields}&expansions=${expansions}&media.fields=${mediaFields}&exclude=retweets,replies`,
      { headers: { Authorization: `Bearer ${bearerToken}` }, next: { revalidate: 900 } }
    )
    if (!tweetsRes.ok) throw new Error(`Twitter tweets: ${tweetsRes.status}`)

    const tweetsData = await tweetsRes.json() as {
      data?: Array<{ id: string; text: string; created_at: string; attachments?: { media_keys?: string[] } }>
      includes?: { media?: Array<{ media_key: string; url?: string; preview_image_url?: string; type: string }> }
    }

    const mediaMap = new Map<string, string>()
    for (const m of tweetsData.includes?.media ?? []) {
      const url = m.url ?? m.preview_image_url
      if (url) mediaMap.set(m.media_key, url)
    }

    const tweets: Tweet[] = (tweetsData.data ?? []).map((t) => {
      const firstMedia = t.attachments?.media_keys?.[0]
      return {
        id: t.id,
        text: t.text,
        createdAt: t.created_at,
        url: `https://x.com/${handle}/status/${t.id}`,
        mediaUrl: firstMedia ? mediaMap.get(firstMedia) : undefined,
      }
    })

    await redis.setex(cacheKey, 900, JSON.stringify(tweets))
    return NextResponse.json({ tweets })
  } catch (err) {
    console.error('[Twitter API]', err)
    return NextResponse.json({ tweets: [], error: 'Twitter fetch failed' })
  }
}
