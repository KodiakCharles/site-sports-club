import type { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact — Web Pulse',
  description:
    "Une démo personnalisée, un devis sur mesure, ou juste une question ? On vous répond sous 24h ouvrables.",
  openGraph: {
    title: 'Contact — Web Pulse',
    description:
      "Une démo personnalisée, un devis sur mesure, ou juste une question ? On vous répond sous 24h ouvrables.",
    type: 'website',
  },
  alternates: { canonical: '/contact' },
}

type SearchParams = Promise<{ subject?: string; sport?: string; plan?: string }>

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const initialSubject = params.subject ?? ''
  const initialSport = params.sport ?? ''
  const initialPlan = params.plan ?? ''

  return (
    <main className="relative bg-white">
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse at 30% 20%, #fef3c7 0%, transparent 55%), radial-gradient(ellipse at 90% 80%, #ffe4e6 0%, transparent 50%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-6 pt-20 md:pt-28 pb-10 text-center">
          <p className="inline-block text-[0.72rem] font-bold tracking-[0.25em] text-amber-600 mb-5">
            CONTACT
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-[-0.04em] text-slate-900">
            Parlons de votre club{' '}
            <span aria-hidden>👋</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-600 leading-[1.55] max-w-2xl mx-auto">
            Une démo personnalisée, un devis sur mesure, ou juste une question ?
            <br className="hidden sm:block" /> On vous répond sous 24h ouvrables.
          </p>
        </div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 pb-24 md:pb-28">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] items-start">
          <aside className="lg:sticky lg:top-24 space-y-4">
            <div className="rounded-[20px] border border-slate-200 bg-white p-7 shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
              <p className="text-[0.72rem] font-bold tracking-[0.2em] text-slate-500 mb-2">
                EMAIL DIRECT
              </p>
              <a
                href="mailto:contact@web-pulse.fr"
                className="font-semibold text-slate-900 text-[1.02rem] hover:text-amber-600 transition break-all"
              >
                contact@web-pulse.fr
              </a>
            </div>
            <div className="rounded-[20px] border border-slate-200 bg-white p-7 shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
              <p className="text-[0.72rem] font-bold tracking-[0.2em] text-slate-500 mb-2">
                ZONE D&apos;ACTION
              </p>
              <p className="font-semibold text-slate-900 text-[1.02rem]">
                Nouvelle-Aquitaine &amp; France entière
              </p>
              <p className="text-slate-500 text-sm mt-1">100% en ligne — démo en visio</p>
            </div>
            <div className="rounded-[20px] border border-slate-200 bg-white p-7 shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
              <p className="text-[0.72rem] font-bold tracking-[0.2em] text-slate-500 mb-2">
                DÉLAI DE RÉPONSE
              </p>
              <p className="font-semibold text-slate-900 text-[1.02rem]">Sous 24h ouvrables</p>
              <p className="text-slate-500 text-sm mt-1">Du lundi au vendredi</p>
            </div>
            <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-7">
              <p className="text-[0.72rem] font-bold tracking-[0.2em] text-slate-500 mb-3">
                ÉDITEUR
              </p>
              <p className="text-slate-700 text-sm leading-relaxed">
                <strong className="text-slate-900">CGC SAS</strong>
                <br />
                RCS Dax 983 956 525
                <br />
                37B rue du Docteur Gronich
                <br />
                40220 Tarnos
              </p>
            </div>
          </aside>

          <ContactForm
            initialSubject={initialSubject}
            initialSport={initialSport}
            initialPlan={initialPlan}
          />
        </div>
      </section>
    </main>
  )
}
