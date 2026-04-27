'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/marketing/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = (await res.json()) as { success?: boolean; redirectUrl?: string; error?: string }
      if (res.ok && data.success) {
        window.location.href = data.redirectUrl ?? '/admin'
        return
      }
      setError(data.error ?? 'Une erreur est survenue.')
    } catch {
      setError('Erreur réseau, vérifiez votre connexion.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 text-slate-400 hover:text-white text-sm transition"
        >
          <span aria-hidden>←</span> Retour à l&apos;accueil
        </Link>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-bold tracking-tight">Web Pulse</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Connexion</h1>
          <p className="text-slate-400 text-sm mb-6">
            Espace réservé aux super-administrateurs Web Pulse.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none text-white placeholder:text-slate-500"
                placeholder="vous@exemple.fr"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none text-white"
              />
            </div>
            {error && (
              <div
                role="alert"
                className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-200"
              >
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-semibold transition"
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
          <p className="mt-6 text-xs text-slate-500 text-center">
            Vous n&apos;êtes pas super-admin ?{' '}
            <a
              href="mailto:contact@web-pulse.fr"
              className="text-amber-400 hover:text-amber-300"
            >
              contact@web-pulse.fr
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
