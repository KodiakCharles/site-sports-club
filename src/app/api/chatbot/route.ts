import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { resolveClub } from '@/lib/utils/tenant'
import { isValidOrigin } from '@/lib/utils/csrf'
import { rateLimit, getClientIp } from '@/lib/utils/rateLimit'
import { getSportConfig, type Sport } from '@/lib/utils/sportConfig'

const schema = z.object({
  message: z.string().min(1).max(1000),
  sessionId: z.string().max(64).optional(),
  userEmail: z.string().email().optional(),
})

type KBEntry = {
  id: string | number
  question: string
  answer: string
  category?: string
  keywords?: string
}

type ClubData = Record<string, unknown> & {
  id: string | number
  name?: string
  sport?: Sport
  contact?: { email?: string; phone?: string; address?: string }
  integrations?: { helloassoUrl?: string; windguruStationId?: string }
}

async function buildClubContext(
  payload: Awaited<ReturnType<typeof getPayload>>,
  clubId: string | number
): Promise<{ context: string; sport: Sport }> {
  const [club, settings, stages, posts, kbEntries] = await Promise.all([
    payload.findByID({ collection: 'clubs', id: clubId }).catch(() => null),
    payload.findGlobal({ slug: 'club-settings' }).catch(() => null),
    payload
      .find({
        collection: 'stages',
        where: { club: { equals: clubId } },
        limit: 20,
        sort: '-startDate',
      })
      .catch(() => ({ docs: [] as unknown[] })),
    payload
      .find({
        collection: 'posts',
        where: {
          and: [
            { club: { equals: clubId } },
            { status: { equals: 'published' } },
          ],
        },
        limit: 10,
        sort: '-publishedAt',
      })
      .catch(() => ({ docs: [] as unknown[] })),
    payload
      .find({
        collection: 'knowledge-base',
        where: {
          and: [
            { club: { equals: clubId } },
            { status: { equals: 'active' } },
          ],
        },
        limit: 200,
      })
      .catch(() => ({ docs: [] as KBEntry[] })),
  ])

  const c = club as ClubData | null
  const s = settings as Record<string, unknown> | null
  const sport: Sport = (c?.sport as Sport) ?? 'voile'
  const sc = getSportConfig(sport)

  const sections: string[] = []

  if (c) {
    sections.push(
      `# CLUB (${sc.label})\nNom : ${c.name ?? ''}\nFédération : ${sc.federation.short} (${sc.federation.long})\nEmail : ${c.contact?.email ?? '—'}\nTéléphone : ${c.contact?.phone ?? '—'}\nAdresse : ${c.contact?.address ?? '—'}`
    )
  }
  if (c?.integrations?.helloassoUrl) {
    sections.push(`# INSCRIPTION / ${sc.federation.licenseLabel.toUpperCase()}\nPlateforme HelloAsso : ${c.integrations.helloassoUrl}`)
  }

  if (s) {
    const activities = (s.activities as string[] | undefined)?.join(', ')
    const hours = s.openingHours as string | undefined
    if (activities) sections.push(`# ACTIVITÉS PROPOSÉES\n${activities}`)
    if (hours) sections.push(`# HORAIRES\n${hours}`)
  }

  const stagesList = ((stages as { docs: Record<string, unknown>[] }).docs ?? []).slice(0, 10)
  if (stagesList.length) {
    const heading = sport === 'rugby' ? 'ENTRAÎNEMENTS / STAGES À VENIR' : sport === 'pelote-basque' ? 'PARTIES / STAGES À VENIR' : 'STAGES EN COURS / À VENIR'
    sections.push(
      `# ${heading}\n` +
        stagesList
          .map((st) => {
            const title = st.title ?? st.name ?? '—'
            const start = st.startDate ?? '—'
            const level = st.level ?? '—'
            const support = st.support ?? '—'
            return `- ${title} — ${support} (niveau ${level}) à partir du ${start}`
          })
          .join('\n')
    )
  }

  const postsList = ((posts as { docs: Record<string, unknown>[] }).docs ?? []).slice(0, 5)
  if (postsList.length) {
    sections.push(
      '# ACTUALITÉS RÉCENTES\n' +
        postsList
          .map((p) => `- ${p.title} (${p.category ?? 'actu'}) : ${p.excerpt ?? ''}`)
          .join('\n')
    )
  }

  const kbList = (kbEntries as { docs: KBEntry[] }).docs ?? []
  if (kbList.length) {
    sections.push(
      '# BASE DE CONNAISSANCES — Q/R VALIDÉES\n' +
        kbList
          .map(
            (kb) =>
              `Q: ${kb.question}\nR: ${kb.answer}${kb.keywords ? `\n(mots-clés: ${kb.keywords})` : ''}`
          )
          .join('\n---\n')
    )
  }

  return { context: sections.join('\n\n'), sport }
}

function buildSystemPrompt(sport: Sport, context: string): string {
  const sc = getSportConfig(sport)
  return `Tu es l'assistant virtuel d'un club de ${sc.label.toLowerCase()} affilié à la ${sc.federation.long} (${sc.federation.short}). Tu aides les visiteurs et ${sc.vocabulary.memberPlural} en répondant à leurs questions sur le club : inscription, ${sc.federation.licenseLabel.toLowerCase()}, ${sc.activityLabel}, ${sc.vocabulary.competitionPlural}, tarifs, horaires, matériel, sécurité, etc.

VOCABULAIRE À UTILISER :
- ${sc.vocabulary.venue} (lieu de pratique)
- ${sc.vocabulary.sessionPlural} / ${sc.vocabulary.competitionPlural}
- ${sc.vocabulary.memberPlural} (membres du club)
- ${sc.federation.licenseLabel}

RÈGLES STRICTES :
1. Réponds UNIQUEMENT à partir des informations contenues dans le contexte fourni (CLUB + BASE DE CONNAISSANCES + activités + actualités).
2. Si tu ne trouves pas l'information dans le contexte, tu DOIS appeler l'outil \`create_alert\` pour signaler la question à l'administrateur, puis retourner la fallback_reply à l'utilisateur.
3. Reste concis (3-5 phrases max), factuel, en français, et vouvoie toujours.
4. N'invente JAMAIS d'informations (horaires, tarifs, contacts, dates...). Préfère créer une alerte plutôt que deviner.
5. Pour les sujets hors scope du ${sc.label.toLowerCase()} (météo temps réel, actualité mondiale, conseil médical...), indique que ce n'est pas ton domaine et redirige.
6. Sécurité : ${sc.safetyNote}

# CONTEXTE DU CLUB

${context}`
}

const tools: Anthropic.Messages.Tool[] = [
  {
    name: 'create_alert',
    description:
      "Crée une alerte pour l'administrateur du club quand tu ne peux pas répondre à la question de l'utilisateur avec certitude à partir du contexte fourni. N'utilise cet outil que si l'information est vraiment absente du contexte.",
    input_schema: {
      type: 'object',
      properties: {
        reason: {
          type: 'string',
          description:
            "Pourquoi tu ne peux pas répondre (ex: 'horaires spécifiques absents du contexte', 'tarif stage X non renseigné').",
        },
        priority: {
          type: 'string',
          enum: ['high', 'normal', 'low'],
          description:
            "Priorité : 'high' si l'utilisateur semble mécontent ou demande urgent, 'normal' sinon, 'low' pour sujets annexes.",
        },
        fallback_reply: {
          type: 'string',
          description:
            "Ta réponse à l'utilisateur pendant qu'il attend la réponse de l'admin. Doit rester polie et indiquer que l'équipe va revenir vers lui.",
        },
      },
      required: ['reason', 'fallback_reply'],
    },
  },
]

export async function POST(req: NextRequest) {
  if (!isValidOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const ip = getClientIp(req)
  const rl = rateLimit(`chatbot:${ip}`, { limit: 20, windowMs: 10 * 60_000 })
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
    )
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
  const { message, sessionId, userEmail } = parsed.data

  const clubId = await resolveClub()
  if (!clubId) {
    return NextResponse.json({ error: 'Club not found' }, { status: 404 })
  }

  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'club-settings' }).catch(() => null)
  const s = settings as Record<string, unknown> | null
  if (!s?.chatbotEnabled) {
    return NextResponse.json({ reply: "Le chatbot n'est pas activé pour ce club." })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Chatbot temporairement indisponible (clé API manquante côté serveur).' },
      { status: 503 }
    )
  }

  const { context, sport } = await buildClubContext(payload, clubId)
  const systemPrompt = buildSystemPrompt(sport, context)

  const client = new Anthropic({ apiKey })

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      tools,
      messages: [{ role: 'user', content: message }],
    })

    let reply = ''
    let alertCreated = false

    for (const block of response.content) {
      if (block.type === 'text') {
        reply += block.text
      } else if (block.type === 'tool_use' && block.name === 'create_alert') {
        const input = block.input as {
          reason?: string
          priority?: 'high' | 'normal' | 'low'
          fallback_reply?: string
        }

        try {
          await payload.create({
            collection: 'chatbot-alerts',
            data: {
              club: clubId,
              userQuestion: message,
              aiAttempt: reply || '(aucune réponse directe avant création alerte)',
              aiReason: input.reason ?? '—',
              priority: input.priority ?? 'normal',
              status: 'pending',
              sessionId,
              userContact: userEmail,
              addToKnowledgeBase: true,
              kbCategory: 'general',
            },
          })
          alertCreated = true
        } catch (err) {
          payload.logger.error(`[Chatbot] alert creation failed: ${err}`)
        }

        if (input.fallback_reply) reply = input.fallback_reply
      }
    }

    if (!reply) {
      reply =
        "Je n'ai pas la réponse précise à votre question, mais je l'ai transmise à l'équipe du club qui vous reviendra rapidement."
    }

    return NextResponse.json({
      reply: reply.trim(),
      alertCreated,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    })
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: 'Service temporairement saturé, réessayez dans quelques secondes.' },
        { status: 429 }
      )
    }
    if (err instanceof Anthropic.APIError) {
      payload.logger.error(`[Chatbot] Anthropic API error ${err.status}: ${err.message}`)
      return NextResponse.json(
        { error: "Erreur du service IA. L'équipe a été notifiée." },
        { status: 502 }
      )
    }
    payload.logger.error(`[Chatbot] unexpected error: ${err}`)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
