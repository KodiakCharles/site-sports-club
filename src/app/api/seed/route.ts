/**
 * Route de seed — crée un club demo + stages + articles.
 * Disponible uniquement en développement.
 * Appeler avec : GET /api/seed
 */

import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const payload = await getPayload({ config })
  const results: string[] = []

  // ─── Club ──────────────────────────────────────────────────────────────────

  const existingClub = await payload.find({
    collection: 'clubs',
    where: { domain: { equals: 'localhost' } },
    limit: 1,
    overrideAccess: true,
  })

  let clubId: string

  if (existingClub.docs.length > 0) {
    clubId = existingClub.docs[0].id as string
    results.push(`Club existant (id: ${clubId}) — ignoré`)
  } else {
    const club = await payload.create({
      collection: 'clubs',
      overrideAccess: true,
      data: {
        // Identité
        name: 'Club de Voile du Lac',
        sport: 'voile',
        domain: 'localhost',
        status: 'active',
        tagline: 'Naviguez avec passion sur le lac de Pau',
        address: '1 Promenade du Lac, 64000 Pau',
        phone: '05 59 27 43 10',
        email: 'contact@clubvoile-lac.fr',
        primaryColor: '#1d6fa4',
        secondaryColor: '#2eb8e6',
        // Modules
        moduleWeather: true,
        moduleMemberSpace: true,
        moduleMultilingual: false,
        moduleBoatRental: false,
        // Intégrations
        windguruStationId: '123456',
        ga4MeasurementId: 'G-XXXXXXXXXX',
        helloassoUrl: 'https://www.helloasso.com/associations/club-voile-du-lac',
        yoplanningKey: '',
        instagramToken: '',
        newsletterApiKey: '',
        newsletterListId: '',
        // Réseaux sociaux
        instagramUrl: 'https://www.instagram.com/clubvoiledulac',
        facebookUrl: 'https://www.facebook.com/clubvoiledulac',
        twitterUrl: 'https://twitter.com/clubvoiledulac',
        youtubeUrl: 'https://www.youtube.com/@clubvoiledulac',
        twitterHandle: 'clubvoiledulac',
        facebookPageId: '100000000000000',
        notes: 'Club template de démonstration — données fictives.',
      },
    })
    clubId = club.id as string
    results.push(`Club créé (id: ${clubId})`)
  }

  // ─── Super admin ───────────────────────────────────────────────────────────

  const existingUser = await payload.find({
    collection: 'users',
    where: { email: { equals: 'admin@voileweb.fr' } },
    limit: 1,
    overrideAccess: true,
  })

  if (existingUser.docs.length > 0) {
    results.push('Super admin déjà existant — ignoré')
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
    results.push('Super admin créé : admin@voileweb.fr / Admin1234!')
  }

  // ─── Stages ────────────────────────────────────────────────────────────────

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
    const exists = await payload.find({
      collection: 'stages',
      where: { and: [{ club: { equals: clubId } }, { title: { equals: stageData.title } }] },
      limit: 1,
      overrideAccess: true,
    })
    if (exists.docs.length > 0) {
      results.push(`Stage "${stageData.title}" — ignoré`)
      continue
    }
    await payload.create({
      collection: 'stages',
      overrideAccess: true,
      data: { ...stageData, club: clubId },
    })
    results.push(`Stage créé : ${stageData.title}`)
  }

  // ─── Articles ──────────────────────────────────────────────────────────────

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
      excerpt: "Les inscriptions pour les stages de voile de l'été 2026 sont ouvertes. Optimist, Laser, Wing Foil et Croisière — une offre complète pour tous les niveaux.",
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
      excerpt: 'Le club vient de signer une convention pluriannuelle avec la Région pour développer la pratique de la voile auprès des jeunes de 8 à 18 ans.',
      status: 'published',
      publishedAt: '2026-02-28T11:00:00.000Z',
    },
    {
      title: 'Lucas Martin sacré champion de France Minime',
      slug: 'lucas-martin-champion-france-minime',
      category: 'distinctions',
      excerpt: "À seulement 14 ans, Lucas Martin a remporté le titre de Champion de France Minime en Laser Radial. Une fierté immense pour tout le club.",
      status: 'published',
      publishedAt: '2026-02-15T16:00:00.000Z',
    },
  ]

  for (const postData of postsData) {
    const exists = await payload.find({
      collection: 'posts',
      where: { and: [{ club: { equals: clubId } }, { slug: { equals: postData.slug } }] },
      limit: 1,
      overrideAccess: true,
    })
    if (exists.docs.length > 0) {
      results.push(`Article "${postData.title}" — ignoré`)
      continue
    }
    await payload.create({
      collection: 'posts',
      overrideAccess: true,
      draft: false,
      data: { ...postData, club: clubId },
    })
    results.push(`Article créé : ${postData.title}`)
  }

  // ─── ClubSettings global ───────────────────────────────────────────────────

  await payload.updateGlobal({
    slug: 'club-settings',
    overrideAccess: true,
    data: {
      clubName: 'Club de Voile du Lac',
      logoText: 'VoileLac',
      tagline: 'Naviguez avec passion sur le lac de Pau',
      address: '1 Promenade du Lac, 64000 Pau',
      phone: '05 59 27 43 10',
      email: 'contact@clubvoile-lac.fr',
      mondayFriday: '9h – 18h',
      saturday: '9h – 13h',
      sunday: 'Fermé sauf régate',
      gpsLat: 43.2951,
      gpsLng: -0.3703,
      instagramUrl: 'https://www.instagram.com/clubvoiledulac',
      facebookUrl: 'https://www.facebook.com/clubvoiledulac',
      twitterUrl: 'https://twitter.com/clubvoiledulac',
      youtubeUrl: 'https://www.youtube.com/@clubvoiledulac',
      tiktokUrl: 'https://www.tiktok.com/@clubvoiledulac',
      founded: 2001,
      membersCount: 300,
      boatsCount: 50,
    },
  })
  results.push('ClubSettings mis à jour (réseaux sociaux + coordonnées)')

  // ─── Page Le Club ────────────────────────────────────────────────────────────

  await payload.updateGlobal({
    slug: 'club-page',
    overrideAccess: true,
    data: {
      heroTitle: 'Le Club',
      heroSubtitle: 'Une passion partagée pour la voile depuis plus de 20 ans',
      historyTitle: 'Notre histoire',
      teamTitle: 'Notre équipe',
      partnersTitle: 'Nos partenaires',
      team: [
        { name: 'Marc Durand',   role: 'Directeur technique',  diploma: 'DE Voile',       icon: '👨‍✈️' },
        { name: 'Sophie Martin', role: 'Monitrice principale', diploma: 'BPJEPS Voile',   icon: '👩‍✈️' },
        { name: 'Thomas Leroy',  role: 'Moniteur compétition', diploma: 'BPJEPS Voile',   icon: '👨‍✈️' },
        { name: 'Emma Bernard',  role: 'Monitrice jeunes',     diploma: 'CQP Initiateur', icon: '👩‍✈️' },
        { name: 'Julie Moreau',  role: 'Monitrice adultes',    diploma: 'BPJEPS Voile',   icon: '👩‍✈️' },
      ],
      partners: [
        { name: 'Région Nouvelle-Aquitaine',   url: 'https://www.nouvelle-aquitaine.fr' },
        { name: 'Fédération Française de Voile', url: 'https://www.ffvoile.fr' },
        { name: 'Ville de Pau',                url: 'https://www.pau.fr' },
        { name: 'Crédit Agricole Pyrénées',    url: '' },
        { name: 'Decathlon Pau',               url: '' },
      ],
    },
  })
  results.push('Page Le Club mise à jour (équipe + partenaires)')

  // ─── Page Compétition ────────────────────────────────────────────────────────

  await payload.updateGlobal({
    slug: 'competition-page',
    overrideAccess: true,
    data: {
      heroTitle: 'Compétition',
      heroSubtitle: 'Régatez sous les couleurs du club',
      stats: [
        { value: '5+',      label: 'régates organisées par an' },
        { value: '15+',     label: 'podiums en 2025' },
        { value: '4',       label: 'catégories compétitives' },
        { value: 'FFVoile', label: 'affilié & homologué' },
      ],
      races: [
        { name: 'Championnat départemental Optimist',    date: '5 avr. 2026',  location: 'Notre port',  category: 'Optimist',  status: 'upcoming', norUrl: '' },
        { name: 'Régate de printemps — Série habitable', date: '19 avr. 2026', location: 'Notre port',  category: 'Habitable', status: 'upcoming', norUrl: '' },
        { name: 'Championnat de ligue Laser ILCA',       date: '3 mai 2026',   location: 'Déplacement', category: 'Laser',     status: 'upcoming', norUrl: '' },
        { name: 'Coupe du club — Catamaran',             date: '17 mai 2026',  location: 'Notre port',  category: 'Catamaran', status: 'upcoming', norUrl: '' },
        { name: 'Grand Prix régional Optimist',          date: '14 mars 2026', location: 'Déplacement', category: 'Optimist',  status: 'past',     norUrl: '' },
      ],
      palmares: [
        { year: 2025, title: 'Champion régional Optimist — Thomas L.',   category: 'Optimist' },
        { year: 2025, title: 'Podium Championnat de France — Emma B.',   category: 'Laser ILCA' },
        { year: 2025, title: 'Vainqueur Coupe du Lac — Lucas M.',        category: 'Catamaran' },
        { year: 2024, title: 'Champion départemental Catamaran',         category: 'Catamaran' },
        { year: 2024, title: 'Vainqueur coupe du club — série A',        category: 'Habitable' },
      ],
      trainingFeatures: [
        { icon: '🎯', title: 'Entraînements ciblés',  desc: 'Séances techniques dédiées à la compétition, analyse vidéo, réglages de bateaux.' },
        { icon: '📅', title: 'Calendrier de régates', desc: 'Organisation des déplacements sur les régates départementales, régionales et nationales.' },
        { icon: '👥', title: 'Suivi individuel',      desc: 'Un moniteur référent par skipper, objectifs personnalisés saison par saison.' },
        { icon: '🏅', title: 'Détection de talents', desc: 'Lien direct avec la ligue régionale pour les espoirs et les pôles France.' },
      ],
    },
  })
  results.push('Page Compétition mise à jour (stats, régates, palmarès)')

  // ─── Page Nous trouver ───────────────────────────────────────────────────────

  await payload.updateGlobal({
    slug: 'nous-trouver-page',
    overrideAccess: true,
    data: {
      heroTitle: 'Nous trouver',
      heroSubtitle: 'Venez naviguer avec nous',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2876.123456789!2d-0.3703!3d43.2951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDE3JzQyLjQiTiAwwrAyMicoOS4yIlc!5e0!3m2!1sfr!2sfr!4v1234567890',
      directionsUrl: 'https://maps.google.com/?q=Pau+lac',
      weatherSpotName: 'Lac de Pau',
      windguruStationId: '123456',
      accessModes: [
        { icon: '🚗', label: 'En voiture', desc: 'Parking gratuit sur place. GPS : 43.2951° N, -0.3703° W' },
        { icon: '🚌', label: 'En bus',     desc: 'Ligne 7 direction Lac — arrêt "Promenade du Lac"' },
        { icon: '🚴', label: 'À vélo',     desc: 'Piste cyclable depuis le centre-ville. Parking vélos sécurisé.' },
        { icon: '⛵', label: 'Par la mer', desc: 'Accès direct depuis le plan d\'eau. Bouées visiteurs disponibles.' },
      ],
    },
  })
  results.push('Page Nous trouver mise à jour (carte, accès, météo)')

  // ─── Page d'accueil — section Rejoindre ────────────────────────────────────

  await payload.updateGlobal({
    slug: 'home-page',
    overrideAccess: true,
    data: {
      heroTitle: 'Bienvenue au Club de Voile du Lac',
      heroSubtitle: 'Voile légère, compétition, stages — pour tous les niveaux depuis 2001.',
      heroCtaLabel: 'Voir nos stages',
      heroCtaSecondaryLabel: 'Découvrir le club',
      activitiesTitle: 'Nos supports nautiques',
      stagesTitle: 'Prochains stages',
      meteoEnabled: true,
      mapEnabled: true,
      joinBadge: '⚓ Rejoignez-nous',
      joinTitle: 'Prenez le large avec',
      joinSubtitle: 'Du premier bord à la régate, nous accompagnons tous les navigateurs. Licences, stages, location de bateaux — tout est ici.',
      joinPerks: [
        { label: 'École Française de Voile' },
        { label: 'Moniteurs diplômés d\'État' },
        { label: 'Flotte entretenue & sécurisée' },
        { label: 'Dès 7 ans, tous niveaux' },
      ],
      joinCtaTitle: 'Essai gratuit',
      joinCtaText: 'Venez découvrir la voile lors d\'une séance découverte offerte pour les nouveaux adhérents.',
      joinCtaBtn: 'Réserver ma séance',
    },
  })
  results.push('Page d\'accueil mise à jour (section Rejoindre)')

  // ─── Page Activités — section EFV ──────────────────────────────────────────

  await payload.updateGlobal({
    slug: 'activites-page',
    overrideAccess: true,
    data: {
      heroTitle: 'Nos activités nautiques',
      heroSubtitle: 'Voile, kayak, foil — une pratique pour chaque profil',
      introTitle: 'Tous les niveaux, tous les supports',
      introSubtitle: 'Du premier bord en Optimist à la navigation hauturière, notre club propose une gamme complète d\'activités encadrées par des moniteurs diplômés d\'État.',
      efvTitle: 'Label École Française de Voile',
      efvSubtitle: 'Notre club est labellisé EFV par la Fédération Française de Voile, garantissant une pédagogie adaptée, des moniteurs qualifiés et des bateaux entretenus.',
      efvFeatures: [
        { icon: '🎓', title: 'Moniteurs diplômés', desc: 'BPJEPS, DE Voile, CQP Initiateur — un encadrement qualifié à chaque étape.' },
        { icon: '⛵', title: 'Flotte entretenue', desc: 'Bateaux révisés chaque saison, équipements de sécurité conformes FFVoile.' },
        { icon: '📋', title: 'Progression validée', desc: 'Carnet de voile FFVoile, passages de niveaux certifiés par les moniteurs.' },
        { icon: '🏅', title: 'Filière compétition', desc: 'Suivi individualisé pour les jeunes talents, déplacements organisés.' },
      ],
      pricingNote: '',
    },
  })
  results.push('Page Activités mise à jour (intro + section EFV)')

  // ─── Page Compétition — section filière ────────────────────────────────────

  await payload.updateGlobal({
    slug: 'competition-page',
    overrideAccess: true,
    data: {
      joinTitle: 'Rejoindre la filière compétition',
      joinSubtitle: 'Vous voulez vous dépasser et mesurer votre niveau ? Notre encadrement compétition vous accompagne de la première régate au niveau national.',
    },
  })
  results.push('Page Compétition mise à jour (section filière)')

  // ─── ClubSettings — logoText ────────────────────────────────────────────────

  await payload.updateGlobal({
    slug: 'club-settings',
    overrideAccess: true,
    data: { logoText: 'VoileLac' },
  })
  results.push('ClubSettings — logoText mis à jour')

  return NextResponse.json({ ok: true, results })
}
