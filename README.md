# Pari Lead Dev

Petite app React pour parier sur l'heure d'arrivée du lead dev (ou n'importe quoi d'autre) en equipe.

## Fonctionnement

1. Ceez un pari (heure ou nombre)
2. Chaque participant ajoute son pronostic
3. Une fois le resultat connu, entrez-le et l'app designe le gagnant (le plus proche)
4. Les points s'accumulent dans le classement general

## Format des heures

- `9.30` = 9h30
- `9.3` = 9h30
- `9:30` = 9h30
- `9h30` = 9h30
- `10` = 10h00

## Developpement

```bash
npm install
npm run dev
```

## Deploiement

Le deploiement sur GitHub Pages est automatique via GitHub Actions quand on push sur `main`.
Pensez a activer GitHub Pages dans Settings > Pages (source: GitHub Actions).

## Tech

- React + Vite
- Donnees stockees en localStorage
- Pas de backend, 100% statique
