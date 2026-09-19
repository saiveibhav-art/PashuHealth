import { createContext, useContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ScanResult } from '@/types';

const KEY = 'pashuhealth.scans';

function load(): ScanResult[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ScanResult[]) : [];
  } catch {
    return [];
  }
}

interface RecordsCtx {
  records: ScanResult[];
  addRecord: (r: ScanResult) => void;
  deleteRecord: (id: string) => void;
  clearAll: () => void;
  syncAll: () => void;
  pendingCount: number;
}

const Ctx = createContext<RecordsCtx | null>(null);

export function RecordsProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<ScanResult[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(records));
    } catch {
      /* storage full — silently ignore */
    }
  }, [records]);

  const addRecord = useCallback((r: ScanResult) => {
    setRecords((prev) => [r, ...prev]);
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const clearAll = useCallback(() => setRecords([]), []);

  const syncAll = useCallback(() => {
    setRecords((prev) => prev.map((r) => ({ ...r, synced: true })));
  }, []);

  const pendingCount = useMemo(() => records.filter((r) => !r.synced).length, [records]);

  const value = useMemo(
    () => ({ records, addRecord, deleteRecord, clearAll, syncAll, pendingCount }),
    [records, addRecord, deleteRecord, clearAll, syncAll, pendingCount]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOfflineRecords() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useOfflineRecords must be used within RecordsProvider');
  return ctx;
}
