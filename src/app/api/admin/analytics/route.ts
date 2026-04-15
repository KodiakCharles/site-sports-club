import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

type Insight = {
  type: 'success' | 'warning' | 'suggestion'
  icon: string
  title: string
  description: string
}

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) return NextResponse.json({ insights: [] }, { status: 401 })

    // Fetch data for analysis
    const [posts, stages, members, newsletters] = await Promise.all([
      payload.find({ collection: 'posts', limit: 100, sort: '-createdAt' }),
      payload.find({ collection: 'stages', limit: 50, sort: '-startDate' }),
      payload.count({ collection: 'members' }),
      payload.find({ collection: 'newsletters', limit: 20, sort: '-createdAt' }),
    ])

    const insights: Insight[] = []
    const now = new Date()

    // --- Content freshness analysis ---
    const publishedPosts = posts.docs.filter((p: Record<string, unknown>) => p.status === 'published')
    const recentPosts = publishedPosts.filter((p: Record<string, unknown>) => {
      const date = p.publishedAt ? new Date(p.publishedAt as string) : new Date(p.createdAt as string)
      return (now.getTime() - date.getTime()) < 30 * 24 * 60 * 60 * 1000 // 30 days
    })

    if (recentPosts.length === 0) {
      insights.push({
        type: 'warning', icon: '📝',
        title: 'Aucun article publie ce mois-ci',
        description: 'Les sites avec du contenu frais sont mieux references par Google. Publiez au moins 1 article par mois pour maintenir votre SEO.',
      })
    } else if (recentPosts.length >= 3) {
      insights.push({
        type: 'success', icon: '🎉',
        title: `${recentPosts.length} articles publies ce mois`,
        description: 'Excellent rythme de publication ! Votre referencement en beneficie directement.',
      })
    }

    // --- Draft articles analysis ---
    const draftPosts = posts.docs.filter((p: Record<string, unknown>) => p.status === 'draft')
    if (draftPosts.length > 3) {
      insights.push({
        type: 'suggestion', icon: '📋',
        title: `${draftPosts.length} brouillons en attente`,
        description: 'Pensez a relire et publier vos brouillons. Du contenu pret a etre publie est du contenu qui ne travaille pas pour vous.',
      })
    }

    // --- Stages analysis ---
    const upcomingStages = stages.docs.filter((s: Record<string, unknown>) => {
      const start = s.startDate ? new Date(s.startDate as string) : null
      return start && start > now
    })
    const fullStages = upcomingStages.filter((s: Record<string, unknown>) => (s.spotsLeft as number) === 0)
    const lowStages = upcomingStages.filter((s: Record<string, unknown>) => {
      const left = s.spotsLeft as number
      const total = s.spots as number
      return left > 0 && left <= Math.ceil(total * 0.3)
    })

    if (fullStages.length > 0) {
      insights.push({
        type: 'success', icon: '🏆',
        title: `${fullStages.length} stage(s) complet(s)`,
        description: 'Vos stages sont populaires ! Pensez a ouvrir des sessions supplementaires.',
      })
    }

    if (lowStages.length > 0) {
      insights.push({
        type: 'suggestion', icon: '📢',
        title: `${lowStages.length} stage(s) presque complet(s)`,
        description: 'Publiez un article ou une newsletter pour remplir les dernieres places. L\'urgence motive les inscriptions.',
      })
    }

    if (upcomingStages.length === 0) {
      insights.push({
        type: 'warning', icon: '⛵',
        title: 'Aucun stage a venir',
        description: 'Planifiez vos prochains stages pour maintenir l\'activite du club et la frequentation du site.',
      })
    }

    // --- Members analysis ---
    const memberCount = members.totalDocs
    if (memberCount < 10) {
      insights.push({
        type: 'suggestion', icon: '👥',
        title: 'Peu d\'adherents enregistres',
        description: 'Encouragez vos adherents a creer leur compte en ligne. L\'espace adherent augmente la fidelisation.',
      })
    }

    // --- Newsletter analysis ---
    const sentNewsletters = newsletters.docs.filter((n: Record<string, unknown>) => n.status === 'sent')
    const recentSent = sentNewsletters.filter((n: Record<string, unknown>) => {
      const date = n.sentAt ? new Date(n.sentAt as string) : null
      return date && (now.getTime() - date.getTime()) < 60 * 24 * 60 * 60 * 1000 // 60 days
    })
    if (recentSent.length === 0 && memberCount > 0) {
      insights.push({
        type: 'suggestion', icon: '📧',
        title: 'Pas de newsletter depuis 2 mois',
        description: 'Une newsletter mensuelle maintient le lien avec vos adherents et genere du trafic sur votre site.',
      })
    }

    // --- Category diversity ---
    const categories = publishedPosts.map((p: Record<string, unknown>) => p.category).filter(Boolean)
    const uniqueCategories = new Set(categories)
    if (publishedPosts.length > 5 && uniqueCategories.size <= 1) {
      insights.push({
        type: 'suggestion', icon: '🎯',
        title: 'Diversifiez vos categories d\'articles',
        description: 'Variez entre competition, vie du club et stages pour toucher un public plus large.',
      })
    }

    // --- Always add a general recommendation ---
    insights.push({
      type: 'suggestion', icon: '💡',
      title: 'Conseil SEO du jour',
      description: 'Ajoutez des photos a vos articles : les pages avec images obtiennent 94% de vues en plus. Pensez a renseigner le texte alternatif.',
    })

    return NextResponse.json({ insights, stats: { posts: publishedPosts.length, drafts: draftPosts.length, stages: upcomingStages.length, members: memberCount } })
  } catch {
    return NextResponse.json({ insights: [], stats: {} })
  }
}
