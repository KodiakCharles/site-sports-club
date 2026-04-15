# Architecture — Site Club Voile (VoilePulse)

## Vue d'ensemble

```
Client (navigateur)
        │
        ▼
  Cloudflare CDN ──── assets statiques (cache)
        │
        ▼
  Traefik (reverse proxy)
        │ résolution du domaine → club
        ▼
  Next.js App (cluster unique)
        │
   ┌────┴────┐
   │         │
Payload CMS  │    Redis (cache, sessions)
(back-office)│
   │         │
   └────┬────┘
        │
   PostgreSQL
        │
   S3 (médias)
```

## Multi-tenant

- **Un cluster** Next.js sert tous les clubs
- La résolution du tenant se fait via le **hostname** de la requête HTTP
- La correspondance `domain → club_id` est mise en cache Redis (TTL 1h)
- Les données sont isolées par `club_id` dans toutes les collections Payload
- Les médias sont isolés dans des préfixes S3 distincts (`/clubs/{club_id}/`)

## Flux d'une requête

1. Visiteur accède à `yacht-club-carnac.fr`
2. Cloudflare CDN → si en cache, servir directement
3. Traefik → forward vers le cluster Next.js
4. `middleware.ts` → résolution locale + gestion de la langue (next-intl)
5. `[locale]/layout.tsx` → `resolveClub(hostname)` → lookup Redis/PostgreSQL
6. Server Component → fetch des données Payload pour ce `club_id`
7. Rendu HTML → réponse au client

## Collections Payload CMS

| Collection | Description |
|-----------|-------------|
| `clubs` | Configuration de chaque club (tenant) |
| `stages` | Stages et cours par club |
| `posts` | Articles de blog par club |
| `members` | Adhérents avec espace privé |
| `media` | Médias uploadés (stockage S3) |
| `users` | Utilisateurs back-office (admins, éditeurs) |
| `boats` | Bateaux disponibles à la location [OPTION] |
| `gallery-albums` | Albums photos et vidéos |
| `partners` | Partenaires et sponsors |
| `races` | Régates et résultats (si pas API FFVoile) |

## APIs intégrées

| API | Accès | Usage |
|-----|-------|-------|
| FFVoile API | Token (accord Bureau Exécutif) | Calendrier + résultats régates |
| Instagram Graph | OAuth par club | Flux photos en temps réel |
| Facebook Page Plugin | Embed officiel | Page Facebook du club |
| Google Maps JavaScript | Clé API | Carte interactive |
| Windguru | iframe embed | Météo marine |
| Yoplanning | Clé API par club | Réservations stages |
| Axyomes | Clé API par club | Alternative Yoplanning |
| HelloAsso | URL par association | Licences FFVoile |
| Stripe Connect | Compte par club | Paiements location bateaux |
| Resend / Brevo | Clé API globale | Emails transactionnels |
| DeepL | Clé API optionnelle | Traduction automatique |

## Internationalisation

- `next-intl` pour FR / EN / ES
- Fichiers de traduction dans `/messages/{locale}.json`
- Contenu CMS multilingue via champ `localized: true` dans Payload
- Fallback vers FR si traduction manquante
- URLs : `/` (FR, défaut), `/en/`, `/es/`

## SEO

- Rendu SSR/SSG via Next.js App Router
- Sitemap XML : `/sitemap.xml` (généré dynamiquement)
- Schema.org : `SportsClub`, `LocalBusiness`, `Event`, `BlogPosting`
- OpenGraph + Twitter Card sur chaque page
- Balises `hreflang` pour multilingue
- Score Lighthouse cible : > 90 mobile et desktop
