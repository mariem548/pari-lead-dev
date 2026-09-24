# Changelog

Tous les changements notables de ce projet sont documentés ici.

Le format suit [Conventional Commits](https://www.conventionalcommits.org/).

---

## [3.3.0] - 2026-09-25

### Added
- Calcul du retard du Lead Dev a partir de 9h35 (heure officielle de debut)
- `computeDelayMinutes` et `formatDelay` dans api.js
- Affichage du retard a cote de l'heure d'arrivee dans les resultats
- Regles du jeu mentionnent le calcul de retard a partir de 9h35

## [3.2.0] - 2026-09-25

### Added
- Code du Royaume : modal des règles du jeu complète (but, comment jouer, score, titres, royaume, parchemin, banquet)
- Bouton 📜 dans le header pour consulter les règles à tout moment
- Tableau des titres de noblesse avec paliers de score
- Rappel du Parchemin Royal mensuel dans les règles
- CSS dédié pour les règles (sections, tableaux, listes)

## [3.1.0] - 2026-09-25

### Changed
- Suppression du choix "heure/nombre" : tous les paris sont maintenant sur l'heure d'arrivée
- Saisie simplifiée : format direct (9.30, 9:30, 10h00), plus de sélecteur de type
- Profil (avatar + pseudo) toujours utilisé depuis l'onboarding, plus de saisie manuelle
- Labels et placeholders simplifiés ("Heure d'arrivée" partout)

## [3.0.0] - 2026-09-25

### Added — 12 nouvelles fonctionnalités médiévales
- Titres de noblesse automatiques selon le score (Vilain → Souverain)
- Trophées drôles (Pile à l'heure, Prophète du café, etc.)
- Coffre aux exploits avec trophées débloquables/verrouillés
- Quêtes quotidiennes (Oracle précis, Double couronne)
- Punchlines royales aléatoires à la clôture des paris
- Calendrier des retards avec code couleur
- Tournoi mensuel avec podium et champion
- Parchemin partageable (copie pour Slack/Teams)
- Animation banquet (trompettes) à l'ouverture du Parchemin Royal
- Joutes entre les 2 meilleurs joueurs
- Météo du royaume dynamique selon l'heure d'arrivée
- Animations d'entrée par avatar (fumée magique, flèche, galop, couronne)

### Removed
- Animation du chevalier sur son cheval (supprimée par demande utilisateur)

## [2.6.0] - 2026-09-25

### Added
- Carte du royaume agrandie (320px de haut, avatars plus grands)
- Badge de notification sur le Parchemin Royal quand le rapport mensuel est prêt
- Animation pulse sur le badge pour attirer l'attention

## [2.5.0] - 2026-09-25

### Added
- Onglet "Royaume" : carte visuelle des joueurs avançant vers le château GIT
- Survol d'un joueur : affiche prénom + points
- Leaderboard fusionné avec la carte du royaume (médieval)
- Onglets de navigation : ⚔️ Salle des paris / 👑 Royaume
- Onboarding obligatoire : choix avatar+nom puis lecture popup histoire
- Bouton "Changer de profil" dans le header

### Changed
- Onboarding non contournable (pas de fermeture sans choix)
- Landing directe sur l'onglet "paris" après onboarding

## [2.4.0] - 2026-09-25

### Added
- Logo redessiné : château médiéval avec tours, toits coniques rouges, texte GIT sur la muraille
- Chevalier à cheval avec couronne, cape et lance dans le logo
- Flux obligatoire : choix avatar+nom puis lecture de la popup d'histoire
- Bouton "Changer de profil" dans le header avec avatar et nom affichés

### Changed
- Palette du logo : moutarde, rouge, anthracite, or
- Favicon mis à jour pour correspondre au nouveau logo

## [2.3.0] - 2026-09-25

### Added
- Parchemin Royal du mois : récap mensuel avec arrivée la plus tardive/tôt, Grand Oracle, prédiction la plus précise
- Bouton "Parchemin Royal du Mois" dans la section classement

### Changed
- Logo redessiné : gardien aux épées croisées protégeant le château GIT
- Favicon mis à jour pour correspondre au nouveau logo
- "Distribution" renommé en "Carte des prédictions" (thème médiéval)

## [2.2.0] - 2026-09-25

### Added
- Onboarding au premier lancement : choix du nom + avatar parmi 12 personnages médiévaux
- Animation chevalier à cheval qui traverse l'écran toutes les 20 secondes

### Removed
- Section commentaires/chat des paris (supprimée)

## [2.0.0] - 2026-09-24

### Added
- Confettis médiévaux : animation de chute d'emojis (⚔️🏹🛡️👑🏰) à la fermeture d'un pari
- Animation de flèche : arc 🏹 qui tire une flèche ➤ vers la cible 🎯
- Effets sonores (Web Audio API) : son de pari, son de victoire, son de fermeture
- Notifications toast : messages en bas d'écran pour pari ajouté et victoire

## [1.9.0] - 2026-09-24

### Added
- Profils joueurs cliquables : cliquez sur un nom dans le classement pour voir ses stats
- Hall of Fame : les 5 meilleures prédictions de l'histoire avec écart
- Stats détaillées : points, victoires, défaites, win rate, séries
- Bouton Hall of Fame dans la section classement

### Added
- Série de victoires : affichage des streaks dans le classement (ex: 🔥 3)
- Badge animé pour les joueurs en série
- Suivi des séries courantes et meilleures séries
- `computeHallOfFame` ajouté à l'API pour les futures fonctionnalités

### Changed
- Logo personnalisé SVG : chevalier protégeant un royaume avec "GIT" inscrit sur le château
- Favicon mis à jour avec le même design

### Fixed
- Renommage Myriam en Mariem dans la popup et le README

### Added
- Graphique de distribution des paris : visualise où tout le monde a parié avec des barres
- Les barres dorées indiquent les gagnants
- Affichage du résultat réel (cible 🎯)

### Added
- Commentaires sur chaque pari : chat léger pour se moquer / encourager
- Table `comments` dans Supabase avec realtime
- Système de commentaires avec avatar, nom, message
- Plier/déplier la section commentaires

### Added
- Avatars médiévaux : chaque joueur choisit un avatar (chevalier, archer, mage, roi, etc.)
- Les avatars s'affichent à côté des prénoms dans les paris et le classement
- 12 avatars disponibles avec sélecteur visuel
- Colonne `avatar` dans la table Supabase `bets`

### Removed
- Nettoyage des restes du système de mot de passe (RPC, table app_config)

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
