/**
 * Centralized API configuration and environment resolution.
 * Supports multi-stage deployment environments (local, dev, staging, prod).
 */

export type AppStage = 'dev' | 'staging' | 'prod' | 'local';

export interface StageConfig {
  name: string;
  internalBaseUrl: string;
  publicDirectUrl: string;
  strictTls: boolean;
  description: string;
}

/**
 * Official endpoint presets for each application deployment stage.
 */
export const STAGE_PRESETS: Record<AppStage, StageConfig> = {
  local: {
    name: 'Local Docker / Machine',
    internalBaseUrl: 'http://localhost:8000/api/v1',
    publicDirectUrl: 'http://localhost:8000/api/v1',
    strictTls: false,
    description: 'Local development environment on developer machine',
  },
  dev: {
    name: 'Development Backend',
    internalBaseUrl: 'https://dev-api-ops.toentoen.com/api/v1',
    publicDirectUrl: 'https://dev-api-ops.toentoen.com/api/v1',
    strictTls: false,
    description: 'Operational development server for QA and feature integration testing',
  },
  staging: {
    name: 'Staging / Pre-Production',
    internalBaseUrl: 'https://staging-api-ops.toentoen.com/api/v1',
    publicDirectUrl: 'https://staging-api-ops.toentoen.com/api/v1',
    strictTls: true,
    description: 'Pre-release environment mirroring production for UAT',
  },
  prod: {
    name: 'Production',
    internalBaseUrl: 'https://api-ops.toentoen.com/api/v1',
    publicDirectUrl: 'https://api-ops.toentoen.com/api/v1',
    strictTls: true,
    description: 'Production server with high SLA and full security enforcement',
  },
};

/**
 * Normalizes stage identifiers from environment variables.
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
 * Resolves the upstream backend base URL for the Next.js reverse proxy.
 *
 * Resolution order:
 * 1. Explicit `INTERNAL_API_BASE_URL` environment variable.
 * 2. Predefined preset matching `APP_STAGE`.
 * 3. Default dev stage fallback (`https://dev-api-ops.toentoen.com/api/v1`).
 */
export function getBackendBaseUrl(): string {
  if (process.env.INTERNAL_API_BASE_URL && process.env.INTERNAL_API_BASE_URL.trim() !== '') {
    return process.env.INTERNAL_API_BASE_URL.trim().replace(/\/+$/, '');
  }

  const stage = resolveCurrentStage();
  const preset = STAGE_PRESETS[stage] || STAGE_PRESETS.dev;
  return preset.internalBaseUrl;
}

/**
 * Determines whether strict TLS validation should be enforced for the current stage.
 */
export function isStrictTlsRequired(): boolean {
  if (process.env.STRICT_TLS === 'true') return true;
  if (process.env.STRICT_TLS === 'false') return false;
  const stage = resolveCurrentStage();
  return STAGE_PRESETS[stage]?.strictTls ?? false;
}
