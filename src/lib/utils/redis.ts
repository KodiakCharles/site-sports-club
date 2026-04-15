/**
 * Client Redis avec fallback en mémoire pour le développement sans Docker.
 * En production, REDIS_URL doit pointer vers un vrai Redis.
 */

// Fallback en mémoire (Map) utilisé si Redis n'est pas disponible
const memoryStore = new Map<string, { value: string; expiresAt: number | null }>()

const memoryClient = {
  isMemoryFallback: true,
  async get(key: string): Promise<string | null> {
    const entry = memoryStore.get(key)
    if (!entry) return null
    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      memoryStore.delete(key)
      return null
    }
    return entry.value
  },
  async set(key: string, value: string): Promise<void> {
    memoryStore.set(key, { value, expiresAt: null })
  },
  async setex(key: string, seconds: number, value: string): Promise<void> {
    memoryStore.set(key, { value, expiresAt: Date.now() + seconds * 1000 })
  },
  async del(key: string): Promise<void> {
    memoryStore.delete(key)
  },
}

type RedisClient = typeof memoryClient

let redisClient: RedisClient = memoryClient

// Tentative de connexion à Redis — silencieuse si indisponible
async function tryConnectRedis(): Promise<void> {
  try {
    const { createClient } = await import('redis')
    const client = createClient({ url: process.env.REDIS_URL ?? 'redis://localhost:6379' })
    client.on('error', () => { /* silencieux — on reste sur le fallback */ })
    await client.connect()
    // Redis disponible : on utilise le vrai client avec l'interface adaptée
    redisClient = {
      isMemoryFallback: false,
      get: (key: string) => client.get(key),
      set: (key: string, value: string) => client.set(key, value).then(() => undefined),
      setex: (key: string, seconds: number, value: string) =>
        client.setEx(key, seconds, value).then(() => undefined),
      del: (key: string) => client.del(key).then(() => undefined),
    }
  } catch {
    // Redis indisponible — le fallback mémoire reste actif
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Redis] Non disponible, fallback mémoire activé')
    }
  }
}

// Connexion non-bloquante au démarrage
tryConnectRedis()

export const redis = new Proxy({} as RedisClient, {
  get(_target, prop) {
    return (redisClient as Record<string | symbol, unknown>)[prop]
  },
})
