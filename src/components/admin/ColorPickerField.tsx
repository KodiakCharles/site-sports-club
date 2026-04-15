'use client'

import React, { useCallback, useRef, useState } from 'react'
import { useField, useFormFields } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'

// ─── Palette de couleurs nautiques ───────────────────────────────────────────

const PALETTE: { color: string; name: string }[] = [
  // Blues / Marines
  { color: '#0d1f3c', name: 'Marine foncé' },
  { color: '#1a3a5c', name: 'Navy' },
  { color: '#1d4e89', name: 'Bleu roi' },
  { color: '#1d6fa4', name: 'Bleu mer' },
  { color: '#2563eb', name: 'Bleu vif' },
  { color: '#2eb8e6', name: 'Bleu ciel' },
  { color: '#00bcd4', name: 'Cyan mer' },
  { color: '#0f766e', name: 'Vert teal' },
  // Blancs & gris
  { color: '#ffffff', name: 'Blanc' },
  { color: '#f8fafc', name: 'Blanc nacré' },
  { color: '#e2e8f0', name: 'Gris perle' },
  { color: '#64748b', name: 'Gris ardoise' },
  { color: '#1e293b', name: 'Gris marine' },
  // Accents
  { color: '#f0b429', name: 'Or voile' },
  { color: '#f59e0b', name: 'Ambre' },
  { color: '#ef4444', name: 'Rouge compét.' },
  { color: '#16a34a', name: 'Vert bouée' },
  { color: '#7c3aed', name: 'Violet' },
  { color: '#ec4899', name: 'Rose' },
  { color: '#f97316', name: 'Orange' },
]

// ─── Extraction de couleurs dominantes depuis pixels canvas ──────────────────

function extractDominantColors(data: Uint8ClampedArray, count: number): string[] {
  const freq = new Map<string, number>()

  for (let i = 0; i < data.length; i += 20) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3]
    if (a < 128) continue
    if (r > 240 && g > 240 && b > 240) continue // blanc
    if (r < 20 && g < 20 && b < 20) continue    // noir
    // Quantisation en paliers de 24 pour regrouper les teintes proches
    const qr = Math.round(r / 24) * 24
    const qg = Math.round(g / 24) * 24
    const qb = Math.round(b / 24) * 24
    const key = `${qr},${qg},${qb}`
    freq.set(key, (freq.get(key) ?? 0) + 1)
  }

  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([key]) => {
      const [r, g, b] = key.split(',').map(Number)
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    })
}

// ─── Composant principal ──────────────────────────────────────────────────────

export function ColorPickerField(props: TextFieldClientProps) {
  const path = props.path ?? props.field.name
  const label = typeof props.field.label === 'string' ? props.field.label : path

  const { value, setValue } = useField<string>({ path })

  // Surveille le champ logo (ID de la relation media)
  const logoId = useFormFields(([fields]) => {
    const logoField = fields['logo']
    return logoField?.value as string | null | undefined
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [open, setOpen] = useState(false)
  const [extractedColors, setExtractedColors] = useState<string[]>([])
  const [extracting, setExtracting] = useState(false)

  const current = value ?? '#1d6fa4'

  // ── Extraction des couleurs depuis le logo ──
  const handleExtract = useCallback(async () => {
    if (!logoId) return
    setExtracting(true)
    try {
      // Récupère le document média depuis l'API Payload
      const res = await fetch(`/api/media/${logoId}`, { credentials: 'include' })
      if (!res.ok) throw new Error('Média introuvable')
      const media = await res.json() as { url?: string }
      const imageUrl = media.url
      if (!imageUrl) throw new Error('URL absente')

      await new Promise<void>((resolve, reject) => {
        const img = new window.Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          const canvas = canvasRef.current
          if (!canvas) { resolve(); return }
          const ctx = canvas.getContext('2d')
          if (!ctx) { resolve(); return }
          canvas.width = 80
          canvas.height = 80
          ctx.drawImage(img, 0, 0, 80, 80)
          const { data } = ctx.getImageData(0, 0, 80, 80)
          setExtractedColors(extractDominantColors(data, 6))
          resolve()
        }
        img.onerror = reject
        img.src = imageUrl
      })
    } catch (err) {
      console.warn('[ColorPicker] Extraction échouée :', err)
    } finally {
      setExtracting(false)
    }
  }, [logoId])

  // ── Rendu ──
  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Label */}
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '.875rem', color: 'var(--theme-text)' }}>
        {label}
      </label>

      {/* Ligne principale : swatch + picker natif + input hex + bouton palette */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Swatch cliquable */}
        <div
          title="Cliquer pour ouvrir la palette"
          onClick={() => setOpen(o => !o)}
          style={{
            width: 40, height: 40, borderRadius: '8px', background: current, flexShrink: 0,
            border: '2px solid var(--theme-elevation-150)', cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,.15)', transition: 'transform .15s',
          }}
        />

        {/* Color picker natif (roue de couleurs OS) */}
        <input
          type="color"
          value={current}
          onChange={e => setValue(e.target.value)}
          title="Sélecteur de couleur"
          style={{
            width: 40, height: 40, padding: '2px', border: '2px solid var(--theme-elevation-150)',
            borderRadius: '8px', cursor: 'pointer', background: 'none', flexShrink: 0,
          }}
        />

        {/* Input hex */}
        <input
          type="text"
          value={current}
          onChange={e => {
            const v = e.target.value
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setValue(v)
          }}
          maxLength={7}
          placeholder="#1d6fa4"
          style={{
            flex: 1, padding: '8px 12px', border: '1px solid var(--theme-elevation-150)',
            borderRadius: '6px', fontFamily: 'monospace', fontSize: '.875rem',
            background: 'var(--theme-input-bg)', color: 'var(--theme-text)',
          }}
        />

        {/* Toggle palette */}
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          style={{
            padding: '8px 14px', border: '1px solid var(--theme-elevation-150)', borderRadius: '6px',
            background: open ? 'var(--theme-elevation-100)' : 'var(--theme-input-bg)',
            color: 'var(--theme-text)', cursor: 'pointer', fontSize: '.8rem', fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {open ? '✕ Fermer' : '🎨 Palette'}
        </button>
      </div>

      {/* Panneau palette */}
      {open && (
        <div style={{
          marginTop: '10px', padding: '16px', borderRadius: '10px',
          border: '1px solid var(--theme-elevation-150)', background: 'var(--theme-elevation-50)',
        }}>

          {/* Palette nautique */}
          <p style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--theme-text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '10px' }}>
            Palette nautique
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
            {PALETTE.map(({ color, name }) => (
              <button
                key={color}
                type="button"
                title={name}
                onClick={() => setValue(color)}
                style={{
                  width: 34, height: 34, borderRadius: '7px', background: color, padding: 0,
                  border: current.toLowerCase() === color.toLowerCase()
                    ? '3px solid var(--theme-success-500)'
                    : '2px solid rgba(0,0,0,.12)',
                  cursor: 'pointer',
                  transform: current.toLowerCase() === color.toLowerCase() ? 'scale(1.15)' : 'scale(1)',
                  transition: 'transform .15s',
                  boxShadow: '0 1px 4px rgba(0,0,0,.15)',
                }}
                aria-label={name}
              />
            ))}
          </div>

          {/* Section extraction depuis le logo */}
          <div style={{ borderTop: '1px solid var(--theme-elevation-150)', paddingTop: '14px' }}>
            <p style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--theme-text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '10px' }}>
              Couleurs extraites du logo
            </p>

            {logoId ? (
              <>
                <button
                  type="button"
                  onClick={handleExtract}
                  disabled={extracting}
                  style={{
                    padding: '7px 14px', borderRadius: '6px', border: 'none',
                    background: 'var(--theme-success-500)', color: '#fff',
                    cursor: extracting ? 'wait' : 'pointer', fontSize: '.82rem', fontWeight: 600,
                  }}
                >
                  {extracting ? '⏳ Analyse en cours…' : '✦ Extraire les couleurs du logo'}
                </button>

                {extractedColors.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <p style={{ fontSize: '.75rem', color: 'var(--theme-text-muted)', marginBottom: '8px' }}>
                      Cliquez pour appliquer une couleur :
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {extractedColors.map(color => (
                        <button
                          key={color}
                          type="button"
                          title={color}
                          onClick={() => setValue(color)}
                          style={{
                            width: 48, height: 48, borderRadius: '8px', background: color,
                            border: current.toLowerCase() === color.toLowerCase()
                              ? '3px solid var(--theme-success-500)'
                              : '2px solid rgba(0,0,0,.12)',
                            cursor: 'pointer', padding: 0, boxShadow: '0 2px 6px rgba(0,0,0,.2)',
                            position: 'relative', fontSize: '1.1rem',
                          }}
                          aria-label={color}
                        >
                          {current.toLowerCase() === color.toLowerCase() && (
                            <span style={{ color: '#fff', textShadow: '0 0 4px rgba(0,0,0,.6)' }}>✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                      {extractedColors.map(color => (
                        <span key={color} style={{ fontFamily: 'monospace', fontSize: '.72rem', color: 'var(--theme-text-muted)' }}>
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p style={{ fontSize: '.82rem', color: 'var(--theme-text-muted)', fontStyle: 'italic' }}>
                Uploadez d&apos;abord un logo dans le champ ci-dessus pour extraire ses couleurs dominantes.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Canvas caché pour l'extraction */}
      <canvas ref={canvasRef} style={{ display: 'none' }} aria-hidden />
    </div>
  )
}
