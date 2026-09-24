import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from './lib/supabase'
import {
  api,
  computeWinners,
  computeLeaderboard,
  computeHallOfFame,
  formatDate,
  filterRoundsByPeriod,
  formatTime,
} from './lib/api'

// === Avatars ===
const AVATARS = [
  { emoji: '🤺', name: 'Chevalier' },
  { emoji: '🏹', name: 'Archer' },
  { emoji: '🧙', name: 'Mage' },
  { emoji: '👑', name: 'Roi' },
  { emoji: '🛡️', name: 'Garde' },
  { emoji: '⚔️', name: 'Guerrier' },
  { emoji: '🗡️', name: 'Assassin' },
  { emoji: '📜', name: 'Scribe' },
  { emoji: '🏰', name: 'Seigneur' },
  { emoji: '🐉', name: 'Dragonnier' },
  { emoji: '🔥', name: 'Pyromancien' },
  { emoji: '🌙', name: 'Sorcière' },
]

const AVATAR_KEY = 'pari-lead-dev-avatar'

// === Story popup ===
const STORY_KEY = 'pari-lead-dev-story-seen'

function StoryPopup({ open, onClose }) {
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Fermer">✕</button>
        <div className="story-text">
          <p>En cette noble époque, où les chevaliers servent leur royaume et où l'honneur guide les plus braves, une idée des plus audacieuses naquit au sein de notre illustre compagnie.</p>
          <p>Face aux retards légendaires de notre très honorable et suprême Lead Dev, une question demeurait sans réponse : à quelle heure daignera-t-il enfin franchir les portes du royaume ?</p>
          <p>C'est ainsi que, dans un élan de solidarité sans pareil, notre valeureuse équipe décida de créer une application permettant à chacun de mettre à l'épreuve son sens de la prophétie et de parier sur l'heure d'arrivée de notre illustre seigneur technique.</p>
          <p>Mais nul projet d'une telle envergure n'aurait pu voir le jour sans le dévouement d'une âme particulièrement noble, douce et généreuse : <strong>Mariem</strong>.</p>
          <p>Telle une chevaleresse au service de son royaume, elle sacrifia de son précieux temps, brava les épreuves du développement et consacra ses talents à cette noble entreprise. Après moult efforts, quelques batailles avec le code et probablement quelques soupirs, elle nous livra une œuvre magnifique : l'application officielle des paris sur l'arrivée de notre Suprême Lead Dev.</p>
          <p className="story-finale">Que les paris commencent.</p>
          <p className="story-finale">Que les prophéties s'affrontent.</p>
          <p className="story-finale">Et que le plus juste des chevaliers — ou le plus grand des devins — remporte la victoire.</p>
        </div>
        <button className="btn btn-primary modal-btn" onClick={onClose}>
          Que les paris commencent
        </button>
      </div>
    </div>
  )
}

// === Logo SVG ===
function Logo() {
  return (
    <svg className="logo-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Pari Lead Dev">
      {/* Shield/kingdom base */}
      <path d="M10 28 L32 60 L54 28 Z" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" opacity="0.3" />
      {/* Castle */}
      <rect x="18" y="36" width="28" height="22" rx="1" fill="var(--color-primary)" />
      <rect x="14" y="30" width="8" height="28" rx="1" fill="var(--color-primary-hover)" />
      <rect x="42" y="30" width="8" height="28" rx="1" fill="var(--color-primary-hover)" />
      {/* Crenellations */}
      <rect x="14" y="27" width="2.5" height="4" fill="var(--color-primary-hover)" />
      <rect x="18" y="27" width="2.5" height="4" fill="var(--color-primary-hover)" />
      <rect x="42" y="27" width="2.5" height="4" fill="var(--color-primary-hover)" />
      <rect x="46" y="27" width="2.5" height="4" fill="var(--color-primary-hover)" />
      {/* Door */}
      <path d="M27 50 Q27 44 32 44 Q37 44 37 50 L37 58 L27 58 Z" fill="var(--color-bg)" />
      {/* GIT text on castle */}
      <text x="32" y="41" textAnchor="middle" fontSize="7" fontWeight="700" fill="var(--color-bg)" fontFamily="Cinzel, serif" letterSpacing="0.5">GIT</text>
      {/* Crossed swords behind guardian */}
      <line x1="16" y1="54" x2="48" y2="14" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" />
      <line x1="48" y1="54" x2="16" y2="14" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" />
      {/* Sword guards */}
      <line x1="14" y1="52" x2="19" y2="56" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="50" y1="52" x2="45" y2="56" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Guardian person in front of castle */}
      {/* Head */}
      <circle cx="32" cy="22" r="5" fill="var(--color-gold)" />
      {/* Body/armor */}
      <path d="M26 28 Q26 44 32 48 Q38 44 38 28 Z" fill="var(--color-gold)" />
      {/* Arms crossed (guardian pose) */}
      <path d="M26 30 L38 36" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M38 30 L26 36" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
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
  const [rounds, setRounds] = useState([])
  const [period, setPeriod] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showStory, setShowStory] = useState(() => {
    try {
      return !sessionStorage.getItem(STORY_KEY)
    } catch {
      return true
    }
  })
  const [profilePlayer, setProfilePlayer] = useState(null)
  const [showHallOfFame, setShowHallOfFame] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [toasts, setToasts] = useState([])
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      return !sessionStorage.getItem('pari-lead-dev-user') || !sessionStorage.getItem(AVATAR_KEY)
    } catch {
      return true
    }
  })

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }, [])

  const triggerConfetti = useCallback(() => {
    setConfetti(true)
    setTimeout(() => setConfetti(false), 3000)
  }, [])
  const [userName, setUserName] = useState(() => {
    try {
      return sessionStorage.getItem('pari-lead-dev-user') || ''
    } catch {
      return ''
    }
  })
  const [userAvatar, setUserAvatar] = useState(() => {
    try {
      return sessionStorage.getItem(AVATAR_KEY) || ''
    } catch {
      return ''
    }
  })

  function closeStory() {
    setShowStory(false)
    try {
      sessionStorage.setItem(STORY_KEY, '1')
    } catch {
      // sessionStorage blocked
    }
  }

  // Load data
  const loadRounds = useCallback(async () => {
    try {
      const data = await api.fetchRounds()
      setRounds(data)
      setError('')
    } catch (e) {
      setError('Erreur de chargement: ' + e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRounds()
  }, [loadRounds])

  // Real-time subscription
  useEffect(() => {
    if (!isSupabaseConfigured) return
    const unsubscribe = api.subscribe(() => {
      loadRounds()
    })
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [loadRounds])

  const filteredRounds = useMemo(() => filterRoundsByPeriod(rounds, period), [rounds, period])
  const leaderboard = useMemo(() => computeLeaderboard(filteredRounds), [filteredRounds])

  // --- Actions ---
  async function createRound(name, type) {
    try {
      const round = await api.createRound(name, type)
      setRounds((prev) => [round, ...prev])
    } catch (e) {
      setError('Erreur: ' + e.message)
    }
  }

  async function addBet(roundId, name, valueStr, type, avatar) {
    try {
      const bet = await api.addBet(roundId, name, valueStr, type, avatar)
      if (bet) {
        setRounds((prev) =>
          prev.map((r) =>
            r.id === roundId ? { ...r, bets: [...r.bets, bet] } : r,
          ),
        )
        showToast(`⚔️ ${name} a parié !`, 'info')
        playSound('bet')
      } else {
        // Supabase: reload to get the bet with correct ID
        loadRounds()
      }
    } catch (e) {
      setError('Erreur: ' + e.message)
    }
  }

  async function removeBet(roundId, betId) {
    try {
      await api.removeBet(roundId, betId)
      setRounds((prev) =>
        prev.map((r) =>
          r.id === roundId ? { ...r, bets: r.bets.filter((b) => b.id !== betId) } : r,
        ),
      )
    } catch (e) {
      setError('Erreur: ' + e.message)
    }
  }

  async function closeRound(roundId, actualInput, type) {
    try {
      await api.closeRound(roundId, actualInput, type)
      let winnerNames = []
      setRounds((prev) =>
        prev.map((r) => {
          if (r.id !== roundId) return r
          const value = type === 'time' ? parseTimeLocal(actualInput) : parseNumberLocal(actualInput)
          const winners = computeWinners({ ...r, actualValue: value })
          winnerNames = r.bets.filter((b) => winners.includes(b.id)).map((b) => b.name)
          return { ...r, actualValue: value, actualInput, status: 'closed', winners }
        }),
      )
      triggerConfetti()
      playSound('win')
      if (winnerNames.length > 0) {
        showToast(`🏆 ${winnerNames.join(', ')} ${winnerNames.length > 1 ? 'gagnent' : 'gagne'} !`, 'success')
      }
    } catch (e) {
      setError('Erreur: ' + e.message)
    }
  }

  async function reopenRound(roundId) {
    try {
      await api.reopenRound(roundId)
      setRounds((prev) =>
        prev.map((r) =>
          r.id === roundId
            ? { ...r, status: 'open', winners: [], actualValue: null, actualInput: '' }
            : r,
        ),
      )
    } catch (e) {
      setError('Erreur: ' + e.message)
    }
  }

  async function deleteRound(roundId) {
    if (!confirm('Supprimer ce pari ? Les scores seront recalculés.')) return
    try {
      await api.deleteRound(roundId)
      setRounds((prev) => prev.filter((r) => r.id !== roundId))
    } catch (e) {
      setError('Erreur: ' + e.message)
    }
  }

  async function resetAll() {
    if (!confirm('Tout effacer ? Tous les paris et scores seront perdus.')) return
    try {
      await api.resetAll()
      setRounds([])
    } catch (e) {
      setError('Erreur: ' + e.message)
    }
  }

  // --- Loading state ---
  if (loading) {
    return (
      <div className="app">
        <header className="header">
          <div className="header-left">
            <Logo />
            <div>
              <h1>Pari Lead Dev</h1>
              <p>Paris d'équipe</p>
            </div>
          </div>
        </header>
        <div className="empty-state">
          <div className="empty-state-icon">🏰</div>
          <h3>Chargement...</h3>
        </div>
      </div>
    )
  }

  // --- Render ---
  return (
    <div className="app">
      {/* Knight rider animation */}
      <KnightRider />

      {/* Onboarding modal */}
      {showOnboarding && (
        <OnboardingModal
          userName={userName}
          userAvatar={userAvatar}
          onSave={(name, avatar) => {
            setUserName(name)
            setUserAvatar(avatar)
            try {
              sessionStorage.setItem('pari-lead-dev-user', name)
              sessionStorage.setItem(AVATAR_KEY, avatar)
            } catch {}
            setShowOnboarding(false)
          }}
          onClose={() => setShowOnboarding(false)}
        />
      )}

      {/* Header */}
      <header className="header">
        <div className="header-left">
          <Logo />
          <div>
            <h1>Pari Lead Dev</h1>
            <p>Paris d'équipe {isSupabaseConfigured ? '— partagé' : ''}</p>
          </div>
        </div>
        <button className="theme-toggle" onClick={toggle} aria-label="Changer de thème">
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        <button className="story-toggle" onClick={() => setShowStory(true)} aria-label="Notre histoire">
          📜
        </button>
      </header>

      {/* Setup banner */}
      {!isSupabaseConfigured && (
        <div className="setup-banner">
          <strong>Mode local</strong> — vos données sont sur votre navigateur uniquement.
          Pour partager avec toute l'équipe, configurez Supabase (voir le README).
        </div>
      )}

      {/* Story popup */}
      <StoryPopup open={showStory} onClose={closeStory} />

      {/* Profile modal */}
      {profilePlayer && (
        <ProfileModal player={profilePlayer} onClose={() => setProfilePlayer(null)} />
      )}

      {/* Hall of Fame modal */}
      {showHallOfFame && (
        <HallOfFameModal rounds={rounds} onClose={() => setShowHallOfFame(false)} />
      )}

      {/* Confetti overlay */}
      {confetti && <ConfettiOverlay />}

      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="error-banner" onClick={() => setError('')}>
          {error} ✕
        </div>
      )}

      {/* New round form */}
      <NewRoundForm onCreate={createRound} />

      {/* Period filter */}
      {rounds.length > 0 && (
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
      {rounds.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏰</div>
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
              userAvatar={userAvatar}
              setUserAvatar={(a) => {
                setUserAvatar(a)
                try { sessionStorage.setItem(AVATAR_KEY, a) } catch {}
              }}
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
            <button className="btn btn-secondary hall-of-fame-btn" onClick={() => setShowHallOfFame(true)}>
              🏆 Hall of Fame
            </button>
          </h2>
          <div className="card">
            <div className="leaderboard">
              {leaderboard.map((entry, i) => (
                <div key={entry.name} className={`leaderboard-item rank-${i + 1}`}>
                  <div className="leaderboard-rank">{i + 1}</div>
                  <span className="leaderboard-avatar">{entry.avatar || '🛡️'}</span>
                  <button className="leaderboard-name clickable" onClick={() => setProfilePlayer(entry)}>{entry.name}</button>
                  {entry.currentStreak >= 2 && (
                    <span className="streak-badge">🔥 {entry.currentStreak}</span>
                  )}
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
      {rounds.length > 0 && (
        <div className="text-center mt-4">
          <button className="btn btn-ghost" onClick={resetAll}>
            Tout effacer
          </button>
        </div>
      )}
    </div>
  )
}

// === Local parsing helpers (for localStorage mode) ===
function parseTimeLocal(input) {
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

function parseNumberLocal(input) {
  if (!input || typeof input !== 'string') return null
  const n = parseFloat(input.replace(',', '.'))
  return isNaN(n) ? null : n
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
function RoundCard({ round, onAddBet, onRemoveBet, onClose, onReopen, onDelete, userAvatar, setUserAvatar }) {
  const [betName, setBetName] = useState('')
  const [betValue, setBetValue] = useState('')
  const [actualInput, setActualInput] = useState(round.actualInput || '')
  const [error, setError] = useState('')

  const isOpen = round.status === 'open'
  const winners = round.winners || []

  function handleAddBet() {
    if (!betName.trim() || !betValue.trim()) return
    const value = round.type === 'time' ? parseTimeLocal(betValue) : parseNumberLocal(betValue)
    if (value === null) {
      setError(round.type === 'time' ? 'Format invalide. Ex: 9.30, 9:30, 10h00' : 'Nombre invalide')
      return
    }
    setError('')
    onAddBet(round.id, betName, betValue, round.type, userAvatar)
    setBetName('')
    setBetValue('')
  }

  function handleClose() {
    if (!actualInput.trim()) return
    const value = round.type === 'time' ? parseTimeLocal(actualInput) : parseNumberLocal(actualInput)
    if (value === null) {
      setError(round.type === 'time' ? 'Format invalide' : 'Nombre invalide')
      return
    }
    setError('')
    onClose(round.id, actualInput, round.type)
  }

  // Sort bets by value for display
  const sortedBets = [...round.bets].sort((a, b) => a.value - b.value)

  function formatValue(v) {
    if (round.type === 'time') return formatTime(v)
    return String(v).replace('.', ',')
  }

  function formatDiff(bet) {
    if (round.actualValue === null || round.actualValue === undefined) return ''
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
                  <span className="bet-item-avatar">{bet.avatar || '🛡️'}</span>
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
            <div className="bet-form-profile">
              <span className="bet-form-avatar">{userAvatar || '🛡️'}</span>
              <input
                type="text"
                placeholder="Prénom"
                value={betName}
                onChange={(e) => setBetName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddBet()}
              />
            </div>
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

      {/* Carte des prédictions */}
      {round.bets.length > 0 && (
        <DistributionChart round={round} />
      )}
    </div>
  )
}

// === Carte des prédictions ===
function DistributionChart({ round }) {
  const [show, setShow] = useState(false)

  const bets = [...round.bets].sort((a, b) => a.value - b.value)
  const values = bets.map((b) => b.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  return (
    <div className="dist-chart-section">
      <button className="dist-toggle" onClick={() => setShow(!show)}>
        📜 Carte des prédictions {show ? '▲' : '▼'}
      </button>
      {show && (
        <div className="dist-chart">
          {bets.map((bet) => {
            const pct = ((bet.value - min) / range) * 80 + 10
            const isWinner = round.winners && round.winners.includes(bet.id)
            return (
              <div key={bet.id} className="dist-bar-row">
                <span className="dist-bar-label">{bet.avatar || '🛡️'} {bet.name}</span>
                <div className="dist-bar-track">
                  <div
                    className={`dist-bar-fill ${isWinner ? 'winner' : ''}`}
                    style={{ width: `${pct}%` }}
                  />
                  <span className="dist-bar-value">
                    {round.type === 'time' ? formatTime(bet.value) : bet.value}
                  </span>
                </div>
              </div>
            )
          })}
          {round.actualValue !== null && round.actualValue !== undefined && (
            <div className="dist-actual">
              🎯 Résultat : {round.type === 'time' ? formatTime(round.actualValue) : round.actualValue}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// === Profile Modal ===
function ProfileModal({ player, onClose }) {
  const total = player.wins + player.losses
  const winRate = total > 0 ? Math.round((player.wins / total) * 100) : 0

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="profile-header">
          <span className="profile-avatar-lg">{player.avatar || '🛡️'}</span>
          <h2>{player.name}</h2>
        </div>
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="stat-value">{player.score}</span>
            <span className="stat-label">Points</span>
          </div>
          <div className="profile-stat">
            <span className="stat-value">{player.wins}</span>
            <span className="stat-label">Victoires</span>
          </div>
          <div className="profile-stat">
            <span className="stat-value">{player.losses}</span>
            <span className="stat-label">Défaites</span>
          </div>
          <div className="profile-stat">
            <span className="stat-value">{winRate}%</span>
            <span className="stat-label">Win rate</span>
          </div>
          <div className="profile-stat">
            <span className="stat-value">{player.currentStreak}</span>
            <span className="stat-label">Série actuelle</span>
          </div>
          <div className="profile-stat">
            <span className="stat-value">{player.bestStreak}</span>
            <span className="stat-label">Meilleure série</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// === Hall of Fame Modal ===
function HallOfFameModal({ rounds, onClose }) {
  const hallOfFame = useMemo(() => computeHallOfFame(rounds), [rounds])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>🏆 Hall of Fame</h2>
        <p className="modal-subtitle">Les meilleures prédictions de l'histoire</p>
        {hallOfFame.length === 0 ? (
          <p className="empty-state-text">Aucun pari clôturé pour le moment</p>
        ) : (
          <div className="hall-of-fame-list">
            {hallOfFame.map((entry, i) => (
              <div key={i} className={`hof-item ${entry.isWinner ? 'winner' : ''}`}>
                <span className="hof-rank">#{i + 1}</span>
                <span className="hof-avatar">{entry.avatar || '🛡️'}</span>
                <div className="hof-info">
                  <span className="hof-name">{entry.name}</span>
                  <span className="hof-detail">
                    {entry.type === 'time' ? formatTime(entry.value) : entry.value}
                    {' → '}
                    {entry.type === 'time' ? formatTime(entry.actualValue) : entry.actualValue}
                    {' ('}écart: {entry.diff}{entry.type === 'time' ? ' min' : ''}{')'}
                  </span>
                  <span className="hof-round">{entry.roundName}</span>
                </div>
                {entry.isWinner && <span className="hof-badge">👑 Gagnant</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// === Confetti Overlay ===
const CONFETTI_EMOJIS = ['⚔️', '🏹', '🛡️', '👑', '🏰', '🔥', '🏆', '⚔️', '🗡️', '🛡️']

// === Knight Rider Animation ===
function KnightRider() {
  const [riding, setRiding] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setRiding(true)
      setTimeout(() => setRiding(false), 4000)
    }, 20000)
    return () => clearInterval(interval)
  }, [])

  if (!riding) return null

  return (
    <div className="knight-rider">
      <div className="knight-horse">
        <div className="knight-body">🐎</div>
        <div className="knight-rider-figure">⚔️</div>
        <div className="knight-cape"></div>
      </div>
      <div className="knight-dust">
        <span>💨</span><span>💨</span><span>💨</span>
      </div>
    </div>
  )
}

// === Sound effects (Web Audio API) ===
let audioCtx = null
function getAudioCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)() } catch { return null }
  }
  return audioCtx
}

function playTone(freq, duration, type = 'sine', volume = 0.15) {
  const ctx = getAudioCtx()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

export function playSound(name) {
  switch (name) {
    case 'bet':
      playTone(523, 0.1, 'triangle')
      setTimeout(() => playTone(659, 0.1, 'triangle'), 80)
      break
    case 'win':
      playTone(523, 0.15, 'sine')
      setTimeout(() => playTone(659, 0.15, 'sine'), 100)
      setTimeout(() => playTone(784, 0.2, 'sine'), 200)
      setTimeout(() => playTone(1047, 0.3, 'sine'), 300)
      break
    case 'close':
      playTone(330, 0.2, 'sawtooth', 0.1)
      setTimeout(() => playTone(440, 0.2, 'sawtooth', 0.1), 150)
      break
    default:
      playTone(440, 0.1)
  }
}


function ConfettiOverlay() {
  const pieces = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 2 + Math.random() * 1.5,
      size: 1 + Math.random() * 0.8,
      rotate: Math.random() * 360,
    }))
  }, [])

  return (
    <div className="confetti-overlay">
      <div className="arrow-animation">
        <span className="arrow-emoji">🏹</span>
        <span className="arrow-projectile">➤</span>
        <span className="target-emoji">🎯</span>
      </div>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            fontSize: `${p.size}rem`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  )
}

// === Onboarding Modal ===
function OnboardingModal({ userName, userAvatar, onSave, onClose }) {
  const [name, setName] = useState(userName || '')
  const [avatar, setAvatar] = useState(userAvatar || AVATARS[0].emoji)

  function handleSave() {
    if (!name.trim()) return
    onSave(name.trim(), avatar)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal onboarding-modal" onClick={(e) => e.stopPropagation()}>
        <h2>🏰 Bienvenue au royaume</h2>
        <p className="modal-subtitle">Choisis ton nom et ton avatar pour commencer à parier</p>
        <div className="onboarding-avatar-grid">
          {AVATARS.map((a) => (
            <button
              key={a.emoji}
              className={`onboarding-avatar-btn ${avatar === a.emoji ? 'selected' : ''}`}
              onClick={() => setAvatar(a.emoji)}
              title={a.name}
            >
              <span className="onboarding-avatar-emoji">{a.emoji}</span>
              <span className="onboarding-avatar-name">{a.name}</span>
            </button>
          ))}
        </div>
        <div className="onboarding-name-section">
          <input
            type="text"
            placeholder="Ton prénom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
          />
          <button className="btn btn-primary" onClick={handleSave} disabled={!name.trim()}>
            ⚔️ Commencer
          </button>
        </div>
      </div>
    </div>
  )
}
