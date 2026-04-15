/**
 * Script de seed — insère un club de démo + stages + articles dans la base locale.
 * Usage : npx tsx scripts/seed.ts
 */

import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.PAYLOAD_SECRET = process.env.PAYLOAD_SECRET ?? 'voileweb-dev-secret-change-in-production'
process.env.DATABASE_URI = `file:${path.resolve(__dirname, '../payload.db')}`

async function seed() {
  const { getPayload } = await import('payload')
  const config = (await import('../payload.config.js')).default
  const payload = await getPayload({ config })

  // ─── 1. Club ───────────────────────────────────────────────────────────────

  console.log('Création du club...')

  const existing = await payload.find({
    collection: 'clubs',
    where: { domain: { equals: 'localhost' } },
    limit: 1,
    overrideAccess: true,
  })

  let clubId: string

  if (existing.docs.length > 0) {
    clubId = existing.docs[0].id as string
    console.log(`  Club existant (id: ${clubId}) — ignoré`)
  } else {
    const club = await payload.create({
      collection: 'clubs',
      overrideAccess: true,
      data: {
        name: 'Club de Voile du Lac',
        domain: 'localhost',
        status: 'active',
        tagline: 'Naviguez avec passion sur le lac',
        address: '1 Promenade du Lac, 64000 Pau',
        phone: '05 59 00 00 00',
        email: 'contact@clubvoile-lac.fr',
        primaryColor: '#1d6fa4',
        secondaryColor: '#2eb8e6',
        moduleWeather: true,
        moduleMemberSpace: true,
        moduleMultilingual: false,
        moduleFfvoile: false,
      },
    })
    clubId = club.id as string
    console.log(`  Club créé (id: ${clubId})`)
  }

  // ─── 2. Super admin ────────────────────────────────────────────────────────

  console.log('Création du super admin...')

  const existingUser = await payload.find({
    collection: 'users',
    where: { email: { equals: 'admin@voileweb.fr' } },
    limit: 1,
    overrideAccess: true,
  })

  if (existingUser.docs.length > 0) {
    console.log('  Super admin déjà existant — ignoré')
  } else {
    await payload.create({
      collection: 'users',
      overrideAccess: true,
      data: {
        email: 'admin@voileweb.fr',
        password: 'Admin1234!',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'super_admin',
      },
    })
    console.log('  Super admin créé : admin@voileweb.fr / Admin1234!')
  }

  // ─── 3. Stages ─────────────────────────────────────────────────────────────

  console.log('Création des stages...')

  const stagesData = [
    {
      title: 'Stage Optimist — Initiation été',
      support: 'optimist',
      level: 'initiation',
      audience: 'Enfants 7–12 ans',
      startDate: '2026-07-07T08:00:00.000Z',
      endDate: '2026-07-11T18:00:00.000Z',
      spots: 10,
      spotsLeft: 7,
      price: 220,
      bookingProvider: 'helloasso',
      bookingUrl: 'https://www.helloasso.com/demo',
    },
    {
      title: 'Stage Laser ILCA — Perfectionnement',
      support: 'laser',
      level: 'perfectionnement',
      audience: 'Ados & adultes 14 ans+',
      startDate: '2026-07-14T08:00:00.000Z',
      endDate: '2026-07-18T18:00:00.000Z',
      spots: 8,
      spotsLeft: 3,
      price: 280,
      bookingProvider: 'helloasso',
      bookingUrl: 'https://www.helloasso.com/demo',
    },
    {
      title: 'Stage Wing Foil — Découverte',
      support: 'foil',
      level: 'initiation',
      audience: 'Adultes 16 ans+',
      startDate: '2026-07-21T08:00:00.000Z',
      endDate: '2026-07-25T18:00:00.000Z',
      spots: 6,
      spotsLeft: 2,
      price: 380,
      bookingProvider: 'helloasso',
      bookingUrl: 'https://www.helloasso.com/demo',
    },
    {
      title: 'Stage Catamaran — Intermédiaire',
      support: 'catamaran',
      level: 'intermediaire',
      audience: 'Ados & adultes',
      startDate: '2026-08-04T08:00:00.000Z',
      endDate: '2026-08-08T18:00:00.000Z',
      spots: 8,
      spotsLeft: 8,
      price: 300,
      bookingProvider: 'helloasso',
      bookingUrl: 'https://www.helloasso.com/demo',
    },
    {
      title: 'Stage Voile habitable — Initiation croisière',
      support: 'croisiere',
      level: 'initiation',
      audience: 'Adultes tous niveaux',
      startDate: '2026-08-18T08:00:00.000Z',
      endDate: '2026-08-22T18:00:00.000Z',
      spots: 6,
      spotsLeft: 0,
      price: 450,
      bookingProvider: 'helloasso',
      bookingUrl: 'https://www.helloasso.com/demo',
    },
  ]

  for (const stageData of stagesData) {
    const existingStage = await payload.find({
      collection: 'stages',
      where: { and: [{ club: { equals: clubId } }, { title: { equals: stageData.title } }] },
      limit: 1,
      overrideAccess: true,
    })
    if (existingStage.docs.length > 0) {
      console.log(`  Stage "${stageData.title}" déjà existant — ignoré`)
      continue
    }
    await payload.create({
      collection: 'stages',
      overrideAccess: true,
      data: { ...stageData, club: clubId },
    })
    console.log(`  Stage créé : ${stageData.title}`)
  }

  // ─── 4. Articles ───────────────────────────────────────────────────────────

  console.log('Création des articles...')

  const postsData = [
    {
      title: 'Victoire au Championnat Régional Optimist 2026',
      slug: 'victoire-championnat-regional-optimist-2026',
      category: 'competition',
      excerpt: "Nos jeunes régatiers ont décroché trois podiums au championnat régional qui s'est tenu sur le lac de Pau. Une performance exceptionnelle saluée par toute la fédération.",
      status: 'published',
      publishedAt: '2026-03-20T10:00:00.000Z',
    },
    {
      title: 'Ouverture des inscriptions stages été 2026',
      slug: 'ouverture-inscriptions-stages-ete-2026',
      category: 'stages',
      excerpt: "Les inscriptions pour les stages de voile de l'été 2026 sont désormais ouvertes. Optimist, Laser, Wing Foil et Croisière — une offre complète pour tous les niveaux et tous les âges.",
      status: 'published',
      publishedAt: '2026-03-15T09:00:00.000Z',
    },
    {
      title: 'Assemblée générale 2026 — compte-rendu',
      slug: 'assemblee-generale-2026-compte-rendu',
      category: 'vie-du-club',
      excerpt: "L'assemblée générale annuelle s'est tenue le 8 mars avec une participation record. Retour sur les décisions prises et les projets pour la saison 2026.",
      status: 'published',
      publishedAt: '2026-03-10T14:00:00.000Z',
    },
    {
      title: 'Nouveau partenariat avec la Région Nouvelle-Aquitaine',
      slug: 'partenariat-region-nouvelle-aquitaine',
      category: 'partenariat',
      excerpt: 'Le club vient de signer une convention pluriannuelle avec la Région Nouvelle-Aquitaine pour développer la pratique de la voile auprès des jeunes de 8 à 18 ans.',
      status: 'published',
      publishedAt: '2026-02-28T11:00:00.000Z',
    },
    {
      title: 'Lucas Martin sacré champion de France Minime',
      slug: 'lucas-martin-champion-france-minime',
      category: 'distinctions',
      excerpt: "À seulement 14 ans, Lucas Martin a remporté le titre de Champion de France Minime en Laser Radial. Une fierté immense pour tout le club qui l'accompagne depuis ses débuts.",
      status: 'published',
      publishedAt: '2026-02-15T16:00:00.000Z',
    },
  ]

  for (const postData of postsData) {
    const existingPost = await payload.find({
      collection: 'posts',
      where: { and: [{ club: { equals: clubId } }, { slug: { equals: postData.slug } }] },
      limit: 1,
      overrideAccess: true,
    })
    if (existingPost.docs.length > 0) {
      console.log(`  Article "${postData.title}" déjà existant — ignoré`)
      continue
    }
    await payload.create({
      collection: 'posts',
      overrideAccess: true,
      draft: false,
      data: { ...postData, club: clubId },
    })
    console.log(`  Article créé : ${postData.title}`)
  }

  console.log('\nSeed terminé.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
