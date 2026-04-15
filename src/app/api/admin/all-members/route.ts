import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })
    if (!user || (user as Record<string, unknown>).role !== 'super_admin') {
      return NextResponse.json({ members: [], total: 0 }, { status: 403 })
    }

    const { docs, totalDocs } = await payload.find({
      collection: 'members',
      limit: 200,
      sort: '-createdAt',
    })

    return NextResponse.json({
      members: docs.map((m: Record<string, unknown>) => {
        const club = m.club as Record<string, unknown> | string
        return {
          id: m.id,
          email: m.email,
          firstName: m.firstName,
          lastName: m.lastName,
          membershipType: m.membershipType,
          ffvoileLicense: m.ffvoileLicense,
          status: m.status,
          membershipExpiry: m.membershipExpiry,
          clubName: typeof club === 'object' ? club?.name : club,
          clubId: typeof club === 'object' ? club?.id : club,
        }
      }),
      total: totalDocs,
    })
  } catch {
    return NextResponse.json({ members: [], total: 0 })
  }
}
