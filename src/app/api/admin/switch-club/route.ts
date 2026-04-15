import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/admin/switch-club
// Body: { clubId: string } | { clubId: null } pour quitter le mode club
export async function POST(req: NextRequest) {
  const payload = await getPayload({ config })

  // Vérifier l'authentification via le token Payload
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '') ?? req.cookies.get('payload-token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  let user: Record<string, unknown> | null = null
  try {
    const { user: verifiedUser } = await payload.auth({ headers: req.headers })
    user = verifiedUser
  } catch {
    return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
  }

  if (!user || user.role !== 'super_admin') {
    return NextResponse.json({ error: 'Accès refusé — super admin uniquement' }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const { clubId } = body as { clubId?: string | null }

  const cookieStore = await cookies()

  if (!clubId) {
    // Quitter le mode club
    cookieStore.delete('payload-active-club')
    cookieStore.delete('payload-active-club-display')
    return NextResponse.json({ success: true, message: 'Mode super admin restauré' })
  }

  // Vérifier que le club existe
  const club = await payload.findByID({ collection: 'clubs', id: clubId }).catch(() => null)
  if (!club) {
    return NextResponse.json({ error: 'Club introuvable' }, { status: 404 })
  }

  cookieStore.set('payload-active-club', String(clubId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8h
  })

  // Cookie lisible côté client pour l'UI du bouton
  cookieStore.set('payload-active-club-display', String(clubId), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  })

  return NextResponse.json({ success: true, club: { id: club.id, name: club.name } })
}
