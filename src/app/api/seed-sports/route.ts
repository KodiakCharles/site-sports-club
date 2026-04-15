/**
 * Seed multi-sport — crée des clubs exemples pour Rugby et Pelote Basque,
 * en s'inspirant de clubs français existants (données fictives, pas d'affiliation).
 * Dev uniquement. GET /api/seed-sports
 */

import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

type StageSeed = {
  title: string
  support: string
  level: string
  audience: string
  startDate: string
  endDate: string
  spots: number
  spotsLeft: number
  price: number
  bookingProvider: 'helloasso' | 'yoplanning' | 'axyomes' | 'external'
  bookingUrl: string
}

type PostSeed = {
  title: string
  slug: string
  category: string
  excerpt: string
  publishedAt: string
}

type KBSeed = { question: string; answer: string; category: string; keywords?: string }

type ClubSeed = {
  name: string
  sport: 'voile' | 'rugby' | 'pelote-basque'
  domain: string
  tagline: string
  address: string
  phone: string
  email: string
  primaryColor: string
  secondaryColor: string
  helloassoUrl: string
  modules: Record<string, boolean>
  stages: StageSeed[]
  posts: PostSeed[]
  kb: KBSeed[]
}

const CLUBS: ClubSeed[] = [
  // ─── RUGBY — inspiré du Stade Montois (amateur section école de rugby) ─────
  {
    name: 'Racing Club du Béarn',
    sport: 'rugby',
    domain: 'rc-bearn.fr',
    tagline: 'Le rugby béarnais depuis 1908 — esprit, combat, partage',
    address: 'Stade Municipal, 64000 Pau',
    phone: '05 59 27 12 34',
    email: 'contact@rc-bearn.fr',
    primaryColor: '#0b4d2c',
    secondaryColor: '#d4a017',
    helloassoUrl: 'https://www.helloasso.com/associations/rc-bearn-demo',
    modules: {
      moduleWeather: false,
      moduleBoatRental: false,
      moduleEquipmentRental: true,
      moduleMemberSpace: true,
      moduleMultilingual: false,
    },
    stages: [
      {
        title: 'École de rugby — Rentrée U8/U10',
        support: 'ecole-rugby',
        level: 'initiation',
        audience: 'Enfants 6–10 ans',
        startDate: '2026-09-07T17:00:00.000Z',
        endDate: '2026-09-07T18:30:00.000Z',
        spots: 40,
        spotsLeft: 15,
        price: 180,
        bookingProvider: 'helloasso',
        bookingUrl: 'https://www.helloasso.com/demo-rugby',
      },
      {
        title: 'Stage Cadets U16 — Pré-saison',
        support: 'cadets',
        level: 'perfectionnement',
        audience: 'Cadets U16',
        startDate: '2026-08-17T09:00:00.000Z',
        endDate: '2026-08-21T17:00:00.000Z',
        spots: 30,
        spotsLeft: 12,
        price: 220,
        bookingProvider: 'helloasso',
        bookingUrl: 'https://www.helloasso.com/demo-rugby',
      },
      {
        title: 'Rugby à 7 — Tournoi loisir',
        support: 'rugby-a-7',
        level: 'debutant',
        audience: 'Adultes 16 ans+',
        startDate: '2026-06-06T10:00:00.000Z',
        endDate: '2026-06-06T18:00:00.000Z',
        spots: 60,
        spotsLeft: 28,
        price: 15,
        bookingProvider: 'helloasso',
        bookingUrl: 'https://www.helloasso.com/demo-rugby',
      },
    ],
    posts: [
      {
        title: 'Victoire des seniors 28-17 face à l\'AS Tarbes',
        slug: 'victoire-seniors-vs-tarbes-2026',
        category: 'match',
        excerpt:
          'Un match solide conclu par un essai de pénalité en fin de partie. Les seniors consolident leur place dans le top 4 de la poule.',
        publishedAt: '2026-04-12T10:00:00.000Z',
      },
      {
        title: 'Portes ouvertes école de rugby samedi 14 septembre',
        slug: 'portes-ouvertes-ecole-rugby-2026',
        category: 'ecole-rugby',
        excerpt:
          "Essai gratuit pour tous les enfants de 6 à 14 ans. Prévoir tenue de sport, gourde et bonne humeur !",
        publishedAt: '2026-04-05T08:00:00.000Z',
      },
    ],
    kb: [
      {
        question: 'À partir de quel âge peut-on commencer le rugby au club ?',
        answer:
          "L'école de rugby accueille les enfants dès 6 ans (catégorie U8). Les entraînements ont lieu le mercredi après-midi et le samedi matin.",
        category: 'inscription',
        keywords: 'école de rugby, baby-rugby, U6, U8, âge minimum',
      },
      {
        question: 'Le certificat médical est-il obligatoire ?',
        answer:
          "Oui, un certificat médical de non-contre-indication à la pratique du rugby en compétition est obligatoire pour tous les licenciés. Il est valable 3 ans si vous renouvelez sans interruption.",
        category: 'inscription',
        keywords: 'certificat médical, licence, visite, santé',
      },
      {
        question: 'Comment obtenir ma licence FFR ?',
        answer:
          "La licence FFR est incluse dans la cotisation annuelle. Remplissez le formulaire d'inscription sur HelloAsso, joignez le certificat médical et une photo d'identité.",
        category: 'inscription',
        keywords: 'licence, FFR, fédération, affiliation',
      },
    ],
  },

  // ─── RUGBY — inspiré d'un club amateur basque ──────────────────────────────
  {
    name: 'Union Sportive Bayonne-Anglet',
    sport: 'rugby',
    domain: 'us-bayonne-anglet.fr',
    tagline: 'Le rugby basque populaire — toutes catégories, tous niveaux',
    address: 'Parc des Sports, 64100 Bayonne',
    phone: '05 59 55 89 22',
    email: 'contact@us-bayonne-anglet.fr',
    primaryColor: '#1a1f71',
    secondaryColor: '#ff6b35',
    helloassoUrl: 'https://www.helloasso.com/associations/us-bay-anglet-demo',
    modules: {
      moduleWeather: false,
      moduleBoatRental: false,
      moduleEquipmentRental: false,
      moduleMemberSpace: true,
      moduleMultilingual: true,
    },
    stages: [
      {
        title: 'Stage seniors féminines — Préparation championnat',
        support: 'seniors-f',
        level: 'competition',
        audience: 'Joueuses seniors',
        startDate: '2026-08-10T09:00:00.000Z',
        endDate: '2026-08-14T17:00:00.000Z',
        spots: 25,
        spotsLeft: 8,
        price: 190,
        bookingProvider: 'helloasso',
        bookingUrl: 'https://www.helloasso.com/demo-rugby',
      },
    ],
    posts: [
      {
        title: "L'école de rugby féminine ouvre ses portes en septembre",
        slug: 'ecole-rugby-feminin-2026',
        category: 'ecole-rugby',
        excerpt:
          'Nouvelle catégorie cette saison : filles U10-U14. Entraînements le mercredi, encadrés par nos entraîneuses diplômées.',
        publishedAt: '2026-04-01T10:00:00.000Z',
      },
    ],
    kb: [
      {
        question: 'Acceptez-vous les joueurs sans expérience ?',
        answer:
          "Absolument. Notre section loisir accueille les débutants adultes. Les premières séances sont consacrées aux bases (passe, placage en sécurité, règles) avant toute mise en situation de match.",
        category: 'inscription',
      },
    ],
  },

  // ─── PELOTE — inspiré des clubs du Pays Basque ─────────────────────────────
  {
    name: 'Pelotaris Gazteak',
    sport: 'pelote-basque',
    domain: 'pelotaris-gazteak.fr',
    tagline: 'La pelote basque vivante — toutes disciplines, tous les niveaux',
    address: 'Fronton municipal, 64500 Saint-Jean-de-Luz',
    phone: '05 59 26 18 44',
    email: 'contact@pelotaris-gazteak.fr',
    primaryColor: '#c8102e',
    secondaryColor: '#006341',
    helloassoUrl: 'https://www.helloasso.com/associations/pelotaris-gazteak-demo',
    modules: {
      moduleWeather: false,
      moduleBoatRental: false,
      moduleEquipmentRental: true,
      moduleMemberSpace: true,
      moduleMultilingual: true,
      moduleBooking: true,
    },
    stages: [
      {
        title: 'Initiation main nue — Enfants',
        support: 'main-nue',
        level: 'initiation',
        audience: 'Enfants 8–13 ans',
        startDate: '2026-07-06T09:00:00.000Z',
        endDate: '2026-07-10T12:00:00.000Z',
        spots: 16,
        spotsLeft: 5,
        price: 140,
        bookingProvider: 'helloasso',
        bookingUrl: 'https://www.helloasso.com/demo-pelote',
      },
      {
        title: 'Stage paleta cuir — Perfectionnement',
        support: 'paleta-cuir',
        level: 'perfectionnement',
        audience: 'Adultes',
        startDate: '2026-07-13T09:00:00.000Z',
        endDate: '2026-07-17T17:00:00.000Z',
        spots: 12,
        spotsLeft: 4,
        price: 260,
        bookingProvider: 'helloasso',
        bookingUrl: 'https://www.helloasso.com/demo-pelote',
      },
      {
        title: 'Découverte chistera (grand gant)',
        support: 'chistera',
        level: 'initiation',
        audience: 'Ados et adultes',
        startDate: '2026-08-03T10:00:00.000Z',
        endDate: '2026-08-07T16:00:00.000Z',
        spots: 10,
        spotsLeft: 6,
        price: 220,
        bookingProvider: 'helloasso',
        bookingUrl: 'https://www.helloasso.com/demo-pelote',
      },
    ],
    posts: [
      {
        title: 'Championnat Côte Basque main nue — finale ce dimanche',
        slug: 'finale-cote-basque-main-nue-2026',
        category: 'championnat',
        excerpt:
          "Nos pelotaris Etxebarria/Irigoyen joueront la finale dimanche à 16h au fronton municipal. Entrée libre, venez nombreux !",
        publishedAt: '2026-04-10T14:00:00.000Z',
      },
      {
        title: 'Tournoi jeunes pelotaris — 42 inscrits cette année',
        slug: 'tournoi-jeunes-pelotaris-2026',
        category: 'partie',
        excerpt:
          'Record battu : 42 enfants inscrits au tournoi annuel des jeunes pelotaris, toutes catégories confondues.',
        publishedAt: '2026-03-28T09:00:00.000Z',
      },
    ],
    kb: [
      {
        question: "Peut-on louer le fronton pour jouer entre amis ?",
        answer:
          "Oui, le fronton municipal est réservable via notre espace réservation. Créneaux d'1h, possible en semaine et week-end. Matériel (pala, pelote) disponible en location.",
        category: 'acces',
        keywords: 'fronton, réservation, location, créneau',
      },
      {
        question: 'Quelle discipline pour débuter ?',
        answer:
          "La paleta gomme est idéale pour débuter : la pelote rebondit bien, le geste est simple à apprendre. On passe ensuite à la main nue ou à la paleta cuir selon les affinités.",
        category: 'materiel',
        keywords: 'débutant, discipline, paleta, main nue',
      },
      {
        question: "Faut-il une licence FFPB pour jouer en compétition ?",
        answer:
          "Oui, la licence FFPB est obligatoire pour toute compétition officielle. Elle est incluse dans la cotisation annuelle du club et inclut l'assurance.",
        category: 'inscription',
        keywords: 'licence, FFPB, compétition, fédération',
      },
    ],
  },

  // ─── PELOTE — club cesta punta ─────────────────────────────────────────────
  {
    name: 'Hegoaldea Cesta Punta',
    sport: 'pelote-basque',
    domain: 'hegoaldea-cp.fr',
    tagline: 'La cesta punta, reine des spécialités — jai alai depuis 1978',
    address: 'Jai Alai, 64700 Hendaye',
    phone: '05 59 20 33 77',
    email: 'contact@hegoaldea-cp.fr',
    primaryColor: '#005daa',
    secondaryColor: '#ffcc00',
    helloassoUrl: 'https://www.helloasso.com/associations/hegoaldea-demo',
    modules: {
      moduleWeather: false,
      moduleBoatRental: false,
      moduleEquipmentRental: true,
      moduleMemberSpace: true,
      moduleMultilingual: true,
      moduleBooking: true,
    },
    stages: [
      {
        title: 'Cesta punta — Stage intensif ados',
        support: 'cesta-punta',
        level: 'perfectionnement',
        audience: 'Ados 14–18 ans',
        startDate: '2026-07-20T09:00:00.000Z',
        endDate: '2026-07-24T17:00:00.000Z',
        spots: 8,
        spotsLeft: 2,
        price: 340,
        bookingProvider: 'helloasso',
        bookingUrl: 'https://www.helloasso.com/demo-pelote',
      },
    ],
    posts: [
      {
        title: 'Gala de pelote estival — 15 août au Jai Alai',
        slug: 'gala-jai-alai-2026',
        category: 'partie',
        excerpt:
          "Grand gala annuel avec les meilleurs pelotaris de cesta punta. Billetterie en ligne, placement libre.",
        publishedAt: '2026-04-08T10:00:00.000Z',
      },
    ],
    kb: [
      {
        question: 'La cesta punta est-elle dangereuse ?',
        answer:
          "La pelote de cesta punta est rapide (jusqu'à 300 km/h). Les lunettes de protection et casque sont obligatoires en compétition et recommandés à l'entraînement. Formation progressive et encadrée.",
        category: 'securite',
      },
    ],
  },
]

async function seedClub(
  payload: Awaited<ReturnType<typeof getPayload>>,
  seed: ClubSeed,
  results: string[]
) {
  const existing = await payload.find({
    collection: 'clubs',
    where: { domain: { equals: seed.domain } },
    limit: 1,
    overrideAccess: true,
  })

  let clubId: string
  if (existing.docs.length) {
    clubId = existing.docs[0].id as string
    results.push(`[${seed.sport}] Club déjà en base : ${seed.name} — ignoré`)
  } else {
    const created = await payload.create({
      collection: 'clubs',
      overrideAccess: true,
      data: {
        name: seed.name,
        sport: seed.sport,
        domain: seed.domain,
        status: 'active',
        plan: 'pulse',
        tagline: seed.tagline,
        address: seed.address,
        phone: seed.phone,
        email: seed.email,
        primaryColor: seed.primaryColor,
        secondaryColor: seed.secondaryColor,
        helloassoUrl: seed.helloassoUrl,
        ...seed.modules,
      } as unknown as Record<string, unknown>,
    })
    clubId = created.id as string
    results.push(`[${seed.sport}] Club créé : ${seed.name} (${clubId})`)
  }

  for (const stage of seed.stages) {
    const exists = await payload.find({
      collection: 'stages',
      where: {
        and: [{ club: { equals: clubId } }, { title: { equals: stage.title } }],
      },
      limit: 1,
      overrideAccess: true,
    })
    if (exists.docs.length) continue
    await payload.create({
      collection: 'stages',
      overrideAccess: true,
      data: { club: clubId, ...stage } as unknown as Record<string, unknown>,
    })
  }

  for (const post of seed.posts) {
    const exists = await payload.find({
      collection: 'posts',
      where: {
        and: [{ club: { equals: clubId } }, { slug: { equals: post.slug } }],
      },
      limit: 1,
      overrideAccess: true,
    })
    if (exists.docs.length) continue
    await payload.create({
      collection: 'posts',
      overrideAccess: true,
      data: {
        club: clubId,
        title: post.title,
        slug: post.slug,
        category: post.category,
        excerpt: post.excerpt,
        status: 'published',
        publishedAt: post.publishedAt,
      } as unknown as Record<string, unknown>,
    })
  }

  for (const kb of seed.kb) {
    const exists = await payload.find({
      collection: 'knowledge-base',
      where: {
        and: [{ club: { equals: clubId } }, { question: { equals: kb.question } }],
      },
      limit: 1,
      overrideAccess: true,
    })
    if (exists.docs.length) continue
    await payload.create({
      collection: 'knowledge-base',
      overrideAccess: true,
      data: {
        club: clubId,
        question: kb.question,
        answer: kb.answer,
        category: kb.category,
        keywords: kb.keywords,
        source: 'manual',
        status: 'active',
      } as unknown as Record<string, unknown>,
    })
  }

  results.push(
    `[${seed.sport}] ${seed.name} : ${seed.stages.length} ${seed.sport === 'rugby' ? 'entraînements' : seed.sport === 'pelote-basque' ? 'parties' : 'stages'}, ${seed.posts.length} articles, ${seed.kb.length} entrées KB`
  )
}

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const payload = await getPayload({ config })
  const results: string[] = []

  for (const seed of CLUBS) {
    try {
      await seedClub(payload, seed, results)
    } catch (err) {
      results.push(`❌ ${seed.name} : ${String(err)}`)
    }
  }

  return NextResponse.json({
    message: 'Seed multi-sport terminé',
    clubsProcessed: CLUBS.length,
    results,
  })
}
