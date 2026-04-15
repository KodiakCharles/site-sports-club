import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })
    if (!user || (user as Record<string, unknown>).role !== 'super_admin') {
      return NextResponse.json({ stages: [] }, { status: 403 })
    }

    const { docs } = await payload.find({
      collection: 'stages',
      limit: 100,
      sort: '-startDate',
    })

    return NextResponse.json({
      stages: docs.map((s: Record<string, unknown>) => {
        const club = s.club as Record<string, unknown> | string
        return {
          id: s.id,
          title: s.title,
          support: s.support,
          level: s.level,
          startDate: s.startDate,
          endDate: s.endDate,
          spots: s.spots,
          spotsLeft: s.spotsLeft,
          price: s.price,
          clubName: typeof club === 'object' ? club?.name : club,
          clubId: typeof club === 'object' ? club?.id : club,
        }
      }),
    })
  } catch {
    return NextResponse.json({ stages: [] })
  }
}
