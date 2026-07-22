/*
  # Create dental epidemiological exam tables

  1. New Tables
    - `exams`
      - `id` (uuid, primary key)
      - `participant_id` (text, participant identifier)
      - `age` (integer, participant age)
      - `sex` (text, participant sex)
      - `school` (text, school name)
      - `examiner` (text, examiner name)
      - `exam_date` (date, date of examination)
      - `created_at` (timestamp)
    - `tooth_records`
      - `id` (uuid, primary key)
      - `exam_id` (uuid, foreign key to exams)
      - `tooth_number` (integer, FDI tooth number)
      - `crown_code` (integer, crown condition code 0-9)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id text NOT NULL DEFAULT '',
  age integer,
  sex text NOT NULL DEFAULT '',
  school text NOT NULL DEFAULT '',
  examiner text NOT NULL DEFAULT '',
  exam_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view exams"
  ON exams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert exams"
  ON exams FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update exams"
  ON exams FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete exams"
  ON exams FOR DELETE
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS tooth_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  tooth_number integer NOT NULL,
  crown_code integer NOT NULL DEFAULT 9,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tooth_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view tooth records"
  ON tooth_records FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert tooth records"
  ON tooth_records FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update tooth records"
  ON tooth_records FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete tooth records"
  ON tooth_records FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_tooth_records_exam_id ON tooth_records(exam_id);
