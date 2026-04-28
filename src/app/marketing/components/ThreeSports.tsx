type SportCard = {
  name: string
  product: string
  fed: string
  tagline: string
  features: string[]
  color: string
  emoji: string
}

const SPORTS: SportCard[] = [
  {
    name: 'Voile',
    product: 'Voile Pulse',
    fed: 'FFVoile',
    tagline: 'Le site web pensé pour les clubs de voile.',
    features: ['Météo marine Windguru', 'Réservation de bateaux', 'Stages 8 supports'],
    color: '#1d6fa4',
    emoji: '⛵',
  },
  {
    name: 'Rugby',
    product: 'Rugby Pulse',
    fed: 'FFR',
    tagline: 'Le site web pensé pour les clubs de rugby.',
    features: ['Catégories U6 → senior', 'Calendrier compétitions', 'Espace adhérent'],
    color: '#c23b22',
    emoji: '🏉',
  },
  {
    name: 'Pelote basque',
    product: 'Pelote Pulse',
    fed: 'FFPB',
    tagline: 'Le site web pensé pour les clubs de pelote basque.',
    features: ['Réservation frontons', 'Multi-disciplines', 'Billetterie événements'],
    color: '#c8102e',
    emoji: '🥎',
  },
]

export default function ThreeSports() {
  return (
    <section
      id="sports"
      className="py-24 md:py-28 bg-slate-50 border-t border-slate-200"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-14">
          <p className="text-[0.72rem] font-bold tracking-[0.25em] text-amber-600 mb-4">
            TROIS SPORTS, UNE PLATEFORME
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.03em] text-slate-900 leading-[1.1]">
            Un site sur mesure pour votre fédération.
          </h2>
          <p className="mt-5 text-slate-600 text-[1.1rem] leading-[1.55]">
            Le vocabulaire, les modules, les règles métier — tout est calibré pour votre sport.
            Pas de compromis, pas de générique.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {SPORTS.map((s) => (
            <article
              key={s.product}
              className="group relative rounded-[20px] bg-white border border-slate-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)] transition p-9 overflow-hidden shadow-[0_4px_16px_rgba(15,23,42,0.04)]"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: s.color }}
              />
              <div className="text-[2.4rem] mb-4 leading-none">{s.emoji}</div>
              <h3 className="text-[1.4rem] font-extrabold tracking-tight text-slate-900">
                {s.product}
              </h3>
              <p className="text-[0.82rem] text-slate-400 mt-1 mb-4">
                Affilié <span className="text-slate-700 font-semibold">{s.fed}</span>
              </p>
              <p className="text-slate-600 mb-5 text-[0.95rem]">{s.tagline}</p>
              <ul className="space-y-2.5">
                {s.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[0.9rem] text-slate-600">
                    <span
                      className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: s.color }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="mt-10 text-center text-slate-500 text-[0.95rem]">
          Vous pratiquez un autre sport ?{' '}
          <a
            href="mailto:contact@web-pulse.fr?subject=Nouveau%20sport%20Web%20Pulse"
            className="font-semibold text-slate-900 underline-offset-4 hover:underline"
          >
            Contactez-nous
          </a>
          {' '}— nous adaptons la plateforme à votre fédération.
        </p>
      </div>
    </section>
  )
}
