import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendMailBatch, type MailMessage } from '@/lib/utils/mailer'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Vérification de l'authentification via le cookie Payload
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })

  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const userRole = (user as any).role
  if (userRole !== 'super_admin' && userRole !== 'club_admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  // Récupération de la newsletter
  const newsletter = await payload.findByID({
    collection: 'newsletters',
    id,
  })

  if (!newsletter) {
    return NextResponse.json({ error: 'Newsletter introuvable' }, { status: 404 })
  }

  if (newsletter.status === 'sent') {
    return NextResponse.json({ error: 'Newsletter déjà envoyée' }, { status: 400 })
  }

  const clubId = typeof newsletter.club === 'object' ? (newsletter.club as any).id : newsletter.club

  // Vérification que le club_admin gère bien ce club
  if (userRole === 'club_admin' && (user as any).club !== clubId && (user as any).club?.id !== clubId) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  // Récupération des membres opt-in du club
  const { docs: members } = await payload.find({
    collection: 'members',
    where: {
      and: [
        { club: { equals: clubId } },
        { newsletterOptIn: { equals: true } },
        { status: { equals: 'active' } },
      ],
    },
    limit: 1000,
    pagination: false,
  })

  if (members.length === 0) {
    return NextResponse.json({ error: 'Aucun destinataire trouvé' }, { status: 400 })
  }

  // Récupération de la config d'envoi du club
  const club = await payload.findByID({ collection: 'clubs', id: clubId })
  const clubData = club as Record<string, unknown>

  if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_SECRET_KEY) {
    return NextResponse.json({ error: 'Configuration email manquante' }, { status: 500 })
  }

  const clubName = (clubData.name as string) ?? 'Club de voile'
  const fromEmail = process.env.NEWSLETTER_FROM_EMAIL ?? 'newsletter@web-pulse.fr'

  const emails = (members as any[]).map((m) => m.email as string).filter(Boolean)

  const messages: MailMessage[] = emails.map((email) => ({
    from: { email: fromEmail, name: clubName },
    to: email,
    subject: newsletter.subject as string,
    html: buildEmailHtml(newsletter.subject as string, clubName),
  }))

  const sent = await sendMailBatch(messages)

  // Mise à jour du statut
  await payload.update({
    collection: 'newsletters',
    id,
    data: {
      status: 'sent',
      sentAt: new Date().toISOString(),
      recipientCount: sent,
    },
  })

  return NextResponse.json({ success: true, recipientCount: sent })
}

function buildEmailHtml(subject: string, clubName: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fa;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fa;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:100%;">
          <tr>
            <td style="background:#0d1f3c;padding:24px 32px;">
              <span style="color:#ffffff;font-size:1.2rem;font-weight:700;">${clubName}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 16px;font-size:1.4rem;color:#0d1f3c;">${subject}</h1>
              <p style="color:#64748b;font-size:0.85rem;margin-top:32px;">
                Vous recevez cet email car vous êtes membre de ${clubName} et avez accepté de recevoir des communications.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
