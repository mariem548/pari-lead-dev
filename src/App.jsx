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
      {/* Background arch (mustard) */}
      <path d="M8 56 L8 20 Q8 8 32 8 Q56 8 56 20 L56 56 Z" fill="#e8b84b" opacity="0.25" />
      {/* Castle towers */}
      <rect x="20" y="34" width="24" height="22" fill="#3a3a4a" />
      <rect x="14" y="26" width="9" height="30" fill="#4a4a5a" />
      <rect x="41" y="26" width="9" height="30" fill="#4a4a5a" />
      {/* Tower cone roofs (red) */}
      <polygon points="14,26 18.5,18 23,26" fill="#c8443a" />
      <polygon points="41,26 45.5,18 50,26" fill="#c8443a" />
      <polygon points="20,34 32,22 44,34" fill="#c8443a" />
      {/* Crenellations */}
      <rect x="14" y="23" width="2" height="4" fill="#4a4a5a" />
      <rect x="18" y="23" width="2" height="4" fill="#4a4a5a" />
      <rect x="41" y="23" width="2" height="4" fill="#4a4a5a" />
      <rect x="45" y="23" width="2" height="4" fill="#4a4a5a" />
      {/* Windows (black slits) */}
      <rect x="16" y="32" width="1.5" height="6" fill="#1a1a2a" />
      <rect x="46" y="32" width="1.5" height="6" fill="#1a1a2a" />
      {/* Castle door */}
      <path d="M27 50 Q27 44 32 44 Q37 44 37 50 L37 56 L27 56 Z" fill="#1a1a2a" />
      {/* GIT text on castle wall */}
      <text x="32" y="40" textAnchor="middle" fontSize="8" fontWeight="700" fill="#e8b84b" fontFamily="Cinzel, serif" letterSpacing="0.5">GIT</text>
      {/* Knight on horse (left foreground) */}
      {/* Horse body */}
      <path d="M8 52 Q8 48 14 47 L22 47 Q26 47 28 50 L28 53 Q28 55 26 55 L24 55 L24 56 L22 56 L22 55 L14 55 Q8 55 8 52 Z" fill="#2a2a3a" />
      {/* Horse legs */}
      <rect x="11" y="53" width="2" height="5" fill="#2a2a3a" />
      <rect x="24" y="53" width="2" height="5" fill="#2a2a3a" />
      {/* Horse head */}
      <path d="M6 49 Q4 46 6 44 L10 44 Q12 46 11 49 L9 51 Q7 51 6 49 Z" fill="#2a2a3a" />
      {/* Knight body (armor) */}
      <path d="M16 42 Q14 46 16 50 L22 50 Q24 46 22 42 Z" fill="#c8a032" />
      {/* Knight head with crown */}
      <circle cx="19" cy="39" r="3.5" fill="#d4a04a" />
      {/* Crown */}
      <polygon points="16,36 17.5,33 19,35 20.5,33 22,36" fill="#e8b84b" />
      {/* Cape (red) */}
      <path d="M16 42 L13 50 L16 50 Z" fill="#c8443a" />
      <path d="M22 42 L25 50 L22 50 Z" fill="#c8443a" />
      {/* Polearm/spear */}
      <line x1="24" y1="50" x2="27" y2="28" stroke="#e8b84b" strokeWidth="1.5" strokeLinecap="round" />
      <polygon points="26,28 27,24 28,28" fill="#c8443a" />
      {/* Sun/crest on castle */}
      <circle cx="32" cy="28" r="3" fill="#e8b84b" opacity="0.6" />
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
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      return !sessionStorage.getItem('pari-lead-dev-user') || !sessionStorage.getItem(AVATAR_KEY)
    } catch {
      return true
    }
  })
  // Story popup shows AFTER onboarding (mandatory read)
  const [showStory, setShowStory] = useState(false)
  const [avatarEntrance, setAvatarEntrance] = useState(false)
  const [activeTab, setActiveTab] = useState('paris')
  const [profilePlayer, setProfilePlayer] = useState(null)
  const [showHallOfFame, setShowHallOfFame] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [toasts, setToasts] = useState([])

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
        setAvatarEntrance(true)
        setTimeout(() => setAvatarEntrance(false), 100)
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
        showToast(`🏆 ${winnerNames.join(', ')} ${winnerNames.length > 1 ? 'gagnent' : 'gagne'} ! ${getPunchline()}`, 'success')
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
  if (loading && !showOnboarding) {
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
      <AvatarEntranceAnimation avatar={userAvatar} name={userName} trigger={avatarEntrance} />

      {/* Onboarding modal - mandatory, no skip */}
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
            setActiveTab('paris')
            setAvatarEntrance(true)
            // Show mandatory story popup after onboarding
            const storySeen = sessionStorage.getItem(STORY_KEY)
            if (!storySeen) {
              setShowStory(true)
            }
          }}
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
        <div className="header-right">
          {userName && (
            <button className="profile-switch-btn" onClick={() => setShowOnboarding(true)} aria-label="Changer de profil" title="Changer de profil">
              <span className="profile-switch-avatar">{userAvatar || '🛡️'}</span>
              <span className="profile-switch-name">{userName}</span>
            </button>
          )}
          <button className="theme-toggle" onClick={toggle} aria-label="Changer de thème">
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button className="story-toggle" onClick={() => setShowStory(true)} aria-label="Notre histoire">
            📜
          </button>
        </div>
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

      {/* Tab navigation */}
      <nav className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'paris' ? 'active' : ''}`}
          onClick={() => setActiveTab('paris')}
        >
          ⚔️ Salle des paris
        </button>
        <button
          className={`tab-btn ${activeTab === 'classement' ? 'active' : ''}`}
          onClick={() => setActiveTab('classement')}
        >
          👑 Royaume
        </button>
      </nav>

      {activeTab === 'paris' && (
      <>
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
              userName={userName}
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
            <div className="header-actions">
              <MonthlyRecap rounds={rounds} />
              <button className="btn btn-secondary hall-of-fame-btn" onClick={() => setShowHallOfFame(true)}>
                🏆 Hall of Fame
              </button>
            </div>
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
      </>
      )}

      {/* Classement tab - Kingdom Map */}
      {activeTab === 'classement' && (
        <KingdomLeaderboard
          leaderboard={leaderboard}
          onPlayerClick={setProfilePlayer}
          rounds={rounds}
          onOpenHallOfFame={() => setShowHallOfFame(true)}
          userName={userName}
        />
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
  const [expanded, setExpanded] = useState(false)

  function handleSubmit() {
    onCreate(name, 'time')
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
            placeholder="Arrivée du lead dev"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>
        <div className="flex-gap-2">
          <button className="btn btn-primary" onClick={handleSubmit}>
            Créer le pari
          </button>
          <button className="btn btn-secondary" onClick={() => setExpanded(false)}>
            Annuler
          </button>
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
          Format heure : 9.30 = 9h30, 9.3 = 9h30, 9:30 = 9h30, 10 = 10h00
        </p>
      </div>
    </div>
  )
}

// === Round Card ===
function RoundCard({ round, onAddBet, onRemoveBet, onClose, onReopen, onDelete, userAvatar, setUserAvatar, userName }) {
  const [betValue, setBetValue] = useState('')
  const [actualInput, setActualInput] = useState(round.actualInput || '')
  const [error, setError] = useState('')

  const isOpen = round.status === 'open'
  const winners = round.winners || []

  function handleAddBet() {
    if (!betValue.trim()) return
    const value = parseTimeLocal(betValue)
    if (value === null) {
      setError('Format invalide. Ex: 9.30, 9:30, 10h00')
      return
    }
    setError('')
    onAddBet(round.id, userName, betValue, 'time', userAvatar)
    setBetValue('')
  }

  function handleClose() {
    if (!actualInput.trim()) return
    const value = parseTimeLocal(actualInput)
    if (value === null) {
      setError('Format invalide')
      return
    }
    setError('')
    onClose(round.id, actualInput, 'time')
  }

  // Sort bets by value for display
  const sortedBets = [...round.bets].sort((a, b) => a.value - b.value)

  function formatValue(v) {
    return formatTime(v)
  }

  function formatDiff(bet) {
    if (round.actualValue === null || round.actualValue === undefined) return ''
    const diff = Math.abs(bet.value - round.actualValue)
    const mins = Math.round(diff)
    if (mins < 1) return 'pile !'
    if (mins === 1) return 'à 1 min'
    return `à ${mins} min`
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header">
        <div>
          <div className="card-title">{round.name}</div>
          <div className="card-subtitle">
            Pari sur l'arrivée du Lead Dev — {round.bets.length} participant{round.bets.length > 1 ? 's' : ''}{round.createdAt ? ` — ${formatDate(round.createdAt)}` : ''}
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
              <span className="bet-form-name">{userName || 'Anonyme'}</span>
            </div>
            <input
              type="text"
              placeholder="9.30"
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
              Heure d'arrivée réelle
            </label>
            <input
              type="text"
              placeholder="10.00"
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
            Heure d'arrivée
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
                    {formatTime(bet.value)}
                  </span>
                </div>
              </div>
            )
          })}
          {round.actualValue !== null && round.actualValue !== undefined && (
            <div className="dist-actual">
              🎯 Résultat : {formatTime(round.actualValue)}
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
                    {formatTime(entry.value)}
                    {' → '}
                    {formatTime(entry.actualValue)}
                    {' ('}écart: {entry.diff} min{')'}
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

// === Avatar Entrance Animation ===
function AvatarEntranceAnimation({ avatar, name, trigger }) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (trigger) {
      setActive(true)
      setTimeout(() => setActive(false), 2500)
    }
  }, [trigger])

  if (!active) return null

  // Map avatar to animation type
  const AVATAR_ANIMATIONS = {
    '🧙': { particle: '✨', effect: 'Fumée magique', class: 'anim-magic' },
    '🔮': { particle: '✨', effect: 'Fumée magique', class: 'anim-magic' },
    '🏹': { particle: '🏹', effect: 'Flèche', class: 'anim-arrow' },
    '⚔️': { particle: '💨', effect: 'Galop', class: 'anim-horse' },
    '🛡️': { particle: '💨', effect: 'Galop', class: 'anim-horse' },
    '👑': { particle: '👑', effect: 'Couronne dorée', class: 'anim-crown' },
    '🏰': { particle: '👑', effect: 'Couronne dorée', class: 'anim-crown' },
    '📜': { particle: '📜', effect: 'Parchemin', class: 'anim-scroll' },
    '🐉': { particle: '🔥', effect: 'Souffle de dragon', class: 'anim-fire' },
    '🔥': { particle: '🔥', effect: 'Flammes', class: 'anim-fire' },
    '🌙': { particle: '⭐', effect: 'Étoiles', class: 'anim-stars' },
    '🗡️': { particle: '🗡️', effect: 'Lame', class: 'anim-blade' },
  }

  const anim = AVATAR_ANIMATIONS[avatar] || { particle: '✨', effect: 'Apparition', class: 'anim-magic' }

  return (
    <div className={`avatar-entrance ${anim.class}`}>
      <div className="avatar-entrance-figure">
        <span className="avatar-entrance-emoji">{avatar}</span>
        <span className="avatar-entrance-name">{name}</span>
      </div>
      <div className="avatar-entrance-particles">
        {[...Array(8)].map((_, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>{anim.particle}</span>
        ))}
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

// === Monthly Recap (Parchemin Royal) ===
function MonthlyRecap({ rounds, onOpenBanquet }) {
  const [show, setShow] = useState(false)
  const [recapSeen, setRecapSeen] = useState(() => {
    try {
      const month = new Date().getMonth()
      return sessionStorage.getItem('pari-lead-dev-recap-seen') === String(month)
    } catch {
      return false
    }
  })

  const recap = useMemo(() => api.computeMonthlyRecap(rounds), [rounds])

  // Show toast when recap becomes available and hasn't been seen
  useEffect(() => {
    if (recap && !recapSeen) {
      // Badge stays visible until user opens the recap
    }
  }, [recap, recapSeen])

  function openRecap() {
    setShow(true)
    try {
      const month = new Date().getMonth()
      sessionStorage.setItem('pari-lead-dev-recap-seen', String(month))
    } catch {}
    setRecapSeen(true)
    if (onOpenBanquet) onOpenBanquet()
  }

  if (!recap) return null

  const monthName = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  function formatTime(val) {
    const rounded = Math.round(val)
    const h = Math.floor(rounded / 60)
    const m = rounded % 60
    return `${h}h${m.toString().padStart(2, '0')}`
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr)
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
  }

  const latestDate = recap.latest.round.closedAt
  const earliestDate = recap.earliest.round.closedAt

  return (
    <>
      <button className="btn btn-secondary monthly-recap-btn" onClick={openRecap}>
        📜 Parchemin Royal du Mois
        {!recapSeen && <span className="recap-badge">!</span>}
      </button>
      {show && (
        <div className="modal-overlay" onClick={() => setShow(false)}>
          <div className="modal monthly-recap-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShow(false)}>✕</button>
            <h2>📜 Parchemin Royal</h2>
            <p className="modal-subtitle">Chroniques de {monthName}</p>

            <div className="recap-section">
              <div className="recap-item recap-late">
                <span className="recap-icon">🐌</span>
                <div className="recap-text">
                  <strong>Arrivée la plus tardive</strong>
                  <p>Le Suprême Lead Dev a brillé par son retard le <strong>{formatDate(latestDate)}</strong> à <strong>{formatTime(recap.latest.round.actualValue)}</strong>.</p>
                  {recap.latest.winners.length > 0 && (
                    <p className="recap-winner">👏 Le royaume applaudit {recap.latest.winners.map((w) => `${w.avatar || ''} ${w.name}`).join(', ')} — grand{recap.latest.winners.length > 1 ? 's' : ''} prophète{recap.latest.winners.length > 1 ? 's' : ''} du jour !</p>
                  )}
                </div>
              </div>

              <div className="recap-item recap-early">
                <span className="recap-icon">⚡</span>
                <div className="recap-text">
                  <strong>Arrivée la plus tôt</strong>
                  <p>Notre Lead Dev a daigné se lever tôt le <strong>{formatDate(earliestDate)}</strong> à <strong>{formatTime(recap.earliest.round.actualValue)}</strong>.</p>
                  {recap.earliest.winners.length > 0 && (
                    <p className="recap-winner">👏 Félicitations à {recap.earliest.winners.map((w) => `${w.avatar || ''} ${w.name}`).join(', ')} pour cette prédiction matiale !</p>
                  )}
                </div>
              </div>

              {recap.topPredictor && (
                <div className="recap-item recap-predictor">
                  <span className="recap-icon">👑</span>
                  <div className="recap-text">
                    <strong>Grand Oracle du mois</strong>
                    <p>{recap.topPredictor.avatar || ''} <strong>{recap.topPredictor.name}</strong> a remporté <strong>{recap.topPredictor.wins}</strong> pari{recap.topPredictor.wins > 1 ? 's' : ''} ce mois-ci !</p>
                  </div>
                </div>
              )}

              {recap.bestBet && (
                <div className="recap-item recap-precise">
                  <span className="recap-icon">🎯</span>
                  <div className="recap-text">
                    <strong>Prédiction la plus précise</strong>
                    <p>{recap.bestBet.avatar || ''} <strong>{recap.bestBet.name}</strong> a deviné l'heure à <strong>{formatTime(recap.bestBet.value)}</strong> pour « {recap.bestBet.roundName} » — pile à {recap.bestBet.diff === 0 ? "l'heure exacte !" : `${recap.bestBet.diff} min près`}</p>
                  </div>
                </div>
              )}

              <div className="recap-stats">
                <div className="recap-stat">
                  <span className="recap-stat-value">{recap.totalRounds}</span>
                  <span className="recap-stat-label">Paris ce mois-ci</span>
                </div>
                <div className="recap-stat">
                  <span className="recap-stat-value">{formatTime(recap.avgArrival)}</span>
                  <span className="recap-stat-label">Heure d'arrivée moyenne</span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
              <ShareableParchment recap={recap} monthName={monthName} />
            </div>

            <button className="btn btn-primary recap-close-btn" onClick={() => setShow(false)}>
              ⚔️ Fermer le parchemin
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// === Medieval titles ===
const MEDIEVAL_TITLES = [
  { min: 0, title: 'Vilain du village', icon: '🧑‍🌾' },
  { min: 1, title: 'Écuyer', icon: '🛡️' },
  { min: 3, title: 'Chevalier', icon: '⚔️' },
  { min: 6, title: 'Baron', icon: '🏰' },
  { min: 10, title: 'Comte', icon: '👑' },
  { min: 15, title: 'Grand Oracle', icon: '🔮' },
  { min: 25, title: 'Souverain du Retard', icon: '👑' },
]

function getMedievalTitle(score) {
  let result = MEDIEVAL_TITLES[0]
  for (const t of MEDIEVAL_TITLES) {
    if (score >= t.min) result = t
  }
  return result
}

// === Delay Calendar ===
function DelayCalendar({ rounds }) {
  const [show, setShow] = useState(false)

  const monthDays = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d)
      const dateStr = date.toDateString()
      const dayRounds = rounds.filter((r) => {
        if (!r.closedAt) return false
        return new Date(r.closedAt).toDateString() === dateStr
      })
      let maxHour = null
      let winners = []
      dayRounds.forEach((r) => {
        if (r.type === 'time' && r.actualValue !== null) {
          const h = r.actualValue / 60
          if (maxHour === null || h > maxHour) maxHour = h
          winners = r.winners || []
        }
      })
      days.push({ date, day: d, maxHour, winners, rounds: dayRounds.length })
    }
    return days
  }, [rounds])

  return (
    <>
      <button className="btn btn-secondary" onClick={() => setShow(true)}>
        📅 Calendrier des retards
      </button>
      {show && (
        <div className="modal-overlay" onClick={() => setShow(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShow(false)}>✕</button>
            <h2>📅 Calendrier des Retards</h2>
            <p className="modal-subtitle">{new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
            <div className="calendar-grid">
              {monthDays.map((d) => (
                <div
                  key={d.day}
                  className={`calendar-day ${d.maxHour !== null ? 'has-delay' : ''} ${d.maxHour >= 11 ? 'delay-late' : d.maxHour >= 10 ? 'delay-medium' : d.maxHour !== null ? 'delay-early' : ''}`}
                  title={d.maxHour !== null ? `${d.date.toLocaleDateString('fr-FR')} - Arrivee: ${Math.floor(d.maxHour)}h${Math.round((d.maxHour % 1) * 60).toString().padStart(2, '0')}` : d.date.toLocaleDateString('fr-FR')}
                >
                  <span className="calendar-day-num">{d.day}</span>
                  {d.maxHour !== null && (
                    <span className="calendar-day-icon">
                      {d.maxHour >= 11 ? '⛈️' : d.maxHour >= 10 ? '🌧️' : '☀️'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// === Daily Quests ===
function DailyQuests({ rounds, userName }) {
  const [show, setShow] = useState(false)

  const quests = useMemo(() => {
    const today = new Date().toDateString()
    const todayRounds = rounds.filter((r) => {
      const d = new Date(r.createdAt || r.closedAt)
      return d.toDateString() === today && r.actualValue !== null
    })

    const playerBets = []
    todayRounds.forEach((r) => {
      r.bets.forEach((b) => {
        if (b.name === userName) {
          playerBets.push({ ...b, actualValue: r.actualValue })
        }
      })
    })

    const winners = todayRounds.flatMap((r) =>
      (r.winners || []).map((w) => {
        const bet = r.bets.find((b) => b.id === w)
        return bet ? bet.name : null
      })
    )

    // Check consecutive wins
    let streak = 0
    const sortedRounds = [...todayRounds].sort((a, b) =>
      new Date(a.closedAt) - new Date(b.closedAt)
    )
    for (const r of sortedRounds) {
      const roundWinners = (r.winners || []).map((w) => {
        const bet = r.bets.find((b) => b.id === w)
        return bet ? bet.name : null
      })
      if (roundWinners.includes(userName)) {
        streak++
      } else {
        break
      }
    }

    return [
      {
        icon: '🎯',
        name: 'Oracle precis',
        desc: 'Predire a moins de 5 minutes',
        done: playerBets.some((b) => Math.abs(b.value - b.actualValue) <= 5),
      },
      {
        icon: '👑',
        name: 'Double couronne',
        desc: 'Gagner 2 fois de suite',
        done: streak >= 2,
      },
    ]
  }, [rounds, userName])

  if (!userName) return null

  return (
    <>
      <button className="btn btn-secondary" onClick={() => setShow(true)}>
        ⚔️ Quetes du jour ({quests.filter((q) => q.done).length}/{quests.length})
      </button>
      {show && (
        <div className="modal-overlay" onClick={() => setShow(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShow(false)}>✕</button>
            <h2>⚔️ Quetes du Jour</h2>
            <p className="modal-subtitle">Challenges de {userName}</p>
            <div className="quests-list">
              {quests.map((q, i) => (
                <div key={i} className={`quest-item ${q.done ? 'done' : ''}`}>
                  <span className="quest-icon">{q.done ? '✅' : q.icon}</span>
                  <div>
                    <strong>{q.name}</strong>
                    <p>{q.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// === Royal Punchlines ===
const ROYAL_PUNCHLINES = [
  'Le roi a parle, les devins tremblent !',
  'Que la fortune vous sourie, noble devin.',
  'L\'heure du jugement a sonne !',
  'Le sort en est jete, les paris sont clos.',
  'Aujourd\'hui, la providence a choisi son champion.',
  'Les astres ont parle, les taverne se taisent.',
  'Le banquier du royaume a rendu son verdict.',
  'La couronne du devin brille de mille feux !',
  'Un nouveau prophetes entre dans la legende.',
  'Les hirondelles annoncent une grande victoire.',
]

function getPunchline() {
  return ROYAL_PUNCHLINES[Math.floor(Math.random() * ROYAL_PUNCHLINES.length)]
}

// === Monthly Tournament ===
function MonthlyTournament({ rounds }) {
  const monthRounds = useMemo(() => {
    const now = new Date()
    return rounds.filter((r) => {
      if (!r.closedAt) return false
      const d = new Date(r.closedAt)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }, [rounds])

  const monthName = new Date().toLocaleDateString('fr-FR', { month: 'long' })

  const tournamentLeaderboard = useMemo(() => {
    const stats = {}
    monthRounds.forEach((r) => {
      (r.winners || []).forEach((w) => {
        const bet = r.bets.find((b) => b.id === w)
        if (!bet) return
        if (!stats[bet.name]) stats[bet.name] = { name: bet.name, avatar: bet.avatar, wins: 0 }
        stats[bet.name].wins++
      })
    })
    return Object.values(stats).sort((a, b) => b.wins - a.wins)
  }, [monthRounds])

  if (tournamentLeaderboard.length === 0) return null

  const champion = tournamentLeaderboard[0]

  return (
    <div className="tournament-card">
      <h3>🏆 Tournoi de {monthName}</h3>
      <div className="tournament-podium">
        {tournamentLeaderboard.slice(0, 3).map((p, i) => (
          <div key={p.name} className={`podium-item rank-${i + 1}`}>
            <span className="podium-avatar">{p.avatar || '🛡️'}</span>
            <span className="podium-name">{p.name}</span>
            <span className="podium-wins">{p.wins} victoire{p.wins > 1 ? 's' : ''}</span>
          </div>
        ))}
      </div>
      {champion && (
        <p className="tournament-champion">
          👑 Champion: {champion.avatar} {champion.name} avec {champion.wins} victoire{champion.wins > 1 ? 's' : ''} !
        </p>
      )}
    </div>
  )
}

// === Shareable Parchment ===
function ShareableParchment({ recap, monthName }) {
  const [copied, setCopied] = useState(false)

  function copyParchment() {
    const text = `📜 Parchemin Royal - ${monthName}

🐌 Arrivée la plus tardive: ${formatDate(recap.latest.round.closedAt)} à ${formatTime(recap.latest.round.actualValue)}
   Gagnant: ${recap.latest.winners.map((w) => w.name).join(', ')}

⚡ Arrivée la plus tôt: ${formatDate(recap.earliest.round.closedAt)} à ${formatTime(recap.earliest.round.actualValue)}
   Gagnant: ${recap.earliest.winners.map((w) => w.name).join(', ')}

👑 Grand Oracle: ${recap.topPredictor?.name} (${recap.topPredictor?.wins} victoires)
🎯 Prédiction la plus précise: ${recap.bestBet?.name} (${recap.bestBet?.diff} min)
📊 Total: ${recap.totalRounds} paris - Moyenne: ${formatTime(recap.avgArrival)}

Via Pari Lead Dev`

    try {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <button className="btn btn-primary" onClick={copyParchment}>
      {copied ? '✅ Copie !' : '📋 Copier le parchemin'}
    </button>
  )
}

// === Banquet Animation ===
function BanquetAnimation({ trigger }) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (trigger) {
      setActive(true)
      setTimeout(() => setActive(false), 3000)
    }
  }, [trigger])

  if (!active) return null

  return (
    <div className="banquet-overlay">
      <div className="banquet-trumpet">🎺</div>
      <div className="banquet-trumpet banquet-trumpet-2">🎺</div>
      <div className="banquet-text">Que le banquet commence !</div>
    </div>
  )
}

// === Player Joust ===
function PlayerJoust({ leaderboard }) {
  if (leaderboard.length < 2) return null

  const [p1, p2] = leaderboard
  const duels = [
    { icon: '⚔️', label: 'Duel de l\'aube' },
    { icon: '🏹', label: 'Joute des archers' },
    { icon: '🔮', label: 'Sortilege des mages' },
  ]
  const duel = duels[Math.floor(Math.random() * duels.length)]

  return (
    <div className="joust-card">
      <h3>{duel.icon} {duel.label}</h3>
      <div className="joust-arena">
        <div className="joust-player">
          <span className="joust-avatar">{p1.avatar || '🛡️'}</span>
          <span className="joust-name">{p1.name}</span>
          <span className="joust-score">{p1.score} pts</span>
        </div>
        <span className="joust-vs">VS</span>
        <div className="joust-player">
          <span className="joust-avatar">{p2.avatar || '🛡️'}</span>
          <span className="joust-name">{p2.name}</span>
          <span className="joust-score">{p2.score} pts</span>
        </div>
      </div>
    </div>
  )
}

// === Kingdom Weather ===
function getKingdomWeather(rounds) {
  const closed = rounds.filter((r) => r.type === 'time' && r.actualValue !== null)
  if (closed.length === 0) return { icon: '☀️', label: 'Ciel degage', class: 'weather-sunny' }

  const latest = closed.reduce((a, b) => (a.actualValue > b.actualValue ? a : b))
  const hour = Math.floor(latest.actualValue / 60)

  if (hour >= 11) return { icon: '⛈️', label: 'Tempete de retard', class: 'weather-storm' }
  if (hour >= 10) return { icon: '🌧️', label: 'Pluie d\'impatience', class: 'weather-rain' }
  if (hour >= 9) return { icon: '⛅', label: 'Nuages d\'attente', class: 'weather-cloudy' }
  return { icon: '☀️', label: 'Soleil matinal', class: 'weather-sunny' }
}

// === Funny trophies ===
const TROPHIES = [
  { id: 'pile', icon: '🎯', name: 'Pile à l\'heure', desc: 'Prédiction exacte (0 min d\'écart)' },
  { id: 'proche', icon: '🏹', name: 'Presque devin', desc: 'Prédiction à 5 min ou moins' },
  { id: 'optimiste', icon: '🌅', name: 'Trop optimiste', desc: 'Toujours en avance sur le lead dev' },
  { id: 'cafe', icon: '☕', name: 'Prophète du café', desc: 'Au moins 3 paris avant 10h' },
  { id: 'stagiaire', icon: '📝', name: 'Stagiaire du Royaume', desc: 'Premier pari joué' },
  { id: 'habitue', icon: '⚔️', name: 'Habitué de la taverne', desc: 'Au moins 5 paris joués' },
  { id: 'champion', icon: '👑', name: 'Champion du mois', desc: 'Meilleur prédicteur du mois' },
  { id: 'meme', icon: '🔄', name: 'L\'Éternel', desc: 'Au moins 10 paris joués' },
]

function computeTrophies(rounds, playerName) {
  const unlocked = new Set()
  const playerBets = []
  rounds.forEach((r) => {
    r.bets.forEach((bet) => {
      if (bet.name === playerName) {
        playerBets.push({ ...bet, actualValue: r.actualValue, roundName: r.name })
        if (r.actualValue !== null) {
          const diff = Math.abs(bet.value - r.actualValue)
          if (diff === 0) unlocked.add('pile')
          if (diff <= 5) unlocked.add('proche')
          if (bet.value < r.actualValue) unlocked.add('optimiste')
          const h = Math.floor(bet.value / 60)
          if (h < 10) unlocked.add('cafe')
        }
      }
    })
  })
  if (playerBets.length >= 1) unlocked.add('stagiaire')
  if (playerBets.length >= 5) unlocked.add('habitue')
  if (playerBets.length >= 10) unlocked.add('meme')
  return TROPHIES.map((t) => ({ ...t, unlocked: unlocked.has(t.id) }))
}

// === Achievement Chest ===
function AchievementChest({ rounds, playerName }) {
  const [show, setShow] = useState(false)
  const trophies = useMemo(() => computeTrophies(rounds, playerName), [rounds, playerName])
  const unlockedCount = trophies.filter((t) => t.unlocked).length

  if (!playerName) return null

  return (
    <>
      <button className="btn btn-secondary" onClick={() => setShow(true)}>
        🎁 Coffre aux exploits ({unlockedCount}/{trophies.length})
      </button>
      {show && (
        <div className="modal-overlay" onClick={() => setShow(false)}>
          <div className="modal achievement-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShow(false)}>✕</button>
            <h2>🎁 Coffre aux Exploits</h2>
            <p className="modal-subtitle">Trophées de {playerName}</p>
            <div className="trophies-grid">
              {trophies.map((t) => (
                <div key={t.id} className={`trophy-card ${t.unlocked ? 'unlocked' : 'locked'}`}>
                  <span className="trophy-icon">{t.unlocked ? t.icon : '🔒'}</span>
                  <span className="trophy-name">{t.name}</span>
                  <span className="trophy-desc">{t.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// === Kingdom Leaderboard (Classement + Carte du royaume) ===
function KingdomLeaderboard({ leaderboard, onPlayerClick, rounds, onOpenHallOfFame, userName }) {
  const maxScore = Math.max(...leaderboard.map((e) => e.score), 1)
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  const weather = getKingdomWeather(rounds)
  const [punchline] = useState(() => getPunchline())
  const [banquetTrigger, setBanquetTrigger] = useState(false)

  return (
    <div className={`kingdom-view ${weather.class}`}>
      <BanquetAnimation trigger={banquetTrigger} />
      <h2 className="section-title">👑 Royaume des Héros</h2>
      <p className="kingdom-date">{today}</p>
      <div className="kingdom-weather">
        <span className="weather-icon">{weather.icon}</span>
        <span className="weather-label">{weather.label}</span>
      </div>
      <p className="kingdom-punchline">{punchline}</p>

      {/* Carte du royaume */}
      <div className="kingdom-map">
        {/* Village (start) */}
        <div className="kingdom-start">
          <span className="kingdom-icon">🏘️</span>
          <span className="kingdom-label">Village</span>
        </div>

        {/* Path with players */}
        <div className="kingdom-path">
          {/* Castle at the end */}
          <div className="kingdom-castle">
            <span className="kingdom-icon">🏰</span>
            <span className="kingdom-label">Château GIT</span>
          </div>
          {leaderboard.map((entry, i) => {
            const progress = Math.round((entry.score / maxScore) * 100)
            const rank = i + 1
            const isLeader = rank === 1
            return (
              <div
                key={entry.name}
                className={`kingdom-player rank-${rank}`}
                style={{ left: `${Math.max(5, Math.min(progress - 3, 88))}%`, top: `${(i % 3) * 35 + 10}px` }}
                onClick={() => onPlayerClick(entry)}
                title={`${entry.name} — ${entry.score} pt${entry.score > 1 ? 's' : ''} — ${getMedievalTitle(entry.score).title}`}
              >
                <span className="kingdom-player-avatar">{entry.avatar || '🛡️'}</span>
                {isLeader && <span className="kingdom-crown">👑</span>}
                <span className="kingdom-player-tooltip">
                  {entry.name} — {entry.score} pt{entry.score > 1 ? 's' : ''}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile list fallback */}
      <div className="kingdom-list">
        {leaderboard.map((entry, i) => (
          <div key={entry.name} className={`leaderboard-item rank-${i + 1}`}>
            <div className="leaderboard-rank">{i + 1}</div>
            <span className="leaderboard-avatar">{entry.avatar || '🛡️'}</span>
            <button className="leaderboard-name clickable" onClick={() => onPlayerClick(entry)}>{entry.name}</button>
            {entry.currentStreak >= 2 && (
              <span className="streak-badge">🔥 {entry.currentStreak}</span>
            )}
            <div className="leaderboard-score">{entry.score} pt{entry.score > 1 ? 's' : ''}</div>
            <div className="leaderboard-title">{getMedievalTitle(entry.score).icon} {getMedievalTitle(entry.score).title}</div>
          </div>
        ))}
      </div>

      {/* Joust + Tournament */}
      <PlayerJoust leaderboard={leaderboard} />
      <MonthlyTournament rounds={rounds} />

      {/* Actions */}
      <div className="header-actions" style={{ justifyContent: 'center', marginTop: 'var(--space-4)', flexWrap: 'wrap' }}>
        <DailyQuests rounds={rounds} userName={userName} />
        <DelayCalendar rounds={rounds} />
        <AchievementChest rounds={rounds} playerName={userName} />
        <MonthlyRecap rounds={rounds} onOpenBanquet={() => setBanquetTrigger(true)} />
        <button className="btn btn-secondary hall-of-fame-btn" onClick={onOpenHallOfFame}>
          🏆 Hall of Fame
        </button>
      </div>
    </div>
  )
}

// === Onboarding Modal (mandatory, no skip) ===
function OnboardingModal({ userName, userAvatar, onSave }) {
  const [name, setName] = useState(userName || '')
  const [avatar, setAvatar] = useState(userAvatar || AVATARS[0].emoji)

  function handleSave() {
    if (!name.trim()) return
    onSave(name.trim(), avatar)
  }

  return (
		<div className="modal-overlay onboarding-overlay">
		<div className="modal onboarding-modal">
			<h2>🏰 Bienvenue au royaume</h2>
			<p className="modal-subtitle">Choisis ton nom et ton avatar pour commencer l'aventure</p>
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
				⚔️ Commencer l'aventure
          </button>
        </div>
      </div>
    </div>
  )
}
