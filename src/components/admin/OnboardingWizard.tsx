'use client'
import { useMemo, useState } from 'react'
import { SPORTS, type Sport } from '@/lib/utils/sportConfig'

type WizardData = {
  sport: Sport
  plan: string
  clubName: string
  domain: string
  tagline: string
  address: string
  phone: string
  email: string
  primaryColor: string
  secondaryColor: string
  weatherWidget: boolean
  boatRental: boolean
  equipmentRental: boolean
  booking: boolean
  memberSpace: boolean
  multilingual: boolean
  adminEmail: string
  adminFirstName: string
  adminLastName: string
  adminPassword: string
}

const STEPS = [
  { num: 1, label: 'Sport' },
  { num: 2, label: 'Forfait' },
  { num: 3, label: 'Domaine' },
  { num: 4, label: 'Identité' },
  { num: 5, label: 'Couleurs' },
  { num: 6, label: 'Modules' },
  { num: 7, label: 'Admin' },
]
const LAST_STEP = STEPS[STEPS.length - 1].num // 7

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '8px',
  border: '1px solid #e2e8f0', fontSize: '0.9rem', marginTop: '4px',
}
const labelStyle: React.CSSProperties = {
  fontSize: '0.78rem', fontWeight: 600, color: '#64748b',
  textTransform: 'uppercase' as const, letterSpacing: '0.5px',
}

const SPORT_CHOICES: Array<{ value: Sport; name: string; brand: string; desc: string }> = [
  { value: 'voile', name: '⛵  Voile', brand: 'VoilePulse', desc: 'Stages, régates, météo marine, supports (optimist, laser, catamaran, wingfoil...)' },
  { value: 'rugby', name: '🏉  Rugby', brand: 'RugbyPulse', desc: 'Écoles de rugby, catégories (U8 → seniors), matchs, résultats, calendrier championnat' },
  { value: 'pelote-basque', name: '🤾  Pelote basque', brand: 'PelotePulse', desc: 'Main nue, chistera, cesta punta, réservation de fronton, parties et championnats' },
]

export function OnboardingWizard() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<{ clubId: string; clubName: string } | null>(null)
  const [data, setData] = useState<WizardData>({
    sport: 'voile',
    plan: 'pulse',
    clubName: '', domain: '',
    tagline: '', address: '', phone: '', email: '',
    primaryColor: SPORTS.voile.defaultPrimaryColor, secondaryColor: SPORTS.voile.defaultSecondaryColor,
    weatherWidget: true, boatRental: false, equipmentRental: false, booking: false, memberSpace: true, multilingual: false,
    adminEmail: '', adminFirstName: '', adminLastName: '', adminPassword: '',
  })

  const sportCfg = SPORTS[data.sport]

  const update = (field: keyof WizardData, value: string | boolean) => {
    setData(prev => {
      const next = { ...prev, [field]: value } as WizardData
      if (field === 'sport') {
        const sc = SPORTS[value as Sport]
        next.primaryColor = sc.defaultPrimaryColor
        next.secondaryColor = sc.defaultSecondaryColor
        next.weatherWidget = sc.availableModules.includes('weatherWidget')
        next.boatRental = false
        next.equipmentRental = false
        next.booking = false
      }
      if (field === 'plan') {
        const p = value as string
        const hasIa = p === 'pulse' || p === 'surmesure'
        next.memberSpace = true
        next.multilingual = hasIa
      }
      return next
    })
  }

  const canNext = () => {
    if (step === 1) return !!data.sport
    if (step === 2) return !!data.plan
    if (step === 3) return data.clubName.length >= 2 && data.domain.length >= 3
    if (step === LAST_STEP) return data.adminEmail.includes('@') && data.adminFirstName && data.adminLastName && data.adminPassword.length >= 8
    return true
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        setError(err.error || 'Erreur lors de la création')
        return
      }
      const result = await res.json()
      setSuccess({ clubId: result.clubId, clubName: data.clubName })
    } catch {
      setError('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  type ModuleKey = 'weatherWidget' | 'boatRental' | 'equipmentRental' | 'booking' | 'memberSpace' | 'multilingual'
  const visibleModules = useMemo(() => {
    const defs: Record<ModuleKey, { label: string; desc: string; plans: string[] }> = {
      weatherWidget: { label: 'Météo marine (Windguru)', desc: 'Conditions en temps réel', plans: ['essentiel', 'pulse', 'surmesure'] },
      memberSpace: { label: `Espace ${sportCfg.vocabulary.member}`, desc: `Portail personnel pour les ${sportCfg.vocabulary.memberPlural}`, plans: ['essentiel', 'pulse', 'surmesure'] },
      multilingual: { label: 'Multilingue EN + ES', desc: 'Site en 3 langues', plans: ['pulse', 'surmesure'] },
      boatRental: { label: 'Location de bateaux', desc: 'Tarifs et réservation', plans: ['essentiel', 'pulse', 'surmesure'] },
      equipmentRental: { label: 'Location de matériel', desc: `Location ${data.sport === 'rugby' ? 'équipement' : 'palas / pelotes'}`, plans: ['essentiel', 'pulse', 'surmesure'] },
      booking: { label: 'Réservation de fronton', desc: 'Créneaux en ligne — sur mesure', plans: ['surmesure'] },
    }
    return (sportCfg.availableModules as ModuleKey[]).map(key => ({ key, ...defs[key] }))
  }, [data.sport, sportCfg])

  if (success) {
    return (
      <div style={{ maxWidth: 560, margin: '0 auto', padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 12 }}>Club créé !</h2>
        <p style={{ color: '#64748b', marginBottom: 24 }}>
          {success.clubName} est actif avec la déclinaison <strong>{sportCfg.brand}</strong>. Le club_admin peut se connecter.
        </p>
        <a href="/admin" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 8, background: '#1d6fa4', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>
          Retour au dashboard
        </a>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px' }}>
      {/* Step indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 32, flexWrap: 'wrap' }}>
        {STEPS.map(s => (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700,
              background: step >= s.num ? '#1d6fa4' : '#e2e8f0',
              color: step >= s.num ? '#fff' : '#94a3b8',
              transition: 'all 0.2s',
            }}>{s.num}</div>
            <span style={{
              fontSize: '0.72rem', fontWeight: 600, color: step === s.num ? '#1d6fa4' : '#94a3b8',
            }}>{s.label}</span>
            {s.num < LAST_STEP && <div style={{ width: 18, height: 2, background: step > s.num ? '#1d6fa4' : '#e2e8f0', borderRadius: 1 }} />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, border: '1px solid #e2e8f0', marginBottom: 24 }}>

        {step === 1 && (
          <>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>Quel sport pour ce club ?</h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: 20 }}>
              Ce choix détermine la marque (VoilePulse / RugbyPulse / PelotePulse), le vocabulaire, les supports et les modules disponibles. Il ne pourra pas être changé ensuite.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {SPORT_CHOICES.map(sc => (
                <label key={sc.value} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 16, padding: '16px 20px',
                  borderRadius: 12, border: '2px solid',
                  borderColor: data.sport === sc.value ? SPORTS[sc.value].defaultPrimaryColor : '#e2e8f0',
                  background: data.sport === sc.value ? `${SPORTS[sc.value].defaultPrimaryColor}12` : '#fff',
                  cursor: 'pointer',
                }}>
                  <input type="radio" name="sport" value={sc.value}
                    checked={data.sport === sc.value}
                    onChange={() => update('sport', sc.value)}
                    style={{ width: 18, height: 18, marginTop: 2, accentColor: SPORTS[sc.value].defaultPrimaryColor }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem' }}>{sc.name}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: SPORTS[sc.value].defaultPrimaryColor }}>{sc.brand}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{sc.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20 }}>Choisir le forfait</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { value: 'essentiel', name: 'Essentiel', price: '29€ HT/mois', target: 'Site complet, sans IA', features: ['Pages illimitées + Page builder', 'CMS éditorial', `Espace ${sportCfg.vocabulary.member}`, 'Galerie photos', 'Newsletter Brevo'], color: '#64748b' },
                { value: 'pulse', name: 'Pulse', price: '49€ HT/mois', target: 'Toutes les fonctionnalités IA', features: ['Tout Essentiel +', 'Chatbot IA Claude', 'Base de connaissances auto-enrichie', 'Multilingue FR/EN/ES', 'SEO automatique IA', 'Assistant IA webmaster'], color: sportCfg.defaultPrimaryColor, popular: true },
                { value: 'surmesure', name: 'Sur mesure', price: 'Sur devis', target: 'Intégrations spécifiques', features: ['Tout Pulse +', 'Yoplanning / Axyomes', 'Calendrier fédération', 'Réservation fronton', 'Billetterie', 'Custom code possible'], color: '#0a1628' },
              ].map(plan => (
                <label key={plan.value} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 16, padding: '16px 20px',
                  borderRadius: 12, border: '2px solid',
                  borderColor: data.plan === plan.value ? plan.color : '#e2e8f0',
                  background: data.plan === plan.value ? `${plan.color}08` : '#fff',
                  cursor: 'pointer',
                }}>
                  <input type="radio" name="plan" value={plan.value}
                    checked={data.plan === plan.value}
                    onChange={() => update('plan', plan.value)}
                    style={{ width: 18, height: 18, marginTop: 2, accentColor: plan.color }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: plan.color }}>
                        {plan.name}
                        {plan.popular && <span style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 10, background: '#f0b429', color: '#fff', fontSize: '.6rem', fontWeight: 700 }}>POPULAIRE</span>}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: plan.color }}>{plan.price}</div>
                    </div>
                    <div style={{ fontSize: '.75rem', color: '#94a3b8', marginBottom: 8 }}>{plan.target}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {plan.features.map(f => (
                        <span key={f} style={{ fontSize: '.68rem', padding: '2px 8px', borderRadius: 6, background: '#f1f5f9', color: '#64748b' }}>{f}</span>
                      ))}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20 }}>Domaine & Nom du club</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Nom du club *</label>
              <input style={inputStyle} value={data.clubName} onChange={e => update('clubName', e.target.value)} placeholder={data.sport === 'voile' ? 'Club Nautique de Nice' : data.sport === 'rugby' ? 'RC Aviron Bayonnais' : 'Pelotaris Bidart'} />
            </div>
            <div>
              <label style={labelStyle}>Domaine *</label>
              <input style={inputStyle} value={data.domain} onChange={e => update('domain', e.target.value)} placeholder={data.sport === 'voile' ? 'club-nautique-nice.fr' : data.sport === 'rugby' ? 'rc-bayonne.fr' : 'pelotaris-bidart.fr'} />
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>Sans https://</div>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20 }}>Identité du club</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Accroche</label>
                <input style={inputStyle} value={data.tagline} onChange={e => update('tagline', e.target.value)} placeholder={data.sport === 'voile' ? 'Voile légère, compétition, stages' : data.sport === 'rugby' ? 'Le rugby local depuis 1920 — esprit et combat' : 'La pelote basque toutes disciplines'} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Adresse</label>
                <input style={inputStyle} value={data.address} onChange={e => update('address', e.target.value)} placeholder={data.sport === 'voile' ? 'Port de plaisance, 06000 Nice' : data.sport === 'rugby' ? 'Stade Municipal, 64000 Pau' : 'Fronton municipal, 64500 Ciboure'} />
              </div>
              <div>
                <label style={labelStyle}>Téléphone</label>
                <input style={inputStyle} value={data.phone} onChange={e => update('phone', e.target.value)} placeholder="05 59 00 00 00" />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" value={data.email} onChange={e => update('email', e.target.value)} placeholder="contact@club.fr" />
              </div>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20 }}>Couleurs du club</h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: 16 }}>
              Pré-réglage selon le sport : <strong>{sportCfg.brand}</strong>. Modifiable.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <label style={labelStyle}>Couleur principale</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <input type="color" value={data.primaryColor} onChange={e => update('primaryColor', e.target.value)} style={{ width: 48, height: 36, border: 'none', cursor: 'pointer' }} />
                  <input style={{ ...inputStyle, marginTop: 0, flex: 1 }} value={data.primaryColor} onChange={e => update('primaryColor', e.target.value)} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Couleur secondaire</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <input type="color" value={data.secondaryColor} onChange={e => update('secondaryColor', e.target.value)} style={{ width: 48, height: 36, border: 'none', cursor: 'pointer' }} />
                  <input style={{ ...inputStyle, marginTop: 0, flex: 1 }} value={data.secondaryColor} onChange={e => update('secondaryColor', e.target.value)} />
                </div>
              </div>
            </div>
            <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <div style={{ background: `linear-gradient(135deg, ${data.primaryColor}, ${data.secondaryColor})`, height: 80, display: 'flex', alignItems: 'center', padding: '0 24px', color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>
                {sportCfg.emoji} {data.clubName || sportCfg.brand}
              </div>
              <div style={{ padding: 16, background: '#fff' }}>
                <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 20, background: data.primaryColor, color: '#fff', fontWeight: 600, fontSize: '0.8rem' }}>Bouton principal</div>
                <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 20, border: `2px solid ${data.primaryColor}`, color: data.primaryColor, fontWeight: 600, fontSize: '0.8rem', marginLeft: 8 }}>Bouton secondaire</div>
              </div>
            </div>
          </>
        )}

        {step === 6 && (
          <>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>Modules du club</h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: 20 }}>
              Modules disponibles pour le sport <strong>{sportCfg.label}</strong>. Les <span style={{ color: '#16a34a', fontWeight: 700 }}>INCLUS</span> font partie du forfait <strong>{data.plan === 'essentiel' ? 'Essentiel' : data.plan === 'pulse' ? 'Pulse' : 'Sur mesure'}</strong>.
            </p>
            {visibleModules.map(m => {
              const included = m.plans.includes(data.plan)
              const checked = data[m.key] as boolean
              return (
                <label key={m.key} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px',
                  borderRadius: 8, border: '1px solid', marginBottom: 8, cursor: 'pointer',
                  borderColor: checked ? (included ? '#16a34a' : '#f0b429') : '#e2e8f0',
                  background: checked ? (included ? 'rgba(22,163,106,0.04)' : 'rgba(240,180,41,0.04)') : '#fff',
                }}>
                  <input type="checkbox" checked={checked} onChange={e => update(m.key, e.target.checked)}
                    style={{ width: 18, height: 18, marginTop: 2, accentColor: included ? '#16a34a' : '#f0b429' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>{m.label}</span>
                      {included
                        ? <span style={{ fontSize: '.6rem', padding: '1px 6px', borderRadius: 4, background: '#dcfce7', color: '#16a34a', fontWeight: 700 }}>INCLUS</span>
                        : checked
                          ? <span style={{ fontSize: '.6rem', padding: '1px 6px', borderRadius: 4, background: '#fef3c7', color: '#d97706', fontWeight: 700 }}>BONUS COMMERCIAL</span>
                          : <span style={{ fontSize: '.6rem', padding: '1px 6px', borderRadius: 4, background: '#f1f5f9', color: '#94a3b8', fontWeight: 700 }}>FORFAIT SUP.</span>
                      }
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{m.desc}</div>
                  </div>
                </label>
              )
            })}
          </>
        )}

        {step === 7 && (
          <>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20 }}>Créer l&apos;administrateur du club</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Prénom *</label>
                <input style={inputStyle} value={data.adminFirstName} onChange={e => update('adminFirstName', e.target.value)} placeholder="Jean" />
              </div>
              <div>
                <label style={labelStyle}>Nom *</label>
                <input style={inputStyle} value={data.adminLastName} onChange={e => update('adminLastName', e.target.value)} placeholder="Dupont" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Email *</label>
                <input style={inputStyle} type="email" value={data.adminEmail} onChange={e => update('adminEmail', e.target.value)} placeholder="admin@club.fr" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Mot de passe * (min. 8 caractères)</label>
                <input style={inputStyle} type="password" value={data.adminPassword} onChange={e => update('adminPassword', e.target.value)} placeholder="••••••••" />
              </div>
            </div>
            <div style={{ marginTop: 16, padding: 12, background: '#f0f9ff', borderRadius: 8, fontSize: '0.78rem', color: '#1d6fa4' }}>
              Cet utilisateur aura le rôle <strong>club_admin</strong> et pourra gérer tout le contenu de <strong>{data.clubName || 'ce club'}</strong> ({sportCfg.brand}).
            </div>
          </>
        )}
      </div>

      {error && <div style={{ padding: 12, background: '#fee2e2', borderRadius: 8, color: '#dc2626', fontSize: '0.85rem', marginBottom: 16 }}>{error}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={() => setStep(s => s - 1)}
          disabled={step === 1}
          style={{
            padding: '10px 24px', borderRadius: 8, border: '1px solid #e2e8f0',
            background: '#fff', fontWeight: 600, fontSize: '0.9rem', cursor: step === 1 ? 'not-allowed' : 'pointer',
            opacity: step === 1 ? 0.4 : 1, color: '#1e293b',
          }}>
          ← Précédent
        </button>
        {step < LAST_STEP ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext()}
            style={{
              padding: '10px 24px', borderRadius: 8, border: 'none',
              background: canNext() ? '#1d6fa4' : '#94a3b8', color: '#fff',
              fontWeight: 600, fontSize: '0.9rem', cursor: canNext() ? 'pointer' : 'not-allowed',
            }}>
            Suivant →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canNext() || loading}
            style={{
              padding: '10px 24px', borderRadius: 8, border: 'none',
              background: canNext() && !loading ? '#16a34a' : '#94a3b8', color: '#fff',
              fontWeight: 600, fontSize: '0.9rem', cursor: canNext() && !loading ? 'pointer' : 'not-allowed',
            }}>
            {loading ? 'Création en cours...' : '✓ Créer le club'}
          </button>
        )}
      </div>
    </div>
  )
}
