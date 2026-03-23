/**
 * Rate limiter en mémoire — pour les routes API publiques.
 * En production multi-instance, remplacer par une implémentation Redis.
 */

interface Entry {
  count: number
  resetAt: number
}

const store = new Map<string, Entry>()

// Nettoyage toutes les 5 minutes pour éviter les fuites mémoire
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key)
  }
}, 5 * 60_000).unref()

interface RateLimitOptions {
  /** Nombre max de requêtes dans la fenêtre */
  limit: number
  /** Durée de la fenêtre en millisecondes */
  windowMs: number
}

interface RateLimitResult {
  ok: boolean
  retryAfter: number
}

/**
 * Vérifie si un identifiant (IP, user ID…) a dépassé la limite.
 * @returns { ok: true } si la requête est autorisée, { ok: false, retryAfter: N } sinon
 */
export function rateLimit(identifier: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  const entry = store.get(identifier)

  if (!entry || entry.resetAt < now) {
    store.set(identifier, { count: 1, resetAt: now + opts.windowMs })
    return { ok: true, retryAfter: 0 }
  }

  if (entry.count >= opts.limit) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count++
  return { ok: true, retryAfter: 0 }
}

/**
 * Extrait l'IP réelle de la requête (supporte les proxies et Vercel).
 */
export function getClientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}
