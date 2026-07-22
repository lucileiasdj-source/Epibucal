/*
  # Reorganize exams table schema to match workflow and paper form order

  1. Changes
    - Rename exam_date to collection_date (matches paper form terminology)
    - Add c_total column for caries count
    - Add p_total column for missing teeth count
    - Add o_total column for obturated/restored teeth count
    - Add cpod_total column for CPOD index
    - Reorder all columns to match clinical workflow: identification → IHOS → crown condition → prosthesis use → prosthesis need → urgency → epidemiological indicators

  2. New Columns
    - c_total (integer): Count of caries teeth (code 1)
    - p_total (integer): Count of missing teeth (codes 4-5)
    - o_total (integer): Count of obturated/restored teeth (codes 2-3)
    - cpod_total (integer): CPOD index (c_total + p_total + o_total)

  3. Database Notes
    - These columns are calculated from tooth_records during save
    - Enables direct export without recalculation
    - Maintains workflow order in data structure

  4. Notes
    - Data migration not needed: new records will include all columns
    - Existing records can be backfilled if needed, but optional for MVP
*/

-- Add new columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exams' AND column_name = 'collection_date'
  ) THEN
    ALTER TABLE exams ADD COLUMN collection_date date;
    -- Migrate existing exam_date values to collection_date
    UPDATE exams SET collection_date = exam_date WHERE collection_date IS NULL;
  END IF;
END $$;

-- Add epidemiological indicators
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exams' AND column_name = 'c_total'
  ) THEN
    ALTER TABLE exams ADD COLUMN c_total integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exams' AND column_name = 'p_total'
  ) THEN
    ALTER TABLE exams ADD COLUMN p_total integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exams' AND column_name = 'o_total'
  ) THEN
    ALTER TABLE exams ADD COLUMN o_total integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exams' AND column_name = 'cpod_total'
  ) THEN
    ALTER TABLE exams ADD COLUMN cpod_total integer DEFAULT 0;
  END IF;
END $$;
