'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

type Plan = 'essentiel' | 'pulse'
type PaymentMode = 'monthly' | 'annual'

const PLAN_PRICES: Record<Plan, number> = { essentiel: 29, pulse: 49 }

const SPORTS = [
  { value: 'voile', label: 'Voile' },
  { value: 'rugby', label: 'Rugby' },
  { value: 'pelote-basque', label: 'Pelote basque' },
  { value: 'autre', label: 'Autre activité' },
] as const

const LEGAL_FORMS = [
  { value: 'association_1901', label: 'Association loi 1901' },
  { value: 'club_sportif', label: 'Club sportif amateur' },
  { value: 'sas', label: 'SAS / SASU' },
  { value: 'sarl', label: 'SARL' },
  { value: 'autre', label: 'Autre' },
] as const

type FormState = {
  organizationName: string
  legalForm: string
  siren: string
  address: string
  sport: string
  representativeName: string
  representativeRole: string
  email: string
  phone: string
  plan: Plan
  paymentMode: PaymentMode
  cgvAccepted: boolean
  website: string
}

export default function OnboardingForm({ initialPlan }: { initialPlan: Plan }) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState<FormState>({
    organizationName: '',
    legalForm: 'association_1901',
    siren: '',
    address: '',
    sport: 'voile',
    representativeName: '',
    representativeRole: '',
    email: '',
    phone: '',
    plan: initialPlan,
    paymentMode: 'monthly',
    cgvAccepted: false,
    website: '',
  })

  const pricing = useMemo(() => {
    const monthly = PLAN_PRICES[form.plan]
    const annualGross = monthly * 12
    const annualNet = form.paymentMode === 'annual' ? annualGross * 0.9 : annualGross
    return {
      monthly,
      annualGross,
      annualNet,
      saves: annualGross - annualNet,
    }
  }, [form.plan, form.paymentMode])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key as string]) {
      setErrors((e) => {
        const next = { ...e }
        delete next[key as string]
        return next
      })
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGlobalError(null)
    setErrors({})
    setSubmitting(true)
    try {
      const res = await fetch('/api/marketing/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = (await res.json()) as { success?: boolean; token?: string; error?: string; fields?: Record<string, string> }
      if (!res.ok || !data.success) {
        if (data.fields) setErrors(data.fields)
        setGlobalError(data.error ?? 'Une erreur est survenue. Réessayez.')
        return
      }
      router.push(`/onboarding/merci/${data.token}`)
    } catch {
      setGlobalError('Impossible de joindre le serveur. Réessayez.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* Honeypot anti-spam */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor="website">Ne pas remplir</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => update('website', e.target.value)}
        />
      </div>

      {/* Étape 1 — Structure */}
      <Card num={1} title="Votre structure" hint="Identité officielle de votre club ou association.">
        <Field label="Raison sociale" required error={errors.organizationName}>
          <input
            type="text"
            value={form.organizationName}
            onChange={(e) => update('organizationName', e.target.value)}
            required
            className={inputCls}
          />
        </Field>
        <Row>
          <Field label="Forme juridique" required error={errors.legalForm}>
            <select
              value={form.legalForm}
              onChange={(e) => update('legalForm', e.target.value)}
              className={inputCls}
            >
              {LEGAL_FORMS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="SIREN / RNA" hint="optionnel">
            <input
              type="text"
              value={form.siren}
              onChange={(e) => update('siren', e.target.value)}
              placeholder="W123456789 ou 123 456 789"
              className={inputCls}
            />
          </Field>
        </Row>
        <Field label="Adresse complète" required error={errors.address}>
          <textarea
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
            required
            rows={3}
            className={inputCls}
          />
        </Field>
        <Field label="Sport ou activité principale" required error={errors.sport}>
          <select
            value={form.sport}
            onChange={(e) => update('sport', e.target.value)}
            className={inputCls}
          >
            {SPORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </Card>

      {/* Étape 2 — Représentant */}
      <Card num={2} title="Votre contact" hint="Personne signataire du contrat de souscription.">
        <Row>
          <Field label="Nom et prénom" required error={errors.representativeName}>
            <input
              type="text"
              value={form.representativeName}
              onChange={(e) => update('representativeName', e.target.value)}
              required
              className={inputCls}
            />
          </Field>
          <Field label="Fonction" required error={errors.representativeRole}>
            <input
              type="text"
              value={form.representativeRole}
              onChange={(e) => update('representativeRole', e.target.value)}
              placeholder="Président, Directeur, Trésorier…"
              required
              className={inputCls}
            />
          </Field>
        </Row>
        <Row>
          <Field label="Email" required error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              required
              className={inputCls}
            />
          </Field>
          <Field label="Téléphone" hint="optionnel">
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              className={inputCls}
            />
          </Field>
        </Row>
      </Card>

      {/* Étape 3 — Formule */}
      <Card num={3} title="Votre formule" hint="Vous pouvez basculer d'une formule à l'autre à l'échéance annuelle.">
        <div className="grid sm:grid-cols-2 gap-4" role="radiogroup">
          <PlanOption
            label="Essentiel"
            price="29 € HT/mois"
            desc="Site complet, CMS, newsletter, monolingue FR. Sans IA."
            checked={form.plan === 'essentiel'}
            onClick={() => update('plan', 'essentiel')}
          />
          <PlanOption
            label="Pulse"
            price="49 € HT/mois"
            desc="Tout Essentiel + chatbot IA, espace adhérent, FR/EN/ES, modules sport."
            highlight
            checked={form.plan === 'pulse'}
            onClick={() => update('plan', 'pulse')}
          />
        </div>
        {errors.plan && <p className="mt-3 text-sm text-rose-600">{errors.plan}</p>}
      </Card>

      {/* Étape 4 — Paiement */}
      <Card
        num={4}
        title="Modalité de paiement"
        hint="Engagement 12 mois ferme dans les deux cas. Règlement par virement bancaire uniquement."
      >
        <div className="grid sm:grid-cols-2 gap-4" role="radiogroup">
          <PlanOption
            label="Mensuel"
            price={`${pricing.monthly} € HT × 12`}
            desc="Facture mensuelle à terme à échoir. Engagement 12 mois."
            checked={form.paymentMode === 'monthly'}
            onClick={() => update('paymentMode', 'monthly')}
          />
          <PlanOption
            label="Annuel d'avance"
            price={`${pricing.annualNet.toFixed(0)} € HT (-10%)`}
            desc="Une seule facture en début de période. Économisez 10%."
            checked={form.paymentMode === 'annual'}
            onClick={() => update('paymentMode', 'annual')}
          />
        </div>
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
          <strong className="text-slate-900">Récapitulatif :</strong> {pricing.monthly} € HT/mois ·
          engagement 12 mois ·{' '}
          <strong>
            total annuel HT {pricing.annualNet.toFixed(2).replace('.', ',')} €
          </strong>
          {form.paymentMode === 'annual' && (
            <> ({pricing.saves.toFixed(2).replace('.', ',')} € économisés)</>
          )}.
        </div>
      </Card>

      {/* CGV */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 mb-6">
        <input
          id="cgvAccepted"
          type="checkbox"
          checked={form.cgvAccepted}
          onChange={(e) => update('cgvAccepted', e.target.checked)}
          className="mt-1"
        />
        <label htmlFor="cgvAccepted" className="text-[0.92rem] text-slate-800">
          J'ai lu et j'accepte les{' '}
          <a href="/cgv" target="_blank" className="text-amber-700 font-bold hover:underline">
            Conditions Générales de Vente
          </a>{' '}
          et la{' '}
          <a href="/confidentialite" target="_blank" className="text-amber-700 font-bold hover:underline">
            Politique de confidentialité
          </a>
          .
        </label>
      </div>
      {errors.cgvAccepted && <p className="mb-4 text-sm text-rose-600">Vous devez accepter les CGV pour continuer.</p>}

      {globalError && (
        <div className="mb-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700">
          {globalError}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-white font-extrabold text-[1rem] shadow-[0_10px_30px_rgba(245,158,11,0.35)] hover:shadow-[0_14px_40px_rgba(245,158,11,0.45)] hover:-translate-y-0.5 transition disabled:opacity-60 disabled:hover:translate-y-0"
        style={{ backgroundImage: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }}
      >
        {submitting ? 'Envoi en cours…' : 'Envoyer ma demande'}
      </button>

      <p className="mt-4 text-center text-sm text-slate-500">
        Nous vous renvoyons votre contrat sous 48h ouvrées. Aucun prélèvement automatique.
      </p>
    </form>
  )
}

const inputCls =
  'w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 text-[0.95rem] focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition'

function Card({ num, title, hint, children }: { num: number; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-7 md:p-8 mb-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
      <h2 className="flex items-center gap-3 text-[1.05rem] font-extrabold text-slate-900 mb-1">
        <span
          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-extrabold"
          style={{ backgroundImage: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }}
        >
          {num}
        </span>
        {title}
      </h2>
      {hint && <p className="text-slate-500 text-sm mb-5">{hint}</p>}
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>
}

function Field({
  label,
  hint,
  required,
  error,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-[0.88rem] font-semibold text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-rose-600 ml-1">*</span>}
        {hint && <span className="ml-2 text-slate-400 font-medium text-xs">({hint})</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-sm text-rose-600">{error}</p>}
    </div>
  )
}

function PlanOption({
  label,
  price,
  desc,
  checked,
  highlight,
  onClick,
}: {
  label: string
  price: string
  desc: string
  checked: boolean
  highlight?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onClick}
      className={`text-left p-5 rounded-2xl border-2 transition relative ${
        checked
          ? 'border-amber-500 bg-amber-50 shadow-[0_8px_24px_rgba(245,158,11,0.18)]'
          : 'border-slate-200 bg-white hover:border-amber-300'
      }`}
    >
      {highlight && (
        <span
          className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-white text-[0.65rem] font-extrabold tracking-wider"
          style={{ backgroundImage: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }}
        >
          RECOMMANDÉ
        </span>
      )}
      <div className="font-extrabold text-slate-900 text-[1rem]">{label}</div>
      <div className="text-amber-600 text-[1.25rem] font-extrabold mt-1">{price}</div>
      <div className="text-slate-600 text-[0.85rem] mt-2 leading-snug">{desc}</div>
    </button>
  )
}
