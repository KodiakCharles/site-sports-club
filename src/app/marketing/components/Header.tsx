'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Header() {
  const [open, setOpen] = useState(false)

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

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className="sticky top-0 z-50 bg-white shadow-[0_6px_24px_rgba(15,23,42,0.08),0_1px_0_#e5e7eb]"
      style={{
        borderTop: '4px solid',
        borderImage: 'linear-gradient(90deg, #1d6fa4 0%, #c23b22 50%, #c8102e 100%) 1',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-[70px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
          <Image
            src="/icons/icon-180.png"
            alt="Web Pulse"
            width={32}
            height={32}
            priority
          />
          <span className="font-extrabold tracking-tight text-[1.05rem] text-slate-900">
            Web Pulse
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[0.92rem] font-semibold">
          <a href="#sports" className="text-slate-600 hover:text-slate-900 transition">Sports</a>
          <a href="#features" className="text-slate-600 hover:text-slate-900 transition">Fonctionnalités</a>
          <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition">Tarifs</a>
          <Link href="/login" className="text-slate-600 hover:text-slate-900 transition">Espace admin</Link>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="mailto:contact@web-pulse.fr?subject=Demande%20de%20d%C3%A9mo%20Web%20Pulse"
            className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-[10px] bg-slate-900 hover:bg-slate-800 text-white font-bold text-[0.88rem] transition shadow-sm hover:shadow-md hover:-translate-y-px"
            onClick={() => setOpen(false)}
          >
            Demander une démo
          </a>
          <button
            type="button"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 hover:border-slate-400 text-slate-700 transition"
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

      {open && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-slate-200 bg-white"
        >
          <nav className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1 text-base">
            <a href="#sports" onClick={() => setOpen(false)} className="px-3 py-3 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition font-semibold">Sports</a>
            <a href="#features" onClick={() => setOpen(false)} className="px-3 py-3 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition font-semibold">Fonctionnalités</a>
            <a href="#pricing" onClick={() => setOpen(false)} className="px-3 py-3 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition font-semibold">Tarifs</a>
            <Link href="/login" onClick={() => setOpen(false)} className="px-3 py-3 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition font-semibold">Espace admin</Link>
            <a
              href="mailto:contact@web-pulse.fr?subject=Demande%20de%20d%C3%A9mo%20Web%20Pulse"
              onClick={() => setOpen(false)}
              className="mt-2 px-3 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-center transition"
            >
              Demander une démo
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
