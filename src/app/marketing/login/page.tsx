import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import LoginForm from './LoginForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Connexion à l\'espace super-administrateur Web Pulse.',
  robots: { index: false, follow: false },
}

export default async function LoginPage() {
  // Si déjà authentifié super_admin → redirect direct vers l'admin
  try {
    const payload = await getPayload({ config })
    const headersList = await headers()
    const { user } = await payload.auth({ headers: headersList })
    if (user && (user as { role?: string }).role === 'super_admin') {
      redirect('/admin')
    }
  } catch {
    // Pas authentifié — on rend le form
  }

  return <LoginForm />
}
