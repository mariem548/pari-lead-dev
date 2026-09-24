# Pari Lead Dev

En cette noble époque, où les chevaliers servent leur royaume et où l'honneur guide les plus braves, une idée des plus audacieuses naquit au sein de notre illustre compagnie.

Face aux retards légendaires de notre très honorable et suprême Lead Dev, une question demeurait sans réponse : à quelle heure daignera-t-il enfin franchir les portes du royaume ?

C'est ainsi que, dans un élan de solidarité sans pareil, notre valeureuse équipe décida de créer une application permettant à chacun de mettre à l'épreuve son sens de la prophétie et de parier sur l'heure d'arrivée de notre illustre seigneur technique.

Mais nul projet d'une telle envergure n'aurait pu voir le jour sans le dévouement d'une âme particulièrement noble, douce et généreuse : Mariem.

Telle une chevaleresse au service de son royaume, elle sacrifia de son précieux temps, brava les épreuves du développement et consacra ses talents à cette noble entreprise. Après moult efforts, quelques batailles avec le code et probablement quelques soupirs, elle nous livra une œuvre magnifique : l'application officielle des paris sur l'arrivée de notre Suprême Lead Dev.

Que les paris commencent.

Que les prophéties s'affrontent.

Et que le plus juste des chevaliers — ou le plus grand des devins — remporte la victoire.

---

## Comment utiliser le projet

### Prérequis

- Node.js 20 ou supérieur
- Un navigateur moderne

### Installation

```bash
git clone https://github.com/mariem548/pari-lead-dev.git
cd pari-lead-dev
npm install
```

### Lancer en local

```bash
npm run dev
```

L'app est accessible sur `http://localhost:5173`.

### Build de production

```bash
npm run build
```

Les fichiers compilés sont dans le dossier `dist/`.

---

## Comment jouer

1. Clique sur **"+ Nouveau pari"**
2. Choisis un nom (ex: "Arrivée du lead dev"), un type (**Heure** ou **Nombre**), puis crée
3. Chaque participant ajoute son prénom + son pronostic
4. Une fois le résultat connu, entre-le dans le champ "Heure d'arrivée réelle" et valide
5. L'app désigne le gagnant (le plus proche) et lui attribue un point
6. Le classement général s'accumule automatiquement

### Format des heures

| Saisie | Interprétation |
|--------|---------------|
| `9.3` | 9h30 |
| `9.30` | 9h30 |
| `9:30` | 9h30 |
| `9h30` | 9h30 |
| `10` | 10h00 |

### Filtres par période

- **Cette semaine** : paris du lundi au dimanche courant
- **Ce mois** : paris du mois en cours
- **Tout** : tous les paris (par défaut)

Le classement s'adapte au filtre choisi.

---

## Idées de paris

| Pari | Type | Exemple |
|------|------|---------|
| Heure d'arrivée du lead dev | Heure | 9.30 |
| Heure de départ du lead dev | Heure | 18.00 |
| Heure du premier commit du jour | Heure | 9.15 |
| Nombre de cafés bus dans la journée | Nombre | 4 |
| Nombre de PR mergées cette semaine | Nombre | 7 |
| Nombre de bugs en prod | Nombre | 2 |
| Lignes de code de la prochaine PR | Nombre | 342 |
| Température de la salle à 14h | Nombre | 21.5 |

---

## Mode partagé (Supabase)

Par défaut, l'app fonctionne en **mode local** : les données sont stockées dans le navigateur de chacun.

Pour que toute l'équipe voie les mêmes paris en temps réel, configure Supabase :

### 1. Créer un projet Supabase

Va sur [supabase.com](https://supabase.com), crée un compte et un nouveau projet.

### 2. Créer les tables

Dans **SQL Editor**, colle et exécute le contenu du fichier [`supabase.sql`](./supabase.sql).

### 3. Récupérer les clés

Dans **Project Settings > API**, copie :
- **Project URL** (ex: `https://xxxxx.supabase.co`)
- **anon public key**

### 4. Configurer les variables GitHub

Sur le repo GitHub, va dans **Settings > Secrets and variables > Actions > Variables** et ajoute :

| Variable | Valeur |
|----------|--------|
| `VITE_SUPABASE_URL` | Project URL |
| `VITE_SUPABASE_ANON_KEY` | anon public key |

Le prochain push sur `main` déploiera la version partagée. L'app bascule automatiquement en mode partagé et affiche "Paris d'équipe — partagé" dans l'en-tête.

---

## Déploiement

Le déploiement sur GitHub Pages est automatique via GitHub Actions à chaque push sur `main`.

Pour activer GitHub Pages : **Settings > Pages > Source: GitHub Actions**.

---

## Architecture

```
pari-lead-dev/
├── .github/workflows/
│   └── deploy.yml          # Workflow GitHub Actions (déploiement auto)
├── src/
│   ├── lib/
│   │   ├── supabase.js     # Client Supabase
│   │   └── api.js          # Couche de données (Supabase + localStorage)
│   ├── App.jsx             # Composant principal
│   ├── main.jsx            # Point d'entrée React
│   └── index.css           # Styles (design system, dark/light mode)
├── supabase.sql            # Schéma SQL pour Supabase
├── CHANGELOG.md            # Historique des versions
├── GUIDE-COMPLET.md        # Guide pas-à-pas avec tout le code
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
- Fonts : Cabinet Grotesk + Satoshi (Fontshare)
