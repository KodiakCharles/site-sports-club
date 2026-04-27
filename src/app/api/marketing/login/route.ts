import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getPayload } from 'payload'
import config from '@payload-config'
import { isValidOrigin } from '@/lib/utils/csrf'
import { rateLimit, getClientIp } from '@/lib/utils/rateLimit'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: NextRequest) {
  if (!isValidOrigin(req)) {
    return NextResponse.json({ error: 'Origine non autorisée' }, { status: 403 })
  }

  const ip = getClientIp(req)
  const rl = rateLimit(`marketing-login:${ip}`, { limit: 5, windowMs: 10 * 60_000 })
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Réessayez plus tard.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Email ou mot de passe manquant.' },
      { status: 400 },
    )
  }
  const { email, password } = parsed.data

  const payload = await getPayload({ config })

  let result: { user?: unknown; token?: string }
  try {
    result = await payload.login({
      collection: 'users',
      data: { email, password },
    })
  } catch {
    // Payload throw une erreur générique sur creds invalides
    return NextResponse.json({ error: 'Identifiants incorrects.' }, { status: 401 })
  }

  const user = result.user as { role?: string } | null
  if (!user || user.role !== 'super_admin') {
    return NextResponse.json(
      { error: 'Accès réservé aux super-administrateurs Web Pulse.' },
      { status: 403 },
    )
  }

  const response = NextResponse.json({ success: true, redirectUrl: '/admin' })
  if (result.token) {
    response.cookies.set('payload-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
  }
  return response
}
