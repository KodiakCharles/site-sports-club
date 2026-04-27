export default function CTA() {
  return (
    <section className="py-24 md:py-32 border-t border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Votre club mérite un site
          <br />
          <span className="text-amber-400">à la hauteur de vos ambitions.</span>
        </h2>
        <p className="mt-6 text-lg text-slate-300">
          Parlons-en 30 minutes. On vous montre une démo en direct, on chiffre l&apos;onboarding,
          vous décidez.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="mailto:contact@web-pulse.fr?subject=Demande%20de%20d%C3%A9mo%20Web%20Pulse"
            className="px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold transition"
          >
            Demander une démo
          </a>
          <a
            href="#pricing"
            className="px-6 py-3 rounded-lg border border-slate-600 hover:border-amber-400 hover:text-amber-400 transition"
          >
            Voir les tarifs
          </a>
        </div>
      </div>
    </section>
  )
}
