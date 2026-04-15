'use client'
import { useEffect, useState } from 'react'
import { DashboardStats } from './DashboardStats'
import { QuickActions } from './QuickActions'
import { SEOScoreWidget } from './SEOScoreWidget'
import { OnboardingWizard } from './OnboardingWizard'
import { CrossClubStages } from './CrossClubStages'
import { CrossClubPosts } from './CrossClubPosts'
import { CrossClubMembers } from './CrossClubMembers'
import { AnalyticsWidget } from './AnalyticsWidget'

type UserInfo = { role: string | null; firstName?: string; plan?: string }
type Club = { id: string; name: string; domain: string; status: string; plan?: string }

const PLAN_LABELS: Record<string, string> = {
  essentiel: 'Essentiel',
  pulse: 'Pulse',
  surmesure: 'Sur mesure',
}
const PLAN_COLORS: Record<string, string> = {
  essentiel: '#64748b',
  pulse: '#1d6fa4',
  surmesure: '#0a1628',
}

export function Dashboard() {
  const [user, setUser] = useState<UserInfo>({ role: null })
  const [clubs, setClubs] = useState<Club[]>([])
  const [showWizard, setShowWizard] = useState(false)

  useEffect(() => {
    fetch('/api/admin/current-user')
      .then(r => r.json())
      .then(setUser)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (user.role === 'super_admin') {
      fetch('/api/admin/all-clubs')
        .then(r => r.json())
        .then(d => setClubs(d.clubs || []))
        .catch(() => {})
    }
  }, [user.role])

  if (!user.role) return null

  const plan = user.plan || 'essentiel'

  // Super Admin Dashboard
  if (user.role === 'super_admin') {
    if (showWizard) {
      return (
        <div style={{ padding: '0 0 32px' }}>
          <button
            onClick={() => setShowWizard(false)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0',
              background: '#fff', fontWeight: 600, fontSize: '0.85rem', color: '#1e293b',
              cursor: 'pointer', marginBottom: 16,
            }}>
            &larr; Retour au dashboard
          </button>
          <OnboardingWizard />
        </div>
      )
    }

    return (
      <div style={{ padding: '0 0 32px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0a1628, #1d6fa4)',
          borderRadius: '12px', padding: '24px', marginBottom: '24px', color: '#fff'
        }}>
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1.5px', opacity: 0.6, marginBottom: '6px' }}>
            Super Administrateur
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>Console multi-tenant VoilePulse</div>
          <div style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '4px' }}>
            {clubs.length} club{clubs.length > 1 ? 's' : ''} enregistre{clubs.length > 1 ? 's' : ''}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', color: '#1e293b' }}>Actions Super Admin</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button onClick={() => setShowWizard(true)} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '10px 18px', borderRadius: '8px', background: '#1d6fa4', border: '1px solid #1d6fa4',
              fontWeight: 600, fontSize: '0.85rem', color: '#fff', cursor: 'pointer',
            }}>Initialiser un nouveau club</button>
            {[
              { label: 'Nouvel admin club', href: '/admin/collections/users/create' },
              { label: 'Tous les clubs', href: '/admin/collections/clubs' },
              { label: 'Tous les utilisateurs', href: '/admin/collections/users' },
            ].map(a => (
              <a key={a.label} href={a.href} style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '10px 18px', borderRadius: '8px', background: '#fff', border: '1px solid #e2e8f0',
                fontWeight: 600, fontSize: '0.85rem', color: '#1e293b', textDecoration: 'none',
              }}>{a.label}</a>
            ))}
          </div>
        </div>

        {/* Clubs table with plan column */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: '#1e293b' }}>Clubs enregistres</h3>
          {clubs.length === 0 ? (
            <div style={{ color: '#94a3b8', textAlign: 'center', padding: '24px' }}>Aucun club. Creez le premier !</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  {['Club', 'Domaine', 'Forfait', 'Statut', ''].map(h => (
                    <th key={h} style={{ textAlign: h ? 'left' : 'right', padding: '8px', color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clubs.map(club => (
                  <tr key={club.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 8px', fontWeight: 600 }}>{club.name}</td>
                    <td style={{ padding: '10px 8px', color: '#64748b' }}>{club.domain}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <span style={{
                        display: 'inline-block', padding: '2px 10px', borderRadius: '10px',
                        fontSize: '0.68rem', fontWeight: 700, color: '#fff',
                        background: PLAN_COLORS[club.plan || 'essentiel'] || '#64748b',
                      }}>{PLAN_LABELS[club.plan || 'essentiel'] || club.plan}</span>
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      <span style={{
                        display: 'inline-block', padding: '2px 8px', borderRadius: '10px',
                        fontSize: '0.7rem', fontWeight: 700,
                        background: club.status === 'active' ? '#dcfce7' : club.status === 'suspended' ? '#fee2e2' : '#fef3c7',
                        color: club.status === 'active' ? '#16a34a' : club.status === 'suspended' ? '#dc2626' : '#d97706',
                      }}>{club.status === 'active' ? 'Actif' : club.status === 'suspended' ? 'Suspendu' : 'En attente'}</span>
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                      <a href={`/admin/collections/clubs/${club.id}`} style={{ color: '#1d6fa4', fontWeight: 600, fontSize: '0.8rem', textDecoration: 'none' }}>Gerer &rarr;</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <CrossClubPosts />
        <CrossClubStages />
        <CrossClubMembers />
        <DashboardStats />
        <AnalyticsWidget />
        <SEOScoreWidget />
      </div>
    )
  }

  // Club Admin Dashboard — gated by plan
  if (user.role === 'club_admin') {
    return (
      <div style={{ padding: '0 0 32px' }}>
        {/* Plan badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 14px', borderRadius: 8, marginBottom: 16,
          background: PLAN_COLORS[plan] || '#64748b', color: '#fff',
          fontSize: '0.72rem', fontWeight: 700,
        }}>
          Forfait : {PLAN_LABELS[plan] || plan}
        </div>

        <DashboardStats />

        {/* SEO Score + Assistant IA — pulse / surmesure (forfaits avec IA) */}
        {(plan === 'pulse' || plan === 'surmesure') && <SEOScoreWidget />}
        {(plan === 'pulse' || plan === 'surmesure') && <AnalyticsWidget />}

        <QuickActions />
      </div>
    )
  }

  // Editor / Contributor Dashboard
  return (
    <div style={{ padding: '0 0 32px' }}>
      <QuickActions />
    </div>
  )
}
