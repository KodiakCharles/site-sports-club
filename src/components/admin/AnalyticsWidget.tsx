'use client'
import { useEffect, useState } from 'react'

type Insight = {
  type: 'success' | 'warning' | 'suggestion'
  icon: string
  title: string
  description: string
}

export function AnalyticsWidget() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(r => r.json())
      .then(d => setInsights(d.insights || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const typeStyles: Record<string, { bg: string; border: string; color: string }> = {
    success: { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a' },
    warning: { bg: '#fef3c7', border: '#fde68a', color: '#d97706' },
    suggestion: { bg: '#eff6ff', border: '#bfdbfe', color: '#2563eb' },
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '1.2rem' }}>{'\u{1F916}'}</span> Recommandations IA
      </h3>
      {loading ? (
        <div style={{ color: '#94a3b8', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>Analyse en cours...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {insights.map((insight, i) => {
            const style = typeStyles[insight.type] || typeStyles.suggestion
            return (
              <div key={i} style={{
                padding: '14px 18px', borderRadius: '10px',
                background: style.bg, border: `1px solid ${style.border}`,
                display: 'flex', alignItems: 'flex-start', gap: '12px',
              }}>
                <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{insight.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: style.color, marginBottom: '2px' }}>
                    {insight.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>
                    {insight.description}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
