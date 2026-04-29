import type { Metadata } from 'next'
import Link from 'next/link'
import OnboardingForm from './OnboardingForm'

export const metadata: Metadata = {
  title: 'Souscrire en ligne',
  description:
    'Souscrivez en ligne à Web Pulse. Choisissez votre formule (Essentiel ou Pulse), recevez votre contrat sous 48h. Engagement annuel, paiement par virement.',
  alternates: { canonical: 'https://www.web-pulse.fr/onboarding' },
}

type SearchParams = { plan?: string }

const VALID_PLANS = new Set(['essentiel', 'pulse'])

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const initialPlan = VALID_PLANS.has(sp.plan ?? '') ? (sp.plan as 'essentiel' | 'pulse') : 'pulse'

  return (
    <main className="bg-slate-50 min-h-[calc(100vh-70px)]">
      <section className="py-16 md:py-20 bg-gradient-to-b from-amber-50 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[0.72rem] font-bold tracking-[0.25em] text-amber-600 mb-4">
            SOUSCRIPTION EN LIGNE
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-[-0.03em] text-slate-900 leading-[1.1]">
            Lancez votre site Web Pulse en quelques minutes.
          </h1>
          <p className="mt-5 text-slate-600 text-[1.05rem] leading-[1.6] max-w-2xl mx-auto">
            Remplissez le formulaire ci-dessous, nous vous renvoyons votre contrat de souscription sous{' '}
            <strong>48h ouvrées</strong>. Engagement annuel, paiement par virement.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <OnboardingForm initialPlan={initialPlan} />
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16 text-center text-slate-500 text-sm">
        Une question avant de souscrire ?{' '}
        <Link href="/" className="text-amber-600 font-semibold hover:underline">
          Retour à l'accueil
        </Link>{' '}
        ·{' '}
        <a href="mailto:contact@web-pulse.fr" className="text-amber-600 font-semibold hover:underline">
          contact@web-pulse.fr
        </a>
      </div>
    </main>
  )
}
