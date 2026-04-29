import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// Schéma miroir du route handler /api/marketing/onboarding (test isolé,
// dupliqué volontairement pour ne pas booter Next.js).
const schema = z.object({
  organizationName: z.string().min(2).max(200),
  legalForm: z.enum(['association_1901', 'club_sportif', 'sas', 'sarl', 'autre']),
  siren: z.string().max(30).optional().default(''),
  address: z.string().min(10).max(500),
  sport: z.enum(['voile', 'rugby', 'pelote-basque', 'autre']),
  representativeName: z.string().min(2).max(200),
  representativeRole: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional().default(''),
  plan: z.enum(['essentiel', 'pulse']),
  paymentMode: z.enum(['monthly', 'annual']),
  cgvAccepted: z.literal(true),
  website: z.string().max(0).optional(),
})

const validBase = {
  organizationName: 'Club de Voile Test',
  legalForm: 'association_1901',
  address: '12 quai de la mer, 64200 Biarritz',
  sport: 'voile',
  representativeName: 'Jean Dupont',
  representativeRole: 'Président',
  email: 'president@club-test.fr',
  plan: 'pulse',
  paymentMode: 'monthly',
  cgvAccepted: true as const,
}

describe('Validation formulaire onboarding Web Pulse', () => {
  it('accepte un payload minimal valide', () => {
    expect(schema.safeParse(validBase).success).toBe(true)
  })

  it('rejette un email invalide', () => {
    const r = schema.safeParse({ ...validBase, email: 'pas-un-email' })
    expect(r.success).toBe(false)
  })

  it('rejette un sport hors liste', () => {
    const r = schema.safeParse({ ...validBase, sport: 'football' })
    expect(r.success).toBe(false)
  })

  it("accepte 'autre' comme sport (capture lead hors-cluster)", () => {
    const r = schema.safeParse({ ...validBase, sport: 'autre' })
    expect(r.success).toBe(true)
  })

  it('rejette un plan inconnu (sur-mesure passe par mailto, pas par /onboarding)', () => {
    const r = schema.safeParse({ ...validBase, plan: 'surmesure' })
    expect(r.success).toBe(false)
  })

  it("rejette si CGV non acceptées (cgvAccepted doit être literal true)", () => {
    const r = schema.safeParse({ ...validBase, cgvAccepted: false })
    expect(r.success).toBe(false)
  })

  it('rejette une adresse trop courte (< 10 caractères)', () => {
    const r = schema.safeParse({ ...validBase, address: 'court' })
    expect(r.success).toBe(false)
  })

  it('détecte le honeypot rempli', () => {
    const r = schema.safeParse({ ...validBase, website: 'http://spam.com' })
    expect(r.success).toBe(false)
  })

  it('rejette une raison sociale trop longue (> 200)', () => {
    const r = schema.safeParse({ ...validBase, organizationName: 'A'.repeat(201) })
    expect(r.success).toBe(false)
  })
})
