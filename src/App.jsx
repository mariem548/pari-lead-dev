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

function formatTimeInput(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}.${String(m).padStart(2, '0')}`
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

// === Date helpers ===
function formatDate(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const days = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam']
  const months = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc']
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`
}

function isThisWeek(ts) {
  if (!ts) return false
  const now = new Date()
  const day = now.getDay()
  const monday = new Date(now)
  const diff = day === 0 ? -6 : 1 - day
  monday.setDate(now.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  return new Date(ts) >= monday
}

function isThisMonth(ts) {
  if (!ts) return false
  const now = new Date()
  const d = new Date(ts)
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
}

function filterRoundsByPeriod(rounds, period) {
  if (period === 'all') return rounds
  return rounds.filter((r) => {
    if (period === 'week') return isThisWeek(r.createdAt)
    if (period === 'month') return isThisMonth(r.createdAt)
    return true
  })
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
  const [period, setPeriod] = useState('all')

  useEffect(() => {
    saveData(data)
  }, [data])

  const filteredRounds = useMemo(() => filterRoundsByPeriod(data.rounds, period), [data.rounds, period])
  const leaderboard = useMemo(() => computeLeaderboard(filteredRounds), [filteredRounds])

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
      createdAt: Date.now(),
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

      {/* Period filter */}
      {data.rounds.length > 0 && (
        <div className="period-filter">
          <button
            className={`period-btn ${period === 'week' ? 'active' : ''}`}
            onClick={() => setPeriod('week')}
          >
            Cette semaine
          </button>
          <button
            className={`period-btn ${period === 'month' ? 'active' : ''}`}
            onClick={() => setPeriod('month')}
          >
            Ce mois
          </button>
          <button
            className={`period-btn ${period === 'all' ? 'active' : ''}`}
            onClick={() => setPeriod('all')}
          >
            Tout
          </button>
        </div>
      )}

      {/* Rounds */}
      {data.rounds.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎯</div>
          <h3>Aucun pari pour le moment</h3>
          <p>Créez un premier pari ci-dessus pour commencer à jouer !</p>
        </div>
      ) : filteredRounds.length === 0 ? (
        <>
          <h2 className="section-title">Paris en cours</h2>
          <div className="empty-state" style={{ padding: 'var(--space-8) var(--space-4)' }}>
            <div className="empty-state-icon" style={{ fontSize: '2rem' }}>📅</div>
            <h3 style={{ fontSize: 'var(--text-base)' }}>Aucun pari sur cette période</h3>
            <p>Changez de filtre ou créez un nouveau pari.</p>
          </div>
        </>
      ) : (
        <>
          <h2 className="section-title">Paris en cours</h2>
          {filteredRounds.map((round) => (
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
          <h2 className="section-title">
            Classement {period === 'week' ? 'de la semaine' : period === 'month' ? 'du mois' : 'général'}
          </h2>
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
            data-testid="input-round-name"
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} data-testid="select-round-type">
            <option value="time">Heure</option>
            <option value="number">Nombre</option>
          </select>
        </div>
        <div className="flex-gap-2">
          <button className="btn btn-primary" onClick={handleSubmit} data-testid="button-create-round">
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
            {round.type === 'time' ? 'Pari sur une heure' : 'Pari sur un nombre'} — {round.bets.length} participant{round.bets.length > 1 ? 's' : ''}{round.createdAt ? ` — ${formatDate(round.createdAt)}` : ''}
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
              data-testid={`input-bet-name-${round.id}`}
            />
            <input
              type="text"
              placeholder={round.type === 'time' ? '9.30' : '42'}
              value={betValue}
              onChange={(e) => setBetValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddBet()}
              data-testid={`input-bet-value-${round.id}`}
            />
            <button className="btn btn-secondary" onClick={handleAddBet} data-testid={`button-add-bet-${round.id}`}>
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
              {round.type === 'time' ? 'Heure d\'arrivée réelle' : 'Résultat réel'}
            </label>
            <input
              type="text"
              placeholder={round.type === 'time' ? '10.00' : '42'}
              value={actualInput}
              onChange={(e) => setActualInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleClose()}
              data-testid={`input-actual-${round.id}`}
            />
          </div>
          <button className="btn btn-primary" onClick={handleClose} data-testid={`button-close-${round.id}`}>
            Valider le résultat
          </button>
        </div>
      )}

      {/* Result display (if closed) */}
      {!isOpen && round.actualValue !== null && (
        <div className="result-box">
          <div className="result-box-title">
            {round.type === 'time' ? 'Heure d\'arrivée' : 'Résultat'}
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
