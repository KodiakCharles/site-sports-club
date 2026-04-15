import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
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
      })
    }
    return response
  } catch {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
}
