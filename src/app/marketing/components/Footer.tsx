import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr] text-sm">
        <div>
          <div className="font-extrabold tracking-tight text-white text-base mb-3">Web Pulse</div>
          <p className="text-slate-400 max-w-[280px]">
            Sites web SaaS pour clubs de sport. Voile, rugby, pelote — un seul SaaS.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-slate-100 mb-3 text-[0.82rem] tracking-[0.12em] uppercase">Produits</h3>
          <ul className="space-y-2.5 text-slate-400">
            <li><a href="#sports" className="hover:text-white transition">Voile Pulse</a></li>
            <li><a href="#sports" className="hover:text-white transition">Rugby Pulse</a></li>
            <li><a href="#sports" className="hover:text-white transition">Pelote Pulse</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-slate-100 mb-3 text-[0.82rem] tracking-[0.12em] uppercase">Ressources</h3>
          <ul className="space-y-2.5 text-slate-400">
            <li><a href="#pricing" className="hover:text-white transition">Tarifs</a></li>
            <li><a href="mailto:contact@web-pulse.fr" className="hover:text-white transition">Contact commercial</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-slate-100 mb-3 text-[0.82rem] tracking-[0.12em] uppercase">Légal</h3>
          <ul className="space-y-2.5 text-slate-400">
            <li><Link href="/mentions-legales" className="hover:text-white transition">Mentions légales</Link></li>
            <li><Link href="/cgv" className="hover:text-white transition">CGV</Link></li>
            <li><Link href="/confidentialite" className="hover:text-white transition">Confidentialité</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between text-[0.82rem] text-slate-500 gap-2">
          <span>© {year} Web Pulse. Tous droits réservés.</span>
          <span>Hébergé en Europe — RGPD compliant.</span>
        </div>
      </div>
    </footer>
  )
}
