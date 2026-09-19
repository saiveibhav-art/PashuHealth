export type Lang = 'en' | 'hi' | 'mr';

export type Screen = 'home' | 'camera' | 'processing' | 'results' | 'log';

export type ScanType = 'mastitis' | 'theileriosis';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface ScanResult {
  id: string;
  type: ScanType;
  risk: RiskLevel;
  label: string;
  detail: string;
  confidence: number;
  imageData: string | null;
  timestamp: number;
  synced: boolean;
  language: Lang;
}
