import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const result = await payload.auth({ headers: req.headers })
    if (!result.user) return NextResponse.json({ user: null }, { status: 401 })
    return NextResponse.json({ user: result.user })
  } catch {
    return NextResponse.json({ user: null }, { status: 401 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const result = await payload.auth({ headers: req.headers })
    if (!result.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const allowedFields = ['firstName', 'lastName', 'phone', 'address', 'newsletterOptIn']
    const updates: Record<string, unknown> = {}
    for (const key of allowedFields) {
      if (key in body) updates[key] = body[key]
    }

    const updated = await payload.update({
      collection: 'members',
      id: result.user.id,
      data: updates,
    })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const result = await payload.auth({ headers: req.headers })
    if (!result.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await payload.delete({ collection: 'members', id: result.user.id })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
