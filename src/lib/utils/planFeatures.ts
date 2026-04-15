export type Plan = 'essentiel' | 'pulse' | 'surmesure'

export type PlanFeatures = {
  maxPages: number // -1 = unlimited
  pageBuilder: boolean
  seoAuto: boolean
  gallery: boolean
  memberSpace: boolean
  stagesManagement: boolean
  newsletter: boolean
  multilingual: boolean
  chatbot: boolean
  chatbotMode: 'standard' | 'expert'
  darkMode: boolean
  analyticsWidget: boolean // assistant IA du webmaster
  apiExternal: boolean
}

const PLAN_FEATURES: Record<Plan, PlanFeatures> = {
  essentiel: {
    // 49€ HT/mois — sans IA
    maxPages: -1,
    pageBuilder: true,
    seoAuto: false,
    gallery: true,
    memberSpace: true,
    stagesManagement: true,
    newsletter: true,
    multilingual: false,
    chatbot: false,
    chatbotMode: 'standard',
    darkMode: false,
    analyticsWidget: false,
    apiExternal: false,
  },
  pulse: {
    // 99€ HT/mois — toutes les fonctionnalités IA
    maxPages: -1,
    pageBuilder: true,
    seoAuto: true,
    gallery: true,
    memberSpace: true,
    stagesManagement: true,
    newsletter: true,
    multilingual: true,
    chatbot: true,
    chatbotMode: 'expert',
    darkMode: true,
    analyticsWidget: true,
    apiExternal: true,
  },
  surmesure: {
    // Sur devis — intégrations spécifiques (HelloAsso avancé, Yoplanning, Axyomes,
    // calendrier FFR/FFVoile/FFPB, billetterie, réservation fronton...)
    maxPages: -1,
    pageBuilder: true,
    seoAuto: true,
    gallery: true,
    memberSpace: true,
    stagesManagement: true,
    newsletter: true,
    multilingual: true,
    chatbot: true,
    chatbotMode: 'expert',
    darkMode: true,
    analyticsWidget: true,
    apiExternal: true,
  },
}

export function getPlanFeatures(plan: string): PlanFeatures {
  return PLAN_FEATURES[plan as Plan] || PLAN_FEATURES.essentiel
}

export function getPlanLabel(plan: string): string {
  const labels: Record<string, string> = {
    essentiel: 'Essentiel',
    pulse: 'Pulse',
    surmesure: 'Sur mesure',
  }
  return labels[plan] || plan
}

export function getPlanPrice(plan: string): string {
  const prices: Record<string, string> = {
    essentiel: '49€ HT/mois',
    pulse: '99€ HT/mois',
    surmesure: 'Sur devis',
  }
  return prices[plan] || '—'
}
