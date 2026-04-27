/**
 * Résolution du tenant (club) à partir du hostname de la requête
 * Chaque club a son propre domaine pointant vers le cluster
 */

import { headers } from 'next/headers'

/** Retourne le hostname de la requête courante */
export async function getCurrentHostname(): Promise<string> {
  const headersList = await headers()
  return headersList.get('host') ?? 'localhost:3000'
}

/** Normalise le hostname (enlève le port en dev) */
export function normalizeHostname(hostname: string): string {
  return hostname.replace(/:\d+$/, '')
}

/**
 * Résout le clubId à partir du hostname.
 * À appeler dans les Server Components / Route Handlers.
 * La correspondance domain → clubId est mise en cache Redis.
 */
export async function resolveClub(hostname?: string): Promise<string | null> {
  const host = hostname ?? normalizeHostname(await getCurrentHostname())

  // En développement local, on peut forcer un club via env
  if (host === 'localhost' && process.env.DEV_CLUB_DOMAIN) {
    return resolveClubByDomain(process.env.DEV_CLUB_DOMAIN)
  }

  return resolveClubByDomain(host)
}

/** Résout le club depuis la base de données (avec cache Redis) */
async function resolveClubByDomain(domain: string): Promise<string | null> {
  const { redis } = await import('./redis')
  const cacheKey = `tenant:domain:${domain}`

  const cached = await redis.get(cacheKey)
  if (cached) return cached as string

  // Requête Payload / base de données
  const { getPayload } = await import('payload')
  const config = await import('@payload-config')
  const payload = await getPayload({ config: config.default })

  const result = await payload.find({
    collection: 'clubs',
    where: { and: [{ domain: { equals: domain } }, { lifecycle: { equals: 'active' } }] },
    limit: 1,
  })

  const clubId = result.docs[0]?.id?.toString() ?? null
  if (clubId) await redis.setex(cacheKey, 3600, clubId)

  return clubId
}
