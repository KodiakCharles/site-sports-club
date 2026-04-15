import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) return NextResponse.json({ role: null })

    const u = user as Record<string, unknown>

    // Resolve the club's plan
    let plan = 'essentiel'
    const userClub = u.club
    if (userClub) {
      const clubId = typeof userClub === 'object' ? (userClub as Record<string, unknown>).id : userClub
      if (clubId) {
        try {
          const club = await payload.findByID({ collection: 'clubs', id: String(clubId) })
          plan = (club as Record<string, unknown>).plan as string || 'essentiel'
        } catch { /* club not found */ }
      }
    }

    return NextResponse.json({
      role: u.role,
      id: user.id,
      firstName: u.firstName,
      club: u.club,
      plan,
    })
  } catch {
    return NextResponse.json({ role: null })
  }
}
