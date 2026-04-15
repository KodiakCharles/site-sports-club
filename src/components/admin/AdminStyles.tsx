/**
 * Injecte du CSS custom dans l'admin Payload.
 * Monté via admin.components.providers dans payload.config.ts.
 */
'use client'

import React from 'react'

export function AdminStyles({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <style>{`
        /* ── Titres de groupes dans la sidebar ── */
        .nav-group__toggle,
        [class*="nav-group__toggle"] {
          font-size: 0.65rem !important;
          font-weight: 800 !important;
          letter-spacing: 0.12em !important;
          text-transform: uppercase !important;
          color: var(--theme-elevation-400) !important;
          padding-top: 1.25rem !important;
          padding-bottom: 0.25rem !important;
          opacity: 1 !important;
          border-top: 1px solid var(--theme-elevation-100) !important;
          margin-top: 0.25rem !important;
        }

        /* Liens de navigation normaux — meilleur contraste */
        .nav__link,
        [class*="nav__link"] {
          font-size: 0.875rem !important;
          font-weight: 500 !important;
          border-radius: 6px !important;
          margin-bottom: 1px !important;
        }

        /* Lien actif */
        .nav__link.active,
        [class*="nav__link"][aria-current="page"],
        [class*="nav__link--active"] {
          background: var(--theme-elevation-100) !important;
          color: var(--theme-text) !important;
          font-weight: 600 !important;
        }
      `}</style>
      {children}
    </>
  )
}
