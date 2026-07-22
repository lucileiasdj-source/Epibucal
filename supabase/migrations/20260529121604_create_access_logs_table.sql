/*
  # Create access_logs table for administrative monitoring

  1. New Tables
    - `access_logs`
      - `id` (uuid, primary key)
      - `session_id` (text) - anonymous session identifier stored in localStorage
      - `event_type` (text) - type of event: 'page_load' | 'tab_navigation'
      - `tab_name` (text, nullable) - name of the tab/section accessed
      - `user_agent` (text) - browser/device info from navigator.userAgent
      - `created_at` (timestamptz) - timestamp of access

  2. Security
    - Enable RLS on `access_logs`
    - INSERT policy: allow anonymous (unauthenticated) inserts so the app can log without auth
    - SELECT policy: restricted to authenticated users only (admin)
    - No UPDATE or DELETE policies (logs are immutable)

  3. Notes
    - No personal data (no IP, no location, no CPF or identifiable fields)
    - session_id is a random UUID generated client-side and stored in sessionStorage
    - This table is append-only by design
*/

CREATE TABLE IF NOT EXISTS access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL DEFAULT '',
  event_type text NOT NULL DEFAULT 'page_load',
  tab_name text,
  user_agent text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including anonymous users) to insert logs
CREATE POLICY "Anyone can insert access logs"
  ON access_logs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users can read logs (admin access)
CREATE POLICY "Authenticated users can read access logs"
  ON access_logs
  FOR SELECT
  TO authenticated
  USING (true);

-- Index for common query patterns
CREATE INDEX IF NOT EXISTS access_logs_created_at_idx ON access_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS access_logs_tab_name_idx ON access_logs (tab_name);
CREATE INDEX IF NOT EXISTS access_logs_session_id_idx ON access_logs (session_id);
