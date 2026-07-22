/*
# Adicionar campo id_participante (inteiro único)

1. Alterações na tabela `exams`
   - Nova coluna `id_participante` (integer, NOT NULL, UNIQUE)
   - Chave única para integração com bancos de dados da pesquisa.
   - Preenchido manualmente pelo examinador (sem auto-incremento).

2. Notas
   - A constraint UNIQUE impede IDs duplicados no banco de dados.
   - Registros existentes (se houver) receberão valor baseado em sequência temporária.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exams' AND column_name = 'id_participante'
  ) THEN
    -- Add column allowing NULL temporarily for existing rows
    ALTER TABLE exams ADD COLUMN id_participante integer;

    -- Backfill existing rows with sequential values
    WITH numbered AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) AS rn
      FROM exams
    )
    UPDATE exams SET id_participante = numbered.rn
    FROM numbered WHERE exams.id = numbered.id;

    -- Now enforce NOT NULL and UNIQUE
    ALTER TABLE exams ALTER COLUMN id_participante SET NOT NULL;
    ALTER TABLE exams ADD CONSTRAINT exams_id_participante_unique UNIQUE (id_participante);
  END IF;
END $$;