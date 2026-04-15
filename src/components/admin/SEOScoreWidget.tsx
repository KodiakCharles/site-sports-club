'use client'
import { useEffect, useState } from 'react'

type SEOCheck = {
  page: string
  score: number
  issues: string[]
}

export function SEOScoreWidget() {
  const [checks, setChecks] = useState<SEOCheck[]>([])
  const [loading, setLoading] = useState(true)
  const [avgScore, setAvgScore] = useState(0)

  useEffect(() => {
    fetch('/api/admin/seo-score')
      .then(r => r.json())
      .then((data: SEOCheck[]) => {
        setChecks(data)
        if (data.length > 0) {
          setAvgScore(Math.round(data.reduce((a, b) => a + b.score, 0) / data.length))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const scoreColor = avgScore >= 80 ? '#4ade80' : avgScore >= 60 ? '#f0b429' : '#f87171'

  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#1e293b' }}>
        📊 Score SEO
      </h3>
      <div style={{
        background: '#fff', borderRadius: '12px', padding: '24px',
        border: '1px solid #e2e8f0',
      }}>
        {loading ? (
          <div style={{ color: '#94a3b8' }}>Analyse en cours...</div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 800, color: scoreColor,
                border: `3px solid ${scoreColor}`,
              }}>
                {avgScore}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>Score global</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {checks.length} pages analysées
                </div>
              </div>
            </div>
            {checks.filter(c => c.issues.length > 0).slice(0, 5).map(c => (
              <div key={c.page} style={{
                padding: '8px 0', borderTop: '1px solid #f1f5f9',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{c.page}</span>
                <span style={{
                  fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px',
                  borderRadius: '4px',
                  background: c.score >= 80 ? '#dcfce7' : c.score >= 60 ? '#fef3c7' : '#fee2e2',
                  color: c.score >= 80 ? '#16a34a' : c.score >= 60 ? '#d97706' : '#dc2626',
                }}>
                  {c.score}/100
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
