'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Header() {
  const [open, setOpen] = useState(false)

  // Ferme le menu si l'utilisateur clique sur une ancre #section ou redimensionne en desktop
  useEffect(() => {
    if (!open) return
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Bloque le scroll de la page quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-slate-900/80 border-b border-slate-700">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 group-hover:bg-amber-300 transition" />
          <span className="font-bold tracking-tight text-lg">Web Pulse</span>
        </Link>

        {/* Nav inline desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
          <a href="#sports" className="hover:text-white transition">Sports</a>
          <a href="#features" className="hover:text-white transition">Fonctionnalités</a>
          <a href="#pricing" className="hover:text-white transition">Tarifs</a>
        </nav>

        {/* Login + burger (burger visible uniquement sur mobile) */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden sm:inline-block px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold text-sm transition"
            onClick={() => setOpen(false)}
          >
            Connexion
          </Link>
          <button
            type="button"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-700 hover:border-slate-500 transition"
          >
            <span className="sr-only">{open ? 'Fermer' : 'Menu'}</span>
            {open ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Drawer mobile */}
      {open && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-slate-700 bg-slate-900/95 backdrop-blur"
        >
          <nav className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1 text-base">
            <a
              href="#sports"
              onClick={() => setOpen(false)}
              className="px-3 py-3 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-white transition"
            >
              Sports
            </a>
            <a
              href="#features"
              onClick={() => setOpen(false)}
              className="px-3 py-3 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-white transition"
            >
              Fonctionnalités
            </a>
            <a
              href="#pricing"
              onClick={() => setOpen(false)}
              className="px-3 py-3 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-white transition"
            >
              Tarifs
            </a>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-2 px-3 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold text-center transition"
            >
              Connexion
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
