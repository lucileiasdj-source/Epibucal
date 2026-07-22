import { useState, useEffect, useCallback } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let savedPromptEvent: BeforeInstallPromptEvent | null = null;

window.addEventListener('beforeinstallprompt', (e: Event) => {
  e.preventDefault();
  savedPromptEvent = e as BeforeInstallPromptEvent;
});

export function useInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(savedPromptEvent);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      savedPromptEvent = e as BeforeInstallPromptEvent;
      setPromptEvent(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setPromptEvent(null);
      savedPromptEvent = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerInstall = useCallback(async () => {
    const event = promptEvent || savedPromptEvent;
    if (!event) return false;

    await event.prompt();
    const { outcome } = await event.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
      savedPromptEvent = null;
      setPromptEvent(null);
      return true;
    }
    return false;
  }, [promptEvent]);

  return {
    canInstall: !isInstalled && !!(promptEvent || savedPromptEvent),
    isInstalled,
    triggerInstall,
  };
}

export function InstallHeaderButton() {
  const { canInstall, triggerInstall } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <button
      onClick={triggerInstall}
      className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 active:bg-white/30 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors border border-white/20"
    >
      <Smartphone className="w-4 h-4" />
      <span className="hidden sm:inline">Instalar App</span>
    </button>
  );
}

export function InstallBanner() {
  const { canInstall, triggerInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-sm animate-slide-up">
      <div className="bg-teal-700 text-white rounded-2xl shadow-2xl border border-teal-600 p-4 flex items-start gap-3">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/15 shrink-0">
          <Download className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold leading-tight">Instalar Epibucal</p>
          <p className="text-xs text-teal-100 mt-1 leading-snug">
            Adicione a tela inicial para acesso rapido, mesmo sem internet.
          </p>
          <button
            onClick={triggerInstall}
            className="mt-3 inline-flex items-center gap-1.5 bg-white text-teal-700 text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-teal-50 active:bg-teal-100 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Adicionar a tela inicial
          </button>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1.5 rounded-lg hover:bg-white/15 transition-colors shrink-0"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}