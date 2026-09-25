# Pari Lead Dev

En cette noble époque, où les chevaliers servent leur royaume et où l'honneur guide les plus braves, une idée des plus audacieuses naquit au sein de notre illustre compagnie.

Face aux retards légendaires de notre très honorable et suprême Lead Dev, une question demeurait sans réponse : à quelle heure daignera-t-il enfin franchir les portes du royaume ?

C'est ainsi que, dans un élan de solidarité sans pareil, notre valeureuse équipe décida de créer une application permettant à chacun de mettre à l'épreuve son sens de la prophétie et de parier sur l'heure d'arrivée de notre illustre seigneur technique.

Mais nul projet d'une telle envergure n'aurait pu voir le jour sans le dévouement d'une âme particulièrement noble, douce et généreuse : Mariem.

Telle une chevaleresse au service de son royaume, elle sacrifia de son précieux temps, brava les épreuves du développement et consacra ses talents à cette noble entreprise. Après moult efforts, quelques batailles avec le code et probablement quelques soupirs, elle nous livra une œuvre magnifique : l'application officielle des paris sur l'arrivée de notre Suprême Lead Dev.

Que les paris commencent.

Que les prophéties s'affrontent.

Et que le plus juste des chevaliers — ou le plus grand des devins — remporte la victoire.

## Guide royal de l'utilisateur

Noble voyageur, si tu viens d'arriver dans ce royaume, voici comment utiliser l'application étape par étape.

### Étape 1 — Choisir son identité

Au premier lancement, l'application te demande de choisir ton avatar et ton pseudo. Choisis-les avec soin, car ils te suivront tout au long de ton aventure. Tu ne pourras pas les changer sans recommencer ton périple. Le bouton "Changer de profil" dans l'en-tête te permet de les modifier si besoin.

### Étape 2 — Lire le README royal

Avant de pénétrer dans le royaume, tu dois lire ce guide. C'est obligatoire. Personne n'entre dans le château sans connaître les lois.

### Étape 3 — Lire les règles du jeu

Après le README, les règles du jeu s'affichent. Elles expliquent le score, les titres de noblesse, et le fonctionnement du royaume. Là aussi, la lecture est obligatoire.

### Étape 4 — Créer un pari

Une fois dans l'application, clique sur "+ Nouveau pari". Donne-lui un nom (par exemple "Arrivée du Lead Dev"). Le pari est maintenant ouvert.

### Étape 5 — Parier une heure

Saisis l'heure à laquelle tu penses que le Lead Dev arrivera. L'application accepte plusieurs formats :

| Saisie | Interprétation |
|---|---|
| 9.3 | 9h30 |
| 9.30 | 9h30 |
| 9:30 | 9h30 |
| 9h30 | 9h30 |
| 10 | 10h00 |

Ton profil (avatar + pseudo) est automatiquement utilisé. Tu n'as rien d'autre à saisir.

### Étape 6 — Clôturer le pari

Quand le Lead Dev arrive, saisis l'heure réelle dans le champ "Heure d'arrivée réelle" et valide. L'application calcule automatiquement le gagnant (celui qui est le plus proche) et lui attribue un point.

## Prérequis techniques

- Node.js 20 ou supérieur
- Un navigateur moderne

## Installation

```bash
git clone https://github.com/mariem548/pari-lead-dev.git
cd pari-lead-dev
npm install
```

## Lancer en local

```bash
npm run dev
```

L'app est accessible sur http://localhost:5173.

## Build de production

```bash
npm run build
```

Les fichiers compilés sont dans le dossier dist/.

## Mode partagé (Supabase)

Par défaut, l'app fonctionne en mode local : les données sont stockées dans le navigateur de chacun.

Pour que toute l'équipe voie les mêmes paris en temps réel, configure Supabase :

### 1. Créer un projet Supabase

Va sur supabase.com, crée un compte et un nouveau projet.

### 2. Créer les tables

Dans SQL Editor, colle et exécute le contenu du fichier supabase.sql.

### 3. Récupérer les clés

Dans Project Settings > API, copie :

- Project URL (ex: https://xxxxx.supabase.co)
- anon public key

### 4. Configurer les variables GitHub

Sur le repo GitHub, va dans Settings > Secrets and variables > Actions > Variables et ajoute :

| Variable | Valeur |
|---|---|
| VITE_SUPABASE_URL | Project URL |
| VITE_SUPABASE_ANON_KEY | anon public key |

Le prochain push sur main déploiera la version partagée.

## Déploiement

Le déploiement sur GitHub Pages est automatique via GitHub Actions à chaque push sur main.

## Architecture

```
pari-lead-dev/
├── src/
│   ├── lib/
│   │   ├── supabase.js     # Client Supabase
│   │   └── api.js          # Couche de données
│   ├── App.jsx             # Composant principal
│   ├── main.jsx            # Point d'entrée React
│   └── index.css           # Styles
├── supabase.sql            # Schéma SQL
├── CHANGELOG.md            # Historique des versions
├── index.html              # HTML entry
├── vite.config.js          # Configuration Vite
└── package.json
```

## Stack technique

- React 18 + Vite 5
- Supabase (base de données + temps réel)
- localStorage (fallback hors ligne)
- GitHub Actions (déploiement continu)
- CSS custom (design system, mode sombre/clair)
- Fonts : Cinzel, MedievalSharp (Google Fonts)
