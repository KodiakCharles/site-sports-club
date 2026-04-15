import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'
import { isValidOrigin } from '@/lib/utils/csrf'
import { clubId } from '@/lib/utils/accessControl'

const schema = z.object({
  answer: z.string().min(2).max(5000),
  category: z
    .enum([
      'general',
      'inscription',
      'stages',
      'competition',
      'tarifs',
      'materiel',
      'acces',
      'securite',
      'autre',
    ])
    .default('general'),
  addToKnowledgeBase: z.boolean().default(true),
  dismiss: z.boolean().default(false),
})

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isValidOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user || !['super_admin', 'club_admin', 'editor'].includes(user.role as string)) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
  const { answer, category, addToKnowledgeBase, dismiss } = parsed.data

  const alert = await payload.findByID({ collection: 'chatbot-alerts', id }).catch(() => null)
  if (!alert) {
    return NextResponse.json({ error: 'Alerte introuvable' }, { status: 404 })
  }

  if (user.role !== 'super_admin') {
    const alertClub = clubId((alert as { club?: unknown }).club)
    const userClub = clubId(user.club)
    if (String(userClub) !== String(alertClub)) {
      return NextResponse.json({ error: 'Accès refusé au club' }, { status: 403 })
    }
  }

  // Update the alert — the afterChange hook creates the KB entry automatically
  const updated = await payload.update({
    collection: 'chatbot-alerts',
    id,
    data: {
      status: dismiss ? 'dismissed' : 'answered',
      adminAnswer: dismiss ? undefined : answer,
      kbCategory: category,
      addToKnowledgeBase: dismiss ? false : addToKnowledgeBase,
    },
  })

  return NextResponse.json({ success: true, alert: updated })
}
