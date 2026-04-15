import Link from 'next/link'
import { convertLexicalToHTML } from '@/lib/utils/lexical'

type Block = {
  blockType: string
  [key: string]: unknown
}

// Helper to safely get string from unknown
const s = (val: unknown): string => (typeof val === 'string' ? val : '')

export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, i) => {
        switch (block.blockType) {
          case 'hero':
            return <HeroBlock key={i} {...block} />
          case 'text-image':
            return <TextImageBlock key={i} {...block} />
          case 'gallery':
            return <GalleryBlock key={i} {...block} />
          case 'stats':
            return <StatsBlock key={i} {...block} />
          case 'cta-banner':
            return <CTABannerBlock key={i} {...block} />
          case 'faq':
            return <FAQBlock key={i} {...block} />
          case 'video':
            return <VideoBlock key={i} {...block} />
          case 'team':
            return <TeamBlock key={i} {...block} />
          case 'partners':
            return <PartnersBlock key={i} {...block} />
          case 'newsletter':
            return <NewsletterBlock key={i} {...block} />
          case 'map':
            return <MapBlock key={i} {...block} />
          case 'weather':
            return <WeatherBlock key={i} {...block} />
          case 'richtext':
            return <RichTextBlock key={i} {...block} />
          case 'divider':
            return <DividerBlock key={i} {...block} />
          default:
            return null
        }
      })}
    </>
  )
}

function HeroBlock(block: Record<string, unknown>) {
  const bg = block.backgroundImage as { url?: string } | null
  return (
    <section style={{
      background: bg?.url ? `linear-gradient(rgba(7,16,32,0.6),rgba(7,16,32,0.7)), url(${bg.url}) center/cover` : 'linear-gradient(135deg, #071020, #0e2540, #1a4a7a)',
      padding: '80px 32px', color: '#fff', textAlign: 'center',
    }}>
      <div className="container">
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 12 }}>{s(block.title)}</h1>
        {!!s(block.subtitle) && <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: 24, maxWidth: 600, margin: '0 auto 24px' }}>{s(block.subtitle)}</p>}
        {!!(s(block.ctaLabel) && s(block.ctaUrl)) && (
          <Link href={s(block.ctaUrl)} className="btn btn-primary btn-lg">{s(block.ctaLabel)}</Link>
        )}
      </div>
    </section>
  )
}

function TextImageBlock(block: Record<string, unknown>) {
  const img = block.image as { url?: string; alt?: string } | null
  const isLeft = block.imagePosition === 'left'
  return (
    <section className="section">
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
        <div style={{ order: isLeft ? 2 : 1 }}>
          {!!s(block.title) && <h2 className="section-title" style={{ textAlign: 'left' }}>{s(block.title)}</h2>}
          {!!block.text && <div dangerouslySetInnerHTML={{ __html: convertLexicalToHTML(block.text) }} />}
        </div>
        {img?.url && (
          <div style={{ order: isLeft ? 1 : 2 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.alt || ''} style={{ width: '100%', borderRadius: 12 }} />
          </div>
        )}
      </div>
    </section>
  )
}

function GalleryBlock(block: Record<string, unknown>) {
  const images = (block.images as { image: { url?: string; alt?: string }; caption?: string }[]) || []
  const cols = s(block.columns) || '3'
  return (
    <section className="section">
      <div className="container">
        {!!s(block.title) && <h2 className="section-title">{s(block.title)}</h2>}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16, marginTop: 24 }}>
          {images.map((item, i) => (
            <div key={i} style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '4/3' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {item.image?.url && <img src={item.image.url} alt={item.image.alt || item.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatsBlock(block: Record<string, unknown>) {
  const items = (block.items as { value: string; label: string }[]) || []
  return (
    <section className="stats-bar">
      <div className="container stats-grid" style={{ maxWidth: items.length * 200 }}>
        {items.map((item, i) => (
          <div key={i} className="stat-item">
            <span className="stat-num">{item.value}</span>
            <span className="stat-label">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function CTABannerBlock(block: Record<string, unknown>) {
  const isPrimary = block.style === 'primary'
  return (
    <section style={{
      background: isPrimary ? 'linear-gradient(135deg, #071020, #1a4a7a)' : '#f8fafc',
      padding: '56px 32px', textAlign: 'center',
      color: isPrimary ? '#fff' : '#1e293b',
    }}>
      <div className="container">
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>{s(block.title)}</h2>
        {!!s(block.subtitle) && <p style={{ fontSize: '1rem', opacity: 0.8, marginBottom: 24 }}>{s(block.subtitle)}</p>}
        <Link href={s(block.buttonUrl)} className={`btn ${isPrimary ? 'btn-primary' : 'btn-outline'} btn-lg`}>
          {s(block.buttonLabel)}
        </Link>
      </div>
    </section>
  )
}

function FAQBlock(block: Record<string, unknown>) {
  const items = (block.items as { question: string; answer: string }[]) || []
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 700 }}>
        {!!s(block.title) && <h2 className="section-title">{s(block.title)}</h2>}
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item, i) => (
            <details key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '16px 20px' }}>
              <summary style={{ fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>{item.question}</summary>
              <p style={{ marginTop: 10, color: '#64748b', fontSize: '0.9rem', lineHeight: 1.7 }}>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function VideoBlock(block: Record<string, unknown>) {
  const url = s(block.url)
  const embedUrl = url?.includes('youtube.com/watch?v=')
    ? url.replace('watch?v=', 'embed/')
    : url?.includes('youtu.be/')
    ? `https://www.youtube.com/embed/${url.split('youtu.be/')[1]}`
    : url?.includes('vimeo.com/')
    ? `https://player.vimeo.com/video/${url.split('vimeo.com/')[1]}`
    : url
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 800 }}>
        {!!s(block.title) && <h2 className="section-title">{s(block.title)}</h2>}
        <div style={{ aspectRatio: '16/9', borderRadius: 12, overflow: 'hidden', marginTop: 24 }}>
          <iframe src={embedUrl} width="100%" height="100%" frameBorder="0" allowFullScreen style={{ border: 0 }} title={s(block.title) || 'Video'} />
        </div>
      </div>
    </section>
  )
}

function TeamBlock(block: Record<string, unknown>) {
  const members = (block.members as { name: string; role?: string; photo?: { url?: string } }[]) || []
  return (
    <section className="section section-alt">
      <div className="container">
        {!!s(block.title) && <h2 className="section-title">{s(block.title)}</h2>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 20, marginTop: 24 }}>
          {members.map((m, i) => (
            <div key={i} style={{ textAlign: 'center', padding: 20, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12 }}>
              {m.photo?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.photo.url} alt={m.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 10 }} />
              ) : (
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #1d6fa4, #2eb8e6)', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}>
                  {m.name[0]}
                </div>
              )}
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{m.name}</h3>
              {m.role && <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.role}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PartnersBlock(block: Record<string, unknown>) {
  const partners = (block.partners as { name: string; logo?: { url?: string }; url?: string }[]) || []
  return (
    <section className="section">
      <div className="container">
        {!!s(block.title) && <h2 className="section-title">{s(block.title)}</h2>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center', marginTop: 24 }}>
          {partners.map((p, i) => (
            <a key={i} href={p.url || '#'} target={p.url ? '_blank' : undefined} rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 140, height: 80, border: '1px solid #e2e8f0', borderRadius: 8, padding: 12 }}>
              {p.logo?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.logo.url} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              ) : (
                <span style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>{p.name}</span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function NewsletterBlock(block: Record<string, unknown>) {
  return (
    <section style={{ background: 'linear-gradient(135deg, #071020, #1a4a7a)', padding: '56px 32px', textAlign: 'center', color: '#fff' }}>
      <div className="container" style={{ maxWidth: 500 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>{s(block.title)}</h2>
        {!!s(block.subtitle) && <p style={{ opacity: 0.7, marginBottom: 20 }}>{s(block.subtitle)}</p>}
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="email" placeholder="votre@email.fr" style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: 'none', fontSize: '0.9rem' }} />
          <button type="button" className="btn btn-primary">S&apos;inscrire</button>
        </div>
      </div>
    </section>
  )
}

function MapBlock(block: Record<string, unknown>) {
  return (
    <section className="section">
      <div className="container">
        {!!s(block.title) && <h2 className="section-title">{s(block.title)}</h2>}
        <div style={{ borderRadius: 12, overflow: 'hidden', marginTop: 24 }}>
          <iframe src={s(block.embedUrl)} width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy" title={s(block.title) || 'Carte'} />
        </div>
      </div>
    </section>
  )
}

function WeatherBlock(block: Record<string, unknown>) {
  return (
    <section className="section">
      <div className="container">
        {!!s(block.title) && <h2 className="section-title">{s(block.title)}</h2>}
        <div style={{ marginTop: 24, maxWidth: 600, margin: '24px auto 0' }}>
          <div className="weather-widget">
            <div className="weather-widget-header">
              <h3>Meteo marine</h3>
            </div>
            <p style={{ color: 'rgba(255,255,255,.6)', textAlign: 'center' }}>Widget meteo — configurez l&apos;ID station Windguru</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function RichTextBlock(block: Record<string, unknown>) {
  if (!block.content) return null
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 750 }}>
        <div dangerouslySetInnerHTML={{ __html: convertLexicalToHTML(block.content) }} />
      </div>
    </section>
  )
}

function DividerBlock(block: Record<string, unknown>) {
  if (block.style === 'space') return <div style={{ height: 48 }} />
  if (block.style === 'wave') return (
    <div style={{ height: 40, overflow: 'hidden' }}>
      <svg viewBox="0 0 1200 40" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <path d="M0,20 C200,0 400,40 600,20 C800,0 1000,40 1200,20 L1200,40 L0,40 Z" fill="#f8fafc" />
      </svg>
    </div>
  )
  return <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '32px 0' }} />
}
