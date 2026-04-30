/**
 * Chiffrement applicatif des champs sensibles (tokens API tiers, clés OAuth).
 *
 * Utilise AES-256-GCM avec une clé dérivée d'une env var `FIELD_ENCRYPTION_KEY`
 * (32 bytes hex, soit 64 caractères). Le format de stockage est :
 *
 *     enc:v1:<iv-base64>:<authtag-base64>:<ciphertext-base64>
 *
 * - Marqueur `enc:v1:` permet la migration en douceur (les valeurs déjà en
 *   clair en BDD sont retournées telles quelles tant qu'elles n'ont pas été
 *   ré-écrites par un super_admin).
 * - GCM fournit confidentialité ET intégrité (auth tag).
 * - Pas de clé partagée avec un tiers — clé locale Railway.
 *
 * Pour générer la clé :
 *   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 *
 * Définir ensuite `FIELD_ENCRYPTION_KEY=<64 chars hex>` dans Railway.
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12 // GCM recommande 12 bytes
const PREFIX = 'enc:v1:'

let cachedKey: Buffer | null = null

function getKey(): Buffer | null {
  if (cachedKey) return cachedKey
  const hex = process.env.FIELD_ENCRYPTION_KEY
  if (!hex) return null
  if (hex.length !== 64) {
    // eslint-disable-next-line no-console
    console.error('[fieldEncryption] FIELD_ENCRYPTION_KEY doit faire 64 caractères hex (32 bytes).')
    return null
  }
  try {
    cachedKey = Buffer.from(hex, 'hex')
    if (cachedKey.length !== 32) {
      cachedKey = null
      return null
    }
    return cachedKey
  } catch {
    return null
  }
}

export function isEncrypted(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith(PREFIX)
}

/**
 * Chiffre une chaîne. Si la clé n'est pas configurée OU si la valeur est déjà
 * chiffrée, retourne la valeur d'entrée inchangée. C'est intentionnel : on ne
 * veut pas perdre une donnée si l'opérateur a oublié de définir la clé en prod.
 * Dans ce cas, le warning console alerte au boot.
 */
export function encryptField(plaintext: string | null | undefined): string | null | undefined {
  if (plaintext == null || plaintext === '') return plaintext
  if (isEncrypted(plaintext)) return plaintext
  const key = getKey()
  if (!key) return plaintext

  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, key, iv)
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return `${PREFIX}${iv.toString('base64')}:${authTag.toString('base64')}:${ciphertext.toString('base64')}`
}

/**
 * Déchiffre. Si la valeur n'est pas au format chiffré, la retourne telle
 * quelle (compat ascendante avec les valeurs en clair pré-migration).
 */
export function decryptField(stored: string | null | undefined): string | null | undefined {
  if (stored == null || stored === '') return stored
  if (!isEncrypted(stored)) return stored
  const key = getKey()
  if (!key) return stored

  try {
    const parts = stored.slice(PREFIX.length).split(':')
    if (parts.length !== 3) return stored
    const [ivB64, tagB64, ctB64] = parts
    const iv = Buffer.from(ivB64, 'base64')
    const authTag = Buffer.from(tagB64, 'base64')
    const ciphertext = Buffer.from(ctB64, 'base64')
    const decipher = createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8')
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[fieldEncryption] decrypt failed:', err)
    return stored
  }
}
