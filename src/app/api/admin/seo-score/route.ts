import { NextResponse } from 'next/server'

const PAGES = [
  { path: '/', name: 'Accueil' },
  { path: '/stages', name: 'Stages' },
  { path: '/actualites', name: 'Actualités' },
  { path: '/competition', name: 'Compétition' },
  { path: '/contact', name: 'Contact' },
  { path: '/le-club', name: 'Le Club' },
  { path: '/activites', name: 'Activités' },
  { path: '/tarifs', name: 'Tarifs' },
  { path: '/nous-trouver', name: 'Nous trouver' },
]

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const results = await Promise.all(
    PAGES.map(async (page) => {
      const issues: string[] = []
      let score = 100

      try {
        const res = await fetch(`${baseUrl}${page.path}`, {
          headers: { 'User-Agent': 'VoilePulse-SEO-Checker' },
        })
        const html = await res.text()

        // Check meta title
        const titleMatch = html.match(/<title>(.*?)<\/title>/)
        if (!titleMatch || !titleMatch[1]) {
          issues.push('Meta title manquant')
          score -= 15
        } else if (titleMatch[1].length > 60) {
          issues.push('Meta title trop long (> 60 caractères)')
          score -= 5
        }

        // Check meta description
        const descMatch = html.match(/<meta name="description" content="(.*?)"/)
        if (!descMatch) {
          issues.push('Meta description manquante')
          score -= 15
        } else if (descMatch[1].length > 160) {
          issues.push('Meta description trop longue (> 160 caractères)')
          score -= 5
        }

        // Check H1
        const h1Match = html.match(/<h1/g)
        if (!h1Match) {
          issues.push('H1 manquant')
          score -= 10
        } else if (h1Match.length > 1) {
          issues.push('Plusieurs H1 détectés')
          score -= 5
        }

        // Check OG tags
        if (!html.includes('og:title')) {
          issues.push('OpenGraph title manquant')
          score -= 10
        }
        if (!html.includes('og:description')) {
          issues.push('OpenGraph description manquant')
          score -= 5
        }
        if (!html.includes('og:image')) {
          issues.push('OpenGraph image manquante')
          score -= 5
        }

        // Check structured data
        if (!html.includes('application/ld+json')) {
          issues.push('Structured data (JSON-LD) manquante')
          score -= 10
        }

        // Check images alt
        const imgWithoutAlt = html.match(/<img(?![^>]*alt=)[^>]*>/g)
        if (imgWithoutAlt && imgWithoutAlt.length > 0) {
          issues.push(`${imgWithoutAlt.length} image(s) sans attribut alt`)
          score -= Math.min(imgWithoutAlt.length * 3, 15)
        }

        // Check canonical
        if (!html.includes('rel="canonical"')) {
          issues.push('URL canonique manquante')
          score -= 5
        }

      } catch {
        issues.push('Page inaccessible')
        score = 0
      }

      return { page: page.name, score: Math.max(0, score), issues }
    })
  )

  return NextResponse.json(results)
}
