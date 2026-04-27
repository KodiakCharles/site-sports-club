import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'
import { getPlanFeatures } from '@/lib/utils/planFeatures'

const schema = z.object({
  sport: z.enum(['voile', 'rugby', 'pelote-basque']).default('voile'),
  plan: z.enum(['essentiel', 'pulse', 'surmesure']).default('pulse'),
  clubName: z.string().min(2),
  domain: z.string().min(3),
  tagline: z.string().optional().default(''),
  address: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  email: z.string().email().optional().or(z.literal('')).default(''),
  primaryColor: z.string().default('#1d6fa4'),
  secondaryColor: z.string().default('#2eb8e6'),
  weatherWidget: z.boolean().default(true),
  boatRental: z.boolean().default(false),
  equipmentRental: z.boolean().default(false),
  booking: z.boolean().default(false),
  memberSpace: z.boolean().default(true),
  multilingual: z.boolean().default(false),
  adminEmail: z.string().email(),
  adminFirstName: z.string().min(1),
  adminLastName: z.string().min(1),
  adminPassword: z.string().min(8),
})

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Auth check — super_admin only
    const { user } = await payload.auth({ headers: req.headers })
    if (!user || (user as Record<string, unknown>).role !== 'super_admin') {
      return NextResponse.json({ error: 'Accès refusé — super admin uniquement' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides', details: parsed.error.flatten() }, { status: 400 })
    }
    const data = parsed.data
    const features = getPlanFeatures(data.plan)

    // Check domain uniqueness
    const existing = await payload.find({
      collection: 'clubs',
      where: { domain: { equals: data.domain } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      return NextResponse.json({ error: `Le domaine "${data.domain}" est déjà utilisé` }, { status: 409 })
    }

    // Sport-aware module defaults
    const isVoile = data.sport === 'voile'
    const isRugby = data.sport === 'rugby'
    const isPelote = data.sport === 'pelote-basque'

    const club = await payload.create({
      collection: 'clubs',
      data: {
        name: data.clubName,
        sport: data.sport,
        domain: data.domain,
        lifecycle: 'active',
        plan: data.plan,
        tagline: data.tagline,
        address: data.address,
        phone: data.phone,
        email: data.email || undefined,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        moduleWeather: isVoile ? data.weatherWidget : false,
        moduleBoatRental: isVoile && features.stagesManagement ? data.boatRental : false,
        moduleEquipmentRental: (isRugby || isPelote) ? data.equipmentRental : false,
        moduleBooking: isPelote ? data.booking : false,
        moduleMemberSpace: features.memberSpace && data.memberSpace,
        moduleMultilingual: features.multilingual && data.multilingual,
      } as unknown as Record<string, unknown>,
    })

    // Create the club admin user
    await payload.create({
      collection: 'users',
      data: {
        email: data.adminEmail,
        password: data.adminPassword,
        firstName: data.adminFirstName,
        lastName: data.adminLastName,
        role: 'club_admin',
        club: club.id,
      },
    })

    return NextResponse.json({ success: true, clubId: club.id, clubName: data.clubName, plan: data.plan }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur', details: String(err) }, { status: 500 })
  }
}
