'use client'
import { useState, useEffect } from 'react'

type Member = {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  membershipType?: string
  ffvoileLicense?: string
  membershipExpiry?: string
  status?: string
  newsletterOptIn?: boolean
}

type Tab = 'profile' | 'stages' | 'documents' | 'subscription'

export default function MemberPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [member, setMember] = useState<Member | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<Member>>({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [saving, setSaving] = useState(false)

  // Check for existing session
  useEffect(() => {
    fetch('/api/members/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.user) {
          setMember(data.user)
          setIsLoggedIn(true)
        }
      })
      .catch(() => {})
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/members/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        const data = await res.json()
        setMember(data.user)
        setIsLoggedIn(true)
      } else {
        setError('Email ou mot de passe incorrect')
      }
    } catch {
      setError('Erreur de connexion')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/members/logout', { method: 'POST' })
    setIsLoggedIn(false)
    setMember(null)
  }

  const handleSave = async () => {
    if (!member) return
    setSaving(true)
    try {
      const res = await fetch('/api/members/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      })
      if (res.ok) {
        const updated = await res.json()
        setMember(updated)
        setEditing(false)
      }
    } catch {}
    setSaving(false)
  }

  const handleDelete = async () => {
    await fetch('/api/members/me', { method: 'DELETE' })
    setIsLoggedIn(false)
    setMember(null)
    setShowDeleteConfirm(false)
  }

  const isExpired = member?.membershipExpiry
    ? new Date(member.membershipExpiry) < new Date()
    : false

  if (!isLoggedIn) {
    return (
      <div className="member-login-container">
        <div className="member-login-card">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>⚓</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0a1628', marginBottom: '8px' }}>
              Espace adherent
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Connectez-vous pour acceder a votre espace personnel
            </p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="votre@email.fr"
              />
            </div>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '16px' }}>{error}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Se connecter
            </button>
          </form>
        </div>
      </div>
    )
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'profile', label: 'Mon profil', icon: '👤' },
    { key: 'stages', label: 'Mes stages', icon: '⛵' },
    { key: 'documents', label: 'Documents', icon: '📄' },
    { key: 'subscription', label: 'Cotisation', icon: '💳' },
  ]

  return (
    <div className="member-dashboard">
      <aside className="member-sidebar">
        <div className="member-avatar">
          {member?.firstName?.[0]?.toUpperCase() || '?'}
        </div>
        <div className="member-name">
          {member?.firstName} {member?.lastName}
        </div>
        <div className="member-role">
          <span className={`status-badge ${isExpired ? 'status-expired' : 'status-active'}`}>
            {isExpired ? 'Expire' : 'Actif'}
          </span>
        </div>
        <nav className="member-nav">
          {tabs.map(tab => (
            <div
              key={tab.key}
              className={`member-nav-link ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span>{tab.icon}</span> {tab.label}
            </div>
          ))}
          <div className="member-nav-link" onClick={handleLogout} style={{ marginTop: '16px', color: '#dc2626' }}>
            <span>🚪</span> Deconnexion
          </div>
        </nav>
      </aside>

      <div className="member-content">
        {activeTab === 'profile' && (
          <>
            <h2>Mon profil</h2>
            {editing ? (
              <div className="profile-form">
                <div className="form-group">
                  <label className="form-label">Prenom</label>
                  <input className="form-input" value={editData.firstName ?? member?.firstName ?? ''} onChange={e => setEditData({...editData, firstName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Nom</label>
                  <input className="form-input" value={editData.lastName ?? member?.lastName ?? ''} onChange={e => setEditData({...editData, lastName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Telephone</label>
                  <input className="form-input" value={editData.phone ?? member?.phone ?? ''} onChange={e => setEditData({...editData, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Adresse</label>
                  <input className="form-input" value={editData.address ?? member?.address ?? ''} onChange={e => setEditData({...editData, address: e.target.value})} />
                </div>
                <div className="form-group full-width" style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
                  <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                  <button className="btn btn-outline" onClick={() => setEditing(false)}>Annuler</button>
                </div>
              </div>
            ) : (
              <>
                <div className="profile-form">
                  <div className="form-group">
                    <span className="form-label">Prenom</span>
                    <span style={{ fontSize: '1rem' }}>{member?.firstName || '\u2014'}</span>
                  </div>
                  <div className="form-group">
                    <span className="form-label">Nom</span>
                    <span style={{ fontSize: '1rem' }}>{member?.lastName || '\u2014'}</span>
                  </div>
                  <div className="form-group">
                    <span className="form-label">Email</span>
                    <span style={{ fontSize: '1rem' }}>{member?.email || '\u2014'}</span>
                  </div>
                  <div className="form-group">
                    <span className="form-label">Telephone</span>
                    <span style={{ fontSize: '1rem' }}>{member?.phone || '\u2014'}</span>
                  </div>
                  <div className="form-group">
                    <span className="form-label">Licence FFVoile</span>
                    <span style={{ fontSize: '1rem' }}>{member?.ffvoileLicense || '\u2014'}</span>
                  </div>
                  <div className="form-group">
                    <span className="form-label">Type d&apos;adhesion</span>
                    <span style={{ fontSize: '1rem' }}>{member?.membershipType || '\u2014'}</span>
                  </div>
                </div>
                <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                  <button className="btn btn-primary" onClick={() => { setEditing(true); setEditData({}) }}>
                    Modifier mon profil
                  </button>
                </div>
              </>
            )}
            <div style={{ marginTop: '48px', padding: '20px', background: '#fee2e2', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#dc2626', marginBottom: '8px' }}>
                Zone de danger
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '12px' }}>
                Supprimer votre compte et toutes vos donnees personnelles (RGPD).
              </p>
              <button
                className="btn"
                style={{ background: '#dc2626', color: '#fff', fontSize: '0.85rem' }}
                onClick={() => setShowDeleteConfirm(true)}
              >
                Supprimer mon compte
              </button>
            </div>
          </>
        )}

        {activeTab === 'stages' && (
          <>
            <h2>Mes stages</h2>
            <p style={{ color: '#64748b' }}>Historique de vos stages et inscriptions a venir.</p>
            <div style={{ marginTop: '20px', padding: '40px', textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: '12px' }}>
              Aucun stage enregistre pour le moment
            </div>
          </>
        )}

        {activeTab === 'documents' && (
          <>
            <h2>Mes documents</h2>
            <p style={{ color: '#64748b' }}>Certificat medical, licence FFVoile, attestations.</p>
            <div style={{ marginTop: '20px', padding: '40px', textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: '12px' }}>
              Aucun document disponible
            </div>
          </>
        )}

        {activeTab === 'subscription' && (
          <>
            <h2>Ma cotisation</h2>
            <div style={{ marginTop: '16px', padding: '20px', background: isExpired ? '#fee2e2' : '#dcfce7', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, color: isExpired ? '#dc2626' : '#16a34a' }}>
                    {isExpired ? 'Cotisation expiree' : 'Cotisation a jour'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                    Expire le {member?.membershipExpiry ? new Date(member.membershipExpiry).toLocaleDateString('fr-FR') : '\u2014'}
                  </div>
                </div>
                <span className={`status-badge ${isExpired ? 'status-expired' : 'status-active'}`}>
                  {isExpired ? 'Expire' : 'Actif'}
                </span>
              </div>
            </div>
            {isExpired && (
              <a href="#" className="btn btn-primary" style={{ marginTop: '16px' }}>
                Renouveler via HelloAsso
              </a>
            )}
          </>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '90%' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>
              Confirmer la suppression
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '24px' }}>
              Cette action est irreversible. Toutes vos donnees personnelles seront supprimees conformement au RGPD.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn" style={{ background: '#dc2626', color: '#fff' }} onClick={handleDelete}>
                Supprimer definitivement
              </button>
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(false)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
