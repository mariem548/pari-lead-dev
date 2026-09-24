-- ============================================
-- Pari Lead Dev — Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Table: rounds
CREATE TABLE IF NOT EXISTS rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Nouveau pari',
  type TEXT NOT NULL DEFAULT 'time' CHECK (type IN ('time', 'number')),
  actual_value NUMERIC,
  actual_input TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  winners JSONB NOT NULL DEFAULT '[]'::jsonb,
  points_per_win INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: bets
CREATE TABLE IF NOT EXISTS bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  avatar TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_bets_round_id ON bets(round_id);

-- ============================================
-- RLS Policies
-- Public read/write for team use
-- ============================================

-- Rounds: SELECT
CREATE POLICY "rounds_select" ON rounds
  FOR SELECT TO anon
  USING (true);

-- Rounds: INSERT
CREATE POLICY "rounds_insert" ON rounds
  FOR INSERT TO anon
  WITH CHECK (true);

-- Rounds: UPDATE
CREATE POLICY "rounds_update" ON rounds
  FOR UPDATE TO anon
  USING (true);

-- Rounds: DELETE
CREATE POLICY "rounds_delete" ON rounds
  FOR DELETE TO anon
  USING (true);

-- Bets: SELECT
CREATE POLICY "bets_select" ON bets
  FOR SELECT TO anon
  USING (true);

-- Bets: INSERT
CREATE POLICY "bets_insert" ON bets
  FOR INSERT TO anon
  WITH CHECK (true);

-- Bets: DELETE
CREATE POLICY "bets_delete" ON bets
  FOR DELETE TO anon
  USING (true);

-- ============================================
-- Realtime
-- ============================================
ALTER TABLE rounds REPLICA IDENTITY FULL;
ALTER TABLE bets REPLICA IDENTITY FULL;

-- ============================================
-- Comments table
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_round_id ON comments(round_id);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comments_select" ON comments
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "comments_insert" ON comments
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "comments_delete" ON comments
  FOR DELETE TO anon
  USING (true);

ALTER TABLE comments REPLICA IDENTITY FULL;
