import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800" />
      <div className="absolute inset-0 opacity-30 pointer-events-none" aria-hidden>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>
      <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <p className="inline-block text-xs font-semibold tracking-[0.3em] text-amber-400 mb-6">
            SAAS POUR CLUBS SPORTIFS
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight">
            Le site web de votre club,
            <br />
            <span className="text-amber-400">prêt en 24h.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl">
            Multi-sport, multi-tenant, conçu pour les fédérations.
            <br />
            Voile, rugby, pelote — un seul SaaS, un design taillé sur mesure.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a
              href="#pricing"
              className="px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold transition"
            >
              Voir les forfaits
            </a>
            <a
              href="mailto:contact@web-pulse.fr?subject=Demande%20de%20d%C3%A9mo%20Web%20Pulse"
              className="px-6 py-3 rounded-lg border border-slate-600 hover:border-amber-400 hover:text-amber-400 transition"
            >
              Demander une démo
            </a>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Hébergé en Europe
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              RGPD compliant
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Sans engagement
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
