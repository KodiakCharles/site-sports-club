import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

type AuthUser = { role?: string; club?: string | { id?: string } }

function getClubId(user: AuthUser | null | undefined): string | null {
  if (!user?.club) return null
  return typeof user.club === 'object' ? (user.club.id ?? null) : user.club
}

export async function GET(req: NextRequest) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const u = user as AuthUser
  const role = u.role ?? ''
  if (role !== 'super_admin' && role !== 'club_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Pour un club_admin, scoper aux ressources de SON club uniquement.
  // Pour un super_admin, retourner les compteurs globaux (vue plateforme).
  const clubId = role === 'super_admin' ? null : getClubId(u)

  try {
    const countArgs = (collection: 'members' | 'stages' | 'newsletters') =>
      clubId
        ? { collection, where: { club: { equals: clubId } } }
        : { collection }
    const postsWhere = clubId
      ? { and: [{ club: { equals: clubId } }, { status: { equals: 'published' } }] }
      : { status: { equals: 'published' } }
    const [members, stages, posts, newsletters] = await Promise.all([
      payload.count(countArgs('members')),
      payload.count(countArgs('stages')),
      payload.count({ collection: 'posts', where: postsWhere as never }),
      payload.count(countArgs('newsletters')),
    ])

    return NextResponse.json({
      members: members.totalDocs,
      stages: stages.totalDocs,
      posts: posts.totalDocs,
      newsletters: newsletters.totalDocs,
      scope: clubId ? 'club' : 'global',
    })
  } catch {
    return NextResponse.json({ members: 0, stages: 0, posts: 0, newsletters: 0 })
  }
}
