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
    price: '29',
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
    price: '49',
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
    <section
      id="pricing"
      className="py-24 md:py-28 bg-slate-50 border-t border-slate-200"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-14">
          <p className="text-[0.72rem] font-bold tracking-[0.25em] text-amber-600 mb-4">
            TARIFS
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.03em] text-slate-900 leading-[1.1]">
            Trois forfaits, zéro engagement.
          </h2>
          <p className="mt-5 text-slate-600 text-[1.1rem] leading-[1.55]">
            Vous payez au mois. Vous résiliez quand vous voulez. Vos données vous appartiennent.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3 items-stretch">
          {PLANS.map((p) => (
            <article
              key={p.name}
              className={`relative rounded-[20px] p-9 flex flex-col bg-white transition ${
                p.highlight
                  ? 'border-2 border-amber-400 shadow-[0_8px_30px_rgba(245,158,11,0.15)]'
                  : 'border border-slate-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]'
              }`}
            >
              {p.highlight && (
                <span
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-white text-[0.7rem] font-extrabold tracking-wider"
                  style={{ backgroundImage: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }}
                >
                  RECOMMANDÉ
                </span>
              )}
              <h3 className="text-[1.4rem] font-extrabold tracking-tight text-slate-900">{p.name}</h3>
              <p className="text-slate-500 text-[0.88rem] mt-1.5 mb-6">{p.tagline}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-extrabold tracking-[-0.03em] text-slate-900">{p.price}</span>
                <span className="text-slate-400 text-[0.9rem]">{p.unit}</span>
              </div>
              <a
                href={p.ctaHref}
                className={`block text-center px-5 py-3 rounded-[10px] font-bold text-[0.9rem] mb-6 transition ${
                  p.highlight
                    ? 'text-white shadow-[0_4px_14px_rgba(245,158,11,0.35)] hover:shadow-[0_8px_24px_rgba(245,158,11,0.45)] hover:-translate-y-0.5'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                }`}
                style={
                  p.highlight
                    ? { backgroundImage: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }
                    : undefined
                }
              >
                {p.cta}
              </a>
              <ul className="space-y-3 text-[0.9rem] text-slate-600 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="text-emerald-500 font-bold mt-0.5 shrink-0">✓</span>
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
