# SportsPulse — État du projet

> Dernière mise à jour : 2026-04-15 — **Refonte multi-sport v0.2** : VoilePulse + RugbyPulse + PelotePulse ; sport choisi à l'onboarding ; seed clubs Rugby & Pelote

---

## Stack technique

- **Next.js 15** (App Router, SSR) + **Payload CMS v3** + **SQLite** (→ PostgreSQL en prod)
- **Redis** (cache tenant + rate limiting) — requis, doit tourner localement
- **Resend** (envoi emails) — `RESEND_API_KEY` requis
- **next-intl** (FR / EN / ES)

---

## Variables d'environnement nécessaires

```bash
PAYLOAD_SECRET=...                      # JWT Payload (32+ chars) — OBLIGATOIRE
DATABASE_URI=file:./payload.db          # SQLite dev, postgres:// en prod
REDIS_URL=redis://localhost:6379        # Requis (pas de fallback actuellement)
RESEND_API_KEY=re_...                   # Envoi emails
EMAIL_FROM=noreply@voileweb.fr
NEWSLETTER_FROM_EMAIL=newsletter@voileweb.fr
DEV_CLUB_DOMAIN=clubvoile-pau.fr        # Dev uniquement — force un club par domaine
ANTHROPIC_API_KEY=sk-ant-...            # Chatbot LLM (Claude Haiku 4.5) — requis
```

---

## Back-office Payload (`/admin`)

### Rôles
| Rôle | Périmètre |
|------|-----------|
| `super_admin` | Tous les clubs, toutes les collections |
| `club_admin` | Son club uniquement (filtre automatique) |
| `editor` | Articles + stages de son club |
| `contributor` | Brouillons articles uniquement |

### Collections
| Collection | Slug | État | Notes |
|------------|------|------|-------|
| Clubs | `clubs` | ✅ complet | Modules, intégrations, couleurs, SwitchClubButton |
| Utilisateurs | `users` | ✅ complet | Auth Payload, rôles |
| Adhérents | `members` | ✅ complet | Auth Payload, profil, adhésion, opt-in newsletter |
| Articles | `posts` | ✅ complet | Brouillon/publié, versioning, catégories |
| Stages | `stages` | ✅ complet | 8 supports, niveaux, places, réservation |
| Newsletters | `newsletters` | ✅ complet | Draft/sent, envoi via Resend |
| Médias | `media` | ✅ complet | Upload 10 MB |
| Knowledge Base | `knowledge-base` | ✅ complet | Q/R alimentant le chatbot LLM, multi-tenant |
| Alertes chatbot | `chatbot-alerts` | ✅ complet | Questions non résolues, réponse admin → KB via hook |

### Multi-sport — `club.sport`
| Sport | Marque | Fédération | Seed demo |
|-------|--------|-----------|-----------|
| Voile (`voile`) | VoilePulse | FFVoile | Club de Voile du Lac (localhost) |
| Rugby (`rugby`) | RugbyPulse | FFR | Racing Club du Béarn (rc-bearn.fr), Union Sportive Bayonne-Anglet (us-bayonne-anglet.fr) |
| Pelote basque (`pelote-basque`) | PelotePulse | FFPB | Pelotaris Gazteak (pelotaris-gazteak.fr), Hegoaldea Cesta Punta (hegoaldea-cp.fr) |

Sport piloté par `club.sport` — module `src/lib/utils/sportConfig.ts`. Fixé à l'onboarding, détermine brand, vocabulaire, supports, système de couleurs par défaut, modules disponibles, system prompt du chatbot.

### Globals (pages configurables)
| Global | État | Notes |
|--------|------|-------|
| Paramètres club (`club-settings`) | ✅ | Identité, couleurs, contact, GPS, modules, labels FFVoile |
| Page d'accueil (`home-page`) | ✅ | Textes hero, activation météo/carte |
| Page Le Club (`club-page`) | ✅ | Histoire (richText), équipe, partenaires |
| Page Contact (`contact-page`) | ✅ | Titre, email destinataire |

---

## Site public

### Pages
| Page | URL | État | Bloquant |
|------|-----|------|----------|
| Accueil | `/` | ✅ connecté CMS | Stages réels, textes depuis ClubSettings |
| Stages | `/stages` | ✅ connecté CMS | Données Payload, lien réservation réel |
| Actualités | `/actualites` | ✅ connecté CMS | Articles publiés, date, catégorie |
| Article | `/actualites/[slug]` | ✅ connecté CMS | notFound() si absent, articles récents sidebar |
| Compétition | `/competition` | ⚠️ squelette seul | — |
| Activités | `/activites` | ⚠️ squelette seul | — |
| Le Club | `/le-club` | ⚠️ statique | À connecter au CMS |
| Tarifs | `/tarifs` | ⚠️ squelette seul | — |
| Contact | `/contact` | ✅ fonctionnel | — |
| Espace adhérent | `/espace-adherent` | ✅ login + profil | Lecture seule (pas de modif profil) |
| Nous trouver | `/nous-trouver` | ⚠️ placeholder | Carte Google Maps à intégrer |
| Mentions légales | `/mentions-legales` | ✅ statique | — |
| Confidentialité | `/confidentialite` | ✅ statique | — |

### Layout
| Élément | État | Notes |
|---------|------|-------|
| Header | ✅ | Logo, nav, sélecteur langue |
| Footer | ✅ | Infos club, réseaux sociaux |
| Bottom Nav (mobile/PWA) | ✅ | 5 onglets, détection page active |
| Internationalisation FR/EN/ES | ✅ | `localeDetection: false` |
| Couleurs dynamiques par club | ⚠️ | Champs définis en CMS, non injectés en CSS |
| Color picker admin | ✅ | Palette nautique 20 couleurs + picker natif + extraction depuis logo |
| Auto-save clubs | ✅ | Sauvegarde automatique brouillon toutes les 3s |

---

## APIs

### Publiques
| Endpoint | État | Notes |
|----------|------|-------|
| `POST /api/contact` | ✅ | Zod, CSRF, rate limit, Resend, honeypot |
| `POST /api/newsletter` | ✅ | Inscription Brevo, rate limit |
| `GET /api/social/instagram` | ⚠️ | Présent, non vérifié |

### Admin
| Endpoint | État | Notes |
|----------|------|-------|
| `POST /api/admin/switch-club` | ✅ | Cookie contexte club pour super_admin |
| `POST /api/admin/newsletters/[id]/send` | ✅ | Auth Payload, batch 50, Resend, màj statut |
| `GET /api/admin/chatbot-alerts` | ✅ | Liste alertes chatbot par statut (filtrée par club) |
| `POST /api/admin/chatbot-alerts/[id]/answer` | ✅ | Admin répond → alimente KB via hook |

---

## Intégrations tierces
| Service | État | Notes |
|---------|------|-------|
| Resend (emails) | ✅ | Contact + newsletters internes |
| Brevo (newsletter ext.) | ✅ | Inscriptions publiques via API key du club |
| Redis | ✅ | Cache tenant + rate limiting — fallback mémoire si Redis absent |
| **Claude LLM (Haiku 4.5)** | ✅ | Chatbot `/api/chatbot` avec contexte club + KB + tool `create_alert`, prompt caching |
| Windguru (météo) | ⚠️ | Client prêt, widget non intégré dans les pages |
| Google Maps | ✅ | Intégré sur `/nous-trouver` |
| Google Analytics GA4 | 🔲 | ID en CMS, aucun composant côté client |
| HelloAsso | 🔲 | URL en CMS, lien externe seulement |
| Yoplanning / Axyomes | 🔲 | Clé en CMS, aucune intégration |
| Instagram (flux photos) | ✅ | Token en CMS, grille 3×3, route /api/social/instagram |
| Facebook (flux posts) | ✅ | PageId + token en CMS, route /api/social/facebook, cache 15min |
| X / Twitter (flux tweets) | ✅ | Handle + bearer token en CMS, route /api/social/twitter, cache 15min |

> **FFVoile (calendrier régates)** : retiré du projet. La page `/competition` reste statique, pas de client API.

---

## Sécurité
| Mesure | État |
|--------|------|
| Validation Zod (toutes entrées API) | ✅ |
| Protection CSRF (vérification origin) | ✅ |
| Rate limiting par IP | ✅ (en mémoire) |
| Honeypot anti-spam | ✅ |
| Isolation multi-tenant (filtre `club`) | ✅ |
| Auth JWT Payload | ✅ |
| Headers HTTP sécurité | 🔲 (non configurés dans next.config) |
| Suppression RGPD (`DELETE /api/members/me`) | 🔲 non implémenté |

---

## Hors scope / limitations connues
- Paiement en ligne : les stages redirigent vers une URL externe (HelloAsso, etc.)
- Modification de profil depuis l'espace adhérent : lecture seule
- Email HTML riche pour newsletters : le richText Payload n'est pas converti → template fixe
- PWA complète : pas de `manifest.json` ni de Service Worker
- Multi-tenant par sous-domaine partagé (`club1.voileweb.fr`) : nécessite un DNS wildcard

---

## Priorités
| Priorité | Tâche | Difficulté |
|----------|-------|------------|
| ✅ | Connecter pages au CMS (accueil, stages, actus) | Moyenne |
| ✅ | Fallback si Redis absent (dev sans Docker) | Faible |
| ✅ | Convertir richText Lexical → HTML (articles) | Moyenne |
| 🟠 | Convertir richText Lexical → HTML email (newsletters) | Moyenne |
| 🟠 | Widget météo Windguru | Faible |
| 🟠 | Carte Google Maps sur `/nous-trouver` | Faible |
| 🟠 | Couleurs dynamiques du club injectées en CSS | Moyenne |
| 🟡 | Bouton "Envoyer" newsletter dans l'admin Payload | Faible |
| 🟡 | Modification de profil membre (espace adhérent) | Moyenne |
| 🟡 | Headers HTTP sécurité (next.config) | Faible |
| 🟢 | Suppression RGPD membre | Moyenne |
| 🟢 | Intégration API FFVoile (accord préalable) | Forte |
| 🟢 | GA4, manifest PWA, Service Worker | Moyenne |
