import { createClient } from 'redis'

const client = createClient({ url: process.env.REDIS_URL ?? 'redis://localhost:6379' })

client.on('error', (err: Error) => console.error('[Redis] Client error', err))

if (!client.isOpen) {
  client.connect().catch((err: Error) => console.error('[Redis] Connection failed', err))
}

export const redis = client
