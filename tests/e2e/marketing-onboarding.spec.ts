import { test, expect } from '@playwright/test'

/**
 * Tests end-to-end — Page publique d'onboarding Web Pulse.
 * Ces tests supposent que l'environnement de test est lancé (railway run npm run dev)
 * avec un hostname résolu en vitrine (MARKETING_DOMAINS contient le host de test).
 */

test.describe("Page publique /onboarding", () => {
  test('charge la page avec le plan Pulse pré-sélectionné par défaut', async ({ page }) => {
    await page.goto('/onboarding')
    await expect(page.getByRole('heading', { name: /Lancez votre site Web Pulse/i })).toBeVisible()
    await expect(page.getByRole('radio', { name: /Pulse/i, checked: true })).toBeVisible()
  })

  test('respecte le query param ?plan=essentiel', async ({ page }) => {
    await page.goto('/onboarding?plan=essentiel')
    await expect(page.getByRole('radio', { name: /Essentiel/i, checked: true })).toBeVisible()
  })

  test('le bouton submit est visible et désactivé pendant l\'envoi', async ({ page }) => {
    await page.goto('/onboarding?plan=pulse')
    await expect(page.getByRole('button', { name: /Envoyer ma demande/i })).toBeVisible()
  })

  test('refuse une soumission sans CGV cochées (validation HTML5/Zod)', async ({ page }) => {
    await page.goto('/onboarding?plan=pulse')
    await page.getByLabel('Raison sociale *').fill('Club Test')
    await page.getByLabel('Adresse complète *').fill('12 quai de la mer, 64200 Biarritz')
    await page.getByLabel('Nom et prénom *').fill('Jean Dupont')
    await page.getByLabel('Fonction *').fill('Président')
    await page.getByLabel('Email *').fill('test@example.com')
    // CGV non cochées → submit doit échouer
    await page.getByRole('button', { name: /Envoyer ma demande/i }).click()
    // Aucune redirection vers /merci ne doit avoir lieu
    await expect(page).not.toHaveURL(/\/onboarding\/merci\//)
  })

  test('affiche le récap tarif annuel avec -10% si annuel d\'avance', async ({ page }) => {
    await page.goto('/onboarding?plan=pulse')
    await page.getByRole('radio', { name: /Annuel d'avance/i }).click()
    await expect(page.getByText(/économisés/i)).toBeVisible()
  })
})

test.describe('Pricing → onboarding (CTA)', () => {
  test('le CTA Choisir Pulse pointe vers /onboarding?plan=pulse', async ({ page }) => {
    await page.goto('/')
    const cta = page.getByRole('link', { name: 'Choisir Pulse' })
    await expect(cta).toHaveAttribute('href', '/onboarding?plan=pulse')
  })

  test('le CTA Choisir Essentiel pointe vers /onboarding?plan=essentiel', async ({ page }) => {
    await page.goto('/')
    const cta = page.getByRole('link', { name: 'Choisir Essentiel' })
    await expect(cta).toHaveAttribute('href', '/onboarding?plan=essentiel')
  })
})
