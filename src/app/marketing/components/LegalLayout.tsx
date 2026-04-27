import Link from 'next/link'

export default function LegalLayout({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <main className="bg-slate-900 text-slate-200">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="hover:text-amber-400">Accueil</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-300">{title}</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">{title}</h1>
        {subtitle && <p className="text-slate-400 text-sm mb-10">{subtitle}</p>}
        <div className="prose prose-invert prose-slate max-w-none [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:my-3 [&_p]:leading-relaxed [&_a]:text-amber-400 [&_a:hover]:text-amber-300 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ul]:space-y-1 [&_strong]:text-white">
          {children}
        </div>
      </div>
    </main>
  )
}
