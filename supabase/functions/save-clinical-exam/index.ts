import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Allowed values for enum-like fields
const SEXO_VALUES = ["M", "F", "masculino", "feminino", "m", "f"];
const PROTESE_VALID = new Set([0, 1, 2, 3, 4, 5, 9, "0", "1", "2", "3", "4", "5", "9"]);
const URGENCIA_VALUES = ["0", "1", "2", "3", "9"];
const CROWN_CODES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const FDI_TEETH = [
  11, 12, 13, 14, 15, 16, 17, 18,
  21, 22, 23, 24, 25, 26, 27, 28,
  31, 32, 33, 34, 35, 36, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48,
];

interface ToothRecord {
  numero_dente: number;
  codigo_coroa: number;
}

interface ExamPayload {
  id_participante: number;
  participante: string;
  idade: number;
  sexo: string;
  escola: string;
  examinador: string;
  data_coleta: string;
  ihos_16?: number | null;
  ihos_11?: number | null;
  ihos_26?: number | null;
  ihos_31?: number | null;
  ihos_36?: number | null;
  ihos_46?: number | null;
  ihos_total?: number | null;
  uso_protese_superior: string;
  uso_protese_inferior: string;
  necessidade_protese_superior: string;
  necessidade_protese_inferior: string;
  urgencia_tratamento: string;
  c_total: number;
  p_total: number;
  o_total: number;
  cpod_total: number;
  dentes: ToothRecord[];
}

interface ValidationError {
  field: string;
  message: string;
}

function validatePayload(data: ExamPayload): ValidationError[] {
  const errors: ValidationError[] = [];

  if (data.id_participante === undefined || data.id_participante === null || !Number.isInteger(data.id_participante) || data.id_participante < 1) {
    errors.push({ field: "id_participante", message: "ID do participante é obrigatório e deve ser um número inteiro positivo." });
  }

  if (!data.participante || typeof data.participante !== "string" || data.participante.trim() === "") {
    errors.push({ field: "participante", message: "Identificador do participante é obrigatório." });
  }

  if (data.idade === undefined || data.idade === null || !Number.isInteger(data.idade) || data.idade < 0 || data.idade > 120) {
    errors.push({ field: "idade", message: "Idade deve ser um número inteiro entre 0 e 120." });
  }

  if (!data.sexo || !SEXO_VALUES.includes(data.sexo)) {
    errors.push({ field: "sexo", message: `Sexo inválido. Valores aceitos: ${SEXO_VALUES.join(", ")}.` });
  }

  if (!data.escola || typeof data.escola !== "string" || data.escola.trim() === "") {
    errors.push({ field: "escola", message: "Nome da escola é obrigatório." });
  }

  if (!data.examinador || typeof data.examinador !== "string" || data.examinador.trim() === "") {
    errors.push({ field: "examinador", message: "Nome do examinador é obrigatório." });
  }

  if (!data.data_coleta || isNaN(Date.parse(data.data_coleta))) {
    errors.push({ field: "data_coleta", message: "Data de coleta inválida. Use o formato YYYY-MM-DD." });
  }

  if (data.uso_protese_superior === undefined || data.uso_protese_superior === null || !PROTESE_VALID.has(data.uso_protese_superior)) {
    errors.push({ field: "uso_protese_superior", message: "Código de uso de prótese superior inválido." });
  }

  if (data.uso_protese_inferior === undefined || data.uso_protese_inferior === null || !PROTESE_VALID.has(data.uso_protese_inferior)) {
    errors.push({ field: "uso_protese_inferior", message: "Código de uso de prótese inferior inválido." });
  }

  if (data.necessidade_protese_superior === undefined || data.necessidade_protese_superior === null || !PROTESE_VALID.has(data.necessidade_protese_superior)) {
    errors.push({ field: "necessidade_protese_superior", message: "Código de necessidade de prótese superior inválido." });
  }

  if (data.necessidade_protese_inferior === undefined || data.necessidade_protese_inferior === null || !PROTESE_VALID.has(data.necessidade_protese_inferior)) {
    errors.push({ field: "necessidade_protese_inferior", message: "Código de necessidade de prótese inferior inválido." });
  }

  if (!data.urgencia_tratamento || !URGENCIA_VALUES.includes(String(data.urgencia_tratamento))) {
    errors.push({ field: "urgencia_tratamento", message: "Código de urgência de tratamento inválido." });
  }

  for (const field of ["c_total", "p_total", "o_total", "cpod_total"] as const) {
    if (!Number.isInteger(data[field]) || data[field] < 0) {
      errors.push({ field, message: `${field} deve ser um inteiro não negativo.` });
    }
  }

  if (!Array.isArray(data.dentes) || data.dentes.length === 0) {
    errors.push({ field: "dentes", message: "Registro de dentes é obrigatório." });
  } else {
    for (const dente of data.dentes) {
      if (!FDI_TEETH.includes(dente.numero_dente)) {
        errors.push({ field: "dentes", message: `Número de dente inválido: ${dente.numero_dente}.` });
        break;
      }
      if (!CROWN_CODES.includes(dente.codigo_coroa)) {
        errors.push({ field: "dentes", message: `Código de coroa inválido (${dente.codigo_coroa}) para o dente ${dente.numero_dente}.` });
        break;
      }
    }
  }

  return errors;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ success: false, error: "Método não permitido. Use POST." }, 405);
  }

  try {
    let payload: ExamPayload;
    try {
      payload = await req.json();
    } catch {
      return json({ success: false, error: "Corpo da requisição inválido. Envie JSON válido." }, 400);
    }

    const errors = validatePayload(payload);
    if (errors.length > 0) {
      return json({ success: false, error: "Dados inválidos.", details: errors }, 422);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    // Prepare exam row — strip dentes before insert
    const { dentes, ...examFields } = payload;
    const examRow = {
      ...examFields,
      participante: examFields.participante.trim(),
      escola: examFields.escola.trim(),
      examinador: examFields.examinador.trim(),
      created_at: new Date().toISOString(),
    };

    const { data: exam, error: examError } = await supabase
      .from("exams")
      .insert([examRow])
      .select("id, id_participante, participante, cpod_total, created_at")
      .single();

    if (examError) {
      console.error("Exam insert error:", examError);
      if (examError.code === "23505" && examError.message?.includes("id_participante")) {
        return json({ success: false, error: "ID do participante já cadastrado." }, 409);
      }
      return json({ success: false, error: "Erro ao salvar exame.", detail: examError.message }, 500);
    }

    const toothRows = dentes.map((d) => ({
      exam_id: exam.id,
      numero_dente: d.numero_dente,
      codigo_coroa: d.codigo_coroa,
      created_at: new Date().toISOString(),
    }));

    const { error: teethError } = await supabase
      .from("tooth_records")
      .insert(toothRows);

    if (teethError) {
      console.error("Tooth records insert error:", teethError);
      // Rollback: delete the exam just inserted to keep data consistent
      await supabase.from("exams").delete().eq("id", exam.id);
      return json({ success: false, error: "Erro ao salvar registros dentários.", detail: teethError.message }, 500);
    }

    return json({
      success: true,
      message: `Exame de ${exam.participante} salvo com sucesso.`,
      data: {
        exam_id: exam.id,
        participante: exam.participante,
        cpod_total: exam.cpod_total,
        created_at: exam.created_at,
      },
    }, 201);
  } catch (err) {
    console.error("Unexpected error:", err);
    return json({ success: false, error: "Erro interno do servidor." }, 500);
  }
});
