import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })
    if (!user || (user as Record<string, unknown>).role !== 'super_admin') {
      return NextResponse.json({ clubs: [] }, { status: 403 })
    }

    const { docs } = await payload.find({
      collection: 'clubs',
      limit: 100,
      sort: '-createdAt',
    })

    return NextResponse.json({
      clubs: docs.map((c: Record<string, unknown>) => ({
        id: c.id,
        name: c.name,
        domain: c.domain,
        status: c.status,
        plan: c.plan || 'essentiel',
      })),
    })
  } catch {
    return NextResponse.json({ clubs: [] })
  }
}
