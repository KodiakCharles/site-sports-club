import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const [members, stages, posts, newsletters] = await Promise.all([
      payload.count({ collection: 'members' }),
      payload.count({ collection: 'stages' }),
      payload.count({ collection: 'posts', where: { status: { equals: 'published' } } }),
      payload.count({ collection: 'newsletters' }),
    ])

    return NextResponse.json({
      members: members.totalDocs,
      stages: stages.totalDocs,
      posts: posts.totalDocs,
      newsletters: newsletters.totalDocs,
    })
  } catch {
    return NextResponse.json({ members: 0, stages: 0, posts: 0, newsletters: 0 })
  }
}
