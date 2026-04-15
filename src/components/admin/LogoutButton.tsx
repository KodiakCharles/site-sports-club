'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    try {
      await fetch('/api/users/logout', { method: 'POST' })
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '0.75rem 1rem', marginTop: 'auto' }}>
      <button
        onClick={handleLogout}
        disabled={loading}
        style={{
          width: '100%',
          padding: '0.5rem 1rem',
          background: 'transparent',
          border: '1px solid var(--theme-elevation-300)',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.85rem',
          color: 'var(--theme-elevation-600)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span>⎋</span>
        {loading ? 'Déconnexion…' : 'Se déconnecter'}
      </button>
    </div>
  )
}
