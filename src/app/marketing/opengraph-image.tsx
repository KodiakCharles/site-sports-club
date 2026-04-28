import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Web Pulse — Sites web SaaS pour clubs de sport'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 96px',
          background:
            'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
          color: '#f8fafc',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Glow décoratif */}
        <div
          style={{
            position: 'absolute',
            top: -180,
            right: -180,
            width: 540,
            height: 540,
            borderRadius: '50%',
            background: 'rgba(251, 191, 36, 0.18)',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -200,
            left: -200,
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: 'rgba(34, 211, 238, 0.12)',
            filter: 'blur(80px)',
          }}
        />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, zIndex: 1 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: '#fbbf24',
            }}
          />
          <span
            style={{
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: -0.5,
            }}
          >
            Web Pulse
          </span>
        </div>

        {/* Titre */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, zIndex: 1 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 8,
              color: '#fbbf24',
              textTransform: 'uppercase',
            }}
          >
            SaaS pour clubs sportifs
          </div>
          <div
            style={{
              fontSize: 88,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 960,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>Le site web de votre club,</span>
            <span style={{ color: '#fbbf24' }}>prêt en 24h.</span>
          </div>
          <div style={{ fontSize: 30, color: '#cbd5e1', maxWidth: 900 }}>
            Voile, rugby, pelote — un seul SaaS, un design taillé sur mesure.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#94a3b8',
            fontSize: 24,
            zIndex: 1,
          }}
        >
          <span>web-pulse.fr</span>
          <div style={{ display: 'flex', gap: 32 }}>
            <span>Voile Pulse</span>
            <span>Rugby Pulse</span>
            <span>Pelote Pulse</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
