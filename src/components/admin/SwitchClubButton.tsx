'use client'

import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export function SwitchClubButton() {
  const pathname = usePathname()
  const router = useRouter()
  const [activeClubId, setActiveClubId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  // Fetch current user role on mount
  useEffect(() => {
    fetch('/api/admin/current-user')
      .then(r => r.json())
      .then(data => setUserRole(data.role))
      .catch(() => setUserRole(null))
  }, [])

  // Extrait l'ID du club depuis l'URL /admin/collections/clubs/[id]
  const match = pathname?.match(/\/admin\/collections\/clubs\/([^/?]+)/)
  const clubId = match ? match[1] : null

  // Récupère le club actif depuis le cookie lisible côté client
  useEffect(() => {
    const cookieMatch = document.cookie.match(/payload-active-club-display=([^;]+)/)
    setActiveClubId(cookieMatch ? cookieMatch[1] : null)
  }, [pathname])

  // Ne s'affiche que sur la page d'édition d'un club ET uniquement pour super_admin
  if (!clubId || userRole !== 'super_admin') return null

  const isManagingThisClub = activeClubId === clubId

  async function handleSwitch() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/switch-club', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clubId: isManagingThisClub ? null : clubId }),
      })
      if (res.ok) {
        router.refresh()
        window.location.href = '/admin'
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: '1rem', padding: '1rem', borderTop: '1px solid var(--theme-elevation-150)' }}>
      {isManagingThisClub ? (
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--theme-success-500)' }}>
            ✓ Vous gérez actuellement ce club
          </p>
          <button
            onClick={handleSwitch}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              background: 'var(--theme-elevation-200)',
              border: '1px solid var(--theme-elevation-300)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {loading ? 'Chargement…' : '↩ Retour au mode Super Admin'}
          </button>
        </div>
      ) : (
        <div>
          <p style={{ marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--theme-elevation-500)' }}>
            Gérer ce club en tant qu&apos;admin
          </p>
          <button
            onClick={handleSwitch}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              background: 'var(--theme-success-500)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            {loading ? 'Chargement…' : '🔑 Devenir admin de ce club'}
          </button>
        </div>
      )}
    </div>
  )
}
