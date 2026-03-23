import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import Users from './src/collections/Users'
import Posts from './src/collections/Posts'
import Stages from './src/collections/Stages'
import Media from './src/collections/Media'
import ClubSettings from './src/globals/ClubSettings'
import { HomePage, ClubPage, ContactPage } from './src/globals/Pages'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— VoileWeb Admin',
    },
  },
  collections: [Users, Posts, Stages, Media],
  globals: [ClubSettings, HomePage, ClubPage, ContactPage],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET ?? 'voileweb-dev-secret-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI ?? `file:${path.resolve(dirname, 'payload.db')}`,
    },
  }),
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
