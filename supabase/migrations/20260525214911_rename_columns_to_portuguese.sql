/*
  # Rename columns to Portuguese

  ## Summary
  Renames all English column names to Portuguese in the `exams` and `tooth_records` tables,
  maintaining the exact same structure and data.

  ## Changes to `exams` table
  - `participant_id` → `participante`
  - `age` → `idade`
  - `sex` → `sexo`
  - `school` → `escola`
  - `examiner` → `examinador`
  - `collection_date` → `data_coleta`
  - `upper_prosthesis_use` → `uso_protese_superior`
  - `lower_prosthesis_use` → `uso_protese_inferior`
  - `upper_prosthesis_need` → `necessidade_protese_superior`
  - `lower_prosthesis_need` → `necessidade_protese_inferior`
  - `treatment_urgency` → `urgencia_tratamento`

  ## Changes to `tooth_records` table
  - `tooth_number` → `numero_dente`
  - `crown_code` → `codigo_coroa`

  ## Notes
  - No data loss — only column renames
  - RLS policies remain unchanged
*/

-- Rename columns in exams table
ALTER TABLE exams RENAME COLUMN participant_id TO participante;
ALTER TABLE exams RENAME COLUMN age TO idade;
ALTER TABLE exams RENAME COLUMN sex TO sexo;
ALTER TABLE exams RENAME COLUMN school TO escola;
ALTER TABLE exams RENAME COLUMN examiner TO examinador;
ALTER TABLE exams RENAME COLUMN collection_date TO data_coleta;
ALTER TABLE exams RENAME COLUMN upper_prosthesis_use TO uso_protese_superior;
ALTER TABLE exams RENAME COLUMN lower_prosthesis_use TO uso_protese_inferior;
ALTER TABLE exams RENAME COLUMN upper_prosthesis_need TO necessidade_protese_superior;
ALTER TABLE exams RENAME COLUMN lower_prosthesis_need TO necessidade_protese_inferior;
ALTER TABLE exams RENAME COLUMN treatment_urgency TO urgencia_tratamento;

-- Rename columns in tooth_records table
ALTER TABLE tooth_records RENAME COLUMN tooth_number TO numero_dente;
ALTER TABLE tooth_records RENAME COLUMN crown_code TO codigo_coroa;
