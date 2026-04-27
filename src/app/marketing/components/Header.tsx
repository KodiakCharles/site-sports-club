import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-slate-900/80 border-b border-slate-700">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 group-hover:bg-amber-300 transition" />
          <span className="font-bold tracking-tight text-lg">Web Pulse</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
          <a href="#sports" className="hover:text-white transition">Sports</a>
          <a href="#features" className="hover:text-white transition">Fonctionnalités</a>
          <a href="#pricing" className="hover:text-white transition">Tarifs</a>
        </nav>
        <Link
          href="/login"
          className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold text-sm transition"
        >
          Connexion
        </Link>
      </div>
    </header>
  )
}
