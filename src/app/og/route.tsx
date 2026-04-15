import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = searchParams.get('title') || 'Club de Voile'
  const subtitle = searchParams.get('subtitle') || ''
  const clubName = searchParams.get('clubName') || 'Club de Voile'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #0a1628 0%, #1d6fa4 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '24px',
            opacity: 0.9,
          }}
        >
          <span>{clubName}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '28px', opacity: 0.6 }}>
            ⚓
          </div>
          <div
            style={{
              fontSize: '56px',
              fontWeight: 700,
              lineHeight: 1.15,
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: '24px',
                opacity: 0.8,
                maxWidth: '800px',
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '18px',
            opacity: 0.6,
          }}
        >
          <span>VoilePulse</span>
          <span>⚓</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
