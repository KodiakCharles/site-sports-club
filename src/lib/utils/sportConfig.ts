/**
 * Configuration centrale multi-sport.
 * Toute logique dépendante du sport du club passe par ce module.
 */

export type Sport = 'voile' | 'rugby' | 'pelote-basque'

export interface SportConfig {
  id: Sport
  brand: string             // Ex: "VoilePulse"
  label: string             // Ex: "Voile"
  emoji: string
  federation: {
    short: string           // Ex: "FFVoile"
    long: string            // Ex: "Fédération Française de Voile"
    site: string            // URL publique fédération
    licenseLabel: string    // Ex: "Licence FFVoile"
  }
  /** Libellé pour l'activité principale (pluriel) */
  activityLabel: string     // "stages" | "entraînements" | "parties"
  activityLabelSingular: string
  /** Supports / disciplines disponibles */
  supports: { value: string; label: string }[]
  /** Catégories d'articles adaptées au sport */
  postCategories: { value: string; label: string }[]
  /** Couleurs de marque par défaut */
  defaultPrimaryColor: string
  defaultSecondaryColor: string
  /** Modules pertinents pour ce sport */
  availableModules: Array<
    'weatherWidget' | 'boatRental' | 'equipmentRental' | 'memberSpace' | 'multilingual' | 'booking'
  >
  /** Vocabulaire pour le chatbot et l'UI */
  vocabulary: {
    venue: string           // "base nautique" | "stade" | "fronton"
    venuePlural: string
    session: string         // Ex: "sortie" | "entraînement" | "partie"
    sessionPlural: string
    competition: string     // Ex: "régate" | "match" | "partie de championnat"
    competitionPlural: string
    member: string          // Ex: "navigateur" | "joueur" | "pelotari"
    memberPlural: string
  }
  /** Mentions légales sécurité spécifiques au sport */
  safetyNote: string
}

export const SPORTS: Record<Sport, SportConfig> = {
  voile: {
    id: 'voile',
    brand: 'VoilePulse',
    label: 'Voile',
    emoji: '⛵',
    federation: {
      short: 'FFVoile',
      long: 'Fédération Française de Voile',
      site: 'https://www.ffvoile.fr',
      licenseLabel: 'Licence FFVoile',
    },
    activityLabel: 'stages',
    activityLabelSingular: 'stage',
    supports: [
      { value: 'optimist', label: 'Optimist' },
      { value: 'laser', label: 'Laser ILCA' },
      { value: 'catamaran', label: 'Catamaran' },
      { value: 'planche', label: 'Planche à voile' },
      { value: 'habitable', label: 'Habitable / croisière' },
      { value: 'windfoil', label: 'Windfoil' },
      { value: 'wingfoil', label: 'Wingfoil' },
      { value: 'paddle', label: 'Paddle' },
    ],
    postCategories: [
      { value: 'competition', label: 'Compétition' },
      { value: 'stages', label: 'Stages' },
      { value: 'vie-du-club', label: 'Vie du club' },
      { value: 'distinctions', label: 'Distinctions' },
      { value: 'partenariat', label: 'Partenariat' },
    ],
    defaultPrimaryColor: '#1d6fa4',
    defaultSecondaryColor: '#2eb8e6',
    availableModules: ['weatherWidget', 'boatRental', 'memberSpace', 'multilingual'],
    vocabulary: {
      venue: 'base nautique',
      venuePlural: 'bases nautiques',
      session: 'sortie',
      sessionPlural: 'sorties',
      competition: 'régate',
      competitionPlural: 'régates',
      member: 'navigateur',
      memberPlural: 'navigateurs',
    },
    safetyNote: 'Savoir nager 25 m et s\'immerger obligatoire. Gilet de sauvetage fourni.',
  },

  rugby: {
    id: 'rugby',
    brand: 'RugbyPulse',
    label: 'Rugby',
    emoji: '🏉',
    federation: {
      short: 'FFR',
      long: 'Fédération Française de Rugby',
      site: 'https://www.ffr.fr',
      licenseLabel: 'Licence FFR',
    },
    activityLabel: 'entraînements',
    activityLabelSingular: 'entraînement',
    supports: [
      { value: 'ecole-rugby', label: 'École de rugby (U6 → U14)' },
      { value: 'cadets', label: 'Cadets (U16)' },
      { value: 'juniors', label: 'Juniors (U19)' },
      { value: 'seniors-m', label: 'Seniors masculins' },
      { value: 'seniors-f', label: 'Seniors féminines' },
      { value: 'loisir', label: 'Rugby loisir' },
      { value: 'rugby-a-7', label: 'Rugby à 7' },
      { value: 'rugby-a-xiii', label: 'Rugby à XIII' },
    ],
    postCategories: [
      { value: 'match', label: 'Match / Résultat' },
      { value: 'ecole-rugby', label: 'École de rugby' },
      { value: 'vie-du-club', label: 'Vie du club' },
      { value: 'distinctions', label: 'Distinctions' },
      { value: 'partenariat', label: 'Partenariat' },
    ],
    defaultPrimaryColor: '#0b4d2c',
    defaultSecondaryColor: '#d4a017',
    availableModules: ['equipmentRental', 'memberSpace', 'multilingual'],
    vocabulary: {
      venue: 'stade',
      venuePlural: 'stades',
      session: 'entraînement',
      sessionPlural: 'entraînements',
      competition: 'match',
      competitionPlural: 'matchs',
      member: 'joueur',
      memberPlural: 'joueurs',
    },
    safetyNote:
      'Certificat médical de non-contre-indication à la pratique du rugby en compétition obligatoire. Protections (protège-dents, casque facultatif) recommandées.',
  },

  'pelote-basque': {
    id: 'pelote-basque',
    brand: 'PelotePulse',
    label: 'Pelote basque',
    emoji: '🤾',
    federation: {
      short: 'FFPB',
      long: 'Fédération Française de Pelote Basque',
      site: 'https://www.ffpb.net',
      licenseLabel: 'Licence FFPB',
    },
    activityLabel: 'parties',
    activityLabelSingular: 'partie',
    supports: [
      { value: 'main-nue', label: 'Main nue' },
      { value: 'paleta-gomme', label: 'Paleta gomme' },
      { value: 'paleta-cuir', label: 'Paleta cuir' },
      { value: 'chistera', label: 'Chistera (grand gant)' },
      { value: 'pala', label: 'Pala' },
      { value: 'xare', label: 'Xare' },
      { value: 'cesta-punta', label: 'Cesta punta' },
      { value: 'frontenis', label: 'Frontenis' },
    ],
    postCategories: [
      { value: 'partie', label: 'Partie / Résultat' },
      { value: 'championnat', label: 'Championnat' },
      { value: 'vie-du-club', label: 'Vie du club' },
      { value: 'distinctions', label: 'Distinctions' },
      { value: 'partenariat', label: 'Partenariat' },
    ],
    defaultPrimaryColor: '#c8102e',
    defaultSecondaryColor: '#006341',
    availableModules: ['equipmentRental', 'memberSpace', 'booking', 'multilingual'],
    vocabulary: {
      venue: 'fronton',
      venuePlural: 'frontons',
      session: 'partie',
      sessionPlural: 'parties',
      competition: 'partie de championnat',
      competitionPlural: 'parties de championnat',
      member: 'pelotari',
      memberPlural: 'pelotaris',
    },
    safetyNote:
      'Certificat médical de non-contre-indication à la pratique en compétition obligatoire. Lunettes de protection recommandées (chistera, cesta punta, pala).',
  },
}

export const DEFAULT_SPORT: Sport = 'voile'

export function getSportConfig(sport: Sport | string | null | undefined): SportConfig {
  if (sport && sport in SPORTS) return SPORTS[sport as Sport]
  return SPORTS[DEFAULT_SPORT]
}

export function sportOptions(): { value: Sport; label: string }[] {
  return (Object.keys(SPORTS) as Sport[]).map((s) => ({
    value: s,
    label: `${SPORTS[s].emoji}  ${SPORTS[s].label}`,
  }))
}
