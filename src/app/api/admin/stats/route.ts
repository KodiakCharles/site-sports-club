import { NextRequest, NextResponse } from 'next/server'
import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import { clubId } from '@/lib/utils/accessControl'

export async function GET(req: NextRequest) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const role = (user as { role?: string }).role ?? ''
  if (role !== 'super_admin' && role !== 'club_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Pour un club_admin, scoper aux ressources de SON club. Pour un super_admin,
  // retourner les compteurs globaux (vue plateforme).
  const scopeId = role === 'super_admin' ? null : clubId((user as { club?: unknown }).club)
  const clubScope: Where | undefined = scopeId ? { club: { equals: scopeId } } : undefined
  const postsWhere: Where = scopeId
    ? { and: [{ club: { equals: scopeId } }, { status: { equals: 'published' } }] }
    : { status: { equals: 'published' } }

  try {
    const [members, stages, posts, newsletters] = await Promise.all([
      payload.count({ collection: 'members', where: clubScope }),
      payload.count({ collection: 'stages', where: clubScope }),
      payload.count({ collection: 'posts', where: postsWhere }),
      payload.count({ collection: 'newsletters', where: clubScope }),
    ])

    return NextResponse.json({
      members: members.totalDocs,
      stages: stages.totalDocs,
      posts: posts.totalDocs,
      newsletters: newsletters.totalDocs,
      scope: scopeId ? 'club' : 'global',
    })
  } catch (err) {
    payload.logger.error(`[/api/admin/stats] count failed: ${err}`)
    return NextResponse.json({ error: 'Stats unavailable' }, { status: 500 })
  }
}
