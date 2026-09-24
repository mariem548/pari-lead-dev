# Changelog

Tous les changements notables de ce projet sont documentés ici.

Le format suit [Conventional Commits](https://www.conventionalcommits.org/).

---

## [Unreleased]

### Added
- Mot de passe d'équipe pour protéger les écritures (créer/modifier/supprimer)
- Fonction RPC `verify_team_password` côté Supabase (hash bcrypt)
- Bouton verrouiller/déverrouiller dans le header
- Pop-up de connexion avec mot de passe
- Colonne `created_by` pour tracer qui a fait quel pari
- Table `app_config` sécurisée (RLS bloque l'accès direct)

### Fixed
- Les nouveaux paris ne s'affichaient pas en mode partagé (Supabase) — mise à jour de l'état local systématique après chaque action

---

## [1.4.0] - 2026-09-24

### Added
- Thème médiéval : parchemin, or, bordures décoratives, police Cinzel + MedievalSharp
- Icônes médiévales (🛡️ bouclier, ⚔ épées, 🏹 arc) dans le header et les titres
- Badges de classement style médailles (or, argent, bronze) avec dégradés et bordures
- Texture parchemin sur les cards et la pop-up
- Logo bouclier doré avec dégradé
- Bouton primaire avec dégradé et bordure

### Fixed
- Les nouveaux paris n'apparaissaient pas en mode partagé (Supabase) — l'état local n'était mis à jour qu'en mode localStorage
- Toutes les actions (createRound, addBet, closeRound, etc.) mettent maintenant à jour l'UI immédiatement, même en mode Supabase

---

## [1.3.0] - 2026-09-24

### Added
- Intégration Supabase avec synchronisation en temps réel
- Mode local (localStorage) en fallback automatique si Supabase n'est pas configuré
- Bannière de statut indiquant le mode actuel (partagé ou local)
- Souscriptions temps réel sur les tables `rounds` et `bets`
- Fichier `supabase.sql` avec le schéma complet et les politiques RLS
- Variables d'environnement `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans le workflow GitHub Actions

### Fixed
- Espacement insuffisant entre le formulaire de nouveau pari et les boutons de filtre

---

## [1.2.0] - 2026-09-24

### Added
- Filtres par période : Cette semaine / Ce mois / Tout
- Date de création affichée sur chaque pari (ex: "jeu 24 sep")
- Classement filtrable selon la période sélectionnée
- État vide quand aucun pari ne correspond à la période choisie

---

## [1.1.0] - 2026-09-24

### Added
- Déploiement automatique sur GitHub Pages via GitHub Actions

---

## [1.0.0] - 2026-09-24

### Added
- Application de paris d'équipe sur l'arrivée du lead dev
- Deux types de paris : Heure et Nombre
- Format d'heure flexible : 9.3 = 9h30, 9:30 = 9h30, 9h30 = 9h30
- Ajout de participants avec leur pronostic
- Calcul automatique du gagnant (le plus proche du résultat réel)
- Gestion des égalités (points partagés)
- Classement général avec scores cumulés
- Mode sombre / mode clair avec bascule manuelle
- Design responsive (mobile et desktop)
- Persistance des données en localStorage
