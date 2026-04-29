# CLAUDE.md

Ce fichier fournit les instructions à Claude Code lors du travail sur ce dépôt.

## Vue d'ensemble du projet

**Web Pulse** — Marque mère SaaS multi-tenant **multi-sport** de sites internet pour clubs sportifs.
Trois déclinaisons produit en v0.2, partageant le même cluster :

| Déclinaison | Sport | Fédération | Champ `club.sport` |
|-------------|-------|-----------|--------------------|
| **Voile Pulse** | Voile | FFVoile | `voile` |
| **Rugby Pulse** | Rugby | FFR | `rugby` |
| **Pelote Pulse** | Pelote basque | FFPB | `pelote-basque` |

Le sport est fixé par le `super_admin` à la création du club. Il pilote : la marque affichée, le vocabulaire (« stages » vs « entraînements » vs « parties »), la liste des supports/disciplines, la fédération de référence, les catégories d'actualités, le system prompt du chatbot, et les modules disponibles (ex. météo marine uniquement pour voile).

Édité par **CGC SAS** (RCS Dax 983 956 525, TVA FR 22 983 956 525), Tarnos. Présidente : KODIAK SAS.

Stack : Next.js 15 (App Router) + Payload CMS v3 + PostgreSQL + Redis + Mailjet (emails) + Anthropic (chatbot).
Aucune BDD locale : tout passe par Postgres Railway prod.

### Self-onboarding & contrats de souscription

Workflow public sur la vitrine pour qu'un club souscrive en ligne sans intervention manuelle préalable.

#### Collection `OnboardingRequests` (`src/collections/OnboardingRequests.ts`)
Workflow `pending → validated → sent → signed` (ou `rejected`). Champs :
- Identité : `organizationName`, `legalForm` (`association_1901` / `club_sportif` / `sas` / `sarl` / `autre`), `siren`, `address`, `sport` (`voile` / `rugby` / `pelote-basque` / `autre`)
- Représentant : `representativeName`, `representativeRole`, `email`, `phone`
- Souscription : `plan` (`essentiel` 29€ / `pulse` 49€), `paymentMode` (`monthly` / `annual`), `discountPercent`, `discountNote`
- Workflow : `status`, `notesAdmin`, `rejectionReason`, `club` (relation FK renseignée à la signature)
- Métadonnées : `token` (UUID public), `ipAddress`, `cgvAccepted`, `validatedAt`, `sentAt`

Access : super_admin uniquement en lecture/édition/suppression. La création est ouverte (`create: () => true`) mais filtrée en pratique par la route API publique seule (l'admin UI ne propose pas de bouton "Créer" pour cette collection à l'utilisateur final puisqu'il n'a pas accès).

#### Page publique `/onboarding`
- `src/app/marketing/onboarding/page.tsx` — server component, lit `?plan=essentiel|pulse` pour pré-cocher
- `src/app/marketing/onboarding/OnboardingForm.tsx` — client, fetch POST `/api/marketing/onboarding`
- `src/app/marketing/onboarding/merci/[token]/page.tsx` — confirmation après soumission

Branchée sur les CTA "Choisir Essentiel" et "Choisir Pulse" du composant `Pricing.tsx` (`?plan=essentiel|pulse`). Le forfait "Sur mesure" reste sur `mailto:contact@web-pulse.fr` (devis manuel).

#### Route API `POST /api/marketing/onboarding`
- Honeypot `website`, `isValidOrigin(req)`, `rateLimit` 5 req / 10 min / IP
- Validation Zod stricte (côté serveur)
- Crée `OnboardingRequest` (status `pending`, `token` UUID)
- Envoie 2 emails Mailjet : notification super admin → `contact@web-pulse.fr` + accusé client à l'email saisi
- Renvoie `{ success: true, token }` ; le client redirige vers `/onboarding/merci/<token>`

#### Génération PDF du contrat (`src/lib/utils/contractPdf.ts`)
Utilise **pdfkit** (pure JS, pas de deps système). `renderContractPdf(req)` retourne un `Buffer` PDF :
- 12 articles, format A4, titres en orange Web Pulse (#F59E0B)
- Identité Éditeur : **CGC SAS** (RCS Dax 983 956 525, Tarnos), Présidente **KODIAK SAS** (RCS Dax 982 748 675), "représentée par son représentant légal en exercice"
- Identité Client : remplie depuis `OnboardingRequest`
- Cases formule (Essentiel/Pulse) et paiement (mensuel/annuel) cochées automatiquement
- Encadré tarif si `discountPercent > 0` ou `paymentMode === 'annual'`
- Coordonnées bancaires lues depuis le global Payload `platform-settings` (éditable via `/admin/globals/platform-settings`, super_admin only). Defaults pré-remplis avec le RIB Qonto de CGC. Placeholder `[À renseigner via /admin/globals/platform-settings]` si vide.
- Tableau de signatures à 2 colonnes (en-tête plein orange)
- Engagement annuel ferme dans tous les cas (Article 3) ; remise -10% si paiement annuel d'avance
- Article 4.5 (tokens IA) inclus uniquement pour la formule Pulse
- Juridiction : Tribunal de commerce de **Dax**

#### Route `GET /api/admin/onboarding/[id]/contract-pdf`
Super_admin uniquement (`payload.auth({ headers })` + check `role === 'super_admin'`). Retourne le PDF inline (`Content-Disposition: inline`).

### Vitrine vs tenants — routing par hostname

L'app sert deux types de contenus selon le `Host` HTTP, distingués par le middleware `src/middleware.ts` :

- **Vitrine commerciale (`web-pulse.fr`, `www.web-pulse.fr`)** : marque mère Web Pulse, landing, `/login`, `/cgv`, `/mentions-legales`, `/confidentialite`. Le middleware fait un rewrite `/X → /marketing/X` pour ces hostnames.
- **Tenants (tout autre hostname)** : site d'un club sportif, résolu via `resolveClubByDomain(host)` puis rendu par les routes `[locale]/*` (FR/EN/ES). Une entrée `clubs.domain` doit exister en BDD pour que le tenant soit reconnu.

La liste des hostnames vitrine est pilotée par la variable d'env **`MARKETING_DOMAINS`** (CSV). En dev local, on peut y ajouter `localhost` ou le hostname Railway pour tester la vitrine sans DNS prod.

Le dossier `src/app/marketing/` ne doit **jamais** être préfixé par `_` (sinon Next.js le considère comme un dossier privé et renvoie 404).

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

| Service | Clé de config | Usage |
|---------|---------------|-------|
| Mailjet | env `MAILJET_API_KEY` + `MAILJET_SECRET_KEY` | Emails transactionnels (contact, newsletters internes). Helper unique : `src/lib/utils/mailer.ts` (`sendMail`, `sendMailBatch`). |
| Anthropic Claude | env `ANTHROPIC_API_KEY` | Chatbot LLM (Haiku 4.5) avec contexte club + KB |
| Yoplanning | `integrations.yoplanningKey` (CMS) | Réservations stages |
| Axyomes | `integrations.axyomesKey` (CMS) | Alternative Yoplanning |
| HelloAsso | `integrations.helloassoUrl` (CMS) | Licences fédérales |
| Windguru | `integrations.windguruStationId` (CMS) | Météo marine (voile only) |
| GA4 | `integrations.ga4MeasurementId` (CMS) | Analytics |
| Google Maps | `integrations.googleMapsApiKey` (CMS) | Carte interactive |
| Instagram | `social.instagramToken` (CMS) | Flux photos live |

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
│   ├── marketing/          # Vitrine Web Pulse (FR uniquement, hostname-based)
│   │   ├── components/     # Header, Footer, Hero, ThreeSports, Pricing, CTA, LegalLayout
│   │   ├── login/          # /login super_admin (server + client component)
│   │   ├── cgv/            # CGV (page statique)
│   │   ├── mentions-legales/
│   │   ├── confidentialite/
│   │   ├── opengraph-image.tsx  # OG image dynamique 1200×630 (next/og)
│   │   ├── marketing.css
│   │   └── layout.tsx      # metadataBase=https://www.web-pulse.fr
│   ├── [locale]/           # Sites tenants (SSR multilingue FR/EN/ES)
│   ├── (payload)/admin/    # Back-office Payload CMS
│   └── api/
│       ├── marketing/      # Routes vitrine (login)
│       ├── admin/          # Routes super_admin (onboarding, switch-club, …)
│       └── …               # Routes publiques (contact, weather, chatbot, social)
├── components/             # Tenant-only (Header, Footer, sections, etc.)
├── lib/
│   ├── api/                # Clients API externes (Windguru, Instagram, Anthropic)
│   └── utils/              # tenant, redis, mailer, csrf, rateLimit, sportConfig
├── middleware.ts           # Routing hostname-aware (MARKETING_DOMAINS)
├── instrumentation.ts      # Sentry init
└── styles/                 # CSS global tenant
payload.config.ts           # À la racine — schéma Payload (Postgres adapter)
src/collections/            # Clubs, Users, Members, Posts, Stages, KB, ChatbotAlerts, OnboardingRequests
src/globals/                # ClubSettings, PlatformSettings (banque CGC, super_admin), HomePage, ClubPage, …, PageBuilder
scripts/                    # Outils ponctuels prod (inspect-db, clean-enums, etc.)
```

## Sécurité — règles obligatoires

### Anti-injection

- Toutes les entrées utilisateur sont validées avec **Zod** avant traitement
- Les paramètres de requête (URL, body, headers) ne sont jamais passés directement à une requête base de données
- Les champs texte sont sanitisés côté serveur (pas uniquement côté client)

### CSRF

- Vérification de l'`Origin` HTTP via `isValidOrigin(req)` dans tous les route handlers POST/PATCH/DELETE (`src/lib/utils/csrf.ts`)
- En dev (sans `Origin`), on laisse passer ; en prod, on bloque

### Authentification

- Auth Payload : cookie HttpOnly `payload-token` signé avec `PAYLOAD_SECRET` (≥ 32 chars)
- Mots de passe hashés par Payload (bcrypt)
- `/login` (vitrine) appelle `payload.login()` puis vérifie `role === 'super_admin'` avant de redirect vers `/admin`
- Rate limit : `rateLimit()` mémoire (5 req / 10 min / IP) sur `/api/contact`, `/api/marketing/login`

### Headers de sécurité (configurés dans `next.config.mjs`)

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

### Sur le hostname vitrine (`www.web-pulse.fr`)

```
/                                       Landing Web Pulse (hero, 3 sports, pricing, CTA)
/login                                  Connexion super_admin (form + server check)
/onboarding                             Formulaire public de souscription (Essentiel / Pulse, ?plan=…)
/onboarding/merci/<token>               Confirmation après soumission
/cgv                                    Conditions Générales de Vente
/mentions-legales                       Mentions légales (éditeur CGC)
/confidentialite                        Politique de confidentialité (RGPD)
/api/marketing/login                    POST {email, password} → cookie session + redirect /admin
/api/marketing/onboarding               POST formulaire souscription → email notif + redirect /merci
/api/admin/onboarding/[id]/contract-pdf GET PDF du contrat (super_admin uniquement)
/marketing/opengraph-image              Image OG 1200×630 dynamique
/admin                                  Back-office Payload CMS (auth requise)
```

### Sur un hostname de tenant (`<club-domain>`)

```
/                           Page d'accueil du club (locale par défaut : fr)
/[locale]/stages            Liste des stages
/[locale]/competition       Compétitions et résultats
/[locale]/actualites        Blog
/[locale]/tarifs            Tarifs et adhésion
/[locale]/espace-adherent   Espace privé membre
/[locale]/contact           Formulaire de contact
/[locale]/nous-trouver      Carte Google Maps
/api/social/instagram       Flux Instagram (GET)
/api/newsletter             Inscription newsletter (POST)
/api/contact                Formulaire de contact (POST → Mailjet)
/api/weather                Données Windguru (GET, cache 30min)
/api/chatbot                Chatbot LLM (POST, Claude Haiku + KB)
/api/admin/chatbot-alerts   Gestion alertes chatbot (super_admin/club_admin)
/api/admin/onboarding       POST création de club (super_admin only)
/api/admin/switch-club      Cookie contexte club (super_admin)
/api/health                 Healthcheck Railway (renvoie 200 même en degraded)
/sitemap.xml                Sitemap SEO dynamique
/robots.txt                 Robots SEO
```

## Production — Railway

Service déployé sur Railway (`projet web-pulse`, env `production`) :
- Service web `site-sports-club` (Next.js + Payload, healthcheck `/api/health`)
- Service `Postgres` (BDD prod, référencé via `${{Postgres.DATABASE_URL}}`)
- Service `Redis` (cache + rate limit, référencé via `${{Redis.REDIS_URL}}`)

Domaines actifs :
- `www.web-pulse.fr` → CNAME → cluster Railway (cert Railway auto)
- `web-pulse.fr` (apex) → A `51.91.236.255` (hébergement OVH Start gratuit) avec un `.htaccess` qui redirige 301 vers `https://www.web-pulse.fr/$1` + cert Let's Encrypt OVH
- `site-sports-club-production.up.railway.app` → URL technique Railway (n'est PAS dans `MARKETING_DOMAINS`, sert le flow tenant fallback)

Variables d'env Railway minimales :
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
PAYLOAD_SECRET=<64 chars hex>
MAILJET_API_KEY=<…>
MAILJET_SECRET_KEY=<…>
ANTHROPIC_API_KEY=sk-ant-<…>
EMAIL_FROM=contact@web-pulse.fr
NEWSLETTER_FROM_EMAIL=contact@web-pulse.fr
MARKETING_DOMAINS=web-pulse.fr,www.web-pulse.fr
PUSH_SCHEMA=false           # ne JAMAIS remettre à true sur deploy normal
# NE PAS définir NODE_ENV=production manuellement — ça fait skip les
# devDependencies au build (next, tailwind, etc.) et casse le build.
```

DNS chez OVH (zone DNS) :
- `www` CNAME → `<id>.up.railway.app.` + TXT `_railway-verify.www`
- `@` (apex) A `51.91.236.255`
- MX OVH (`mx0..mx3.mail.ovh.net`) pour la boîte mail `contact@web-pulse.fr`
- SPF unique : `v=spf1 include:spf.mailjet.com include:mx.ovh.com ~all`
- DKIM Mailjet (`mailjet._domainkey`) + DKIM OVH (`ovhmo-selector-1/2._domainkey`)
