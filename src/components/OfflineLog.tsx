import { Clock, Trash2, RefreshCw, CheckCircle2, ChevronLeft, Inbox } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { useOfflineRecords } from '@/context/RecordsContext';
import { useState } from 'react';
import type { RiskLevel } from '@/types';

interface Props {
  onBack: () => void;
}

const riskStyles: Record<RiskLevel, { dot: string; label: string; text: string }> = {
  low: { dot: 'bg-brand-500', label: 'Low', text: 'text-brand-600' },
  medium: { dot: 'bg-warn-400', label: 'Med', text: 'text-warn-600' },
  high: { dot: 'bg-danger-500', label: 'High', text: 'text-danger-600' },
};

export function OfflineLog({ onBack }: Props) {
  const { t } = useI18n();
  const { records, deleteRecord, clearAll, syncAll, pendingCount } = useOfflineRecords();
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  const handleSync = () => {
    if (pendingCount === 0) return;
    setSyncing(true);
    setTimeout(() => {
      syncAll();
      setSyncing(false);
      setSynced(true);
      setTimeout(() => setSynced(false), 2000);
    }, 1200);
  };

  return (
    <div className="px-4 pt-3 pb-safe animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-bold text-gray-500 active:scale-95 transition-transform">
          <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
          {t('back')}
        </button>
        <span className="text-sm font-extrabold text-gray-900">{t('pendingScans')}</span>
      </div>

      {/* Summary card */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-200 mb-4">
        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
          <Clock className="w-6 h-6 text-amber-500" strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <p className="text-2xl font-extrabold text-gray-900">{pendingCount}</p>
          <p className="text-xs font-medium text-gray-400">{t('pending')}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-brand-600" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-2xl font-extrabold text-gray-900">{records.filter((r) => r.synced).length}</p>
          <p className="text-xs font-medium text-gray-400">Synced</p>
        </div>
      </div>

      {/* Sync button */}
      <button
        onClick={handleSync}
        disabled={pendingCount === 0 || syncing}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-brand-500 text-white font-bold shadow-lg shadow-brand-500/25 active:scale-[0.97] transition-all mb-4 disabled:opacity-40"
      >
        {syncing ? <RefreshCw className="w-5 h-5 animate-spin" strokeWidth={2.5} /> : synced ? <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} /> : <RefreshCw className="w-5 h-5" strokeWidth={2.5} />}
        {syncing ? t('syncing') : synced ? t('syncDone') : t('syncAll')}
      </button>

      {/* Records list */}
      {records.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
            <Inbox className="w-8 h-8 text-gray-300" strokeWidth={2} />
          </div>
          <p className="text-sm font-medium text-gray-400">{t('noPending')}</p>
        </div>
      ) : (
        <>
          <div className="space-y-2.5">
            {records.map((r) => {
              const rs = riskStyles[r.risk];
              const typeLabel = r.type === 'mastitis' ? t('scanMastitis') : t('scanTheileriosis');
              const date = new Date(r.timestamp);
              const dateStr = date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
              const timeStr = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-200 animate-slide-up">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                    {r.imageData ? (
                      <img src={r.imageData} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className={`w-3 h-3 rounded-full ${rs.dot}`} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{typeLabel}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs font-bold ${rs.text}`}>{rs.label}</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-400">{dateStr} {timeStr}</span>
                    </div>
                  </div>
                  {r.synced ? (
                    <CheckCircle2 className="w-5 h-5 text-brand-500 flex-shrink-0" strokeWidth={2.5} />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                  )}
                  <button
                    onClick={() => deleteRecord(r.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 active:text-danger-500 active:bg-danger-50 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
              );
            })}
          </div>

          {records.length > 0 && (
            <button
              onClick={() => { if (confirm(t('confirmClear'))) clearAll(); }}
              className="w-full mt-4 py-3 text-sm font-semibold text-danger-500 active:text-danger-700 transition-colors"
            >
              {t('clearAll')}
            </button>
          )}
        </>
      )}
    </div>
  );
}
