import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import Clubs from './src/collections/Clubs'
import Users from './src/collections/Users'
import Members from './src/collections/Members'
import Posts from './src/collections/Posts'
import Stages from './src/collections/Stages'
import Media from './src/collections/Media'
import Newsletters from './src/collections/Newsletters'
import KnowledgeBase from './src/collections/KnowledgeBase'
import ChatbotAlerts from './src/collections/ChatbotAlerts'
import OnboardingRequests from './src/collections/OnboardingRequests'
import ClubSettings from './src/globals/ClubSettings'
import PlatformSettings from './src/globals/PlatformSettings'
import { HomePage, ClubPage, ContactPage, TarifsPage, ActivitesPage, CompetitionPage, NousTrouverPage, MentionsLegalesPage, ConfidentialitePage } from './src/globals/Pages'
import PageBuilder from './src/globals/PageBuilder'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Postgres uniquement — Railway prod en dev ET en prod (workflow : `railway run npm run dev`).
// Pas de fallback SQLite, pas de BDD locale.
//
// Note : au build time (Next.js pre-render, collecte de page data), DATABASE_URL peut
// ne pas être injectée côté Railway. On utilise une URL placeholder pour que
// l'adapter soit construit, mais les pages sont force-dynamic et ne se connectent
// réellement qu'au runtime (où DATABASE_URL est bien présente).
const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://build-placeholder:build-placeholder@localhost:5432/build-placeholder'

if (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-console
  console.warn(
    "[payload] DATABASE_URL manquante. Utiliser `railway run npm run dev` ou définir la variable dans .env.local"
  )
}

// PUSH_SCHEMA contrôle si Payload modifie le schéma au boot.
// - Premier deploy d'un nouveau projet Railway : laisser push=true (1 fois) pour créer les tables.
// - Tous les deploys suivants : PUSH_SCHEMA=false en variable Railway → schéma figé,
//   les changements doivent passer par des migrations explicites (`npx payload migrate`).
// Default = false par sécurité (jamais de wipe involontaire).
const shouldPush = process.env.PUSH_SCHEMA === 'true'

const dbAdapter = postgresAdapter({
  pool: { connectionString },
  push: shouldPush,
})

export default buildConfig({
  admin: {
    user: Users.slug,
    theme: 'light',
    meta: {
      titleSuffix: '— VoilePulse Admin',
    },
    components: {
      // Enregistrés ici pour forcer l'inclusion dans l'importMap auto-généré
      afterDashboard: [
        '@/components/admin/Dashboard#Dashboard',
        '@/components/admin/SwitchClubButton#SwitchClubButton',
      ],
      afterNavLinks: ['@/components/admin/LogoutButton#LogoutButton'],
      providers: ['@/components/admin/AdminStyles#AdminStyles'],
      // ColorPickerField est auto-détecté via les champs des collections (admin.components.Field)
    },
  },
  collections: [Clubs, Users, Members, Posts, Stages, Media, Newsletters, KnowledgeBase, ChatbotAlerts, OnboardingRequests],
  globals: [ClubSettings, PlatformSettings, HomePage, ClubPage, ActivitesPage, TarifsPage, ContactPage, CompetitionPage, NousTrouverPage, MentionsLegalesPage, ConfidentialitePage, PageBuilder],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET ?? 'voileweb-dev-secret-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: dbAdapter,
  upload: {
    limits: {
      fileSize: 10000000, // 10MB
    },
  },
  localization: {
    locales: [
      { label: 'Français', code: 'fr' },
      { label: 'English', code: 'en' },
      { label: 'Español', code: 'es' },
    ],
    defaultLocale: 'fr',
    fallback: true,
  },
})
