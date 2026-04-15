# SportsPulse — TODOS

> Source : revue CEO `/plan-ceo-review` du 2026-04-15 sur la refonte multi-sport + chatbot LLM.
> Mode revue : HOLD SCOPE. Contexte : PMF voile pas encore validé (zéro client payant).

---

## P1 — Bloquant avant un client payant

### P1-A · Observability chatbot LLM

**Pourquoi** : la feature chatbot est mise en avant dans les 3 pitches comme différenciateur. Aucune métrique aujourd'hui → on ne sait pas si elle fonctionne, combien elle coûte (tokens Anthropic), si les admins répondent aux alertes.

**Quoi** :
1. Collection `chatbot-usage` (multi-tenant) : un document par appel chatbot avec `clubId`, `inputTokens`, `outputTokens`, `alertCreated`, `kbEntriesUsed`, `responseTimeMs`, `createdAt`.
2. Vue admin `/admin/collections/chatbot-usage` (groupée par jour/mois/club) — agrégats : nombre de questions, % d'alertes créées, coût estimé tokens.
3. Sentry ou équivalent pour exception tracking sur les routes `/api/chatbot` et `/api/admin/chatbot-alerts/*`.

**Effort** : ~3-4h human / ~30 min CC. **Priorité** : P1.

### P1-B · Migration Postgres Railway pour `Club.sport`

**Pourquoi** : SQLite dev pousse le schema en auto-accept. Postgres prod nécessite une migration explicite. Le champ `sport` est obligatoire (defaultValue `voile`) — le rollout sur un cluster avec un club voile existant doit être testé.

**Quoi** :
1. Générer la migration Payload pour le nouveau champ `sport` + nouveaux modules (`moduleEquipmentRental`, `moduleBooking`).
2. Tester la migration sur une copie de la prod.
3. Vérifier que les clubs existants sans `sport` se voient assigner `voile` correctement.
4. Ajouter `ANTHROPIC_API_KEY` aux variables d'env Railway.

**Effort** : ~2h human / ~30 min CC. **Priorité** : P1.

### P1-C · Tests chatbot LLM + collections KB/alerts + régression Stages.support

**Pourquoi** : la feature payante mise en avant dans les 3 pitches n'a aucune couverture test. Risque régression silencieuse à chaque évolution Anthropic SDK ou collection. Hook Stages.support ajouté par `/plan-eng-review` protège contre créations cross-sport mais n'est pas testé.

**Quoi** :
1. Test unitaire `getSportConfig()` : null → voile ; invalid → voile ; 3 sports retournent bon cfg.
2. Test unitaire `buildSystemPrompt(sport, context)` : vérifie vocabulaire/fédération par sport (FFVoile/régate/navigateur ; FFR/entraînement/joueur ; FFPB/partie/pelotari).
3. Test unitaire `buildClubContext` mocké avec Payload stub : vérifie que la KB est bien injectée, ordre des sections.
4. **CRITICAL — Test régression hook `Stages.support.beforeValidate`** : (a) voile + optimist → OK ; (b) rugby + optimist → throw ; (c) pelote + main-nue → OK ; (d) rugby + ecole-rugby → OK ; (e) club sport absent → laisse passer.
5. Test E2E API `/api/chatbot` avec mock Anthropic : (a) réponse normale, (b) tool `create_alert` déclenché → alerte créée en DB + fallback_reply retourné, (c) clé manquante → 503, (d) chatbotEnabled=false → reply disabled.
6. Test du hook `ChatbotAlerts.afterChange` : status answered + addToKB=true + answer → KB créée ; status answered + addToKB=false → pas de KB ; re-save already-answered → pas de duplicate.
7. Test isolation multi-tenant API admin : club_admin rugby tente de répondre alerte d'un club voile → 403.
8. Eval suite chatbot (optionnel v2) : 20 questions par sport, assertions sur vouvoiement FR, absence d'invention, déclenchement `create_alert` quand info absente.

**Effort** : ~6-8h human / ~1h CC. **Priorité** : P1. Items 1-4 sont les plus critiques (bug fix + regression).

### P1-D · Pages publiques sport-aware (compléter)

**Pourquoi** : `/stages` et `/competition` sont sport-aware (fait dans cette session). Les pages restantes (`/`, `/le-club`, `/activites`, `/tarifs`, `/actualites`, `/contact`, `/nous-trouver`, `/espace-adherent`) restent voile-only dans les copies/labels.

**Quoi** : passer chaque page (~8 pages) avec le pattern `getClubData() → sport → labels conditionnels`. Le chatbot widget aussi (titre "Assistant" générique).

**Effort** : ~2-3h human / ~20 min CC. **Priorité** : P1 pour rugby/pelote, P2 pour voile (pas régression).

---

## P2 — Bloquant avant scaling commercial

### P2-A · Silent failures du chatbot et hook KB

**Pourquoi** : si la création d'alerte échoue après que le LLM a consommé des tokens, l'utilisateur reçoit le `fallback_reply` mais aucun signal n'est tracé. Idem pour le hook `afterChange` qui crée la KB : si ça échoue, l'alerte est marquée `answered` mais la KB n'a rien.

**Quoi** :
1. Compteur `failed_alert_creation` en métrique (lié à P1-A).
2. Retry simple (1 tentative) avant log + alerte ops.
3. Dans le hook KB : si la création échoue, retomber le statut de l'alerte à `pending` au lieu de la laisser `answered` faussement.

**Effort** : ~1-2h. **Priorité** : P2.

### P2-B · Clubs omnisports

**Pourquoi** : modèle `Club.sport` mono-valeur exclut les clubs omnisports (ex : sections voile + pelote dans une même asso, courant Sud-Ouest FR). Ce sont des prospects intéressants — un site, plusieurs sports.

**Quoi** : transformer `Club.sport` en `Club.sports[]` (relation array). Chaque page consomme le sport "actif" via routing : `/voile/stages`, `/rugby/matchs`, etc. Ou interface menu sport-switcher.

**Effort** : refonte modèle data + routing — **L** (~2 jours human / ~3-4h CC). **Priorité** : P2 (à valider avec un prospect réel).

### P2-C · Pre-seed KB par sport

**Pourquoi** : nouveau club onboardé = KB vide → chatbot crée des alertes à 80% des questions → admin submergé pendant 3 mois. Mauvaise expérience produit cold-start.

**Quoi** : KB par défaut pré-remplie au moment de l'onboarding (~30 entrées par sport). L'admin peut ensuite éditer/supprimer. Source : extraire les questions classiques de chaque fédération + FAQ génériques (inscription, certif, tarifs, sécurité…).

**Effort** : ~3-4h pour rédiger les 90 entrées + adapter le seed. **Priorité** : P2.

### P2-D · Fallback chatbot quand KB > 100 entrées

**Pourquoi** : avec 200 entrées KB × 200 chars + posts + stages, le system prompt approche 50 KB. Coûts input tokens élevés à chaque appel, latence plus grande.

**Quoi** : pré-filtrer la KB côté serveur par mots-clés (matching simple sur la question utilisateur) avant injection dans le prompt. Limite à 30 entrées les plus pertinentes.

**Effort** : ~2h. **Priorité** : P2 quand un club aura > 100 entrées KB.

---

## P3 — Améliorations et features Roadmap

### P3-A · Implémenter ce que les pitches promettent (Roadmap)

Les pitches rugby et pelote ont été ajustés (cette session) pour exposer une section "Roadmap" listant les features non livrées. Les implémenter dans cet ordre, en fonction des demandes clients :

**Pelote basque** :
- Réservation de fronton en ligne (créneaux 24/7) — collection `Booking` + UI client + admin
- Billetterie galas (intégration HelloAsso ou Stripe Connect)
- Location de matériel avec disponibilité temps réel

**Rugby** :
- Calendrier matchs + feuilles de match + convocations — collection `Match` + workflow
- Classement de poule auto (parsing résultats officiels FFR si API publique)
- Statistiques joueurs (essais, cartons, temps de jeu)

**Voile** :
- Yoplanning / Axyomes integrations (au-delà du lien externe HelloAsso)
- Génération d'articles via IA (assistant rédaction)
- Alt text auto images (accessibilité)
- Calendrier régates FFVoile (sous réserve d'accord Bureau Exécutif FFVoile)

**Effort** : 3-5 jours par feature. **Priorité** : P3 (driven par demande client).

### P3-B · Validation client réel

**Pourquoi** : les seeds rugby (Racing Club du Béarn, US Bayonne-Anglet) et pelote (Pelotaris Gazteak, Hegoaldea CP) sont des **clubs fictifs**. Aucun prospect réel n'a été interviewé sur ces 2 sports. Risque produit-market fit.

**Quoi** :
1. Identifier 3 clubs rugby amateur du Sud-Ouest qui ont besoin d'un site refait → demo + interview.
2. Identifier 3 clubs pelote (FFPB) qui galèrent avec leur site WordPress → demo + interview.
3. Idem voile : démarrer la chasse au design partner FFVoile.

**Effort** : non-tech. **Priorité** : critique GTM.

### P3-C · Différenciation vs Clubeo

**Pourquoi** : Clubeo (clubeo.com) couvre déjà tous les sports amateur en France depuis 10 ans. Tarifs ~10 €/mois. Notre positionnement "L'Équipage 49 €/mois" doit justifier le 5x premium.

**Différenciateurs candidats** : design moderne, chatbot IA (réel), SEO meilleur, multilingue, Lexical editor riche. **À tester** : ces différentiateurs valent-ils 5x pour un président de club bénévole ?

**Effort** : analyse comparative + tests utilisateurs. **Priorité** : P3 mais critique stratégique.

### P3-D · Renommer le repo GitHub

`site-voile-club.git` → `site-sports-club.git` côté GitHub (settings du repo). Le rename local est fait, le remote pas encore. **Effort** : 5 min.

---

## Liste rapide d'autres dettes notées

- Headers HTTP sécurité (next.config) — non configurés
- DELETE /api/members/me (suppression RGPD) — non implémenté
- Service Worker / manifest PWA complet — partiel
- WeatherWidget Windguru codé mais pas wired dans la home (orphelin)
- Chatbot widget UI client (`ChatbotWidget.tsx` existe, à connecter et styler)
- Mailchimp newsletter (annoncé en pitch, seul Brevo implémenté)
- 2 tests sécurité qui timeout (cf STATUS.md) — assertions trop strictes à corriger

---

**Dernière revue CEO** : 2026-04-15 (HOLD SCOPE).
**Prochaine revue conseillée** : après P1 résolus + 1er client réel.
