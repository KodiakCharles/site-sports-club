'use client'
import { useEffect, useState } from 'react'

type Stage = {
  id: string; title: string; support: string; level: string;
  startDate: string; spotsLeft: number; price: number; clubName: string
}

export function CrossClubStages() {
  const [stages, setStages] = useState<Stage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/all-stages')
      .then(r => r.json())
      .then(d => setStages(d.stages || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 }}>
      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 12 }}>⛵ Stages — Vue globale</h4>
      {loading ? <div style={{ color: '#94a3b8' }}>Chargement...</div> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ textAlign: 'left', padding: 8, color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Club</th>
              <th style={{ textAlign: 'left', padding: 8, color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Titre</th>
              <th style={{ textAlign: 'left', padding: 8, color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Support</th>
              <th style={{ textAlign: 'left', padding: 8, color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</th>
              <th style={{ textAlign: 'left', padding: 8, color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Places</th>
              <th style={{ textAlign: 'right', padding: 8, color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Prix</th>
            </tr>
          </thead>
          <tbody>
            {stages.slice(0, 10).map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: 8, fontWeight: 600 }}>{s.clubName || '—'}</td>
                <td style={{ padding: 8 }}><a href={`/admin/collections/stages/${s.id}`} style={{ color: '#1d6fa4', textDecoration: 'none', fontWeight: 500 }}>{s.title}</a></td>
                <td style={{ padding: 8, color: '#64748b' }}>{s.support}</td>
                <td style={{ padding: 8, color: '#64748b' }}>{s.startDate ? new Date(s.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '—'}</td>
                <td style={{ padding: 8 }}>{s.spotsLeft ?? '—'}</td>
                <td style={{ padding: 8, textAlign: 'right', fontWeight: 600, color: '#1d6fa4' }}>{s.price}€</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {stages.length === 0 && !loading && <div style={{ color: '#94a3b8', textAlign: 'center', padding: 20 }}>Aucun stage</div>}
    </div>
  )
}
