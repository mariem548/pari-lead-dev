import { supabase, isSupabaseConfigured } from './supabase'

// === Storage fallback (localStorage) ===
const STORAGE_KEY = 'pari-lead-dev-data'

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { rounds: [] }
  } catch {
    return { rounds: [] }
  }
}

function saveLocal(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // blocked
  }
}

// === ID generator ===
function genId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

// === Time parsing ===
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

function parseNumber(input) {
  if (!input || typeof input !== 'string') return null
  const n = parseFloat(input.replace(',', '.'))
  return isNaN(n) ? null : n
}

// === Winner calculation ===
export function computeWinners(round) {
  if (round.actualValue === null || round.actualValue === undefined || round.bets.length === 0) return []
  const actual = round.actualValue
  const diffs = round.bets.map((bet) => ({
    id: bet.id,
    diff: Math.abs(bet.value - actual),
  }))
  const minDiff = Math.min(...diffs.map((d) => d.diff))
  return diffs.filter((d) => d.diff === minDiff).map((d) => d.id)
}

// === Leaderboard ===
export function computeLeaderboard(rounds) {
  const scores = {}
  rounds.forEach((round) => {
    if (round.status !== 'closed' || !round.winners) return
    round.bets.forEach((bet) => {
      if (!scores[bet.name]) scores[bet.name] = { name: bet.name, score: 0, wins: 0, losses: 0, avatar: bet.avatar || null, currentStreak: 0, bestStreak: 0 }
      if (round.winners.includes(bet.id)) {
        scores[bet.name].score += round.pointsPerWin || 1
        scores[bet.name].wins += 1
        scores[bet.name].currentStreak += 1
        scores[bet.name].bestStreak = Math.max(scores[bet.name].bestStreak, scores[bet.name].currentStreak)
      } else {
        scores[bet.name].losses += 1
        scores[bet.name].currentStreak = 0
      }
    })
  })
  return Object.values(scores).sort((a, b) => b.score - a.score || b.wins - a.wins)
}

export function computeHallOfFame(rounds) {
  const entries = []
  rounds.forEach((round) => {
    if (round.status !== 'closed' || round.actualValue === null || round.actualValue === undefined) return
    round.bets.forEach((bet) => {
      const diff = Math.abs(bet.value - round.actualValue)
      const isWinner = round.winners && round.winners.includes(bet.id)
      entries.push({
        name: bet.name,
        avatar: bet.avatar || null,
        roundName: round.name,
        value: bet.value,
        actualValue: round.actualValue,
        diff,
        type: round.type,
        isWinner,
        createdAt: round.createdAt,
      })
    })
  })
  return entries.sort((a, b) => a.diff - b.diff).slice(0, 5)
}

// === Date helpers ===
export function formatDate(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const days = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam']
  const months = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc']
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`
}

export function isThisWeek(ts) {
  if (!ts) return false
  const now = new Date()
  const day = now.getDay()
  const monday = new Date(now)
  const diff = day === 0 ? -6 : 1 - day
  monday.setDate(now.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  return new Date(ts) >= monday
}

export function isThisMonth(ts) {
  if (!ts) return false
  const now = new Date()
  const d = new Date(ts)
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
}

export function filterRoundsByPeriod(rounds, period) {
  if (period === 'all') return rounds
  return rounds.filter((r) => {
    if (period === 'week') return isThisWeek(r.createdAt)
    if (period === 'month') return isThisMonth(r.createdAt)
    return true
  })
}

export function formatTime(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h${String(m).padStart(2, '0')}`
}

// === SUPABASE API ===

// Map DB row to app model
function mapRound(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    bets: (row.bets || []).map((b) => ({
      id: b.id,
      name: b.name,
      value: Number(b.value),
      avatar: b.avatar || null,
    })),
    actualValue: row.actual_value !== null ? Number(row.actual_value) : null,
    actualInput: row.actual_input || '',
    status: row.status,
    winners: row.winners || [],
    pointsPerWin: row.points_per_win || 1,
    createdAt: row.created_at ? new Date(row.created_at).getTime() : null,
  }
}

async function fetchRoundsSupabase() {
  const { data: rounds, error } = await supabase
    .from('rounds')
    .select('*, bets(*)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return rounds.map(mapRound)
}

async function createRoundSupabase(name, type) {
  const { data, error } = await supabase
    .from('rounds')
    .insert({
      name: name.trim() || (type === 'time' ? 'Arrivée du lead dev' : 'Nouveau pari'),
      type,
      status: 'open',
      winners: [],
      points_per_win: 1,
    })
    .select()
    .single()

  if (error) throw error
  return mapRound(data)
}

async function addBetSupabase(roundId, name, valueStr, type, avatar) {
  const value = type === 'time' ? parseTime(valueStr) : parseNumber(valueStr)
  if (value === null) throw new Error('Invalid value')

  const { data, error } = await supabase
    .from('bets')
    .insert({
      id: genId(),
      round_id: roundId,
      name: name.trim(),
      value: value,
      avatar: avatar || null,
    })
    .select()
    .single()

  if (error) throw error
  return { id: data.id, name: data.name, value: Number(data.value), avatar: data.avatar }
}

async function removeBetSupabase(roundId, betId) {
  const { error } = await supabase.from('bets').delete().eq('id', betId)
  if (error) throw error
}

async function closeRoundSupabase(roundId, actualInput, type) {
  const value = type === 'time' ? parseTime(actualInput) : parseNumber(actualInput)
  if (value === null) throw new Error('Invalid value')

  // Fetch round to compute winners
  const { data: round } = await supabase
    .from('rounds')
    .select('*, bets(*)')
    .eq('id', roundId)
    .single()

  const bets = (round.bets || []).map((b) => ({ id: b.id, value: Number(b.value) }))
  const diffs = bets.map((b) => ({ id: b.id, diff: Math.abs(b.value - value) }))
  const minDiff = Math.min(...diffs.map((d) => d.diff))
  const winners = diffs.filter((d) => d.diff === minDiff).map((d) => d.id)

  const { error } = await supabase
    .from('rounds')
    .update({
      actual_value: value,
      actual_input: actualInput,
      status: 'closed',
      winners: winners,
    })
    .eq('id', roundId)

  if (error) throw error
}

async function reopenRoundSupabase(roundId) {
  const { error } = await supabase
    .from('rounds')
    .update({
      status: 'open',
      winners: [],
      actual_value: null,
      actual_input: null,
    })
    .eq('id', roundId)

  if (error) throw error
}

async function deleteRoundSupabase(roundId) {
  // bets are cascade deleted
  const { error } = await supabase.from('rounds').delete().eq('id', roundId)
  if (error) throw error
}

// === UNIFIED API ===
export const api = {
  isSupabase: isSupabaseConfigured,

  async fetchRounds() {
    if (isSupabaseConfigured) {
      return fetchRoundsSupabase()
    }
    return loadLocal().rounds
  },

  async createRound(name, type) {
    if (isSupabaseConfigured) {
      return createRoundSupabase(name, type)
    }
    // localStorage
    const data = loadLocal()
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
    data.rounds.push(round)
    saveLocal(data)
    return round
  },

  async addBet(roundId, name, valueStr, type, avatar) {
    if (isSupabaseConfigured) {
      return addBetSupabase(roundId, name, valueStr, type, avatar)
    }
    // localStorage
    const data = loadLocal()
    const round = data.rounds.find((r) => r.id === roundId)
    if (!round) return null
    const value = type === 'time' ? parseTime(valueStr) : parseNumber(valueStr)
    if (value === null) return null
    const bet = { id: genId(), name: name.trim(), value, avatar: avatar || null }
    round.bets.push(bet)
    saveLocal(data)
    return bet
  },

  async removeBet(roundId, betId) {
    if (isSupabaseConfigured) {
      return removeBetSupabase(roundId, betId)
    }
    const data = loadLocal()
    const round = data.rounds.find((r) => r.id === roundId)
    if (round) {
      round.bets = round.bets.filter((b) => b.id !== betId)
      saveLocal(data)
    }
  },

  async closeRound(roundId, actualInput, type) {
    if (isSupabaseConfigured) {
      return closeRoundSupabase(roundId, actualInput, type)
    }
    // localStorage
    const data = loadLocal()
    const round = data.rounds.find((r) => r.id === roundId)
    if (!round) return
    const value = type === 'time' ? parseTime(actualInput) : parseNumber(actualInput)
    if (value === null) return
    round.actualValue = value
    round.actualInput = actualInput
    round.status = 'closed'
    round.winners = computeWinners({ ...round, actualValue: value })
    saveLocal(data)
  },

  async reopenRound(roundId) {
    if (isSupabaseConfigured) {
      return reopenRoundSupabase(roundId)
    }
    const data = loadLocal()
    const round = data.rounds.find((r) => r.id === roundId)
    if (round) {
      round.status = 'open'
      round.winners = []
      round.actualValue = null
      round.actualInput = ''
      saveLocal(data)
    }
  },

  async deleteRound(roundId) {
    if (isSupabaseConfigured) {
      return deleteRoundSupabase(roundId)
    }
    const data = loadLocal()
    data.rounds = data.rounds.filter((r) => r.id !== roundId)
    saveLocal(data)
  },

  async resetAll() {
    if (isSupabaseConfigured) {
      // Delete all rounds (bets cascade)
      const { error } = await supabase.from('rounds').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (error) throw error
      return
    }
    saveLocal({ rounds: [] })
  },

  async verifyPassword(password) {
    if (!isSupabaseConfigured) return true
    const { data, error } = await supabase.rpc('verify_team_password', { input: password })
    if (error) throw error
    return data === true
  },

  subscribe(callback) {
    if (!isSupabaseConfigured) return null
    const channel = supabase
      .channel('rounds-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rounds' }, () => callback())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bets' }, () => callback())
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  },
}
