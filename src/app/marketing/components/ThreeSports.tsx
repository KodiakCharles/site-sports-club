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
    features: ['Réservation frontons', 'Multi-disciplines', 'Billeterie événements'],
    color: '#c8102e',
    emoji: '🥎',
  },
]

export default function ThreeSports() {
  return (
    <section id="sports" className="py-24 md:py-32 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-semibold tracking-[0.3em] text-amber-400 mb-3">
            TROIS SPORTS, UNE PLATEFORME
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Un site sur mesure pour votre fédération.
          </h2>
          <p className="mt-5 text-slate-300 text-lg">
            Le vocabulaire, les modules, les règles métier — tout est calibré pour votre sport.
            Pas de compromis, pas de générique.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {SPORTS.map((s) => (
            <article
              key={s.product}
              className="group relative rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-slate-500 p-8 transition"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{ background: s.color }}
              />
              <div className="text-4xl mb-4">{s.emoji}</div>
              <h3 className="text-2xl font-bold tracking-tight">{s.product}</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Affilié <span className="text-slate-300">{s.fed}</span>
              </p>
              <p className="text-slate-300 mb-5">{s.tagline}</p>
              <ul className="space-y-2 text-sm text-slate-400">
                {s.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span
                      className="mt-1.5 w-1 h-1 rounded-full shrink-0"
                      style={{ background: s.color }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
