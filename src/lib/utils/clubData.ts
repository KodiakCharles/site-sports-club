/**
 * Helper serveur — récupère les données du club courant depuis Payload CMS.
 * À appeler uniquement depuis les Server Components et Route Handlers.
 */

import { resolveClub } from './tenant'

export type ClubData = {
  clubId: string
  club: Record<string, unknown>
  settings: Record<string, unknown>
  homePage: Record<string, unknown>
}

let payloadInstance: Awaited<ReturnType<typeof import('payload').getPayload>> | null = null

async function getPayloadInstance() {
  if (!payloadInstance) {
    const { getPayload } = await import('payload')
    const config = (await import('@payload-config')).default
    payloadInstance = await getPayload({ config })
  }
  return payloadInstance
}

/**
 * Résout le club depuis le hostname et retourne ses données CMS.
 * Retourne null si aucun club n'est résolu (dev sans DEV_CLUB_DOMAIN).
 */
export async function getClubData(): Promise<ClubData | null> {
  const clubId = await resolveClub()
  if (!clubId) return null

  const payload = await getPayloadInstance()

  const [club, settings, homePage] = await Promise.all([
    payload.findByID({ collection: 'clubs', id: clubId }).catch(() => null),
    payload.findGlobal({ slug: 'club-settings' }).catch(() => null),
    payload.findGlobal({ slug: 'home-page' }).catch(() => null),
  ])

  if (!club) return null

  return {
    clubId,
    club: club as Record<string, unknown>,
    settings: (settings ?? {}) as Record<string, unknown>,
    homePage: (homePage ?? {}) as Record<string, unknown>,
  }
}

/**
 * Récupère les N prochains stages du club (date de début >= aujourd'hui).
 */
export async function getUpcomingStages(clubId: string, limit = 3) {
  const payload = await getPayloadInstance()
  const today = new Date().toISOString()

  const { docs } = await payload.find({
    collection: 'stages',
    where: {
      and: [
        { club: { equals: clubId } },
        { startDate: { greater_than_equal: today } },
      ],
    },
    sort: 'startDate',
    limit,
  })

  return docs
}

/**
 * Récupère les stages du club (avec pagination).
 */
export async function getStages(clubId: string, limit = 20) {
  const payload = await getPayloadInstance()
  const today = new Date().toISOString()

  const { docs } = await payload.find({
    collection: 'stages',
    where: {
      and: [
        { club: { equals: clubId } },
        { startDate: { greater_than_equal: today } },
      ],
    },
    sort: 'startDate',
    limit,
  })

  return docs
}

/**
 * Récupère les articles publiés du club (avec pagination).
 */
export async function getPosts(clubId: string, limit = 12) {
  const payload = await getPayloadInstance()

  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { club: { equals: clubId } },
        { status: { equals: 'published' } },
      ],
    },
    sort: '-publishedAt',
    limit,
  })

  return docs
}

/**
 * Récupère un article par son slug.
 */
export async function getPostBySlug(clubId: string, slug: string) {
  const payload = await getPayloadInstance()

  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { club: { equals: clubId } },
        { slug: { equals: slug } },
        { status: { equals: 'published' } },
      ],
    },
    limit: 1,
  })

  return docs[0] ?? null
}
