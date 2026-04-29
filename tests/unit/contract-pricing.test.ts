import { describe, it, expect } from 'vitest'

// Logique de prix miroir du contractPdf.ts. Reproduite ici pour tester sans
// importer pdfkit (qui demande des fonts au chargement).
const PLAN_PRICES = { essentiel: 29, pulse: 49 } as const
const ANNUAL_DISCOUNT = 0.1

interface Req {
  plan: 'essentiel' | 'pulse'
  paymentMode: 'monthly' | 'annual'
  discountPercent?: number
}

function compute(req: Req) {
  const baseMonthly = PLAN_PRICES[req.plan]
  const discountPercent = req.discountPercent ?? 0
  const discountAmount = Math.round(baseMonthly * discountPercent) / 100
  const finalMonthly = Math.round((baseMonthly - discountAmount) * 100) / 100
  const annualGross = Math.round(finalMonthly * 12 * 100) / 100
  const annualDiscountAmount =
    req.paymentMode === 'annual' ? Math.round(annualGross * ANNUAL_DISCOUNT * 100) / 100 : 0
  const annualTotal = Math.round((annualGross - annualDiscountAmount) * 100) / 100
  return { baseMonthly, finalMonthly, annualGross, annualDiscountAmount, annualTotal }
}

describe('Calcul tarifaire — engagement annuel', () => {
  it('Essentiel mensuel : 29 × 12 = 348 €', () => {
    const r = compute({ plan: 'essentiel', paymentMode: 'monthly' })
    expect(r.annualTotal).toBe(348)
    expect(r.annualDiscountAmount).toBe(0)
  })

  it('Pulse mensuel : 49 × 12 = 588 €', () => {
    const r = compute({ plan: 'pulse', paymentMode: 'monthly' })
    expect(r.annualTotal).toBe(588)
  })

  it('Pulse annuel d\'avance : 588 - 10% = 529,20 €', () => {
    const r = compute({ plan: 'pulse', paymentMode: 'annual' })
    expect(r.annualDiscountAmount).toBe(58.8)
    expect(r.annualTotal).toBe(529.2)
  })

  it('Essentiel annuel d\'avance : 348 - 10% = 313,20 €', () => {
    const r = compute({ plan: 'essentiel', paymentMode: 'annual' })
    expect(r.annualTotal).toBe(313.2)
  })

  it('Remise commerciale 20% sur Pulse mensuel : (49 - 9,80) × 12 = 470,40 €', () => {
    const r = compute({ plan: 'pulse', paymentMode: 'monthly', discountPercent: 20 })
    expect(r.finalMonthly).toBe(39.2)
    expect(r.annualTotal).toBe(470.4)
  })

  it('Remise commerciale 20% + annuel d\'avance : double remise cumulée', () => {
    const r = compute({ plan: 'pulse', paymentMode: 'annual', discountPercent: 20 })
    // (49 - 9,80) × 12 = 470,40 ; -10% = 423,36
    expect(r.annualTotal).toBe(423.36)
  })
})
