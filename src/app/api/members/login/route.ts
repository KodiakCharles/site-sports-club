import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getPayload } from 'payload'
import config from '@payload-config'
import { isValidOrigin } from '@/lib/utils/csrf'
import { rateLimit, getClientIp } from '@/lib/utils/rateLimit'

const schema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200),
})

export async function POST(req: NextRequest) {
  if (!isValidOrigin(req)) {
    return NextResponse.json({ error: 'Origine non autorisée' }, { status: 403 })
  }

  // Rate limit IP : 5 tentatives / 10 min — anti brute-force.
  const ip = getClientIp(req)
  const rlIp = rateLimit(`members-login-ip:${ip}`, { limit: 5, windowMs: 10 * 60_000 })
  if (!rlIp.ok) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Réessayez plus tard.' },
      { status: 429, headers: { 'Retry-After': String(rlIp.retryAfter) } },
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
    return NextResponse.json({ error: 'Email ou mot de passe manquant.' }, { status: 400 })
  }
  const { email, password } = parsed.data

  // Rate limit par email : 5 tentatives / 15 min — anti credential-stuffing
  // depuis IPs distribuées (botnet) sur un même compte.
  const rlEmail = rateLimit(`members-login-email:${email.toLowerCase()}`, {
    limit: 5,
    windowMs: 15 * 60_000,
  })
  if (!rlEmail.ok) {
    return NextResponse.json(
      { error: 'Compte temporairement bloqué. Réessayez plus tard.' },
      { status: 429, headers: { 'Retry-After': String(rlEmail.retryAfter) } },
    )
  }

  try {
    const payload = await getPayload({ config })
    const result = await payload.login({
      collection: 'members',
      data: { email, password },
    })

    const response = NextResponse.json({ user: result.user })
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
  } catch {
    // Réponse générique pour ne pas révéler si l'email existe.
    return NextResponse.json({ error: 'Identifiants incorrects.' }, { status: 401 })
  }
}
