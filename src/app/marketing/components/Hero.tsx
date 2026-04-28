export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, #fef3c7 0%, transparent 55%), radial-gradient(ellipse at 90% 80%, #ffe4e6 0%, transparent 50%)',
        }}
      />
      <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 lg:py-36">
        <div className="max-w-4xl">
          <p className="inline-block text-[0.72rem] font-bold tracking-[0.25em] text-slate-500 mb-6">
            SAAS POUR CLUBS SPORTIFS
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.02] tracking-[-0.04em] text-slate-900">
            Le site web de votre club,
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }}
            >
              prêt en 24h.
            </span>
          </h1>
          <p className="mt-7 text-lg md:text-xl text-slate-600 max-w-2xl leading-[1.55]">
            Multi-sport, multi-tenant, conçu pour les fédérations. Voile, rugby, pelote — un seul
            SaaS, un design taillé sur mesure pour chaque sport.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[10px] bg-slate-900 hover:bg-slate-800 text-white font-bold text-[0.95rem] transition shadow-md hover:shadow-xl hover:-translate-y-0.5"
            >
              Voir les forfaits →
            </a>
            <a
              href="mailto:contact@web-pulse.fr?subject=Demande%20de%20d%C3%A9mo%20Web%20Pulse"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[10px] bg-white text-slate-900 font-semibold text-[0.95rem] border-[1.5px] border-slate-300 hover:border-slate-900 transition"
            >
              Demander une démo
            </a>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Hébergé en Europe
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              RGPD compliant
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Sans engagement
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
