'use client'
import { useEffect, useState } from 'react'

type Member = {
  id: string; firstName: string; lastName: string; email: string;
  membershipType: string; status: string; membershipExpiry: string; clubName: string
}

export function CrossClubMembers() {
  const [members, setMembers] = useState<Member[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/all-members')
      .then(r => r.json())
      .then(d => { setMembers(d.members || []); setTotal(d.total || 0) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statusStyle = (m: Member) => {
    const expired = m.membershipExpiry ? new Date(m.membershipExpiry) < new Date() : false
    return {
      display: 'inline-block' as const, padding: '2px 8px', borderRadius: 10,
      fontSize: '0.65rem', fontWeight: 700,
      background: expired ? '#fee2e2' : '#dcfce7',
      color: expired ? '#dc2626' : '#16a34a',
    }
  }

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>👥 Adhérents — Vue globale</h4>
        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{total} adhérent{total > 1 ? 's' : ''} au total</span>
      </div>
      {loading ? <div style={{ color: '#94a3b8' }}>Chargement...</div> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ textAlign: 'left', padding: 8, color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Club</th>
              <th style={{ textAlign: 'left', padding: 8, color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nom</th>
              <th style={{ textAlign: 'left', padding: 8, color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</th>
              <th style={{ textAlign: 'left', padding: 8, color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: 8, color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {members.slice(0, 15).map(m => (
              <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: 8, fontWeight: 600 }}>{m.clubName || '—'}</td>
                <td style={{ padding: 8 }}><a href={`/admin/collections/members/${m.id}`} style={{ color: '#1d6fa4', textDecoration: 'none' }}>{m.firstName} {m.lastName}</a></td>
                <td style={{ padding: 8, color: '#64748b' }}>{m.email}</td>
                <td style={{ padding: 8, color: '#64748b' }}>{m.membershipType || '—'}</td>
                <td style={{ padding: 8 }}><span style={statusStyle(m)}>{m.membershipExpiry && new Date(m.membershipExpiry) < new Date() ? 'Expiré' : 'Actif'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {members.length === 0 && !loading && <div style={{ color: '#94a3b8', textAlign: 'center', padding: 20 }}>Aucun adhérent</div>}
    </div>
  )
}
