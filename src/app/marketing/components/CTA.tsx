export default function CTA() {
  return (
    <section
      className="py-24 md:py-28 border-t border-slate-200 text-center"
      style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #ffffff 50%, #ffe4e6 100%)',
      }}
    >
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.03em] text-slate-900 leading-[1.1]">
          Votre club mérite un site
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }}
          >
            à la hauteur de vos ambitions.
          </span>
        </h2>
        <p className="mt-6 text-[1.15rem] text-slate-600 max-w-xl mx-auto leading-[1.55]">
          Parlons-en 30 minutes. On vous montre une démo en direct, on chiffre l&apos;onboarding,
          vous décidez.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="mailto:contact@web-pulse.fr?subject=Demande%20de%20d%C3%A9mo%20Web%20Pulse"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[10px] bg-slate-900 hover:bg-slate-800 text-white font-bold text-[0.95rem] transition shadow-md hover:shadow-xl hover:-translate-y-0.5"
          >
            Demander une démo →
          </a>
          <a
            href="#pricing"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[10px] bg-white text-slate-900 font-semibold text-[0.95rem] border-[1.5px] border-slate-300 hover:border-slate-900 transition"
          >
            Voir les tarifs
          </a>
        </div>
      </div>
    </section>
  )
}
