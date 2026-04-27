import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PAYLOAD_SECRET: z.string().min(32).default('voileweb-dev-secret-change-in-production'),
    DATABASE_URI: z.string().optional(),
    REDIS_URL: z.string().optional(),
    MAILJET_API_KEY: z.string().optional(),
    MAILJET_SECRET_KEY: z.string().optional(),
    EMAIL_FROM: z.string().email().optional(),
    NEWSLETTER_FROM_EMAIL: z.string().email().optional(),
    DEV_CLUB_DOMAIN: z.string().optional(),
  },
  client: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    DATABASE_URI: process.env.DATABASE_URI,
    REDIS_URL: process.env.REDIS_URL,
    MAILJET_API_KEY: process.env.MAILJET_API_KEY,
    MAILJET_SECRET_KEY: process.env.MAILJET_SECRET_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    NEWSLETTER_FROM_EMAIL: process.env.NEWSLETTER_FROM_EMAIL,
    DEV_CLUB_DOMAIN: process.env.DEV_CLUB_DOMAIN,
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === 'true',
})
