'use client'
import { useEffect, useState } from 'react'

type Stats = {
  members: number
  stages: number
  posts: number
  newsletters: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats>({ members: 0, stages: 0, posts: 0, newsletters: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Adhérents', value: stats.members, icon: '👥', color: '#1d6fa4' },
    { label: 'Stages', value: stats.stages, icon: '⛵', color: '#2eb8e6' },
    { label: 'Articles', value: stats.posts, icon: '📰', color: '#f0b429' },
    { label: 'Newsletters', value: stats.newsletters, icon: '📧', color: '#4ade80' },
  ]

  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#1e293b' }}>
        Tableau de bord
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {cards.map(c => (
          <div key={c.label} style={{
            background: '#fff', borderRadius: '12px', padding: '20px',
            border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: '-10px', right: '-10px',
              fontSize: '3rem', opacity: 0.1
            }}>{c.icon}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
              {c.label}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: c.color, marginTop: '4px' }}>
              {loading ? '—' : c.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
