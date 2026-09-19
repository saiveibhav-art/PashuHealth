import { useCallback, useEffect, useState } from 'react';
import { I18nProvider, useI18n } from '@/context/I18nContext';
import { RecordsProvider, useOfflineRecords } from '@/context/RecordsContext';
import { TopNav } from '@/components/TopNav';
import { Dashboard } from '@/components/Dashboard';
import { CameraCapture } from '@/components/CameraCapture';
import { AIProcessing } from '@/components/AIProcessing';
import { Results } from '@/components/Results';
import { OfflineLog } from '@/components/OfflineLog';
import type { Screen, ScanType, ScanResult, RiskLevel } from '@/types';

function AppInner() {
  const { t, lang } = useI18n();
  const { records, addRecord, pendingCount } = useOfflineRecords();

  const [screen, setScreen] = useState<Screen>('home');
  const [scanType, setScanType] = useState<ScanType>('mastitis');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  // PWA service worker registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  const generateResult = useCallback((): ScanResult => {
    const rand = Math.random();
    let risk: RiskLevel;
    let label: string;
    let detail: string;

    if (rand < 0.4) {
      risk = 'low';
      label = scanType === 'mastitis' ? 'Healthy' : 'Healthy';
      detail = t('healthy');
    } else if (rand < 0.75) {
      risk = 'medium';
      label = scanType === 'mastitis' ? 'Subclinical Mastitis' : 'Mild Theileriosis';
      detail = t('monitor');
    } else {
      risk = 'high';
      label = scanType === 'mastitis' ? 'Clinical Mastitis Detected' : 'Theileriosis Detected';
      detail = t('clinical');
    }

    const confidence = risk === 'low' ? 88 + Math.floor(Math.random() * 10) : risk === 'medium' ? 75 + Math.floor(Math.random() * 15) : 82 + Math.floor(Math.random() * 16);

    return {
      id: `scan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type: scanType,
      risk,
      label,
      detail,
      confidence,
      imageData: capturedImage,
      timestamp: Date.now(),
      synced: false,
      language: lang,
    };
  }, [scanType, capturedImage, t, lang]);

  const handleScan = (type: ScanType) => {
    setScanType(type);
    setCapturedImage(null);
    setResult(null);
    setScreen('camera');
  };

  const handleCapture = (imageData: string | null) => {
    setCapturedImage(imageData);
    setScreen('processing');
  };

  const handleProcessingDone = () => {
    setResult(generateResult());
    setScreen('results');
  };

  const handleSave = () => {
    if (result) addRecord(result);
  };

  const handleNewScan = () => {
    setCapturedImage(null);
    setResult(null);
    setScreen('camera');
  };

  const handleHome = () => {
    setCapturedImage(null);
    setResult(null);
    setScreen('home');
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto shadow-sm">
      <TopNav
        onNavigateHome={handleHome}
        pendingCount={pendingCount}
        onOpenLog={() => setScreen('log')}
      />

      <main className="pt-14 min-h-screen">
        {screen === 'home' && (
          <Dashboard
            onScan={handleScan}
            onOpenLog={() => setScreen('log')}
            hasRecords={records.length > 0}
          />
        )}

        {screen === 'camera' && (
          <CameraCapture
            scanType={scanType}
            onCapture={handleCapture}
            onBack={handleHome}
          />
        )}

        {screen === 'processing' && (
          <AIProcessing
            scanType={scanType}
            imageData={capturedImage}
            onDone={handleProcessingDone}
          />
        )}

        {screen === 'results' && result && (
          <Results
            result={result}
            onSave={handleSave}
            onNewScan={handleNewScan}
            onHome={handleHome}
          />
        )}

        {screen === 'log' && (
          <OfflineLog onBack={handleHome} />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <RecordsProvider>
        <AppInner />
      </RecordsProvider>
    </I18nProvider>
  );
}
