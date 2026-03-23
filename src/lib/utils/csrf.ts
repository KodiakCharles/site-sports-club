/**
 * Protection CSRF : vérifie que l'Origin de la requête correspond au Host.
 * À utiliser dans tous les route handlers POST/PATCH/DELETE.
 */
export function isValidOrigin(req: Request): boolean {
  const origin = req.headers.get('origin')
  const host = req.headers.get('host')

  // Si pas d'Origin (ex: curl, Postman), on laisse passer en dev uniquement
  if (!origin) {
    return process.env.NODE_ENV !== 'production'
  }

  if (!host) return false

  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}
