'use client'
import { useEffect, useState } from 'react'

type Post = {
  id: string; title: string; category: string; status: string;
  publishedAt: string; createdAt: string; clubName: string
}

export function CrossClubPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/all-posts')
      .then(r => r.json())
      .then(d => setPosts(d.posts || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statusStyle = (s: string) => ({
    display: 'inline-block' as const, padding: '2px 8px', borderRadius: 10,
    fontSize: '0.65rem', fontWeight: 700,
    background: s === 'published' ? '#dcfce7' : '#fef3c7',
    color: s === 'published' ? '#16a34a' : '#d97706',
  })

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 }}>
      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 12 }}>📰 Articles — Vue globale</h4>
      {loading ? <div style={{ color: '#94a3b8' }}>Chargement...</div> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ textAlign: 'left', padding: 8, color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Club</th>
              <th style={{ textAlign: 'left', padding: 8, color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Titre</th>
              <th style={{ textAlign: 'left', padding: 8, color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Catégorie</th>
              <th style={{ textAlign: 'left', padding: 8, color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Statut</th>
              <th style={{ textAlign: 'left', padding: 8, color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {posts.slice(0, 10).map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: 8, fontWeight: 600 }}>{p.clubName || '—'}</td>
                <td style={{ padding: 8 }}><a href={`/admin/collections/posts/${p.id}`} style={{ color: '#1d6fa4', textDecoration: 'none', fontWeight: 500 }}>{p.title}</a></td>
                <td style={{ padding: 8, color: '#64748b' }}>{p.category || '—'}</td>
                <td style={{ padding: 8 }}><span style={statusStyle(p.status)}>{p.status === 'published' ? 'Publié' : 'Brouillon'}</span></td>
                <td style={{ padding: 8, color: '#64748b' }}>{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('fr-FR') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {posts.length === 0 && !loading && <div style={{ color: '#94a3b8', textAlign: 'center', padding: 20 }}>Aucun article</div>}
    </div>
  )
}
