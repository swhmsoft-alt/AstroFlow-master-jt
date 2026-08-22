/**
 * ai-provider.mjs — Unified AI Provider Configuration (Single Source of Truth)
 * ================================================================
 * Active provider:  MiniMax M3 (OpenAI-compatible) → https://api.minimaxi.com/v1
 * Provider identity is intentionally provider-agnostic at the call sites:
 * scripts import `getChatCompletionsConfig()` and never see DeepSeek/MiniMax
 * tokens directly, so swapping providers later is a one-file change.
 *
 * API key resolution priority (highest → lowest):
 *   1. process.env.MINIMAX_API_KEY           ← CI / prod shell
 *   2. .env.production  MINIMAX_API_KEY=…     ← gitignored dev convenience
 *   3. process.env.DEEPSEEK_API_KEY           ← legacy fallback for outages only
 *
 * SECURITY: this module MUST NEVER embed raw API keys. The `.env.production`
 *           file is the single source of truth for secrets and is .gitignored.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

const ACTIVE_PROVIDER = Object.freeze({
  name: 'MiniMax M3',
  url: 'https://api.minimaxi.com/v1/chat/completions',
  model: 'MiniMax-M3',
  authEnvVar: 'MINIMAX_API_KEY',
});

/**
 * Parse a single KEY=VALUE line out of .env.production.
 * Returns null when the file is absent, unreadable, or the key is missing/empty.
 * The file is gitignored — values here never enter version control.
 */
function readEnvFileValue(key) {
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

/**
 * Resolve the active provider's API key by priority.
 * Returns null when nothing is configured — callers must surface a clear error.
 */
export function resolveApiKey() {
  // 1. explicit env var
  if (process.env[ACTIVE_PROVIDER.authEnvVar]) {
    return process.env[ACTIVE_PROVIDER.authEnvVar];
  }
  // 2. .env.production (gitignored dev fallback)
  const fromFile = readEnvFileValue(ACTIVE_PROVIDER.authEnvVar);
  if (fromFile) return fromFile;
  // 3. legacy provider as emergency fallback (per 工作区 Rules §8)
  if (process.env.DEEPSEEK_API_KEY) return process.env.DEEPSEEK_API_KEY;
  return null;
}

/**
 * Return the chat-completions endpoint config for the active provider.
 * Throws a clear, actionable error when no key is available.
 */
export function getChatCompletionsConfig() {
  const apiKey = resolveApiKey();
  if (!apiKey) {
    throw new Error(
      `[ai-provider] No API key configured. ` +
        `Set ${ACTIVE_PROVIDER.authEnvVar} in your shell or in .env.production ` +
        `(gitignored). DEEPSEEK_API_KEY is also accepted as emergency fallback.`,
    );
  }
  return {
    url: ACTIVE_PROVIDER.url,
    model: ACTIVE_PROVIDER.model,
    apiKey,
    providerName: ACTIVE_PROVIDER.name,
  };
}

/** Read-only view of the active provider identity (for logging / UI). */
export const AI_PROVIDER = Object.freeze({
  name: ACTIVE_PROVIDER.name,
  url: ACTIVE_PROVIDER.url,
  model: ACTIVE_PROVIDER.model,
});