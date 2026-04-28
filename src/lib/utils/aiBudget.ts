import { redis } from './redis'

// Budget mensuel en tokens (input + output) par club. Au-delà, le chatbot
// renvoie 503 jusqu'au prochain mois. À ajuster via env si besoin.
//
// Why: rate-limit IP n'est pas suffisant — un attaquant qui tourne sur 100 IPs
// peut faire ~$11k/jour de coût Anthropic sans cap mensuel par club.
const DEFAULT_MONTHLY_TOKEN_BUDGET = Number(
  process.env.CHATBOT_MONTHLY_TOKEN_BUDGET ?? 1_000_000,
)

// TTL = 35 jours, suffit à couvrir la fin du mois en cours puis expirer
// peu après le début du suivant. Une nouvelle clé est créée à chaque mois.
const COUNTER_TTL_SECONDS = 35 * 24 * 60 * 60

function monthKey(clubId: string | number, now = new Date()): string {
  const ym = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`
  return `chatbot:cost:${clubId}:${ym}`
}

export type BudgetStatus = {
  ok: boolean
  used: number
  limit: number
}

export async function getBudgetStatus(clubId: string | number): Promise<BudgetStatus> {
  const key = monthKey(clubId)
  const raw = await redis.get(key)
  const used = raw ? Number(raw) : 0
  return { ok: used < DEFAULT_MONTHLY_TOKEN_BUDGET, used, limit: DEFAULT_MONTHLY_TOKEN_BUDGET }
}

/**
 * Ajoute des tokens consommés au compteur mensuel du club.
 * Best-effort : si Redis échoue, on n'incrémente pas (mais le check
 * pré-appel a déjà autorisé la requête).
 */
export async function incrementBudget(
  clubId: string | number,
  tokens: number,
): Promise<void> {
  if (tokens <= 0) return
  const key = monthKey(clubId)
  try {
    const current = Number((await redis.get(key)) ?? 0)
    await redis.setex(key, COUNTER_TTL_SECONDS, String(current + tokens))
  } catch {
    // silent — pas de blocage de l'API si Redis indispo
  }
}
