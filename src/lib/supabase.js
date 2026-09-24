import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = !!(url && anonKey)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      realtime: { params: { eventsPerSecond: 2 } },
    })
  : null
