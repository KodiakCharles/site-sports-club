// ============================================================
// Types globaux — Site Club Voile
// ============================================================

export type Locale = 'fr' | 'en' | 'es'

export type ClubPlan = 'starter' | 'pro' | 'premium'

export type SupportNautique =
  | 'optimist'
  | 'laser-ilca'
  | 'deriveur-420'
  | 'deriveur-470'
  | 'rs-feva'
  | 'catamaran'
  | 'planche-voile'
  | 'windsurf'
  | 'foil'
  | 'wing-foil'
  | 'voile-habitable'
  | 'croisiere'
  | 'kayak'
  | 'sup'
  | 'yole'
  | 'autre'

export type StageStatus = 'draft' | 'published' | 'full' | 'cancelled'

export type PostStatus = 'draft' | 'published'

export type PostCategory =
  | 'competition'
  | 'vie-du-club'
  | 'stages'
  | 'partenariat'
  | 'presse'
  | 'autre'

export type BookingProvider = 'yoplanning' | 'axyomes' | 'helloasso' | 'internal'

export type UserRole = 'super_admin' | 'club_admin' | 'editor' | 'contributor'

// ---- Météo Windguru ----
export interface WindguruData {
  windSpeed: number[]      // m/s
  windDirection: number[]  // degrés
  windGust: number[]
  wavHeight: number[]
  wavPeriod: number[]
  temperature: number[]
  hours: string[]
}

// ---- Instagram ----
export interface InstagramPost {
  id: string
  mediaUrl: string
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  caption?: string
  timestamp: string
  permalink: string
  thumbnailUrl?: string
}

// ---- Newsletter ----
export interface NewsletterSubscription {
  email: string
  firstName?: string
  clubId: string
  locale: Locale
}
