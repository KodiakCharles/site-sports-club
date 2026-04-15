'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = (base: string) => [
  { href: base || '/', icon: '🏠', label: 'Accueil' },
  { href: `${base}/stages`, icon: '⛵', label: 'Stages' },
  { href: `${base}/actualites`, icon: '📰', label: 'Actus' },
  { href: `${base}/contact`, icon: '✉️', label: 'Contact' },
  { href: `${base}/espace-adherent`, icon: '👤', label: 'Mon espace' },
]

export default function BottomNav({ locale }: { locale: string }) {
  const pathname = usePathname()
  const base = locale === 'fr' ? '' : `/${locale}`
  const items = tabs(base)

  const isActive = (href: string) => {
    if (href === base || href === '/') return pathname === '/' || pathname === `/${locale}`
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <nav className="bottom-nav" aria-label="Navigation principale mobile">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`bottom-nav-item${isActive(item.href) ? ' active' : ''}`}
          aria-label={item.label}
        >
          <span className="bottom-nav-icon">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}
