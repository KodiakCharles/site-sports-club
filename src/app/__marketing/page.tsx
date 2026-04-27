export default function MarketingHome() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: 720 }}>
        <p style={{ color: 'var(--wp-accent)', fontWeight: 700, letterSpacing: 4, fontSize: 12 }}>
          WEB PULSE
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', lineHeight: 1.1, margin: '1rem 0' }}>
          Le site web de votre club, prêt en 24h.
        </h1>
        <p style={{ color: 'var(--wp-muted)', fontSize: '1.125rem', margin: '1rem 0 2rem' }}>
          Multi-sport, multi-tenant, conçu pour les fédérations.
          <br />
          Voile, rugby, pelote — un seul SaaS.
        </p>
        <p style={{ color: 'var(--wp-muted)', fontSize: '0.875rem' }}>
          La vitrine arrive bientôt. En attendant, l&apos;admin est à{' '}
          <a href="/admin">/admin</a>.
        </p>
      </div>
    </main>
  )
}
