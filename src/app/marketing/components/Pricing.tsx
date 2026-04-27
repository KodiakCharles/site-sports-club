type Plan = {
  name: string
  price: string
  unit: string
  tagline: string
  highlight?: boolean
  features: string[]
  cta: string
  ctaHref: string
}

const PLANS: Plan[] = [
  {
    name: 'Essentiel',
    price: '49',
    unit: '€ HT / mois',
    tagline: 'Pour démarrer en ligne, sans IA.',
    features: [
      'Site complet multi-pages',
      'CMS pour publier articles & stages',
      'Inscription newsletter',
      'Multilingue FR uniquement',
      'Support email',
    ],
    cta: 'Choisir Essentiel',
    ctaHref: 'mailto:contact@web-pulse.fr?subject=Forfait%20Essentiel',
  },
  {
    name: 'Pulse',
    price: '99',
    unit: '€ HT / mois',
    tagline: 'Toutes les fonctionnalités IA, le forfait le plus complet.',
    highlight: true,
    features: [
      'Tout Essentiel inclus',
      'Chatbot IA branché sur votre KB',
      'Espace adhérent complet',
      'Multilingue FR / EN / ES',
      'Météo marine (voile) ou modules sport-spécifiques',
      'Support prioritaire',
    ],
    cta: 'Choisir Pulse',
    ctaHref: 'mailto:contact@web-pulse.fr?subject=Forfait%20Pulse',
  },
  {
    name: 'Sur mesure',
    price: 'Sur',
    unit: 'devis',
    tagline: 'Intégrations spécifiques, branding avancé.',
    features: [
      'Tout Pulse inclus',
      'Intégrations tierces (Yoplanning, HelloAsso, Axyomes…)',
      'Templates emails personnalisés',
      'Account manager dédié',
      'SLA garanti',
    ],
    cta: 'Demander un devis',
    ctaHref: 'mailto:contact@web-pulse.fr?subject=Forfait%20Sur%20mesure',
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-semibold tracking-[0.3em] text-amber-400 mb-3">
            TARIFS
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Trois forfaits, zéro engagement.
          </h2>
          <p className="mt-5 text-slate-300 text-lg">
            Vous payez au mois. Vous résiliez quand vous voulez. Vos données vous appartiennent.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <article
              key={p.name}
              className={`relative rounded-2xl p-8 border transition ${
                p.highlight
                  ? 'bg-gradient-to-b from-amber-400/10 to-transparent border-amber-400/50'
                  : 'bg-slate-800/50 border-slate-700'
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-400 text-slate-900 text-xs font-bold">
                  RECOMMANDÉ
                </span>
              )}
              <h3 className="text-xl font-bold tracking-tight">{p.name}</h3>
              <p className="text-slate-400 text-sm mt-1 mb-6">{p.tagline}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-bold tracking-tight">{p.price}</span>
                <span className="text-slate-400 text-sm">{p.unit}</span>
              </div>
              <a
                href={p.ctaHref}
                className={`block text-center px-4 py-2.5 rounded-lg font-semibold text-sm transition ${
                  p.highlight
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-900'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                {p.cta}
              </a>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">✓</span>
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
