import { useState, useRef, useCallback } from 'react';
import { Volume2, Square, Save, RotateCcw, Home, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { TrafficLight } from '@/components/TrafficLight';
import type { ScanResult, ScanType, RiskLevel } from '@/types';

interface Props {
  result: ScanResult;
  onSave: () => void;
  onNewScan: () => void;
  onHome: () => void;
}

export function Results({ result, onSave, onNewScan, onHome }: Props) {
  const { t, lang } = useI18n();
  const [saved, setSaved] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<SpeechSynthesisUtterance | null>(null);

  const riskConfig = {
    low: {
      icon: <CheckCircle2 className="w-8 h-8" strokeWidth={2.5} />,
      label: t('lowRisk'),
      detail: t('healthy'),
      rec: t('recLow'),
      bg: 'bg-brand-50',
      border: 'border-brand-200',
      text: 'text-brand-700',
      accent: 'text-brand-600',
    },
    medium: {
      icon: <ShieldAlert className="w-8 h-8" strokeWidth={2.5} />,
      label: t('mediumRisk'),
      detail: t('monitor'),
      rec: t('recMed'),
      bg: 'bg-warn-50',
      border: 'border-warn-200',
      text: 'text-warn-700',
      accent: 'text-warn-600',
    },
    high: {
      icon: <AlertTriangle className="w-8 h-8" strokeWidth={2.5} />,
      label: t('highRisk'),
      detail: t('clinical'),
      rec: t('recHigh'),
      bg: 'bg-danger-50',
      border: 'border-danger-200',
      text: 'text-danger-700',
      accent: 'text-danger-600',
    },
  }[result.risk];

  const handlePlayAudio = useCallback(() => {
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }

    const voiceText: Record<string, string> = {
      en: `${result.label}. ${riskConfig.detail}. ${riskConfig.rec}`,
      hi: result.risk === 'high'
        ? `उच्च जोखिम। ${riskConfig.detail}। ${riskConfig.rec}`
        : result.risk === 'medium'
          ? `मध्यम जोखिम। ${riskConfig.detail}। ${riskConfig.rec}`
          : `कम जोखिम। ${riskConfig.detail}।`,
      mr: result.risk === 'high'
        ? `उच्च जोखीम। ${riskConfig.detail}। ${riskConfig.rec}`
        : result.risk === 'medium'
          ? `मध्यम जोखीम। ${riskConfig.detail}। ${riskConfig.rec}`
          : `कमी जोखीम। ${riskConfig.detail}।`,
    };

    const utter = new SpeechSynthesisUtterance(voiceText[lang] || voiceText.en);
    utter.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN';
    utter.rate = 0.85;
    utter.pitch = 1;
    utter.onend = () => setPlaying(false);
    utter.onerror = () => setPlaying(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    audioRef.current = utter;
    setPlaying(true);
  }, [playing, result, riskConfig, lang]);

  const handleSave = () => {
    onSave();
    setSaved(true);
  };

  const typeLabel = result.type === 'mastitis' ? t('scanMastitis') : t('scanTheileriosis');

  return (
    <div className="px-4 pt-4 pb-safe animate-slide-up">
      {/* Header */}
      <div className="text-center mb-5">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">{typeLabel}</p>
        <p className="text-sm font-medium text-gray-500">{t('results')}</p>
      </div>

      {/* Image preview */}
      {result.imageData && (
        <div className="relative w-full h-32 rounded-2xl overflow-hidden mb-5 shadow-md">
          <img src={result.imageData} alt="scan" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}

      {/* Traffic light + risk */}
      <div className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${riskConfig.bg} ${riskConfig.border} mb-4`}>
        <TrafficLight risk={result.risk} />
        <div className="flex-1">
          <div className={`flex items-center gap-2 mb-1 ${riskConfig.accent}`}>
            {riskConfig.icon}
            <span className="text-lg font-extrabold">{riskConfig.label}</span>
          </div>
          <p className={`text-sm font-semibold ${riskConfig.text} leading-snug`}>{riskConfig.detail}</p>
        </div>
      </div>

      {/* Confidence */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 mb-4">
        <span className="text-sm font-semibold text-gray-500">{t('confidence')}</span>
        <span className="text-sm font-extrabold text-gray-800">{result.confidence}%</span>
      </div>

      {/* Recommendations */}
      <div className="px-4 py-3.5 rounded-xl bg-white border border-gray-200 mb-6">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">{t('recommendations')}</p>
        <p className="text-sm text-gray-700 leading-relaxed">{riskConfig.rec}</p>
      </div>

      {/* Audio button */}
      <button
        onClick={handlePlayAudio}
        className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-base shadow-lg active:scale-[0.97] transition-all mb-3 ${
          playing
            ? 'bg-gray-700 text-white shadow-gray-700/30'
            : result.risk === 'high'
              ? 'bg-danger-500 text-white shadow-danger-500/30'
              : result.risk === 'medium'
                ? 'bg-warn-500 text-white shadow-warn-500/30'
                : 'bg-brand-500 text-white shadow-brand-500/30'
        }`}
      >
        {playing ? <Square className="w-5 h-5 fill-current" strokeWidth={2.5} /> : <Volume2 className="w-5 h-5" strokeWidth={2.5} />}
        {playing ? t('stopAudio') : t('playAudio')}
      </button>

      {/* Save & Sync */}
      <button
        onClick={handleSave}
        disabled={saved}
        className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-base active:scale-[0.97] transition-all mb-3 ${
          saved
            ? 'bg-brand-100 text-brand-700 border-2 border-brand-200'
            : 'bg-gray-100 text-gray-700 border-2 border-gray-200 active:bg-gray-200'
        }`}
      >
        {saved ? <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} /> : <Save className="w-5 h-5" strokeWidth={2.5} />}
        {saved ? t('saved') : t('saveSync')}
      </button>

      {/* Bottom actions */}
      <div className="flex gap-3">
        <button
          onClick={onNewScan}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white border-2 border-gray-200 text-gray-600 font-semibold active:scale-[0.97] transition-all"
        >
          <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
          {t('newScan')}
        </button>
        <button
          onClick={onHome}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white border-2 border-gray-200 text-gray-600 font-semibold active:scale-[0.97] transition-all"
        >
          <Home className="w-4 h-4" strokeWidth={2.5} />
          {t('backHome')}
        </button>
      </div>
    </div>
  );
}
