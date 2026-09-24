# Pari Lead Dev — Guide complet

## Étape 1 : Créer le projet

```bash
npm create vite@latest pari-lead-dev -- --template react
cd pari-lead-dev
npm install
```

---

## Étape 2 : Fichier `package.json`

Remplace le contenu par :

```json
{
  "name": "pari-lead-dev",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "vite build && gh-pages -d dist"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "gh-pages": "^6.1.1",
    "vite": "^5.4.0"
  }
}
```

Puis :

```bash
npm install
```

---

## Étape 3 : Fichier `vite.config.js`

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
})
```

---

## Étape 4 : Fichier `index.html`

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Parez sur l'heure d'arrivée du lead dev et autres paris d'équipe" />
    <title>Pari Lead Dev — Paris d'équipe</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎯</text></svg>" />
    <link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@500,700&f[]=satoshi@400,500,700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## Étape 5 : Fichier `src/main.jsx`

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## Étape 6 : Fichier `src/index.css`

```css
/* === Design Tokens === */
:root {
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.35vw, 1rem);
  --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.75vw, 1.5rem);
  --text-xl: clamp(1.5rem, 1.2rem + 1.25vw, 2.25rem);

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;

  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  --transition-interactive: 180ms cubic-bezier(0.16, 1, 0.3, 1);

  --font-display: 'Cabinet Grotesk', 'Inter', sans-serif;
  --font-body: 'Satoshi', 'Inter', system-ui, sans-serif;
}

/* Light mode — warm cream + amber */
:root,
[data-theme='light'] {
  --color-bg: #faf7f2;
  --color-surface: #ffffff;
  --color-surface-2: #f5f1eb;
  --color-surface-offset: #efe9e1;
  --color-border: #e0d8cc;
  --color-divider: #e8e2d8;
  --color-text: #2d2419;
  --color-text-muted: #7d7363;
  --color-text-faint: #b8ad9e;
  --color-primary: #c2601e;
  --color-primary-hover: #a04e16;
  --color-primary-active: #7a3c10;
  --color-primary-highlight: #fce8d5;
  --color-success: #437a22;
  --color-success-highlight: #e0ecd5;
  --color-gold: #d19900;
  --color-gold-highlight: #fff4d6;
  --color-error: #c12c2c;
  --color-error-highlight: #fde0e0;
  --shadow-sm: 0 1px 2px rgba(45, 36, 25, 0.06);
  --shadow-md: 0 4px 12px rgba(45, 36, 25, 0.08);
  --shadow-lg: 0 12px 32px rgba(45, 36, 25, 0.12);
}

/* Dark mode */
[data-theme='dark'] {
  --color-bg: #1a1714;
  --color-surface: #221e1a;
  --color-surface-2: #2a2520;
  --color-surface-offset: #2e2823;
  --color-border: #3d3630;
  --color-divider: #332e28;
  --color-text: #e8e0d4;
  --color-text-muted: #9a9084;
  --color-text-faint: #6b6358;
  --color-primary: #e89540;
  --color-primary-hover: #f0a85c;
  --color-primary-active: #d4822a;
  --color-primary-highlight: #3d2e1e;
  --color-success: #7bc043;
  --color-success-highlight: #2a3a1e;
  --color-gold: #e8af34;
  --color-gold-highlight: #3d321e;
  --color-error: #e85c5c;
  --color-error-highlight: #3d1e1e;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.4);
}

/* === Base === */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  scroll-behavior: smooth;
}

body {
  min-height: 100dvh;
  line-height: 1.6;
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-text);
  background-color: var(--color-bg);
}

h1, h2, h3, h4 {
  font-family: var(--font-display);
  line-height: 1.2;
  text-wrap: balance;
}

button {
  cursor: pointer;
  font-family: var(--font-body);
  border: none;
  transition: all var(--transition-interactive);
}

input, select {
  font-family: var(--font-body);
  font-size: var(--text-sm);
}

a, button, input, select {
  transition: color var(--transition-interactive), background var(--transition-interactive), border-color var(--transition-interactive), box-shadow var(--transition-interactive);
}

:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* === Layout === */
.app {
  max-width: 760px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-4) var(--space-12);
}

@media (min-width: 640px) {
  .app {
    padding: var(--space-10) var(--space-6) var(--space-16);
  }
}

/* === Header === */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-8);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.logo {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  border-radius: var(--radius-lg);
  font-size: 1.4rem;
  flex-shrink: 0;
}

.header h1 {
  font-size: var(--text-lg);
  font-weight: 700;
}

.header p {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin: 0;
}

.theme-toggle {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.theme-toggle:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* === Buttons === */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
  white-space: nowrap;
}

.btn-primary {
  background: var(--color-primary);
  color: #fff;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

.btn-primary:active {
  background: var(--color-primary-active);
}

.btn-secondary {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn-ghost {
  background: transparent;
  color: var(--color-text-muted);
  padding: var(--space-1) var(--space-2);
  font-size: var(--text-xs);
}

.btn-ghost:hover {
  color: var(--color-primary);
}

.btn-danger {
  background: transparent;
  color: var(--color-error);
  padding: var(--space-1) var(--space-2);
  font-size: var(--text-xs);
}

.btn-danger:hover {
  background: var(--color-error-highlight);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* === Card === */
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  margin-bottom: var(--space-4);
  box-shadow: var(--shadow-sm);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.card-title {
  font-size: var(--text-base);
  font-weight: 700;
  font-family: var(--font-display);
}

.card-subtitle {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-top: var(--space-1);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 500;
  white-space: nowrap;
}

.badge-open {
  background: var(--color-primary-highlight);
  color: var(--color-primary);
}

.badge-closed {
  background: var(--color-surface-offset);
  color: var(--color-text-muted);
}

.badge-winner {
  background: var(--color-success-highlight);
  color: var(--color-success);
}

.badge-gold {
  background: var(--color-gold-highlight);
  color: var(--color-gold);
}

/* === Forms === */
.form-row {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  align-items: end;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  flex: 1;
  min-width: 0;
}

.form-group label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-weight: 500;
}

input[type="text"],
input[type="number"],
select {
  padding: var(--space-2) var(--space-3);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  width: 100%;
}

input[type="text"]:focus,
input[type="number"]:focus,
select:focus {
  outline: none;
  border-color: var(--color-primary);
  background: var(--color-surface);
}

input::placeholder {
  color: var(--color-text-faint);
}

/* === Bet list === */
.bet-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.bet-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  background: var(--color-surface-2);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  transition: border-color var(--transition-interactive);
}

.bet-item.is-winner {
  border-color: var(--color-success);
  background: var(--color-success-highlight);
}

.bet-item.is-tied {
  border-color: var(--color-gold);
  background: var(--color-gold-highlight);
}

.bet-item-left {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: 1;
  min-width: 0;
}

.bet-item-name {
  font-weight: 500;
  font-size: var(--text-sm);
}

.bet-item-value {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
}

.bet-item-diff {
  font-size: var(--text-xs);
  color: var(--color-text-faint);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.bet-item-actions {
  display: flex;
  gap: var(--space-1);
}

/* === Result box === */
.result-box {
  margin-top: var(--space-4);
  padding: var(--space-4);
  background: var(--color-surface-2);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.result-box-title {
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  margin-bottom: var(--space-2);
}

.result-value {
  font-size: var(--text-xl);
  font-weight: 700;
  font-family: var(--font-display);
  font-variant-numeric: tabular-nums;
}

.result-winner {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-2);
  font-size: var(--text-sm);
}

.result-winner strong {
  color: var(--color-success);
}

/* === Leaderboard === */
.leaderboard {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  transition: background var(--transition-interactive);
}

.leaderboard-item.rank-1 {
  background: var(--color-gold-highlight);
}

.leaderboard-rank {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 700;
  background: var(--color-surface-offset);
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.leaderboard-item.rank-1 .leaderboard-rank {
  background: var(--color-gold);
  color: #fff;
}

.leaderboard-item.rank-2 .leaderboard-rank {
  background: #b0b0b0;
  color: #fff;
}

.leaderboard-item.rank-3 .leaderboard-rank {
  background: #cd7f32;
  color: #fff;
}

.leaderboard-name {
  flex: 1;
  font-weight: 500;
  font-size: var(--text-sm);
}

.leaderboard-score {
  font-weight: 700;
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums;
  color: var(--color-primary);
}

.leaderboard-empty {
  text-align: center;
  padding: var(--space-6);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

/* === Empty state === */
.empty-state {
  text-align: center;
  padding: var(--space-12) var(--space-4);
}

.empty-state-icon {
  font-size: 3rem;
  margin-bottom: var(--space-3);
}

.empty-state h3 {
  font-size: var(--text-lg);
  margin-bottom: var(--space-2);
}

.empty-state p {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

/* === Section title === */
.section-title {
  font-size: var(--text-sm);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  margin-bottom: var(--space-3);
  margin-top: var(--space-8);
}

/* === Utility === */
.text-center { text-align: center; }
.mt-2 { margin-top: var(--space-2); }
.mt-4 { margin-top: var(--space-4); }
.flex-gap-2 { display: flex; gap: var(--space-2); flex-wrap: wrap; }

/* === New round form === */
.new-round-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.new-round-form .form-row {
  align-items: stretch;
}

/* === Add bet form === */
.add-bet-form {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-3);
  flex-wrap: wrap;
}

.add-bet-form input {
  flex: 1;
  min-width: 100px;
}

/* === Close round === */
.close-round {
  display: flex;
  gap: var(--space-2);
  align-items: end;
  flex-wrap: wrap;
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-divider);
}

.close-round .form-group {
  flex: 1;
  min-width: 120px;
}
```

---

## Étape 7 : Fichier `src/App.jsx`

```jsx
import { useState, useEffect, useMemo } from 'react'

// === Storage (localStorage with fallback) ===
const STORAGE_KEY = 'pari-lead-dev-data'

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { rounds: [] }
  } catch {
    return { rounds: [] }
  }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage blocked (iframe) — data lives in memory only
  }
}

// === Time parsing ===
// "9.3" → 9h30, "9.30" → 9h30, "9:30" → 9h30, "9h30" → 9h30, "10" → 10h00
function parseTime(input) {
  if (!input || typeof input !== 'string') return null
  const cleaned = input.replace(/[hH:]/g, '.').trim()
  const parts = cleaned.split('.')
  const hours = parseInt(parts[0], 10)
  let minutes = 0
  if (parts.length > 1 && parts[1]) {
    let minStr = parts[1]
    if (minStr.length === 1) minStr = minStr + '0'
    minutes = parseInt(minStr, 10)
  }
  if (isNaN(hours) || hours < 0 || hours > 23) return null
  if (isNaN(minutes) || minutes < 0 || minutes > 59) return null
  return hours * 60 + minutes
}

function formatTime(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h${String(m).padStart(2, '0')}`
}

// === Number parsing ===
function parseNumber(input) {
  if (!input || typeof input !== 'string') return null
  const n = parseFloat(input.replace(',', '.'))
  return isNaN(n) ? null : n
}

// === ID generator ===
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

// === Winner calculation ===
function computeWinners(round) {
  if (!round.actualValue || round.bets.length === 0) return []
  const actual = round.actualValue
  const diffs = round.bets.map((bet) => ({
    bet,
    diff: Math.abs(bet.value - actual),
  }))
  const minDiff = Math.min(...diffs.map((d) => d.diff))
  return diffs.filter((d) => d.diff === minDiff).map((d) => d.bet.id)
}

// === Leaderboard ===
function computeLeaderboard(rounds) {
  const scores = {}
  rounds.forEach((round) => {
    if (round.status !== 'closed' || !round.winners) return
    round.bets.forEach((bet) => {
      if (!scores[bet.name]) scores[bet.name] = { name: bet.name, score: 0, wins: 0 }
      if (round.winners.includes(bet.id)) {
        scores[bet.name].score += round.pointsPerWin || 1
        scores[bet.name].wins += 1
      }
    })
  })
  return Object.values(scores).sort((a, b) => b.score - a.score || b.wins - a.wins)
}

// === Theme ===
function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return { theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }
}

// === Sun/Moon icons ===
function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}
function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

// === Main App ===
export default function App() {
  const { theme, toggle } = useTheme()
  const [data, setData] = useState(loadData)

  useEffect(() => {
    saveData(data)
  }, [data])

  const leaderboard = useMemo(() => computeLeaderboard(data.rounds), [data.rounds])

  // --- Actions ---
  function createRound(name, type) {
    const round = {
      id: genId(),
      name: name.trim() || (type === 'time' ? 'Arrivée du lead dev' : 'Nouveau pari'),
      type,
      bets: [],
      actualValue: null,
      actualInput: '',
      status: 'open',
      winners: [],
      pointsPerWin: 1,
    }
    setData((d) => ({ ...d, rounds: [...d.rounds, round] }))
  }

  function addBet(roundId, name, valueStr) {
    setData((d) => ({
      ...d,
      rounds: d.rounds.map((r) => {
        if (r.id !== roundId) return r
        const value = r.type === 'time' ? parseTime(valueStr) : parseNumber(valueStr)
        if (value === null) return r
        return {
          ...r,
          bets: [...r.bets, { id: genId(), name: name.trim(), value }],
        }
      }),
    }))
  }

  function removeBet(roundId, betId) {
    setData((d) => ({
      ...d,
      rounds: d.rounds.map((r) =>
        r.id === roundId ? { ...r, bets: r.bets.filter((b) => b.id !== betId) } : r,
      ),
    }))
  }

  function closeRound(roundId, actualInput) {
    setData((d) => ({
      ...d,
      rounds: d.rounds.map((r) => {
        if (r.id !== roundId) return r
        const actualValue = r.type === 'time' ? parseTime(actualInput) : parseNumber(actualInput)
        if (actualValue === null) return r
        const winners = computeWinners({ ...r, actualValue })
        return { ...r, actualValue, actualInput, status: 'closed', winners }
      }),
    }))
  }

  function reopenRound(roundId) {
    setData((d) => ({
      ...d,
      rounds: d.rounds.map((r) =>
        r.id === roundId
          ? { ...r, status: 'open', winners: [], actualValue: null, actualInput: '' }
          : r,
      ),
    }))
  }

  function deleteRound(roundId) {
    if (!confirm('Supprimer ce pari ? Les scores seront recalculés.')) return
    setData((d) => ({ ...d, rounds: d.rounds.filter((r) => r.id !== roundId) }))
  }

  function resetAll() {
    if (!confirm('Tout effacer ? Tous les paris et scores seront perdus.')) return
    setData({ rounds: [] })
  }

  // --- Render ---
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">🎯</div>
          <div>
            <h1>Pari Lead Dev</h1>
            <p>Paris d'équipe</p>
          </div>
        </div>
        <button className="theme-toggle" onClick={toggle} aria-label="Changer de thème">
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </header>

      {/* New round form */}
      <NewRoundForm onCreate={createRound} />

      {/* Rounds */}
      {data.rounds.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎯</div>
          <h3>Aucun pari pour le moment</h3>
          <p>Créez un premier pari ci-dessus pour commencer à jouer !</p>
        </div>
      ) : (
        <>
          <h2 className="section-title">Paris en cours</h2>
          {data.rounds.map((round) => (
            <RoundCard
              key={round.id}
              round={round}
              onAddBet={addBet}
              onRemoveBet={removeBet}
              onClose={closeRound}
              onReopen={reopenRound}
              onDelete={deleteRound}
            />
          ))}
        </>
      )}

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <>
          <h2 className="section-title">Classement général</h2>
          <div className="card">
            <div className="leaderboard">
              {leaderboard.map((entry, i) => (
                <div key={entry.name} className={`leaderboard-item rank-${i + 1}`}>
                  <div className="leaderboard-rank">{i + 1}</div>
                  <div className="leaderboard-name">{entry.name}</div>
                  <div className="leaderboard-score">
                    {entry.score} pt{entry.score > 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Reset */}
      {data.rounds.length > 0 && (
        <div className="text-center mt-4">
          <button className="btn btn-ghost" onClick={resetAll}>
            Tout effacer
          </button>
        </div>
      )}
    </div>
  )
}

// === New Round Form ===
function NewRoundForm({ onCreate }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('time')
  const [expanded, setExpanded] = useState(false)

  function handleSubmit() {
    onCreate(name, type)
    setName('')
    setExpanded(false)
  }

  if (!expanded) {
    return (
      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setExpanded(true)}>
        + Nouveau pari
      </button>
    )
  }

  return (
    <div className="card">
      <div className="new-round-form">
        <div className="form-group">
          <label>Nom du pari</label>
          <input
            type="text"
            placeholder={type === 'time' ? 'Arrivée du lead dev' : 'Température de demain'}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="time">Heure</option>
            <option value="number">Nombre</option>
          </select>
        </div>
        <div className="flex-gap-2">
          <button className="btn btn-primary" onClick={handleSubmit}>
            Créer le pari
          </button>
          <button className="btn btn-secondary" onClick={() => setExpanded(false)}>
            Annuler
          </button>
        </div>
        {type === 'time' && (
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Format heure : 9.30 = 9h30, 9.3 = 9h30, 9:30 = 9h30, 10 = 10h00
          </p>
        )}
      </div>
    </div>
  )
}

// === Round Card ===
function RoundCard({ round, onAddBet, onRemoveBet, onClose, onReopen, onDelete }) {
  const [betName, setBetName] = useState('')
  const [betValue, setBetValue] = useState('')
  const [actualInput, setActualInput] = useState(round.actualInput || '')
  const [error, setError] = useState('')

  const isOpen = round.status === 'open'
  const winners = round.winners || []

  function handleAddBet() {
    if (!betName.trim() || !betValue.trim()) return
    const value = round.type === 'time' ? parseTime(betValue) : parseNumber(betValue)
    if (value === null) {
      setError(round.type === 'time' ? 'Format invalide. Ex: 9.30, 9:30, 10h00' : 'Nombre invalide')
      return
    }
    setError('')
    onAddBet(round.id, betName, betValue)
    setBetName('')
    setBetValue('')
  }

  function handleClose() {
    if (!actualInput.trim()) return
    const value = round.type === 'time' ? parseTime(actualInput) : parseNumber(actualInput)
    if (value === null) {
      setError(round.type === 'time' ? 'Format invalide' : 'Nombre invalide')
      return
    }
    setError('')
    onClose(round.id, actualInput)
  }

  // Sort bets by value for display
  const sortedBets = [...round.bets].sort((a, b) => a.value - b.value)

  function formatValue(v) {
    if (round.type === 'time') return formatTime(v)
    return String(v).replace('.', ',')
  }

  function formatDiff(bet) {
    if (!round.actualValue) return ''
    const diff = Math.abs(bet.value - round.actualValue)
    if (round.type === 'time') {
      const mins = Math.round(diff)
      if (mins < 1) return 'pile !'
      if (mins === 1) return 'à 1 min'
      return `à ${mins} min`
    }
    return `écart ${diff.toFixed(2).replace('.', ',')}`
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header">
        <div>
          <div className="card-title">{round.name}</div>
          <div className="card-subtitle">
            {round.type === 'time' ? 'Pari sur une heure' : 'Pari sur un nombre'} — {round.bets.length} participant{round.bets.length > 1 ? 's' : ''}
          </div>
        </div>
        <span className={`badge ${isOpen ? 'badge-open' : 'badge-closed'}`}>
          {isOpen ? 'Ouvert' : 'Fermé'}
        </span>
      </div>

      {/* Bets list */}
      {sortedBets.length > 0 && (
        <div className="bet-list">
          {sortedBets.map((bet) => {
            const isWinner = winners.includes(bet.id)
            const isTied = isWinner && winners.length > 1
            return (
              <div
                key={bet.id}
                className={`bet-item ${isWinner ? (isTied ? 'is-tied' : 'is-winner') : ''}`}
              >
                <div className="bet-item-left">
                  <span className="bet-item-name">{bet.name}</span>
                  <span className="bet-item-value">{formatValue(bet.value)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  {!isOpen && round.actualValue !== null && (
                    <span className="bet-item-diff">{formatDiff(bet)}</span>
                  )}
                  {isWinner && (
                    <span className={`badge ${isTied ? 'badge-gold' : 'badge-winner'}`}>
                      {isTied ? 'Égalité' : 'Gagnant'}
                    </span>
                  )}
                  {isOpen && (
                    <button
                      className="btn btn-danger"
                      onClick={() => onRemoveBet(round.id, bet.id)}
                      aria-label={`Retirer le pari de ${bet.name}`}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add bet form (only if open) */}
      {isOpen && (
        <>
          <div className="add-bet-form">
            <input
              type="text"
              placeholder="Prénom"
              value={betName}
              onChange={(e) => setBetName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddBet()}
            />
            <input
              type="text"
              placeholder={round.type === 'time' ? '9.30' : '42'}
              value={betValue}
              onChange={(e) => setBetValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddBet()}
            />
            <button className="btn btn-secondary" onClick={handleAddBet}>
              + Ajouter
            </button>
          </div>
          {error && (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)', marginTop: 'var(--space-2)' }}>
              {error}
            </p>
          )}
        </>
      )}

      {/* Close round form (only if open and has bets) */}
      {isOpen && round.bets.length > 0 && (
        <div className="close-round">
          <div className="form-group">
            <label>
              {round.type === 'time' ? "Heure d'arrivée réelle" : 'Résultat réel'}
            </label>
            <input
              type="text"
              placeholder={round.type === 'time' ? '10.00' : '42'}
              value={actualInput}
              onChange={(e) => setActualInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleClose()}
            />
          </div>
          <button className="btn btn-primary" onClick={handleClose}>
            Valider le résultat
          </button>
        </div>
      )}

      {/* Result display (if closed) */}
      {!isOpen && round.actualValue !== null && (
        <div className="result-box">
          <div className="result-box-title">
            {round.type === 'time' ? "Heure d'arrivée" : 'Résultat'}
          </div>
          <div className="result-value">{formatValue(round.actualValue)}</div>
          {winners.length > 0 && (
            <div className="result-winner">
              {winners.length === 1 ? (
                <span><strong>{round.bets.find((b) => b.id === winners[0])?.name}</strong> gagne +{round.pointsPerWin} pt</span>
              ) : (
                <span>
                  <strong>{winners.map((id) => round.bets.find((b) => b.id === id)?.name).join(', ')}</strong> — égalité, +{round.pointsPerWin} pt chacun
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Actions for closed rounds */}
      {!isOpen && (
        <div className="flex-gap-2 mt-4">
          <button className="btn btn-secondary" onClick={() => onReopen(round.id)}>
            Rouvrir le pari
          </button>
          <button className="btn btn-danger" onClick={() => onDelete(round.id)}>
            Supprimer
          </button>
        </div>
      )}

      {/* Delete for open rounds */}
      {isOpen && round.bets.length === 0 && (
        <div className="flex-gap-2 mt-4">
          <button className="btn btn-danger" onClick={() => onDelete(round.id)}>
            Supprimer
          </button>
        </div>
      )}
    </div>
  )
}
```

---

## Étape 8 : Workflow GitHub Actions

Crée le fichier `.github/workflows/deploy.yml` :

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

---

## Étape 9 : Fichier `.gitignore`

```
node_modules
dist
.DS_Store
*.log
```

---

## Étape 10 : Déployer sur GitHub

```bash
# 1. Init le repo git
git init
git add -A
git commit -m "Initial commit: Pari Lead Dev app"

# 2. Créer le repo sur GitHub (depuis github.com/new)
# Nom du repo : pari-lead-dev
# Public ou Private (peu importe pour Pages)

# 3. Lier et pousser
git remote add origin https://github.com/VOTRE-USERNAME/pari-lead-dev.git
git branch -M main
git push -u origin main

# 4. Activer GitHub Pages
# Sur GitHub : Settings > Pages
# Source : GitHub Actions (pas "Deploy from a branch")
```

Le déploiement se fait automatiquement via le workflow GitHub Actions à chaque push sur `main`.

---

## Idées de paris

L'app supporte deux types de paris : **Heure** et **Nombre**. Voici des idées fun pour une équipe dev :

| Pari | Type | Exemple |
|------|------|---------|
| Heure d'arrivée du lead dev | Heure | 9.30 |
| Heure de départ du lead dev | Heure | 18.00 |
| Heure du premier commit du jour | Heure | 9.15 |
| Heure du premier "bonjour" dans le Slack | Heure | 8.45 |
| Nombre de cafés bus dans la journée | Nombre | 4 |
| Nombre de PR mergées cette semaine | Nombre | 7 |
| Nombre de bugs en prod cette semaine | Nombre | 2 |
| Lignes de code de la prochaine PR | Nombre | 342 |
| Température de la salle à 14h | Nombre | 21.5 |
| Nombre de réactions sur le dernier message | Nombre | 15 |
