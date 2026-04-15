import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { redis } from '@/lib/utils/redis'

type CheckStatus = 'ok' | 'skipped' | 'degraded' | 'failed'
type Check = { status: CheckStatus; detail?: string }

export async function GET() {
  const started = Date.now()
  const checks: Record<string, Check> = {}

  // DB
  try {
    const payload = await getPayload({ config })
    await payload.count({ collection: 'clubs' })
    checks.database = { status: 'ok' }
  } catch (err) {
    checks.database = { status: 'failed', detail: err instanceof Error ? err.message : String(err) }
  }

  // Redis (real connection vs in-memory fallback)
  try {
    const testKey = `health:${Date.now()}`
    await redis.setex(testKey, 5, '1')
    const got = await redis.get(testKey)
    await redis.del(testKey)
    if (got !== '1') {
      checks.redis = { status: 'failed', detail: 'round-trip mismatch' }
    } else {
      const isMemory = (redis as { isMemoryFallback?: boolean }).isMemoryFallback === true
      checks.redis = isMemory
        ? { status: 'degraded', detail: 'in-memory fallback (REDIS_URL missing or unreachable)' }
        : { status: 'ok' }
    }
  } catch (err) {
    checks.redis = { status: 'failed', detail: err instanceof Error ? err.message : String(err) }
  }

  // Required env vars
  const envChecks: Record<string, Check> = {
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET
      ? { status: 'ok' }
      : { status: 'failed', detail: 'missing' },
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY
      ? { status: 'ok' }
      : { status: 'degraded', detail: 'missing — chatbot will return 503' },
    RESEND_API_KEY: process.env.RESEND_API_KEY
      ? { status: 'ok' }
      : { status: 'degraded', detail: 'missing — contact form + newsletters will fail' },
  }
  checks.env = Object.values(envChecks).some((c) => c.status === 'failed')
    ? { status: 'failed', detail: JSON.stringify(envChecks) }
    : Object.values(envChecks).some((c) => c.status === 'degraded')
      ? { status: 'degraded', detail: JSON.stringify(envChecks) }
      : { status: 'ok' }

  const overall: CheckStatus = Object.values(checks).some((c) => c.status === 'failed')
    ? 'failed'
    : Object.values(checks).some((c) => c.status === 'degraded')
      ? 'degraded'
      : 'ok'
  // Healthcheck Railway : on renvoie toujours 200 pour confirmer que le serveur écoute.
  // Les détails de failure/degradation sont dans le body JSON et surveillables via Sentry.
  // Sans ça, un fail DB au 1er boot empêcherait Railway de considérer le service up.
  const httpStatus = 200

  return NextResponse.json(
    {
      status: overall,
      ts: new Date().toISOString(),
      durationMs: Date.now() - started,
      checks,
    },
    { status: httpStatus }
  )
}
