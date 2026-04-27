type Feature = {
  title: string
  desc: string
  icon: string
}

const FEATURES: Feature[] = [
  {
    title: 'Multi-tenant natif',
    desc: 'Un seul cluster sert tous vos clubs. Mise à jour centralisée, déploiement instantané.',
    icon: '◆',
  },
  {
    title: 'Multilingue FR / EN / ES',
    desc: 'Touchez vos adhérents internationaux et vos visiteurs touristes sans effort.',
    icon: '◆',
  },
  {
    title: 'CMS complet',
    desc: 'Articles, stages, galeries, équipes, partenaires — vos adhérents publient en autonomie.',
    icon: '◆',
  },
  {
    title: 'Espace adhérent',
    desc: 'Connexion membre, profil, opt-in newsletter, droit RGPD à l\'effacement.',
    icon: '◆',
  },
  {
    title: 'Chatbot IA',
    desc: 'Assistant conversationnel branché sur votre base de connaissances. Disponible 24/7.',
    icon: '◆',
  },
  {
    title: 'SEO + Analytics',
    desc: 'Sitemap auto, Open Graph, GA4 prêt à brancher. Vous montez dans Google.',
    icon: '◆',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 md:py-32 border-t border-slate-800 bg-slate-950">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-semibold tracking-[0.3em] text-amber-400 mb-3">
            FONCTIONNALITÉS
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Tout ce qu&apos;il faut pour faire vivre un club en ligne.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/40 p-6 transition"
            >
              <div className="text-amber-400 text-xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
