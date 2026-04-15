# CLAUDE.md

Ce fichier fournit les instructions à Claude Code lors du travail sur ce dépôt.

## Vue d'ensemble du projet

**SportsPulse** — Solution SaaS multi-tenant **multi-sport** de sites internet pour clubs sportifs. Trois déclinaisons livrées en v0.2 :

| Déclinaison | Sport | Fédération | Champ `club.sport` |
|-------------|-------|-----------|--------------------|
| **VoilePulse** | Voile | FFVoile | `voile` |
| **RugbyPulse** | Rugby | FFR | `rugby` |
| **PelotePulse** | Pelote basque | FFPB | `pelote-basque` |

Le sport est fixé par le `super_admin` à l'onboarding du club. Il pilote : la marque affichée, le vocabulaire (« stages » vs « entraînements » vs « parties »), la liste des supports/disciplines, la fédération de référence, les catégories d'actualités, le system prompt du chatbot, et les modules disponibles (ex. météo marine uniquement pour voile).

Stack : Next.js 15 (App Router) + Payload CMS v3 + SQLite (→ PostgreSQL en prod) + Redis.

### Architecture multi-tenant

Chaque club est un **tenant** identifié par son domaine. Un seul cluster Next.js sert tous les clubs.

- La résolution du tenant se fait via le hostname HTTP → `src/lib/utils/tenant.ts`
- Toutes les collections Payload ont un champ `club` (relation FK obligatoire)
- **Règle obligatoire** : toute requête Payload doit filtrer par `club: { equals: clubId }` — jamais de requête cross-tenant
- Les médias sont isolés dans S3 sous le préfixe `/clubs/{clubId}/`
- Le cache Redis utilise des clés préfixées par `tenant:{domain}:*`

### Thème graphique par tenant

Chaque `Club` a ses propres `primaryColor` et `secondaryColor` (codes hex). Le layout injecte des variables CSS `--color-primary` et `--color-secondary` dans `<head>` selon le tenant résolu. Le fichier `globals.css` utilise ces variables — pas de couleurs hardcodées dans les composants.

### Rôles utilisateurs

| Rôle | Accès |
|------|-------|
| `super_admin` | Tous les clubs (console multi-tenant `/admin`) |
| `club_admin` | Back-office complet de son club |
| `editor` | Publication blog, galeries, résultats |
| `contributor` | Création de brouillons uniquement |

Décorateurs/middleware à utiliser :
- `resolveClub()` — obligatoire dans tous les layouts et route handlers
- Vérification du rôle via `req.user?.role` dans les handlers Payload

### Modules optionnels

Chaque club active/désactive ses modules dans `club.modules.*`. Avant d'afficher un module, toujours vérifier `club.modules.{module} === true`.

| Module | Champ | Sports applicables |
|--------|-------|--------------------|
| Météo marine (Windguru) | `modules.weatherWidget` | voile |
| Location de bateaux | `modules.boatRental` | voile |
| Location matériel | `modules.equipmentRental` | rugby, pelote-basque |
| Espace adhérent | `modules.memberSpace` | tous |
| Multilingue EN+ES | `modules.multilingual` | tous |
| Billetterie / réservation frontons | `modules.booking` | pelote-basque |

Les modules non applicables au sport choisi sont masqués dans l'UI d'onboarding.

### Intégrations tierces

| Service | Clé de config dans le CMS | Usage |
|---------|--------------------------|-------|
| Yoplanning | `integrations.yoplanningKey` | Réservations stages |
| Axyomes | `integrations.axyomesKey` | Alternative Yoplanning |
| HelloAsso | `integrations.helloassoUrl` | Licences FFVoile |
| Windguru | `integrations.windguruStationId` | Météo marine |
| GA4 | `integrations.ga4MeasurementId` | Analytics |
| Google Maps | `integrations.googleMapsApiKey` | Carte interactive |
| Instagram | `social.instagramToken` | Flux photos live |
| Newsletter | `integrations.newsletterApiKey` + `newsletterListId` | Brevo/Mailchimp |

## Commandes courantes

> **Pas de BDD locale.** L'app utilise uniquement le Postgres Railway (prod), même en dev.
> Le workflow recommandé : `railway run npm run dev` qui injecte `DATABASE_URL` automatiquement.
> Schéma figé : `PUSH_SCHEMA=true` uniquement au 1er déploiement, puis `false` pour ne jamais
> wiper la BDD prod sur les commits suivants.

```bash
# Développement local — connecté à la BDD Railway prod
railway run npm run dev     # Postgres prod + Redis prod injectés via Railway CLI
# OU sans Railway CLI : copier DATABASE_URL + REDIS_URL depuis dashboard dans .env.local

# Base de données
npm run db:migrate          # Applique les migrations Payload
npm run db:seed             # Injecte des données de test

# Tests
npm run test                # Tous les tests
npm run test:unit           # Tests unitaires (Vitest)
npm run test:e2e            # Tests end-to-end (Playwright)
npm run test:security       # Tests de sécurité (npm audit + custom)

# Qualité
npm run lint                # ESLint
npm run type-check          # TypeScript strict
```

## Architecture des fichiers

```
src/
├── app/
│   ├── [locale]/           # Routes publiques (SSR/SSG, multilingue)
│   ├── admin/              # Back-office Payload CMS
│   └── api/                # Route handlers (contact, newsletter, social, etc.)
├── components/
│   ├── layout/             # Header, Footer (data-fetching côté serveur)
│   ├── sections/           # Blocs de page (Hero, SocialWall, etc.)
│   ├── forms/              # Formulaires (contact, newsletter, inscription)
│   └── ui/                 # Composants atomiques (Button, Card, etc.)
├── lib/
│   ├── api/                # Clients API externes (FFVoile, Windguru, Instagram)
│   └── utils/              # Utilitaires (tenant, redis, slug, etc.)
├── types/                  # Types TypeScript globaux
└── styles/                 # CSS global (variables, layout, composants)
payload/
└── collections/            # Schémas de données Payload CMS
tests/
├── unit/                   # Tests unitaires (Vitest)
├── e2e/                    # Tests end-to-end (Playwright)
└── security/               # Tests de sécurité
```

## Sécurité — règles obligatoires

### Anti-injection

- Toutes les entrées utilisateur sont validées avec **Zod** avant traitement
- Les paramètres de requête (URL, body, headers) ne sont jamais passés directement à une requête base de données
- Les champs texte sont sanitisés côté serveur (pas uniquement côté client)

### CSRF

- Tous les formulaires POST incluent un token CSRF (géré par Next.js via `next-auth`)
- Les route handlers vérifient l'origine avec `req.headers.get('origin')`

### Authentification

- Sessions JWT signées avec `NEXTAUTH_SECRET` (minimum 32 caractères)
- Mots de passe hashés avec bcrypt (cost factor 12)
- Pas de données sensibles dans les tokens JWT (pas de mot de passe, pas de token tiers)

### Headers de sécurité (configurés dans `next.config.ts`)

```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(self)
```

### Isolation des tenants

- **Ne jamais** effectuer une requête Payload sans filtre `association: clubId`
- Les fichiers S3 sont accessibles uniquement via des URLs signées générées côté serveur
- Le cookie de session ne contient pas le `clubId` (résolution toujours par hostname)

### Variables d'environnement

- **Ne jamais** committer `.env.local` ou `.env`
- Les secrets tiers (tokens OAuth, clés API) sont stockés chiffrés en base (chiffrement Fernet recommandé)
- Toutes les variables sont typées et validées via `@t3-oss/env-nextjs`

## Tests

### Tests unitaires (Vitest)

```bash
npm run test:unit
```

Couvrent : résolution du tenant, clients API (FFVoile, Windguru, Instagram), utilitaires (slug, validation, cache), logique des collections Payload.

### Tests end-to-end (Playwright)

```bash
npm run test:e2e
```

Couvrent : onboarding wizard, publication d'un stage, inscription adhérent, formulaire de contact, navigation multilingue, affichage météo, flux Instagram.

### Tests de sécurité

```bash
npm run test:security
```

Couvrent :
- `npm audit` — vérification des dépendances avec CVE connues
- Tests d'injection (XSS, injection SQL via Payload, CSRF)
- Vérification de l'isolation multi-tenant (accès cross-club)
- Vérification des headers de sécurité HTTP
- Vérification que les routes admin nécessitent une authentification

### Hook pre-commit

`.git/hooks/pre-commit` — bloque le commit si `lint`, `type-check` ou les tests unitaires échouent.

```bash
chmod +x .git/hooks/pre-commit
```

## RGPD

- Le bandeau de consentement cookies est obligatoire (intégration Tarteaucitron ou Axeptio)
- Les logs d'accès ne doivent pas contenir d'IPs complètes (anonymisation)
- Les emails transactionnels doivent inclure un lien de désinscription
- Le droit à l'effacement est implémenté dans l'espace adhérent (`DELETE /api/members/me`)

## URLs importantes

```
/                           Page d'accueil du club (locale par défaut : fr)
/[locale]/stages            Liste des stages
/[locale]/competition       Compétitions et résultats
/[locale]/actualites        Blog
/[locale]/tarifs            Tarifs et adhésion
/[locale]/espace-adherent   Espace privé membre
/[locale]/contact           Formulaire de contact
/[locale]/nous-trouver      Carte Google Maps
/admin                      Back-office Payload CMS
/api/social/instagram       Flux Instagram (GET)
/api/newsletter             Inscription newsletter (POST)
/api/contact                Formulaire de contact (POST)
/api/weather                Données Windguru (GET, cache 30min)
/api/chatbot                Chatbot LLM (POST, Claude Haiku + knowledge base)
/api/admin/chatbot-alerts   Gestion alertes chatbot (admin)
/sitemap.xml                Sitemap SEO dynamique
/robots.txt                 Robots SEO
```
