import { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import type { ScanType } from '@/types';

interface Props {
  scanType: ScanType;
  onCapture: (imageData: string | null) => void;
  onBack: () => void;
}

export function CameraCapture({ scanType, onCapture, onBack }: Props) {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraReady(true);
      setCameraError(false);
    } catch {
      setCameraError(true);
      setCameraReady(false);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((tr) => tr.stop());
        streamRef.current = null;
      }
    };
  }, [startCamera]);

  const handleCapture = () => {
    if (!videoRef.current || !cameraReady) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const data = canvas.toDataURL('image/jpeg', 0.7);
      setPreview(data);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const confirmCapture = () => onCapture(preview);

  const retake = () => {
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const typeLabel = scanType === 'mastitis' ? t('scanMastitis') : t('scanTheileriosis');
  const typeColor = scanType === 'mastitis' ? 'bg-brand-100 text-brand-700' : 'bg-danger-100 text-danger-700';

  if (preview) {
    return (
      <div className="flex flex-col items-center justify-between min-h-[calc(100vh-3.5rem)] px-4 pt-6 pb-safe animate-fade-in">
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${typeColor}`}>{typeLabel}</span>
            <button onClick={retake} className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 active:scale-95 transition-transform">
              <X className="w-4 h-4" /> {t('retake')}
            </button>
          </div>
          <div className="relative rounded-3xl overflow-hidden bg-black shadow-xl">
            <img src={preview} alt="capture" className="w-full max-h-[55vh] object-contain" />
          </div>
        </div>

        <div className="w-full mt-6 space-y-3">
          <button
            onClick={confirmCapture}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-brand-500 text-white font-bold text-base shadow-lg shadow-brand-500/30 active:scale-[0.97] transition-all"
          >
            <ImageIcon className="w-5 h-5" strokeWidth={2.5} />
            {t('done')}
          </button>
          <button
            onClick={retake}
            className="w-full py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-semibold active:scale-[0.97] transition-all"
          >
            {t('retakePhoto')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)] px-4 pt-4 pb-safe animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${typeColor}`}>{typeLabel}</span>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {cameraReady && !cameraError ? (
          <div className="relative w-full aspect-[3/4] max-h-[55vh] rounded-3xl overflow-hidden bg-black shadow-xl">
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
            {/* Overlay guide */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-6 border-2 border-dashed border-white/60 rounded-2xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-32 h-32 border-2 border-white/30 rounded-full" />
              </div>
            </div>
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/90 text-xs font-semibold bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full whitespace-nowrap">
              {t('positionGuide')}
            </p>
          </div>
        ) : (
          <div className="w-full aspect-[3/4] max-h-[55vh] rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-3 px-6 text-center">
            {cameraError ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-gray-200 flex items-center justify-center">
                  <Camera className="w-7 h-7 text-gray-400" strokeWidth={2} />
                </div>
                <p className="text-sm font-semibold text-gray-500">{t('uploadFallback')}</p>
              </>
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gray-200 flex items-center justify-center animate-pulse">
                <Camera className="w-7 h-7 text-gray-400" strokeWidth={2} />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <button
          onClick={handleCapture}
          disabled={!cameraReady}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-brand-500 text-white font-bold text-base shadow-lg shadow-brand-500/30 active:scale-[0.97] transition-all disabled:opacity-40 disabled:shadow-none"
        >
          <Camera className="w-5 h-5" strokeWidth={2.5} />
          {t('capture')}
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-semibold active:scale-[0.97] transition-all"
        >
          <Upload className="w-5 h-5" strokeWidth={2.5} />
          {t('uploadFallback')}
        </button>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
        <button onClick={onBack} className="w-full py-2 text-sm font-semibold text-gray-400">
          {t('back')}
        </button>
      </div>
    </div>
  );
}
