import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { InstallBanner, InstallHeaderButton } from './components/InstallBanner';
import { IhosSelect } from './components/IhosSelect';
import {
  Save,
  Download,
  ClipboardList,
  User,
  Smile,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCcw,
  ShieldAlert,
  Activity,
  Calculator,
} from 'lucide-react';

const DENTES_SUPERIORES = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const DENTES_INFERIORES = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

const CODIGOS: Record<number, string> = {
  0: 'Hígido',
  1: 'Cariado',
  2: 'Rest. c/ cárie',
  3: 'Rest. s/ cárie',
  4: 'Perdido p/ cárie',
  5: 'Perdido outra',
  6: 'Selante',
  7: 'Ponte/Coroa/Impl.',
  8: 'Não erupcionado',
  9: 'Não registrado',
};

const PROSTHESIS_USE_CODES: Record<number, string> = {
  0: 'Sem prótese',
  1: 'Prótese parcial',
  2: 'Prótese total',
  9: 'Não registrado',
};

const PROSTHESIS_NEED_CODES: Record<number, string> = {
  0: 'Sem necessidade',
  1: '1 elemento',
  2: 'Mais de 1 elem.',
  3: 'Prótese total',
  9: 'Não registrado',
};

const TREATMENT_URGENCY_CODES: Record<number, string> = {
  0: 'Sem necessidade',
  1: 'Preventivo',
  2: 'Eletivo',
  3: 'Urgente',
  9: 'Não registrado',
};

const IHOS_CODES: Record<number, string> = {
  0: 'Sem placa',
  1: 'Até 1/3',
  2: '1/3 a 2/3',
  3: 'Mais de 2/3',
  9: 'Não registrado',
};

const IHOS_TEETH = [16, 11, 26, 31, 36, 46] as const;


type ToothState = Record<number, number>;

const CROWN_COLORS: Record<number, string> = {
  0: 'bg-emerald-100 border-emerald-300',
  1: 'bg-red-100 border-red-300',
  2: 'bg-orange-100 border-orange-300',
  3: 'bg-teal-100 border-teal-300',
  4: 'bg-gray-200 border-gray-400',
  5: 'bg-gray-200 border-gray-400',
  6: 'bg-sky-100 border-sky-300',
  7: 'bg-violet-100 border-violet-300',
  8: 'bg-slate-100 border-slate-300',
  9: 'bg-white border-gray-200',
};

const CROWN_TEXT: Record<number, string> = {
  0: 'text-emerald-700',
  1: 'text-red-700',
  2: 'text-orange-700',
  3: 'text-teal-700',
  4: 'text-gray-600',
  5: 'text-gray-600',
  6: 'text-sky-700',
  7: 'text-violet-700',
  8: 'text-slate-600',
  9: 'text-gray-400',
};

const PROSTHESIS_COLORS: Record<number, string> = {
  0: 'bg-emerald-50 border-emerald-200',
  1: 'bg-amber-50 border-amber-200',
  2: 'bg-orange-50 border-orange-200',
  9: 'bg-white border-gray-200',
};

const PROSTHESIS_NEED_COLORS: Record<number, string> = {
  0: 'bg-emerald-50 border-emerald-200',
  1: 'bg-amber-50 border-amber-200',
  2: 'bg-orange-50 border-orange-200',
  3: 'bg-red-50 border-red-200',
  9: 'bg-white border-gray-200',
};

const URGENCY_COLORS: Record<number, string> = {
  0: 'bg-emerald-50 border-emerald-200',
  1: 'bg-sky-50 border-sky-200',
  2: 'bg-amber-50 border-amber-200',
  3: 'bg-red-50 border-red-200',
  9: 'bg-white border-gray-200',
};

const IHOS_COLORS: Record<number, string> = {
  0: 'bg-emerald-50 border-emerald-200',
  1: 'bg-amber-50 border-amber-200',
  2: 'bg-orange-50 border-orange-200',
  3: 'bg-red-50 border-red-200',
  9: 'bg-white border-gray-200',
};

const INITIAL_TOOTH_STATE: ToothState = [...DENTES_SUPERIORES, ...DENTES_INFERIORES].reduce(
  (acc, tooth) => ({ ...acc, [tooth]: 9 }),
  {} as ToothState
);

type Notification = {
  type: 'success' | 'error';
  message: string;
} | null;

type ClinicalExamPayload = Record<string, unknown> & {
  participante: string;
  dentes: { numero_dente: number; codigo_coroa: number }[];
};

type OfflineExam = {
  id: string;
  createdAt: string;
  payload: ClinicalExamPayload;
};

const OFFLINE_EXAMS_KEY = 'epibucal_offline_exams';

function readOfflineExams(): OfflineExam[] {
  try {
    const stored = localStorage.getItem(OFFLINE_EXAMS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function writeOfflineExams(exams: OfflineExam[]) {
  localStorage.setItem(OFFLINE_EXAMS_KEY, JSON.stringify(exams));
}

function isNetworkError(err: unknown) {
  if (!navigator.onLine) return true;
  const message = err instanceof Error ? err.message : String(err);
  return /failed to fetch|networkerror|load failed|internet|offline/i.test(message);
}

const ToothIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C9 2 6 4 6 7c0 1.5.5 3 1 4.5L8 20c.3 1.2 1 2 2 2h4c1 0 1.7-.8 2-2l1-8.5c.5-1.5 1-3 1-4.5 0-3-3-5-6-5z" />
  </svg>
);

const SECTIONS = [
  { id: 'identification', label: 'Identificação', icon: User },
  { id: 'ihos', label: 'IHOS', icon: ClipboardList },
  { id: 'crown', label: 'Condição da Coroa', icon: ToothIcon },
  { id: 'prosthesis-use', label: 'Uso de Prótese', icon: Smile },
  { id: 'prosthesis-need', label: 'Necess. Prótese', icon: Activity },
  { id: 'urgency', label: 'Urgência', icon: ShieldAlert },
  { id: 'summary', label: 'Resumo', icon: Calculator },
] as const;

function OptionGrid({
  options,
  value,
  onChange,
  colors,
}: {
  options: Record<number, string>;
  value: number;
  onChange: (v: number) => void;
  colors: Record<number, string>;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {Object.entries(options).map(([code, desc]) => {
        const numCode = Number(code);
        const isSelected = value === numCode;
        return (
          <button
            key={code}
            type="button"
            onClick={() => onChange(numCode)}
            className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all duration-150 cursor-pointer min-h-[72px] ${
              isSelected
                ? `${colors[numCode]} ring-2 ring-teal-500 ring-offset-1 shadow-sm scale-[1.02]`
                : 'bg-white border-gray-100 hover:border-gray-300 active:scale-[0.98]'
            }`}
          >
            <span className="text-2xl font-bold text-gray-800">{code}</span>
            <span className="text-xs text-gray-500 text-center leading-tight">{desc}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function App() {
  const [idParticipante, setIdParticipante] = useState('');
  const [participantId, setParticipantId] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [school, setSchool] = useState('');
  const [examiner, setExaminer] = useState('');
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);

  const [upperProsthesisUse, setUpperProsthesisUse] = useState(9);
  const [lowerProsthesisUse, setLowerProsthesisUse] = useState(9);
  const [upperProsthesisNeed, setUpperProsthesisNeed] = useState(9);
  const [lowerProsthesisNeed, setLowerProsthesisNeed] = useState(9);
  const [treatmentUrgency, setTreatmentUrgency] = useState(9);

  const [ihos, setIhos] = useState<Record<number, number>>({
    16: 9, 11: 9, 26: 9, 31: 9, 36: 9, 46: 9,
  });

  const [teeth, setTeeth] = useState<ToothState>({ ...INITIAL_TOOTH_STATE });

  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<Notification>(null);
  const [upperOpen, setUpperOpen] = useState(true);
  const [lowerOpen, setLowerOpen] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showClearSavedConfirm, setShowClearSavedConfirm] = useState(false);
  const [clearingSaved, setClearingSaved] = useState(false);
  const [pendingOfflineExams, setPendingOfflineExams] = useState(() => readOfflineExams().length);

  // ACCESS_TRACKING_DISABLED: re-enable when monitoring is reactivated
  // useEffect(() => { logPageLoad(); }, []);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const ihosTotal = useMemo(() => {
    const validScores = IHOS_TEETH.map((t) => ihos[t]).filter((v) => v !== 9);
    if (validScores.length === 0) return null;
    return validScores.reduce((sum, v) => sum + v, 0) / validScores.length;
  }, [ihos]);

  // CPOD calculations
  const cCount = useMemo(() => {
    return Object.values(teeth).filter((c) => c === 1).length;
  }, [teeth]);

  const pCount = useMemo(() => {
    const ageNum = parseInt(age);
    const includeCode5 = !isNaN(ageNum) && ageNum >= 30;
    return Object.values(teeth).filter((c) => c === 4 || (includeCode5 && c === 5)).length;
  }, [teeth, age]);

  const oCount = useMemo(() => {
    return Object.values(teeth).filter((c) => c === 2 || c === 3).length;
  }, [teeth]);

  const cpodTotal = useMemo(() => cCount + pCount + oCount, [cCount, pCount, oCount]);

  const sCount = useMemo(() => {
    return Object.values(teeth).filter((c) => c === 6).length;
  }, [teeth]);

  const prCount = useMemo(() => {
    return Object.values(teeth).filter((c) => c === 7).length;
  }, [teeth]);

  const showNotification = useCallback((n: Notification) => {
    setNotification(n);
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const refreshPendingOfflineExams = useCallback(() => {
    setPendingOfflineExams(readOfflineExams().length);
  }, []);

  const saveClinicalExamOnline = useCallback(async (payload: ClinicalExamPayload) => {
    const fnUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-clinical-exam`;
    const response = await fetch(fnUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      const detail = result.details
        ? result.details.map((d: { field: string; message: string }) => d.message).join(' ')
        : result.error ?? 'Erro ao salvar exame.';
      throw new Error(detail);
    }

    return result;
  }, []);

  const queueOfflineExam = useCallback((payload: ClinicalExamPayload) => {
    const pending = readOfflineExams();
    pending.push({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      payload,
    });
    writeOfflineExams(pending);
    setPendingOfflineExams(pending.length);
  }, []);

  const syncOfflineExams = useCallback(async (silent = false) => {
    const pending = readOfflineExams();
    if (pending.length === 0 || !navigator.onLine) return;

    const stillPending: OfflineExam[] = [];
    let synced = 0;

    for (const exam of pending) {
      try {
        await saveClinicalExamOnline(exam.payload);
        synced += 1;
      } catch (err) {
        stillPending.push(exam);
        if (isNetworkError(err)) break;
      }
    }

    writeOfflineExams(stillPending);
    setPendingOfflineExams(stillPending.length);

    if (!silent && synced > 0) {
      const remaining = stillPending.length > 0 ? ` ${stillPending.length} ainda pendente(s).` : '';
      showNotification({ type: 'success', message: `${synced} exame(s) offline sincronizado(s).${remaining}` });
    }
  }, [saveClinicalExamOnline, showNotification]);

  useEffect(() => {
    refreshPendingOfflineExams();
    const handleOnline = () => {
      syncOfflineExams();
    };
    window.addEventListener('online', handleOnline);
    syncOfflineExams(true);
    return () => window.removeEventListener('online', handleOnline);
  }, [refreshPendingOfflineExams, syncOfflineExams]);

  const scrollToSection = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // ACCESS_TRACKING_DISABLED: add tab navigation tracking here when monitoring is reactivated.
  };

  const handleToothChange = (toothNumber: number, code: number) => {
    setTeeth((prev) => ({ ...prev, [toothNumber]: code }));
  };

  const handleIhosChange = (toothNumber: number, code: number) => {
    setIhos((prev) => ({ ...prev, [toothNumber]: code }));
  };

  const resetForm = () => {
    setIdParticipante('');
    setParticipantId('');
    setAge('');
    setSex('');
    setSchool('');
    setExaminer('');
    setExamDate(new Date().toISOString().split('T')[0]);
    setTeeth({ ...INITIAL_TOOTH_STATE });
    setUpperProsthesisUse(9);
    setLowerProsthesisUse(9);
    setUpperProsthesisNeed(9);
    setLowerProsthesisNeed(9);
    setTreatmentUrgency(9);
    setIhos({ 16: 9, 11: 9, 26: 9, 31: 9, 36: 9, 46: 9 });
  };

  const handleClearExam = () => {
    // Clear any app-related localStorage keys
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('exam_') || key.startsWith('clinical_') || key.startsWith('coleta_')) {
        localStorage.removeItem(key);
      }
    });
    resetForm();
    setShowClearConfirm(false);
    scrollToSection('identification');
  };

  const handleClearSavedExams = async () => {
    setClearingSaved(true);
    try {
      const fnUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-all-exams`;
      const response = await fetch(fnUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error ?? 'Erro ao apagar exames.');
      console.log(`[clear-exams] ${result.deleted} registro(s) removido(s) do banco de dados.`);
      setShowClearSavedConfirm(false);
      showNotification({ type: 'success', message: 'Todos os exames salvos foram excluídos com sucesso.' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao apagar exames.';
      showNotification({ type: 'error', message: msg });
    } finally {
      setClearingSaved(false);
    }
  };

  const validateForm = (): string | null => {
    const idNum = parseInt(idParticipante);
    if (!idParticipante || isNaN(idNum) || idNum < 1 || !Number.isInteger(idNum)) return 'ID do participante deve ser um número inteiro positivo';
    if (!participantId.trim()) return 'Nome do participante é obrigatório';
    if (!age || parseInt(age) < 0 || parseInt(age) > 150) return 'Idade inválida';
    if (!sex) return 'Selecione o sexo';
    if (!examiner.trim()) return 'Examinador é obrigatório';
    if (!examDate) return 'Data do exame é obrigatória';
    return null;
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      showNotification({ type: 'error', message: validationError });
      return;
    }

    setSaving(true);
    console.log('=== SAVE EXAM START ===');

    try {
      const payload: ClinicalExamPayload = {
        id_participante: parseInt(idParticipante),
        participante: participantId.trim(),
        idade: parseInt(age),
        sexo: sex,
        escola: school.trim(),
        examinador: examiner.trim(),
        data_coleta: examDate,
        ihos_16: ihos[16],
        ihos_11: ihos[11],
        ihos_26: ihos[26],
        ihos_31: ihos[31],
        ihos_36: ihos[36],
        ihos_46: ihos[46],
        ihos_total: ihosTotal ?? 0,
        uso_protese_superior: upperProsthesisUse,
        uso_protese_inferior: lowerProsthesisUse,
        necessidade_protese_superior: upperProsthesisNeed,
        necessidade_protese_inferior: lowerProsthesisNeed,
        urgencia_tratamento: treatmentUrgency,
        c_total: cCount,
        p_total: pCount,
        o_total: oCount,
        cpod_total: cpodTotal,
        dentes: [...DENTES_SUPERIORES, ...DENTES_INFERIORES].map((n) => ({
          numero_dente: n,
          codigo_coroa: teeth[n],
        })),
      };

      if (!navigator.onLine) {
        queueOfflineExam(payload);
        showNotification({
          type: 'success',
          message: `Sem internet: exame ${payload.participante} guardado no aparelho para sincronizar depois.`
        });
        resetForm();
        scrollToSection('identification');
        return;
      }

      const result = await saveClinicalExamOnline(payload);

      showNotification({
        type: 'success',
        message: `Exame ${result.data.participante} salvo! (CPOD=${cpodTotal})`
      });

      resetForm();
      scrollToSection('identification');
    } catch (err) {
      console.error('=== SAVE ERROR ===', err);
      if (isNetworkError(err)) {
        const payload: ClinicalExamPayload = {
          id_participante: parseInt(idParticipante),
          participante: participantId.trim(),
          idade: parseInt(age),
          sexo: sex,
          escola: school.trim(),
          examinador: examiner.trim(),
          data_coleta: examDate,
          ihos_16: ihos[16],
          ihos_11: ihos[11],
          ihos_26: ihos[26],
          ihos_31: ihos[31],
          ihos_36: ihos[36],
          ihos_46: ihos[46],
          ihos_total: ihosTotal ?? 0,
          uso_protese_superior: upperProsthesisUse,
          uso_protese_inferior: lowerProsthesisUse,
          necessidade_protese_superior: upperProsthesisNeed,
          necessidade_protese_inferior: lowerProsthesisNeed,
          urgencia_tratamento: treatmentUrgency,
          c_total: cCount,
          p_total: pCount,
          o_total: oCount,
          cpod_total: cpodTotal,
          dentes: [...DENTES_SUPERIORES, ...DENTES_INFERIORES].map((n) => ({
            numero_dente: n,
            codigo_coroa: teeth[n],
          })),
        };
        queueOfflineExam(payload);
        showNotification({
          type: 'success',
          message: `Falha de conexão: exame ${payload.participante} guardado no aparelho para sincronizar depois.`
        });
        resetForm();
        scrollToSection('identification');
        return;
      }
      const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar exame.';
      showNotification({ type: 'error', message: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const { data: exams, error } = await supabase
        .from('exams')
        .select('*, tooth_records(*)')
        .order('created_at', { ascending: false });

      if (error) throw new Error(`Erro ao buscar: ${error.message}`);

      if (!exams || exams.length === 0) {
        showNotification({ type: 'error', message: 'Nenhum exame para exportar.' });
        return;
      }

      const header = [
        'id_participante',
        'participante',
        'idade',
        'sexo',
        'escola',
        'examinador',
        'data_coleta',
        'ihos_16',
        'ihos_11',
        'ihos_26',
        'ihos_31',
        'ihos_36',
        'ihos_46',
        'ihos_total',
        ...DENTES_SUPERIORES.map((t) => `d${t}`),
        ...DENTES_INFERIORES.map((t) => `d${t}`),
        'uso_protese_superior',
        'uso_protese_inferior',
        'necessidade_protese_superior',
        'necessidade_protese_inferior',
        'urgencia_tratamento',
        'c_total',
        'p_total',
        'o_total',
        'cpod_total',
        's_total',
        'pr_total',
      ].join(';');

      const allTeethNumbers = [...DENTES_SUPERIORES, ...DENTES_INFERIORES];

      const rows = exams.map((exam) => {
        const toothMap: Record<number, number> = {};
        (exam.tooth_records || []).forEach((r: { numero_dente: number; codigo_coroa: number }) => {
          toothMap[r.numero_dente] = r.codigo_coroa;
        });

        const sTotal = allTeethNumbers.filter((t) => toothMap[t] === 6).length;
        const prTotal = allTeethNumbers.filter((t) => toothMap[t] === 7).length;

        return [
          exam.id_participante ?? '',
          exam.participante,
          exam.idade,
          exam.sexo,
          exam.escola,
          exam.examinador,
          exam.data_coleta,
          exam.ihos_16,
          exam.ihos_11,
          exam.ihos_26,
          exam.ihos_31,
          exam.ihos_36,
          exam.ihos_46,
          exam.ihos_total,
          ...DENTES_SUPERIORES.map((t) => toothMap[t] ?? ''),
          ...DENTES_INFERIORES.map((t) => toothMap[t] ?? ''),
          exam.uso_protese_superior,
          exam.uso_protese_inferior,
          exam.necessidade_protese_superior,
          exam.necessidade_protese_inferior,
          exam.urgencia_tratamento,
          exam.c_total ?? '',
          exam.p_total ?? '',
          exam.o_total ?? '',
          exam.cpod_total ?? '',
          sTotal,
          prTotal,
        ].join(';');
      });

      const csv = [header, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `exames_epidemiologicos_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      showNotification({ type: 'success', message: `${exams.length} exame(s) exportado(s)!` });
    } catch (err) {
      console.error('Export error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao exportar.';
      showNotification({ type: 'error', message: errorMessage });
    }
  };

  const renderToothCard = (toothNumber: number) => {
    const code = teeth[toothNumber];
    return (
      <div
        key={toothNumber}
        className={`border-2 rounded-xl p-2 text-center transition-all duration-150 ${CROWN_COLORS[code]}`}
      >
        <div className={`font-bold text-sm mb-1 tabular-nums ${CROWN_TEXT[code]}`}>
          {toothNumber}
        </div>
        <select
          value={code}
          onChange={(e) => handleToothChange(toothNumber, parseInt(e.target.value))}
          className="w-full text-xs border rounded-lg p-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
        >
          {Object.entries(CODIGOS).map(([codigo, descricao]) => (
            <option key={codigo} value={codigo}>
              {codigo} - {descricao}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const renderIhosCard = (toothNumber: number) => {
    const code = ihos[toothNumber];
    return (
      <div
        key={toothNumber}
        className={`border-2 rounded-xl p-3 text-center transition-all duration-150 ${IHOS_COLORS[code]}`}
      >
        <div className="font-bold text-base text-gray-800 mb-2 tabular-nums">
          {toothNumber}
        </div>
        <IhosSelect
          toothNumber={toothNumber}
          value={code}
          onChange={(v) => handleIhosChange(toothNumber, v)}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <InstallBanner />
      {/* Institutional Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4">
          <img
            src="/image copy.png"
            alt="Logo Projeto ProfSMOC II"
            className="h-16 sm:h-20 w-auto object-contain"
          />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-base sm:text-lg font-extrabold text-teal-700 leading-tight tracking-wide">
                PROFSMOC II
              </p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-tight">
                Coleta Epidemiológica em Saúde Bucal
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Panel — DISABLED: uncomment to reactivate */}
      {/* {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />} */}

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 left-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg transition-all duration-300 sm:left-auto sm:right-4 sm:max-w-md ${
            notification.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Clear Exam Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 shrink-0">
                <RotateCcw className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Limpar exame</h3>
                <p className="text-sm text-gray-500 mt-0.5">Esta ação não pode ser desfeita.</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              Tem certeza que deseja apagar este exame e limpar tudo?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleClearExam}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Sim, limpar tudo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Saved Exams Confirmation Modal */}
      {showClearSavedConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Excluir Exames Salvos</h3>
                <p className="text-sm text-gray-500 mt-0.5">Esta ação é permanente e não poderá ser desfeita.</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              ATENÇÃO: Você está prestes a excluir todos os exames salvos. Esta ação é permanente e não poderá ser desfeita. Deseja continuar?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                disabled={clearingSaved}
                onClick={() => setShowClearSavedConfirm(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={clearingSaved}
                onClick={handleClearSavedExams}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {clearingSaved && <Loader2 className="w-4 h-4 animate-spin" />}
                Sim, apagar tudo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-2">
          <div className="p-1.5 bg-teal-600 rounded-lg shrink-0">
            <ClipboardList className="w-4 h-4 text-white" />
          </div>
          <div className="flex gap-1 overflow-x-auto scrollbar-hide flex-1">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => scrollToSection(s.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-colors shrink-0 whitespace-nowrap"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {s.label}
                </button>
              );
            })}
          </div>
          <InstallHeaderButton />
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-5">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Exame Clínico
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Formulário de exame clínico
            </p>
          </div>
        </header>

        {/* 1. IDENTIFICATION */}
        <section
          ref={(el) => { sectionRefs.current['identification'] = el; }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden scroll-mt-16"
        >
          <div className="flex items-center gap-2 px-5 py-3 bg-teal-600 text-white">
            <User className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              1. Identificação do Participante
            </h2>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                ID Participante (numerico) *
              </label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent tabular-nums"
                placeholder="Ex: 1, 2, 3..."
                type="number"
                min={1}
                step={1}
                value={idParticipante}
                onChange={(e) => setIdParticipante(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">Chave unica de identificacao. Nao permite duplicados.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Nome do Participante *
              </label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                placeholder="Ex: P001"
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Idade *
              </label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                placeholder="Idade"
                type="number"
                min={0}
                max={150}
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Sexo *
              </label>
              <select
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent cursor-pointer"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Escola
              </label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                placeholder="Nome da escola"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Examinador *
              </label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                placeholder="Nome do examinador"
                value={examiner}
                onChange={(e) => setExaminer(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Data da Coleta *
              </label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* 2. IHOS */}
        <section
          ref={(el) => { sectionRefs.current['ihos'] = el; }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden scroll-mt-16"
        >
          <div className="flex items-center gap-2 px-5 py-3 bg-teal-600 text-white">
            <ClipboardList className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              2. IHOS - Índice de Higiene Oral Simplificado
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {/* Legend */}
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(IHOS_CODES).map(([code, desc]) => (
                <span
                  key={code}
                  className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border font-medium ${IHOS_COLORS[Number(code)]}`}
                >
                  {code} - {desc}
                </span>
              ))}
            </div>

            {/* IHOS Tooth Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {IHOS_TEETH.map(renderIhosCard)}
            </div>

            {/* IHOS Total */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    IHOS Total
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Média (código 9 excluído)
                  </p>
                </div>
                <div className="text-3xl font-bold text-teal-700 tabular-nums">
                  {ihosTotal !== null ? ihosTotal.toFixed(2) : '--'}
                </div>
              </div>
              {ihosTotal !== null && (
                <div className="mt-3">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        ihosTotal <= 1.2 ? 'bg-emerald-500' : ihosTotal <= 2.0 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(ihosTotal / 3) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-400">
                    <span>0 - Sem placa</span>
                    <span>3 - Placa extensa</span>
                  </div>
                  <div className={`mt-2 text-xs font-semibold px-2 py-1 rounded-md inline-block ${
                    ihosTotal <= 1.2
                      ? 'bg-emerald-50 text-emerald-700'
                      : ihosTotal <= 2.0
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-red-50 text-red-700'
                  }`}>
                    Classificação: {ihosTotal <= 1.2 ? 'Boa' : ihosTotal <= 2.0 ? 'Regular' : 'Necessita Melhoria'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3. CROWN CONDITION */}
        <section
          ref={(el) => { sectionRefs.current['crown'] = el; }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden scroll-mt-16"
        >
          <div className="flex items-center gap-2 px-5 py-3 bg-teal-600 text-white">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C9 2 6 4 6 7c0 1.5.5 3 1 4.5L8 20c.3 1.2 1 2 2 2h4c1 0 1.7-.8 2-2l1-8.5c.5-1.5 1-3 1-4.5 0-3-3-5-6-5z" />
            </svg>
            <h2 className="text-sm font-bold uppercase tracking-wider">
              3. Condição da Coroa
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {/* Legend */}
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(CODIGOS).map(([code, desc]) => (
                <span
                  key={code}
                  className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border font-medium ${CROWN_COLORS[Number(code)]} ${CROWN_TEXT[Number(code)]}`}
                >
                  {code} - {desc}
                </span>
              ))}
            </div>

            {/* Upper Jaw */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setUpperOpen(!upperOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-bold text-gray-700">
                  Arcada Superior
                </span>
                {upperOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {upperOpen && (
                <div className="p-3 grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {DENTES_SUPERIORES.map(renderToothCard)}
                </div>
              )}
            </div>

            {/* Lower Jaw */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setLowerOpen(!lowerOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-bold text-gray-700">
                  Arcada Inferior
                </span>
                {lowerOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {lowerOpen && (
                <div className="p-3 grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {DENTES_INFERIORES.map(renderToothCard)}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 4. PROSTHESIS USE */}
        <section
          ref={(el) => { sectionRefs.current['prosthesis-use'] = el; }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden scroll-mt-16"
        >
          <div className="flex items-center gap-2 px-5 py-3 bg-teal-600 text-white">
            <Smile className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              4. Uso de Prótese
            </h2>
          </div>
          <div className="p-5 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-3">
                Arcada Superior
              </label>
              <OptionGrid
                options={PROSTHESIS_USE_CODES}
                value={upperProsthesisUse}
                onChange={setUpperProsthesisUse}
                colors={PROSTHESIS_COLORS}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-3">
                Arcada Inferior
              </label>
              <OptionGrid
                options={PROSTHESIS_USE_CODES}
                value={lowerProsthesisUse}
                onChange={setLowerProsthesisUse}
                colors={PROSTHESIS_COLORS}
              />
            </div>
          </div>
        </section>

        {/* 4. PROSTHESIS NEED */}
        <section
          ref={(el) => { sectionRefs.current['prosthesis-need'] = el; }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden scroll-mt-16"
        >
          <div className="flex items-center gap-2 px-5 py-3 bg-teal-600 text-white">
            <Activity className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              5. Necessidade de Prótese
            </h2>
          </div>
          <div className="p-5 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-3">
                Arcada Superior
              </label>
              <OptionGrid
                options={PROSTHESIS_NEED_CODES}
                value={upperProsthesisNeed}
                onChange={setUpperProsthesisNeed}
                colors={PROSTHESIS_NEED_COLORS}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-3">
                Arcada Inferior
              </label>
              <OptionGrid
                options={PROSTHESIS_NEED_CODES}
                value={lowerProsthesisNeed}
                onChange={setLowerProsthesisNeed}
                colors={PROSTHESIS_NEED_COLORS}
              />
            </div>
          </div>
        </section>

        {/* 5. TREATMENT URGENCY */}
        <section
          ref={(el) => { sectionRefs.current['urgency'] = el; }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden scroll-mt-16"
        >
          <div className="flex items-center gap-2 px-5 py-3 bg-teal-600 text-white">
            <ShieldAlert className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              6. Urgência de Tratamento
            </h2>
          </div>
          <div className="p-5">
            <OptionGrid
              options={TREATMENT_URGENCY_CODES}
              value={treatmentUrgency}
              onChange={setTreatmentUrgency}
              colors={URGENCY_COLORS}
            />
          </div>
        </section>

        {/* 7. EPIDEMIOLOGICAL SUMMARY */}
        <section
          ref={(el) => { sectionRefs.current['summary'] = el; }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden scroll-mt-16"
        >
          <div className="flex items-center gap-2 px-5 py-3 bg-teal-600 text-white">
            <Calculator className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              7. Resumo Epidemiológico
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {/* CPOD */}
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                Índice CPOD
              </p>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100">
                  <div className="text-4xl font-bold text-red-600 tabular-nums">{cCount}</div>
                  <div className="text-sm font-semibold text-red-700 mt-1">C</div>
                  <div className="text-xs text-red-500 mt-0.5">Cariados</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
                  <div className="text-4xl font-bold text-gray-600 tabular-nums">{pCount}</div>
                  <div className="text-sm font-semibold text-gray-700 mt-1">P</div>
                  <div className="text-xs text-gray-500 mt-0.5">Perdidos</div>
                </div>
                <div className="bg-teal-50 rounded-xl p-4 text-center border border-teal-100">
                  <div className="text-4xl font-bold text-teal-600 tabular-nums">{oCount}</div>
                  <div className="text-sm font-semibold text-teal-700 mt-1">O</div>
                  <div className="text-xs text-teal-500 mt-0.5">Obturados</div>
                </div>
                <div className="bg-teal-600 rounded-xl p-4 text-center">
                  <div className="text-4xl font-bold text-white tabular-nums">{cpodTotal}</div>
                  <div className="text-sm font-semibold text-teal-100 mt-1">CPOD</div>
                  <div className="text-xs text-teal-200 mt-0.5">Total</div>
                </div>
              </div>
            </div>

            {/* IHOS Summary */}
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                IHOS
              </p>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">IHOS Total</p>
                    <p className="text-xs text-gray-400">Média dos dentes registrados</p>
                    {ihosTotal !== null && (
                      <span className={`mt-1 text-xs font-semibold px-2 py-0.5 rounded-md inline-block ${
                        ihosTotal <= 1.2
                          ? 'bg-emerald-50 text-emerald-700'
                          : ihosTotal <= 2.0
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        Classificação: {ihosTotal <= 1.2 ? 'Boa' : ihosTotal <= 2.0 ? 'Regular' : 'Necessita Melhoria'}
                      </span>
                    )}
                  </div>
                  <div className="text-4xl font-bold text-teal-700 tabular-nums">
                    {ihosTotal !== null ? ihosTotal.toFixed(2) : '--'}
                  </div>
                </div>
              </div>
            </div>

            {/* Crown Condition Breakdown */}
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                Distribuição da Condição da Coroa
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-100">
                  <div className="text-xl font-bold text-emerald-600 tabular-nums">
                    {Object.values(teeth).filter((c) => c === 0).length}
                  </div>
                  <div className="text-xs text-emerald-700 font-medium">Hígido</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center border border-red-100">
                  <div className="text-xl font-bold text-red-600 tabular-nums">{cCount}</div>
                  <div className="text-xs text-red-700 font-medium">Cariado</div>
                </div>
                <div className="bg-teal-50 rounded-lg p-3 text-center border border-teal-100">
                  <div className="text-xl font-bold text-teal-600 tabular-nums">{oCount}</div>
                  <div className="text-xs text-teal-700 font-medium">Restaurado</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                  <div className="text-xl font-bold text-gray-600 tabular-nums">{pCount}</div>
                  <div className="text-xs text-gray-700 font-medium">Perdido</div>
                </div>
                <div className="bg-sky-50 rounded-lg p-3 text-center border border-sky-100">
                  <div className="text-xl font-bold text-sky-600 tabular-nums">{sCount}</div>
                  <div className="text-xs text-sky-700 font-medium">Selante</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center border border-amber-100">
                  <div className="text-xl font-bold text-amber-600 tabular-nums">{prCount}</div>
                  <div className="text-xs text-amber-700 font-medium">Prótese</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {pendingOfflineExams > 0 && (
          <section className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-900">
                  {pendingOfflineExams} exame(s) aguardando sincronização
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Os dados estão guardados neste aparelho e serão enviados quando houver internet.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => syncOfflineExams()}
              className="inline-flex items-center justify-center gap-2 border border-amber-300 bg-white hover:bg-amber-100 active:bg-amber-200 text-amber-800 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              Sincronizar agora
            </button>
          </section>
        )}

        {/* Actions */}
        <section className="flex flex-col sm:flex-row gap-3 pb-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:bg-teal-300 text-white px-6 py-4 rounded-xl font-bold text-base shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? 'Salvando...' : 'Salvar Exame'}
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 px-6 py-4 rounded-xl font-bold text-base transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
          >
            <Download className="w-5 h-5" />
            Exportar CSV
          </button>

          <button
            onClick={resetForm}
            className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-500 px-6 py-4 rounded-xl font-bold text-base transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
          >
            <RotateCcw className="w-5 h-5" />
            Limpar
          </button>

          <button
            onClick={() => setShowClearSavedConfirm(true)}
            className="inline-flex items-center justify-center gap-2 border-2 border-red-200 bg-white hover:bg-red-50 active:bg-red-100 text-red-600 px-6 py-4 rounded-xl font-bold text-base transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            <AlertCircle className="w-5 h-5" />
            Excluir Exames Salvos
          </button>
        </section>
      </div>
    </div>
  );
}
