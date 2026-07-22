import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  X,
  Lock,
  BarChart2,
  Calendar,
  Monitor,
  List,
  RefreshCw,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react';

const ADMIN_PASSWORD = 'profsmoc2024admin';

type AccessLog = {
  id: string;
  session_id: string;
  event_type: string;
  tab_name: string | null;
  user_agent: string;
  created_at: string;
};

type DailyStat = { date: string; count: number };
type TabStat = { tab_name: string; count: number };

function parseDevice(ua: string): string {
  if (/mobile|android|iphone|ipad/i.test(ua)) {
    if (/ipad/i.test(ua)) return 'iPad';
    if (/iphone/i.test(ua)) return 'iPhone';
    if (/android/i.test(ua)) return 'Android';
    return 'Mobile';
  }
  if (/windows/i.test(ua)) return 'Windows';
  if (/mac os/i.test(ua)) return 'macOS';
  if (/linux/i.test(ua)) return 'Linux';
  return 'Desconhecido';
}

function parseBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return 'Edge';
  if (/opr\//i.test(ua)) return 'Opera';
  if (/chrome/i.test(ua)) return 'Chrome';
  if (/safari/i.test(ua)) return 'Safari';
  if (/firefox/i.test(ua)) return 'Firefox';
  return 'Outro';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatDateOnly(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

export function AdminPanel({ onClose }: { onClose: () => void }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'logs'>('overview');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('access_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);
      if (!error && data) setLogs(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) fetchLogs();
  }, [authenticated, fetchLogs]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Senha incorreta. Tente novamente.');
    }
  }

  // Derived stats
  const totalAccesses = logs.filter(l => l.event_type === 'page_load').length;
  const totalNavigations = logs.filter(l => l.event_type === 'tab_navigation').length;
  const uniqueSessions = new Set(logs.map(l => l.session_id)).size;

  const dailyStats: DailyStat[] = (() => {
    const map: Record<string, number> = {};
    logs.forEach(l => {
      const date = l.created_at.slice(0, 10);
      map[date] = (map[date] ?? 0) + 1;
    });
    return Object.entries(map)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 14);
  })();

  const tabStats: TabStat[] = (() => {
    const map: Record<string, number> = {};
    logs.filter(l => l.event_type === 'tab_navigation' && l.tab_name).forEach(l => {
      const name = l.tab_name!;
      map[name] = (map[name] ?? 0) + 1;
    });
    return Object.entries(map)
      .map(([tab_name, count]) => ({ tab_name, count }))
      .sort((a, b) => b.count - a.count);
  })();

  const maxTabCount = tabStats[0]?.count ?? 1;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-4 px-2">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-600 rounded-xl">
              <BarChart2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Painel Administrativo</h2>
              <p className="text-xs text-gray-500">Monitoramento de acesso — PROFSMOC II</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!authenticated ? (
          /* Login form */
          <div className="flex flex-col items-center justify-center px-6 py-14 gap-6">
            <div className="p-4 bg-teal-50 rounded-2xl">
              <Lock className="w-8 h-8 text-teal-600" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-gray-900">Acesso Restrito</h3>
              <p className="text-sm text-gray-500 mt-1">Digite a senha para acessar o painel.</p>
            </div>
            <form onSubmit={handleLogin} className="w-full max-w-xs flex flex-col gap-3">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setAuthError(''); }}
                  placeholder="Senha administrativa"
                  className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && <p className="text-xs text-red-600 text-center">{authError}</p>}
              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Entrar
              </button>
            </form>
          </div>
        ) : (
          /* Dashboard */
          <div className="flex flex-col">
            {/* Sub-tabs */}
            <div className="flex gap-1 px-6 pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                Visão Geral
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('logs')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'logs'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="w-4 h-4" />
                Registros
              </button>
              <div className="ml-auto">
                <button
                  type="button"
                  onClick={fetchLogs}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {loading
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <RefreshCw className="w-4 h-4" />}
                  Atualizar
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {activeTab === 'overview' && (
                <>
                  {/* Summary cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="bg-teal-50 rounded-xl p-4">
                      <p className="text-xs text-teal-600 font-medium uppercase tracking-wide">Acessos ao sistema</p>
                      <p className="text-3xl font-bold text-teal-700 mt-1">{totalAccesses}</p>
                    </div>
                    <div className="bg-sky-50 rounded-xl p-4">
                      <p className="text-xs text-sky-600 font-medium uppercase tracking-wide">Sessões únicas</p>
                      <p className="text-3xl font-bold text-sky-700 mt-1">{uniqueSessions}</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4 col-span-2 sm:col-span-1">
                      <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">Navegações de aba</p>
                      <p className="text-3xl font-bold text-amber-700 mt-1">{totalNavigations}</p>
                    </div>
                  </div>

                  {/* Abas mais acessadas */}
                  {tabStats.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-gray-400" />
                        Abas mais acessadas
                      </h3>
                      <div className="space-y-2">
                        {tabStats.map(({ tab_name, count }) => (
                          <div key={tab_name} className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 w-36 shrink-0 truncate">{tab_name}</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-teal-500 h-2 rounded-full transition-all"
                                style={{ width: `${(count / maxTabCount) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 w-8 text-right shrink-0">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Acessos por data */}
                  {dailyStats.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        Acessos por data (últimos 14 dias)
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                              <th className="pb-2 font-medium">Data</th>
                              <th className="pb-2 font-medium text-right">Eventos</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dailyStats.map(({ date, count }) => (
                              <tr key={date} className="border-b border-gray-50 last:border-0">
                                <td className="py-2 text-gray-700">{formatDateOnly(date)}</td>
                                <td className="py-2 text-right font-semibold text-gray-800">{count}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {logs.length === 0 && !loading && (
                    <p className="text-center text-sm text-gray-400 py-8">Nenhum registro encontrado.</p>
                  )}
                </>
              )}

              {activeTab === 'logs' && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <List className="w-4 h-4 text-gray-400" />
                    Registros de navegação
                    <span className="ml-auto text-xs text-gray-400 font-normal">Exibindo até 500 registros</span>
                  </h3>
                  <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50">
                        <tr className="text-left text-gray-500 uppercase tracking-wide">
                          <th className="px-3 py-2 font-medium">Data/Hora</th>
                          <th className="px-3 py-2 font-medium">Evento</th>
                          <th className="px-3 py-2 font-medium">Aba</th>
                          <th className="px-3 py-2 font-medium">Navegador</th>
                          <th className="px-3 py-2 font-medium">Dispositivo</th>
                          <th className="px-3 py-2 font-medium">Sessão</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map(log => (
                          <tr key={log.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{formatDate(log.created_at)}</td>
                            <td className="px-3 py-2">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                log.event_type === 'page_load'
                                  ? 'bg-teal-100 text-teal-700'
                                  : 'bg-sky-100 text-sky-700'
                              }`}>
                                {log.event_type === 'page_load' ? 'Acesso' : 'Aba'}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-gray-700">{log.tab_name ?? '—'}</td>
                            <td className="px-3 py-2 text-gray-600">{parseBrowser(log.user_agent)}</td>
                            <td className="px-3 py-2 text-gray-600">{parseDevice(log.user_agent)}</td>
                            <td className="px-3 py-2 text-gray-400 font-mono">{log.session_id.slice(0, 8)}…</td>
                          </tr>
                        ))}
                        {logs.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-3 py-8 text-center text-gray-400">
                              Nenhum registro encontrado.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
