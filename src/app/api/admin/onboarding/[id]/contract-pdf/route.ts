import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { renderContractPdf, type BankSettings, type OnboardingForPdf } from '@/lib/utils/contractPdf'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })

  if (!user || (user as { role?: string }).role !== 'super_admin') {
    return NextResponse.json({ error: 'Accès réservé au super admin.' }, { status: 403 })
  }

  const { id } = await params
  const doc = await payload.findByID({
    collection: 'onboarding-requests',
    id,
    overrideAccess: true,
  })

  if (!doc) return NextResponse.json({ error: 'Demande introuvable' }, { status: 404 })

  const request: OnboardingForPdf = {
    organizationName: doc.organizationName as string,
    legalForm: doc.legalForm as string,
    siren: (doc.siren as string | null) ?? '',
    address: doc.address as string,
    sport: doc.sport as string,
    representativeName: doc.representativeName as string,
    representativeRole: doc.representativeRole as string,
    email: doc.email as string,
    phone: (doc.phone as string | null) ?? '',
    plan: doc.plan as 'essentiel' | 'pulse',
    paymentMode: doc.paymentMode as 'monthly' | 'annual',
    discountPercent: (doc.discountPercent as number | null) ?? 0,
    discountNote: (doc.discountNote as string | null) ?? '',
  }

  // Charge les coordonnées bancaires CGC depuis le global PlatformSettings.
  const settings = (await payload.findGlobal({
    slug: 'platform-settings',
    overrideAccess: true,
  })) as Record<string, unknown>

  const bank: BankSettings = {
    bankAccountHolder: (settings.bankAccountHolder as string | null) ?? null,
    bankHolderAddress: (settings.bankHolderAddress as string | null) ?? null,
    bankIban: (settings.bankIban as string | null) ?? null,
    bankBic: (settings.bankBic as string | null) ?? null,
    bankName: (settings.bankName as string | null) ?? null,
    bankDomiciliation: (settings.bankDomiciliation as string | null) ?? null,
    bankSwiftPartnerBic: (settings.bankSwiftPartnerBic as string | null) ?? null,
  }

  const pdf = await renderContractPdf(request, bank)

  const safeName = request.organizationName.replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 50)
  const filename = `contrat-${safeName}.pdf`

  // Wrap Buffer dans un Blob (BodyInit). On copie dans un ArrayBuffer pur pour
  // éviter le mismatch Node Buffer (ArrayBufferLike) vs DOM Blob (ArrayBuffer).
  const ab = new ArrayBuffer(pdf.byteLength)
  new Uint8Array(ab).set(pdf)
  const body = new Blob([ab], { type: 'application/pdf' })

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
