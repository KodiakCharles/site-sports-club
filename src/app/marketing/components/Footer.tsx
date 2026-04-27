import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-slate-700 bg-slate-950">
      <div className="max-w-6xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-4 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-bold tracking-tight">Web Pulse</span>
          </div>
          <p className="text-slate-400">Sites web SaaS pour clubs de sport.</p>
        </div>
        <div>
          <h3 className="font-semibold text-slate-200 mb-3">Produits</h3>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#sports" className="hover:text-white">Voile Pulse</a></li>
            <li><a href="#sports" className="hover:text-white">Rugby Pulse</a></li>
            <li><a href="#sports" className="hover:text-white">Pelote Pulse</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-slate-200 mb-3">Ressources</h3>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#pricing" className="hover:text-white">Tarifs</a></li>
            <li><a href="mailto:contact@web-pulse.fr" className="hover:text-white">Contact commercial</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-slate-200 mb-3">Légal</h3>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="/mentions-legales" className="hover:text-white">Mentions légales</Link></li>
            <li><Link href="/cgv" className="hover:text-white">CGV</Link></li>
            <li><Link href="/confidentialite" className="hover:text-white">Confidentialité</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between text-xs text-slate-500 gap-2">
          <span>© {year} Web Pulse. Tous droits réservés.</span>
          <span>Hébergé en Europe — RGPD compliant.</span>
        </div>
      </div>
    </footer>
  )
}
