// src/config/apiConfig.ts
// Modul Konfigurasi Terpusat untuk Base URL & Environment API ToenToen
// Sesuai Standar Industri (12-Factor App & Next.js Enterprise Architecture)

export type AppStage = 'dev' | 'staging' | 'prod' | 'local';

export interface StageConfig {
  name: string;
  internalBaseUrl: string;
  publicDirectUrl: string;
  strictTls: boolean;
  description: string;
}

/**
 * Daftar Preset URL Resmi untuk Setiap Fase / Lingkungan ToenToen
 */
export const STAGE_PRESETS: Record<AppStage, StageConfig> = {
  local: {
    name: 'Local Docker / Machine',
    internalBaseUrl: 'http://localhost:8000/api/v1',
    publicDirectUrl: 'http://localhost:8000/api/v1',
    strictTls: false,
    description: 'Lingkungan local development internal backend di mesin pengembang',
  },
  dev: {
    name: 'Development Backend',
    internalBaseUrl: 'https://dev-api-ops.toentoen.com/api/v1',
    publicDirectUrl: 'https://dev-api-ops.toentoen.com/api/v1',
    strictTls: false,
    description: 'Server dev operasional untuk QA dan testing integrasi fitur baru',
  },
  staging: {
    name: 'Staging / Pre-Production',
    internalBaseUrl: 'https://staging-api-ops.toentoen.com/api/v1',
    publicDirectUrl: 'https://staging-api-ops.toentoen.com/api/v1',
    strictTls: true,
    description: 'Lingkungan pra-rilis identik dengan production untuk UAT',
  },
  prod: {
    name: 'Production',
    internalBaseUrl: 'https://api-ops.toentoen.com/api/v1',
    publicDirectUrl: 'https://api-ops.toentoen.com/api/v1',
    strictTls: true,
    description: 'Server produksi live dengan SLA tinggi dan proteksi keamanan penuh',
  },
};

/**
 * Normalisasi nama stage dari environment variable
 */
export function resolveCurrentStage(): AppStage {
  const raw = (
    process.env.APP_STAGE ||
    process.env.NEXT_PUBLIC_APP_STAGE ||
    process.env.NODE_ENV ||
    'dev'
  ).toLowerCase().trim();

  if (raw === 'production' || raw === 'prod') return 'prod';
  if (raw === 'staging' || raw === 'uat') return 'staging';
  if (raw === 'local' || raw === 'localhost') return 'local';
  return 'dev';
}

/**
 * Mendapatkan Base URL Upstream Backend (digunakan di Reverse Proxy Server Next.js)
 *
 * Prioritas Resolusi:
 * 1. Nilai eksplisit `INTERNAL_API_BASE_URL` (jika di-set di .env)
 * 2. Preset berdasarkan `APP_STAGE` (dev | staging | prod | local)
 * 3. Fallback default DEV (`https://dev-api-ops.toentoen.com/api/v1`)
 */
export function getBackendBaseUrl(): string {
  // 1. Prioritas utama: URL eksplisit kustom (misal untuk tunneling Ngrok atau IP spesifik)
  if (process.env.INTERNAL_API_BASE_URL && process.env.INTERNAL_API_BASE_URL.trim() !== '') {
    return process.env.INTERNAL_API_BASE_URL.trim().replace(/\/+$/, '');
  }

  // 2. Prioritas kedua: Preset berdasarkan APP_STAGE
  const stage = resolveCurrentStage();
  const preset = STAGE_PRESETS[stage] || STAGE_PRESETS.dev;
  return preset.internalBaseUrl;
}

/**
 * Mengetahui apakah stage saat ini membutuhkan validasi TLS ketat
 */
export function isStrictTlsRequired(): boolean {
  if (process.env.STRICT_TLS === 'true') return true;
  if (process.env.STRICT_TLS === 'false') return false;
  const stage = resolveCurrentStage();
  return STAGE_PRESETS[stage]?.strictTls ?? false;
}
