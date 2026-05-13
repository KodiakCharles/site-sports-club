'use client'

import Link from 'next/link'
import { useState } from 'react'

const SPORTS = [
  { value: '', label: '— Aucune préférence —' },
  { value: 'voile', label: 'Voile' },
  { value: 'rugby', label: 'Rugby' },
  { value: 'pelote-basque', label: 'Pelote basque' },
  { value: 'autre', label: 'Autre activité' },
] as const

const SUBJECTS = [
  { value: 'demo', label: 'Demander une démo' },
  { value: 'devis', label: 'Demander un devis sur mesure' },
  { value: 'question', label: 'Poser une question' },
  { value: 'autre', label: 'Autre' },
] as const

type FormState = {
  name: string
  email: string
  organizationName: string
  phone: string
  sport: string
  subject: string
  message: string
  website: string
}

function inferInitialSubject(raw: string): string {
  const v = raw.toLowerCase()
  if (v.includes('démo') || v.includes('demo')) return 'demo'
  if (v.includes('devis') || v.includes('sur mesure')) return 'devis'
  if (v.includes('question')) return 'question'
  if (raw) return 'autre'
  return 'demo'
}

function inferInitialMessage(rawSubject: string, plan: string, sport: string): string {
  const lines: string[] = []
  if (rawSubject) lines.push(rawSubject)
  if (plan) lines.push(`Forfait envisagé : ${plan}`)
  if (sport && rawSubject.toLowerCase().includes('nouveau sport')) {
    lines.push(`Sport souhaité : ${sport}`)
  }
  return lines.join('\n')
}

export default function ContactForm({
  initialSubject = '',
  initialSport = '',
  initialPlan = '',
}: {
  initialSubject?: string
  initialSport?: string
  initialPlan?: string
}) {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    organizationName: '',
    phone: '',
    sport: SPORTS.some((s) => s.value === initialSport) ? initialSport : '',
    subject: inferInitialSubject(initialSubject),
    message: inferInitialMessage(initialSubject, initialPlan, initialSport),
    website: '',
  })

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
      const res = await fetch('/api/marketing/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = (await res.json()) as {
        success?: boolean
        error?: string
        fields?: Record<string, string>
      }
      if (!res.ok || !data.success) {
        if (data.fields) setErrors(data.fields)
        setGlobalError(data.error ?? "Une erreur s'est produite. Réessayez plus tard.")
        return
      }
      setSuccess(true)
    } catch {
      setGlobalError('Connexion impossible. Réessayez plus tard.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 p-10 text-center">
        <div
          className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-5"
          style={{ backgroundImage: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          aria-hidden
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12l5 5L20 7"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Message bien reçu !
        </h2>
        <p className="mt-3 text-slate-600 leading-relaxed">
          Nous revenons vers vous <strong>sous 24h ouvrables</strong>. Un accusé de réception
          vous a été envoyé par email.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-[10px] bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/#pricing"
            className="inline-flex items-center justify-center px-6 py-3 rounded-[10px] bg-white border-[1.5px] border-slate-300 hover:border-slate-900 text-slate-900 font-semibold text-sm transition"
          >
            Voir les tarifs
          </Link>
        </div>
      </div>
    )
  }

  const inputClass =
    'w-full rounded-[10px] border-[1.5px] border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-100 transition'
  const labelClass = 'block text-sm font-semibold text-slate-800 mb-1.5'
  const errorClass = 'mt-1.5 text-xs font-semibold text-red-600'

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-[20px] border border-slate-200 bg-white p-7 md:p-10 shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
    >
      {globalError && (
        <div
          role="alert"
          className="mb-6 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {globalError}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Votre nom <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            required
            maxLength={120}
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className={inputClass}
            placeholder="Marie Dupont"
          />
          {errors.name && <p className={errorClass}>{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            required
            maxLength={200}
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className={inputClass}
            placeholder="marie@club-voile.fr"
          />
          {errors.email && <p className={errorClass}>{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="contact-org" className={labelClass}>
            Nom du club / association
          </label>
          <input
            id="contact-org"
            type="text"
            autoComplete="organization"
            maxLength={200}
            value={form.organizationName}
            onChange={(e) => update('organizationName', e.target.value)}
            className={inputClass}
            placeholder="Cercle Nautique de Capbreton"
          />
          {errors.organizationName && <p className={errorClass}>{errors.organizationName}</p>}
        </div>

        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            Téléphone <span className="text-slate-400 font-normal">(facultatif)</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className={inputClass}
            placeholder="06 12 34 56 78"
          />
          {errors.phone && <p className={errorClass}>{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="contact-sport" className={labelClass}>
            Sport
          </label>
          <select
            id="contact-sport"
            value={form.sport}
            onChange={(e) => update('sport', e.target.value)}
            className={inputClass}
          >
            {SPORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="contact-subject" className={labelClass}>
            Sujet
          </label>
          <select
            id="contact-subject"
            value={form.subject}
            onChange={(e) => update('subject', e.target.value)}
            className={inputClass}
          >
            {SUBJECTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="contact-message" className={labelClass}>
          Votre message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-message"
          required
          rows={6}
          maxLength={4000}
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          className={`${inputClass} resize-y`}
          placeholder="Dites-nous en quelques lignes votre besoin, le nombre de licenciés, et votre échéance idéale."
        />
        {errors.message && <p className={errorClass}>{errors.message}</p>}
      </div>

      {/* Honeypot — ne pas remplir */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Ne pas remplir</label>
        <input
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => update('website', e.target.value)}
        />
      </div>

      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-xs text-slate-500 leading-relaxed sm:max-w-sm">
          En envoyant ce formulaire, vous acceptez notre{' '}
          <Link href="/confidentialite" className="underline hover:text-slate-900">
            politique de confidentialité
          </Link>
          .
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[10px] bg-slate-900 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-[0.95rem] transition shadow-md hover:shadow-xl hover:-translate-y-0.5"
        >
          {submitting ? 'Envoi…' : 'Envoyer ma demande →'}
        </button>
      </div>
    </form>
  )
}
