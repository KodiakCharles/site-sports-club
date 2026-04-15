import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@payload-config'
import { clubId } from '@/lib/utils/accessControl'

export async function GET(req: NextRequest) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user || !['super_admin', 'club_admin', 'editor'].includes(user.role as string)) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const url = new URL(req.url)
  const status = url.searchParams.get('status') ?? 'pending'
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50', 10), 200)

  const where: Where = { status: { equals: status } }
  if (user.role !== 'super_admin') {
    const userClub = clubId(user.club)
    if (userClub !== null) where.club = { equals: userClub }
  }

  const alerts = await payload.find({
    collection: 'chatbot-alerts',
    where,
    sort: '-createdAt',
    limit,
  })

  return NextResponse.json({
    alerts: alerts.docs,
    total: alerts.totalDocs,
  })
}
