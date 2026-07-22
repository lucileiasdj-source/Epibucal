/*
  # Add new exam fields for expanded epidemiological collection

  1. Modified Tables
    - `exams` - add columns for prosthesis use, prosthesis need, urgency of treatment, and IHOS scores
      - `upper_prosthesis_use` (integer, default 9) - 0=No prosthesis, 1=Partial, 2=Total, 9=Not recorded
      - `lower_prosthesis_use` (integer, default 9) - 0=No prosthesis, 1=Partial, 2=Total, 9=Not recorded
      - `upper_prosthesis_need` (integer, default 9) - 0=No need, 1=1 element, 2=>1 element, 3=Total, 9=Not recorded
      - `lower_prosthesis_need` (integer, default 9) - 0=No need, 1=1 element, 2=>1 element, 3=Total, 9=Not recorded
      - `treatment_urgency` (integer, default 9) - 0=None, 1=Preventive, 2=Elective, 3=Immediate, 9=Not recorded
      - `ihos_16` (integer, default 9) - Plaque index for tooth 16
      - `ihos_11` (integer, default 9) - Plaque index for tooth 11
      - `ihos_26` (integer, default 9) - Plaque index for tooth 26
      - `ihos_31` (integer, default 9) - Plaque index for tooth 31
      - `ihos_36` (integer, default 9) - Plaque index for tooth 36
      - `ihos_46` (integer, default 9) - Plaque index for tooth 46
      - `ihos_total` (numeric, default 0) - Average of all IHOS scores

  2. Security
    - No changes to existing RLS policies - new columns inherit existing policies

  3. Important Notes
    - All new columns use IF NOT EXISTS checks to prevent errors on re-run
    - Default value of 9 means "Not recorded" which matches the coding standard
    - ihos_total is computed on the frontend and stored for reporting convenience
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exams' AND column_name = 'upper_prosthesis_use'
  ) THEN
    ALTER TABLE exams ADD COLUMN upper_prosthesis_use integer NOT NULL DEFAULT 9;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exams' AND column_name = 'lower_prosthesis_use'
  ) THEN
    ALTER TABLE exams ADD COLUMN lower_prosthesis_use integer NOT NULL DEFAULT 9;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exams' AND column_name = 'upper_prosthesis_need'
  ) THEN
    ALTER TABLE exams ADD COLUMN upper_prosthesis_need integer NOT NULL DEFAULT 9;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exams' AND column_name = 'lower_prosthesis_need'
  ) THEN
    ALTER TABLE exams ADD COLUMN lower_prosthesis_need integer NOT NULL DEFAULT 9;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exams' AND column_name = 'treatment_urgency'
  ) THEN
    ALTER TABLE exams ADD COLUMN treatment_urgency integer NOT NULL DEFAULT 9;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exams' AND column_name = 'ihos_16'
  ) THEN
    ALTER TABLE exams ADD COLUMN ihos_16 integer NOT NULL DEFAULT 9;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exams' AND column_name = 'ihos_11'
  ) THEN
    ALTER TABLE exams ADD COLUMN ihos_11 integer NOT NULL DEFAULT 9;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exams' AND column_name = 'ihos_26'
  ) THEN
    ALTER TABLE exams ADD COLUMN ihos_26 integer NOT NULL DEFAULT 9;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exams' AND column_name = 'ihos_31'
  ) THEN
    ALTER TABLE exams ADD COLUMN ihos_31 integer NOT NULL DEFAULT 9;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exams' AND column_name = 'ihos_36'
  ) THEN
    ALTER TABLE exams ADD COLUMN ihos_36 integer NOT NULL DEFAULT 9;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exams' AND column_name = 'ihos_46'
  ) THEN
    ALTER TABLE exams ADD COLUMN ihos_46 integer NOT NULL DEFAULT 9;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exams' AND column_name = 'ihos_total'
  ) THEN
    ALTER TABLE exams ADD COLUMN ihos_total numeric(5,2) NOT NULL DEFAULT 0;
  END IF;
END $$;
