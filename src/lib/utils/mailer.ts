import Mailjet from 'node-mailjet'

export type MailMessage = {
  to: string | { email: string; name?: string }
  from?: { email: string; name?: string }
  subject: string
  html: string
  replyTo?: string
}

let cached: Mailjet | null = null

function client(): Mailjet {
  if (cached) return cached
  const apiKey = process.env.MAILJET_API_KEY
  const apiSecret = process.env.MAILJET_SECRET_KEY
  if (!apiKey || !apiSecret) {
    throw new Error('MAILJET_API_KEY ou MAILJET_SECRET_KEY manquante')
  }
  cached = new Mailjet({ apiKey, apiSecret })
  return cached
}

const DEFAULT_FROM_NAME = 'Web Pulse'

function toMailjetMessage(m: MailMessage, defaultFromEmail: string) {
  const to =
    typeof m.to === 'string'
      ? { Email: m.to }
      : { Email: m.to.email, ...(m.to.name ? { Name: m.to.name } : {}) }

  const fromEmail = m.from?.email ?? defaultFromEmail
  const fromName = m.from?.name ?? DEFAULT_FROM_NAME

  return {
    From: { Email: fromEmail, Name: fromName },
    To: [to],
    Subject: m.subject,
    HTMLPart: m.html,
    ...(m.replyTo ? { ReplyTo: { Email: m.replyTo } } : {}),
  }
}

export async function sendMail(msg: MailMessage): Promise<void> {
  const defaultFrom = process.env.EMAIL_FROM ?? 'noreply@web-pulse.fr'
  await client()
    .post('send', { version: 'v3.1' })
    .request({ Messages: [toMailjetMessage(msg, defaultFrom)] })
}

/**
 * Envoie une liste de messages en lots de 50 (limite Mailjet par requête).
 * Renvoie le nombre total de messages soumis.
 */
export async function sendMailBatch(messages: MailMessage[]): Promise<number> {
  const defaultFrom = process.env.NEWSLETTER_FROM_EMAIL ?? process.env.EMAIL_FROM ?? 'newsletter@web-pulse.fr'
  const BATCH_SIZE = 50
  let sent = 0
  for (let i = 0; i < messages.length; i += BATCH_SIZE) {
    const batch = messages.slice(i, i + BATCH_SIZE)
    await client()
      .post('send', { version: 'v3.1' })
      .request({ Messages: batch.map((m) => toMailjetMessage(m, defaultFrom)) })
    sent += batch.length
  }
  return sent
}
