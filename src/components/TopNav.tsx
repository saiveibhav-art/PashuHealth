import { Wifi, WifiOff, HeartPulse, Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/context/I18nContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { LANGS } from '@/i18n';
import type { Lang } from '@/types';

interface Props {
  onNavigateHome: () => void;
  pendingCount: number;
  onOpenLog: () => void;
}

export function TopNav({ onNavigateHome, pendingCount, onOpenLog }: Props) {
  const { lang, setLang, t } = useI18n();
  const online = useNetworkStatus();
  const [langOpen, setLangOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 pt-safe">
      <div className="flex items-center justify-between px-4 h-14 max-w-md mx-auto">
        <button onClick={onNavigateHome} className="flex items-center gap-2 active:scale-95 transition-transform">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-sm shadow-brand-500/30">
            <HeartPulse className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-none text-left">
            <p className="text-[15px] font-extrabold text-gray-900">{t('appName')}</p>
            <p className="text-[10px] font-medium text-gray-400">{t('tagline')}</p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <button
              onClick={onOpenLog}
              className="relative flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 active:scale-95 transition-transform"
            >
              <span className="text-xs font-bold text-amber-700">{pendingCount}</span>
            </button>
          )}

          <div
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg ${
              online ? 'bg-brand-50 border border-brand-200' : 'bg-gray-100 border border-gray-300'
            }`}
          >
            {online ? (
              <Wifi className="w-4 h-4 text-brand-600" strokeWidth={2.5} />
            ) : (
              <WifiOff className="w-4 h-4 text-gray-500" strokeWidth={2.5} />
            )}
            <span className={`text-xs font-bold ${online ? 'text-brand-700' : 'text-gray-500'}`}>
              {online ? t('online') : t('offline')}
            </span>
          </div>

          <div ref={ref} className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-100 border border-gray-200 active:scale-95 transition-transform"
            >
              <Globe className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
              <span className="text-xs font-bold text-gray-700 uppercase">{lang}</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg shadow-gray-300/50 border border-gray-200 overflow-hidden animate-pop origin-top-right">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code as Lang); setLangOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold transition-colors ${
                      lang === l.code ? 'bg-brand-50 text-brand-700' : 'text-gray-700 active:bg-gray-50'
                    }`}
                  >
                    <span>{l.native}</span>
                    {lang === l.code && <span className="w-2 h-2 rounded-full bg-brand-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
