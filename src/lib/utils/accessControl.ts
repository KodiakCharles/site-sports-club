/**
 * Extrait l'ID du club depuis un champ de relation potentiellement peuplé.
 * Dans Payload v3, req.user.club peut être un objet { id, name, ... } ou un simple ID.
 */
export function clubId(club: unknown): string | number | null {
  if (!club) return null
  if (typeof club === 'object' && club !== null && 'id' in club) {
    return (club as { id: string | number }).id
  }
  return club as string | number
}
