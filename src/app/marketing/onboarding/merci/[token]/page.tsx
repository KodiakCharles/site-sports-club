import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

export const metadata: Metadata = {
  title: 'Demande de souscription reçue',
  description: 'Votre demande de souscription Web Pulse a bien été reçue. Vous recevrez votre contrat sous 48h.',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const PLAN_LABELS: Record<string, string> = { essentiel: 'Essentiel', pulse: 'Pulse' }
const PLAN_PRICES: Record<string, number> = { essentiel: 29, pulse: 49 }
const PAYMENT_LABELS: Record<string, string> = {
  monthly: 'Mensuel',
  annual: "Annuel d'avance (-10%)",
}

export default async function OnboardingThanksPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'onboarding-requests',
    where: { token: { equals: token } },
    limit: 1,
    overrideAccess: true,
  })

  const req = result.docs[0]
  if (!req) notFound()

  const plan = req.plan as 'essentiel' | 'pulse'
  const monthly = PLAN_PRICES[plan] ?? 0
  const annualGross = monthly * 12
  const annualNet = req.paymentMode === 'annual' ? annualGross * 0.9 : annualGross

  return (
    <main className="bg-slate-50 min-h-[calc(100vh-70px)]">
      <section className="py-16 md:py-24 bg-gradient-to-b from-emerald-50 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-[-0.02em] text-slate-900 leading-[1.15]">
            Demande bien reçue.
          </h1>
          <p className="mt-4 text-slate-600 text-[1.05rem] leading-[1.6]">
            Merci <strong>{req.representativeName}</strong>. Nous vous renvoyons votre contrat de
            souscription par email à <strong>{req.email}</strong> sous{' '}
            <strong>48h ouvrées</strong>.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-7 md:p-8 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
          <h2 className="text-lg font-extrabold text-slate-900 mb-4">Récapitulatif de votre demande</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
            <Item label="Structure" value={req.organizationName} />
            <Item label="Représentant" value={`${req.representativeName} — ${req.representativeRole}`} />
            <Item label="Formule" value={`${PLAN_LABELS[plan] ?? plan} — ${monthly} € HT/mois`} />
            <Item label="Paiement" value={PAYMENT_LABELS[req.paymentMode] ?? req.paymentMode} />
            <Item
              label="Engagement"
              value="12 mois ferme"
            />
            <Item
              label="Total annuel HT"
              value={`${annualNet.toFixed(2).replace('.', ',')} €`}
            />
          </dl>
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-amber-50 border border-amber-200">
          <h3 className="font-extrabold text-slate-900 mb-2">Prochaines étapes</h3>
          <ol className="text-slate-700 text-sm leading-relaxed space-y-2 list-decimal list-inside">
            <li>Notre équipe valide votre demande sous 48h ouvrées.</li>
            <li>Vous recevez le <strong>contrat de souscription</strong> par email à signer.</li>
            <li>Après réception du contrat signé et du premier règlement, votre site est mis en ligne sous 7 jours ouvrés.</li>
          </ol>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Une question ?{' '}
          <a href="mailto:contact@web-pulse.fr" className="text-amber-600 font-semibold hover:underline">
            contact@web-pulse.fr
          </a>{' '}
          ·{' '}
          <Link href="/" className="text-amber-600 font-semibold hover:underline">
            Retour à l'accueil
          </Link>
        </p>
      </div>
    </main>
  )
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-slate-500 font-semibold text-[0.78rem] uppercase tracking-wider">{label}</dt>
      <dd className="text-slate-900 font-medium mt-0.5">{value}</dd>
    </div>
  )
}
