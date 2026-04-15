import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })
    if (!user || (user as Record<string, unknown>).role !== 'super_admin') {
      return NextResponse.json({ posts: [] }, { status: 403 })
    }

    const { docs } = await payload.find({
      collection: 'posts',
      limit: 100,
      sort: '-createdAt',
    })

    return NextResponse.json({
      posts: docs.map((p: Record<string, unknown>) => {
        const club = p.club as Record<string, unknown> | string
        return {
          id: p.id,
          title: p.title,
          slug: p.slug,
          category: p.category,
          status: p.status,
          publishedAt: p.publishedAt,
          createdAt: p.createdAt,
          clubName: typeof club === 'object' ? club?.name : club,
          clubId: typeof club === 'object' ? club?.id : club,
        }
      }),
    })
  } catch {
    return NextResponse.json({ posts: [] })
  }
}
