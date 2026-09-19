import { useEffect, useRef } from 'react';
import { Cpu, Zap, ShieldCheck } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import type { ScanType } from '@/types';

interface Props {
  scanType: ScanType;
  imageData: string | null;
  onDone: () => void;
}

export function AIProcessing({ scanType, imageData, onDone }: Props) {
  const { t } = useI18n();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setTimeout(onDone, 2500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [onDone]);

  const typeLabel = scanType === 'mastitis' ? t('scanMastitis') : t('scanTheileriosis');

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-6 pb-safe animate-fade-in">
      {/* Image with scanning overlay */}
      <div className="relative w-64 h-64 rounded-3xl overflow-hidden bg-gray-900 shadow-2xl mb-8">
        {imageData ? (
          <img src={imageData} alt="scan" className="w-full h-full object-cover opacity-70" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
        )}

        {/* Scan line */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-0 right-0 h-0.5 bg-brand-400 shadow-[0_0_20px_4px_rgba(16,185,129,0.6)] animate-scan-line" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-brand-400/20" />
            ))}
          </div>
        </div>

        {/* Corner brackets */}
        <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-brand-400 rounded-tl-lg" />
        <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-brand-400 rounded-tr-lg" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-brand-400 rounded-bl-lg" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-brand-400 rounded-br-lg" />

        {/* Center pulse */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-brand-500/30 animate-pulse-ring" />
            <div className="absolute inset-0 w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Status text */}
      <div className="text-center mb-2">
        <p className="text-lg font-extrabold text-gray-900 animate-pulse">{t('analyzing')}</p>
        <p className="text-sm text-gray-400 mt-1">{typeLabel}</p>
      </div>

      {/* Progress bar */}
      <div className="w-56 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-4">
        <div className="h-full bg-gradient-to-r from-brand-400 to-brand-600 animate-progress-fill rounded-full" />
      </div>

      {/* Offline badge */}
      <div className="mt-8 flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200">
        <Zap className="w-4 h-4 text-brand-600" strokeWidth={2.5} />
        <span className="text-xs font-bold text-brand-700">{t('noInternet')}</span>
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
        <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.5} />
        <span className="font-medium">{t('processingLocally')}</span>
      </div>
    </div>
  );
}
