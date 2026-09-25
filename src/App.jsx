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
  formatDelay,
  computeDelayMinutes,
  WORK_START_MINUTES,
} from './lib/api'

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
const README_KEY = 'pari-lead-dev-readme-seen-v1'
const RULES_KEY = 'pari-lead-dev-rules-seen-v1'
const STORY_KEY = 'pari-lead-dev-story-seen'
PLACEHOLDER_FULL_CONTENT_TOO_LONG_FOR_MANUAL_TYPING