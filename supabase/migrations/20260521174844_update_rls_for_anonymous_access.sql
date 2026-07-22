/*
  # Update RLS policies to allow anonymous access for data collection

  1. Changes
    - Drop existing RLS policies that require authentication
    - Add new policies allowing anonymous users to insert and select data
    - This is appropriate for epidemiological field data collection where offline-first works better

  2. Security Notes
    - All users (authenticated and anonymous) can insert exams and tooth records
    - Users can read all records (suitable for export functionality)
    - No deletion of records is allowed for data integrity
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view exams" ON exams;
DROP POLICY IF EXISTS "Authenticated users can insert exams" ON exams;
DROP POLICY IF EXISTS "Authenticated users can update exams" ON exams;
DROP POLICY IF EXISTS "Authenticated users can delete exams" ON exams;

DROP POLICY IF EXISTS "Authenticated users can view tooth records" ON tooth_records;
DROP POLICY IF EXISTS "Authenticated users can insert tooth records" ON tooth_records;
DROP POLICY IF EXISTS "Authenticated users can update tooth records" ON tooth_records;
DROP POLICY IF EXISTS "Authenticated users can delete tooth records" ON tooth_records;

-- Create new policies for anonymous and authenticated access
CREATE POLICY "Allow all to view exams"
  ON exams FOR SELECT
  USING (true);

CREATE POLICY "Allow all to insert exams"
  ON exams FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all to update exams"
  ON exams FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all to view tooth_records"
  ON tooth_records FOR SELECT
  USING (true);

CREATE POLICY "Allow all to insert tooth_records"
  ON tooth_records FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all to update tooth_records"
  ON tooth_records FOR UPDATE
  USING (true)
  WITH CHECK (true);
