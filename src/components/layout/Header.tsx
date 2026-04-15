'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import DarkModeToggle from '@/components/ui/DarkModeToggle'

const locales = ['fr', 'en', 'es']

const t: Record<string, Record<string, string>> = {
  fr: { club: 'Le Club', activities: 'Activités', stages: 'Stages', competition: 'Compétition', prices: 'Tarifs', news: 'Actualités', contact: 'Contact', register: "S'inscrire", members: 'Mon espace' },
  en: { club: 'The Club', activities: 'Activities', stages: 'Courses', competition: 'Racing', prices: 'Prices', news: 'News', contact: 'Contact', register: 'Register', members: 'My space' },
  es: { club: 'El Club', activities: 'Actividades', stages: 'Cursos', competition: 'Competición', prices: 'Precios', news: 'Noticias', contact: 'Contacto', register: 'Inscribirse', members: 'Mi espacio' },
}

export default function Header({ locale, logoUrl, logoText }: { locale: string; logoUrl?: string | null; logoText?: string }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [headerHidden, setHeaderHidden] = useState(false)
  const lastScrollY = useRef(0)
  const nav = t[locale] ?? t.fr
  const base = locale === 'fr' ? '' : `/${locale}`

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      if (y < 20) {
        setHeaderHidden(false)
      } else if (y > lastScrollY.current && y > 200) {
        setHeaderHidden(true)
      } else if (y < lastScrollY.current) {
        setHeaderHidden(false)
      }
      lastScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Ferme le menu au changement de route
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const links = [
    { href: `${base}/le-club`, label: nav.club },
    { href: `${base}/activites`, label: nav.activities },
    { href: `${base}/stages`, label: nav.stages },
    { href: `${base}/competition`, label: nav.competition },
    { href: `${base}/tarifs`, label: nav.prices },
    { href: `${base}/actualites`, label: nav.news },
    { href: `${base}/contact`, label: nav.contact },
  ]

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  const langHref = (l: string) => {
    const withoutLocale = pathname.replace(/^\/(fr|en|es)(\/|$)/, '/')
    const path = withoutLocale === '/' ? '' : withoutLocale
    return l === 'fr' ? withoutLocale || '/' : `/${l}${path}`
  }

  return (
    <>
      <header className={`site-header${scrolled ? ' scrolled' : ''}${headerHidden ? ' hidden' : ''}`}>
        <div className="header-inner container">

          {/* LOGO */}
          <Link href={base || '/'} className="header-logo" onClick={() => setMenuOpen(false)}>
            {logoUrl
              ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={logoUrl} alt={logoText ?? 'Logo'} className="logo-img" />
              : <><span className="logo-icon">⚓</span><span className="logo-text">{logoText ?? 'ClubVoile'}</span></>
            }
          </Link>

          {/* NAV DESKTOP */}
          <nav className="header-nav" aria-label="Navigation principale">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`nav-link${isActive(l.href) ? ' active' : ''}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* ACTIONS DESKTOP */}
          <div className="header-actions">
            <div className="lang-switcher" aria-label="Langue">
              {locales.map((l) => (
                <Link key={l} href={langHref(l)} className={`lang-btn${locale === l ? ' active' : ''}`}>
                  {l.toUpperCase()}
                </Link>
              ))}
            </div>
            <DarkModeToggle />
            <Link href={`${base}/espace-adherent`} className="btn-icon" aria-label={nav.members} title={nav.members}>
              👤
            </Link>
            <Link href={`${base}/stages`} className="btn btn-primary btn-sm header-cta">
              {nav.register}
            </Link>
          </div>

          {/* BURGER */}
          <button
            className={`menu-burger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* MENU MOBILE */}
      <div className={`mobile-drawer${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <nav className="mobile-nav">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`mobile-nav-link${isActive(l.href) ? ' active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mobile-nav-footer">
          <div className="lang-switcher">
            {locales.map((l) => (
              <Link key={l} href={langHref(l)} className={`lang-btn${locale === l ? ' active' : ''}`}>
                {l.toUpperCase()}
              </Link>
            ))}
          </div>
          <Link href={`${base}/stages`} className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>
            {nav.register}
          </Link>
          <Link href={`${base}/espace-adherent`} className="btn btn-outline" style={{ flex: 1, textAlign: 'center' }}>
            {nav.members}
          </Link>
        </div>
      </div>

      {/* OVERLAY */}
      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />}
    </>
  )
}
