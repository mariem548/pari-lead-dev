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
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_bets_round_id ON bets(round_id);

-- ============================================
-- Config table (team password)
-- RLS blocks all direct access — only RPC can read
-- ============================================
CREATE TABLE IF NOT EXISTS app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Default team password: "pari2024" — change this!
INSERT INTO app_config (key, value)
VALUES ('team_password', crypt('pari2024', gen_salt('bf')))
ON CONFLICT (key) DO NOTHING;

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
-- No policies = no direct access for anon/authenticated

-- ============================================
-- RPC: verify team password
-- ============================================
CREATE OR REPLACE FUNCTION verify_team_password(input TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM app_config
    WHERE key = 'team_password'
      AND value = crypt(input, value)
  );
END;
$$;

-- Enable RLS on rounds and bets
ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies
-- Public can READ everything
-- Writes also public (protected by password gate on frontend)
-- For true security, use Supabase Auth + tighter RLS
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
