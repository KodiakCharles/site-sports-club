export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config')

    // Force l'init de Payload au boot du serveur. Sans cela, getPayload est
    // mémoïsé/lazy à la première route handler, et `push: true` (Drizzle) ne
    // se déclenche pas. En appelant getPayload ici, le schéma est synchronisé
    // au boot quand PUSH_SCHEMA=true.
    //
    // Skip pendant le build : DATABASE_URL est un placeholder et la connexion
    // échouerait en collecte de page data. Au runtime Railway, DATABASE_URL
    // pointe sur la vraie BDD.
    const dbUrl = process.env.DATABASE_URL ?? ''
    if (!dbUrl.includes('build-placeholder')) {
      try {
        const { getPayload } = await import('payload')
        const config = (await import('@payload-config')).default
        await getPayload({ config })
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[instrumentation] Payload init failed:', err)
      }
    }
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config')
  }
}

export { captureRequestError as onRequestError } from '@sentry/nextjs'
