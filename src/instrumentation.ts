export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config')

    // PUSH_SCHEMA=true : pousse le schéma Postgres au boot (pour le 1er deploy
    // ou après une migration). À remettre à "false" une fois le schéma figé,
    // sinon Drizzle re-pousse à chaque cold start (perf + risque).
    if (process.env.PUSH_SCHEMA === 'true') {
      try {
        const { getPayload } = await import('payload')
        const configModule = await import('../payload.config')
        const payload = await getPayload({ config: configModule.default })
        const adapter = payload.db as unknown as {
          requireDrizzleKit: () => {
            pushSchema: (
              schema: unknown,
              drizzle: unknown,
              schemas?: string[],
              tablesFilter?: string[],
              extensionsFilter?: string[],
            ) => Promise<{ apply: () => Promise<void>; hasDataLoss: boolean; warnings: string[] }>
          }
          schema: unknown
          drizzle: unknown
          schemaName?: string
          tablesFilter?: string[]
          extensions?: { postgis?: boolean }
        }
        const { pushSchema } = adapter.requireDrizzleKit()
        const { apply, hasDataLoss, warnings } = await pushSchema(
          adapter.schema,
          adapter.drizzle,
          adapter.schemaName ? [adapter.schemaName] : undefined,
          adapter.tablesFilter,
          adapter.extensions?.postgis ? ['postgis'] : undefined,
        )
        if (warnings.length) {
          payload.logger.warn(
            `[instrumentation] schema push warnings (hasDataLoss=${hasDataLoss}): ${warnings.join(' | ')}`,
          )
        }
        await apply()
        payload.logger.info('[instrumentation] schema pushed successfully')
      } catch (err) {
        console.error('[instrumentation] schema push failed:', err)
      }
    }
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config')
  }
}

export { captureRequestError as onRequestError } from '@sentry/nextjs'
