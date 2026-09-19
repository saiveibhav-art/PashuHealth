import { useState } from 'react';
import { useMemo } from 'react';
import { Camera, Bug, RefreshCw, ChevronRight, Clock, CheckCircle2, Zap } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { useOfflineRecords } from '@/context/RecordsContext';
import type { ScanType } from '@/types';

interface Props {
  onScan: (type: ScanType) => void;
  onOpenLog: () => void;
  hasRecords: boolean;
}

export function Dashboard({ onScan, onOpenLog, hasRecords }: Props) {
  const { t } = useI18n();
  const { records, syncAll, pendingCount } = useOfflineRecords();
  const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'done'>('idle');

  const syncedCount = useMemo(() => records.filter((r) => r.synced).length, [records]);

  const handleSync = () => {
    if (pendingCount === 0) return;
    setSyncState('syncing');
    setTimeout(() => {
      syncAll();
      setSyncState('done');
      setTimeout(() => setSyncState('idle'), 2000);
    }, 1200);
  };

  return (
    <div className="px-4 pt-2 pb-safe">
      {/* Hero / Welcome */}
      <div className="mb-5 animate-slide-up">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-600 mb-1">{t('aiPowered')}</p>
        <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">{t('welcome')}</h1>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{t('welcomeSub')}</p>
      </div>

      {/* Scan cards */}
      <div className="space-y-3 mb-5">
        <ScanCard
          icon={<Camera className="w-7 h-7" strokeWidth={2.5} />}
          title={t('scanMastitis')}
          subtitle={t('scanMastitisSub')}
          accent="brand"
          onClick={() => onScan('mastitis')}
          delay={0}
        />
        <ScanCard
          icon={<Bug className="w-7 h-7" strokeWidth={2.5} />}
          title={t('scanTheileriosis')}
          subtitle={t('scanTheileriosisSub')}
          accent="danger"
          onClick={() => onScan('theileriosis')}
          delay={80}
        />
      </div>

      {/* Sync section */}
      <button
        onClick={handleSync}
        disabled={pendingCount === 0 && syncState !== 'done'}
        className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 border-dashed border-gray-300 active:scale-[0.98] transition-all bg-white disabled:opacity-60 animate-slide-up"
        style={{ animationDelay: '160ms' }}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            syncState === 'done' ? 'bg-brand-100' : 'bg-gray-100'
          }`}>
            {syncState === 'syncing' ? (
              <RefreshCw className="w-5 h-5 text-gray-500 animate-spin" strokeWidth={2.5} />
            ) : syncState === 'done' ? (
              <CheckCircle2 className="w-5 h-5 text-brand-600" strokeWidth={2.5} />
            ) : (
              <RefreshCw className="w-5 h-5 text-gray-500" strokeWidth={2.5} />
            )}
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-800">
              {syncState === 'syncing' ? t('syncing') : syncState === 'done' ? t('syncDone') : t('syncRecords')}
            </p>
            <p className="text-xs text-gray-400">
              {pendingCount} {t('pending')} · {syncedCount} synced
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300" />
      </button>

      {/* Offline log shortcut */}
      {hasRecords && (
        <button
          onClick={onOpenLog}
          className="w-full mt-3 flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 active:scale-[0.98] transition-all animate-slide-up"
          style={{ animationDelay: '200ms' }}
        >
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-gray-400" strokeWidth={2.5} />
            <span className="text-sm font-semibold text-gray-600">{t('scanHistory')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-gray-400">{records.length}</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
        </button>
      )}

      {/* Offline badge */}
      <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400 animate-fade-in">
        <Zap className="w-3.5 h-3.5" strokeWidth={2.5} />
        <span className="font-medium">{t('noInternet')}</span>
      </div>
    </div>
  );
}

function ScanCard({
  icon,
  title,
  subtitle,
  accent,
  onClick,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  accent: 'brand' | 'danger';
  onClick: () => void;
  delay: number;
}) {
  const styles = accent === 'brand'
    ? 'from-brand-500 to-brand-600 shadow-brand-500/25'
    : 'from-danger-500 to-danger-600 shadow-danger-500/25';

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br ${styles} shadow-lg active:scale-[0.97] transition-all text-left animate-slide-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-base font-extrabold text-white leading-tight">{title}</p>
        <p className="text-sm text-white/80 mt-0.5">{subtitle}</p>
      </div>
      <ChevronRight className="w-6 h-6 text-white/70 flex-shrink-0" strokeWidth={2.5} />
    </button>
  );
}
