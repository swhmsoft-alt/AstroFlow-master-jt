/**
 * ai-image-provider.mjs — AI Image Generation Provider Configuration (Single Source of Truth)
 * =====================================================================================
 * Text-to-image provider registry for `scripts/generate-ai-images.mjs`.
 * Call sites import `getImageProviderConfig()` and never see provider tokens or
 * account ids directly, so swapping providers later is a one-file change.
 *
 * Providers
 * ---------
 *   cloudflare : Cloudflare Workers AI — @cf/black-forest-labs/flux-1-schnell
 *                Free tier: 10,000 Neurons/day, resets 00:00 UTC.
 *                ~43 Neurons per image @ 4 steps  →  ~230 images/day.
 *                NOTE: FLUX.1 Schnell exposes NO width/height input — the model
 *                always returns 512x512. Target sizes are reached by a sharp
 *                centre-crop + upscale (see `nativeSize`).
 *
 *   zhipu      : Zhipu BigModel — cogview-3-flash (free model)
 *                Endpoint: POST /api/paas/v4/images/generations
 *                Returns an image URL that must be downloaded, or b64_json.
 *
 * API key resolution priority (highest → lowest):
 *   1. process.env.<VAR>            ← CI / prod shell
 *   2. .env.production  <VAR>=…      ← gitignored dev convenience
 *
 * SECURITY: this module MUST NEVER embed raw API keys. The `.env.production`
 *           file is the single source of truth for secrets and is .gitignored.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

export const IMAGE_PROVIDERS = Object.freeze({
  cloudflare: Object.freeze({
    id: 'cloudflare',
    name: 'Cloudflare Workers AI',
    model: '@cf/black-forest-labs/flux-1-schnell',
    endpoint: (accountId) =>
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
    authEnvVar: 'CLOUDFLARE_API_TOKEN',
    accountEnvVar: 'CLOUDFLARE_ACCOUNT_ID',
    nativeSize: '512x512',
    defaultSteps: 4,
    freeTier: Object.freeze({
      neuronsPerDay: 10000,
      neuronsPerImage: 43,
      resetUtc: '00:00',
      approxImagesPerDay: 230,
    }),
    notes:
      'FLUX.1 Schnell has no width/height input — output is always 512x512. ' +
      'Free Neuron quota resets daily at 00:00 UTC.',
  }),

  zhipu: Object.freeze({
    id: 'zhipu',
    name: 'Zhipu BigModel',
    model: 'cogview-3-flash',
    endpoint: 'https://open.bigmodel.cn/api/paas/v4/images/generations',
    authEnvVar: 'ZHIPU_API_KEY',
    accountEnvVar: null,
    nativeSize: null,
    defaultSteps: null,
    freeTier: Object.freeze({
      note: 'Free model. Concurrency is account-tier limited, not quota limited.',
    }),
    notes:
      'Free CogView-3-Flash model. Multi-resolution output; the API returns an ' +
      'image URL (downloaded by the caller) or b64_json.',
  }),
});

export const DEFAULT_PROVIDER = 'cloudflare';

/**
 * Parse a single KEY=VALUE line out of .env.production.
 * Returns null when the file is absent, unreadable, or the key is missing/empty.
 * The file is gitignored — values here never enter version control.
 */
export function readEnvFileValue(key) {
  try {
    const envPath = path.join(ROOT, '.env.production');
    if (!fs.existsSync(envPath)) return null;
    const raw = fs.readFileSync(envPath, 'utf-8');
    const line = raw.split(/\r?\n/).find((l) => l.startsWith(`${key}=`));
    if (!line) return null;
    const val = line.slice(`${key}=`.length).trim();
    return val || null;
  } catch {
    return null;
  }
}

/** Resolve a value from process.env first, then .env.production. */
export function resolveEnvValue(key) {
  const fromProcess = process.env[key];
  if (fromProcess && fromProcess.trim()) return fromProcess.trim();
  return readEnvFileValue(key);
}


/**
 * Return the fully resolved config for an image provider.
 * Throws a clear, actionable error when credentials are missing.
 */
export function getImageProviderConfig(providerId = DEFAULT_PROVIDER) {
  const provider = IMAGE_PROVIDERS[providerId];
  if (!provider) {
    throw new Error(
      `[ai-image-provider] Unknown provider "${providerId}". ` +
        `Known providers: ${Object.keys(IMAGE_PROVIDERS).join(', ')}.`,
    );
  }

  const apiKey = resolveEnvValue(provider.authEnvVar);
  if (!apiKey) {
    throw new Error(
      `[ai-image-provider] Missing ${provider.authEnvVar}. ` +
        `Set it in your shell or in .env.production (gitignored).`,
    );
  }

  let accountId = null;
  if (provider.accountEnvVar) {
    accountId = resolveEnvValue(provider.accountEnvVar);
    if (!accountId) {
      throw new Error(
        `[ai-image-provider] Missing ${provider.accountEnvVar}. ` +
          `Set it in your shell or in .env.production (gitignored).`,
      );
    }
  }

  const endpoint =
    typeof provider.endpoint === 'function' ? provider.endpoint(accountId) : provider.endpoint;

  return { ...provider, apiKey, accountId, endpoint };
}

/** Read-only view of the registry (for CLI listings / docs). */
export function listImageProviders() {
  return Object.values(IMAGE_PROVIDERS).map((p) => ({
    id: p.id,
    name: p.name,
    model: p.model,
    authEnvVar: p.authEnvVar,
    accountEnvVar: p.accountEnvVar,
    notes: p.notes,
  }));
}

// ─── Zhipu JWT helper ───────────────────────────────────────────────────────
//
// Zhipu accepts a raw `id.secret` API key as a Bearer token for some endpoints,
// but the documented JWT form is what the image endpoints expect when the key
// is issued in the `id.secret` form. We sign it natively with node:crypto so
// this script keeps zero runtime dependencies.
//
//   header : { alg: "HS256", sign_type: "SIGN" }
//   payload: { api_key: <id>, exp: <ms now + ttl>, timestamp: <ms now> }
//   secret : the `<secret>` half of the API key

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Build a Zhipu JWT token from an `id.secret` API key.
 * Returns null when the key is not in the `id.secret` form.
 */
export function signZhipuJwt(apiKey, ttlSeconds = 3600) {
  const parts = String(apiKey).split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  const [id, secret] = parts;

  const header = base64url(JSON.stringify({ alg: 'HS256', sign_type: 'SIGN' }));
  const now = Date.now();
  const payload = base64url(
    JSON.stringify({
      api_key: id,
      exp: now + ttlSeconds * 1000,
      timestamp: now,
    }),
  );
  const signature = base64url(
    crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest(),
  );
  return `${header}.${payload}.${signature}`;
}
