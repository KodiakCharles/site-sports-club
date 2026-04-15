'use client'
import { useRouter } from 'next/navigation'

export function QuickActions() {
  const router = useRouter()

  const actions = [
    { label: '+ Article', href: '/admin/collections/posts/create', icon: '📰' },
    { label: '+ Stage', href: '/admin/collections/stages/create', icon: '⛵' },
    { label: '+ Newsletter', href: '/admin/collections/newsletters/create', icon: '📧' },
    { label: '+ Membre', href: '/admin/collections/members/create', icon: '👤' },
    { label: 'Paramètres', href: '/admin/globals/club-settings', icon: '⚙️' },
    { label: 'Page d\'accueil', href: '/admin/globals/home-page', icon: '🏠' },
  ]

  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#1e293b' }}>
        ⚡ Actions rapides
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {actions.map(a => (
          <button
            key={a.label}
            onClick={() => router.push(a.href)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '10px 18px', borderRadius: '8px',
              background: '#f8fafc', border: '1px solid #e2e8f0',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
              color: '#1e293b', transition: 'all 0.15s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#1d6fa4'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#1d6fa4' }}
            onMouseOut={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#1e293b'; e.currentTarget.style.borderColor = '#e2e8f0' }}
          >
            <span>{a.icon}</span>
            {a.label}
          </button>
        ))}
      </div>
    </div>
  )
}
