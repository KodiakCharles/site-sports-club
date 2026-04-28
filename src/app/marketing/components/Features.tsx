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
    icon: '🌍',
  },
  {
    title: 'CMS complet',
    desc: 'Articles, stages, galeries, équipes, partenaires — vos adhérents publient en autonomie.',
    icon: '📝',
  },
  {
    title: 'Espace adhérent',
    desc: "Connexion membre, profil, opt-in newsletter, droit RGPD à l'effacement.",
    icon: '🔐',
  },
  {
    title: 'Chatbot IA pour vos visiteurs',
    desc:
      "Vos visiteurs interagissent en langage naturel. L'IA répond grâce à vos Q/R officielles, et vous alerte si elle bute sur une question inconnue — pour que vous l'enrichissiez en un clic.",
    icon: '🤖',
  },
  {
    title: 'SEO + Analytics',
    desc: 'Sitemap auto, Open Graph, GA4 prêt à brancher. Vous montez dans Google.',
    icon: '📈',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-14">
          <p className="text-[0.72rem] font-bold tracking-[0.25em] text-amber-600 mb-4">
            FONCTIONNALITÉS
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.03em] text-slate-900 leading-[1.1]">
            Tout ce qu&apos;il faut pour faire vivre un club en ligne.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:-translate-y-0.5 transition p-7"
            >
              <div className="w-11 h-11 rounded-[10px] bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 flex items-center justify-center text-[1.3rem] mb-4">
                {f.icon}
              </div>
              <h3 className="font-extrabold text-[1.1rem] text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-[0.92rem] leading-[1.55]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
