#!/usr/bin/env node

/**
 * ============================================================================
 * generate-ai-images.mjs
 *
 * Phase 1 MVP — AI 图片生成管线（主力 Cloudflare FLUX.1 Schnell，备用智谱
 * CogView-3-Flash）。
 *
 * 功能：
 *   1. 解析 prompt（直接传入，或从 image-catalog.json 按 catalogId 读取）
 *   2. 调用云端图像生成 API（Cloudflare Workers AI / 智谱 BigModel）
 *   3. 统一后处理：sharp 裁切缩放到目标尺寸，输出 .png + .webp
 *   4. 落盘到指定目录，并把每次生成的元数据写入 data/ai-images/manifest.json
 *
 * 用法：
 *   node scripts/generate-ai-images.mjs --prompt "a CNC machining scene" \
 *        --out-dir public/images/ai --usage scene
 *   node scripts/generate-ai-images.mjs --catalog-id titanium-cnc-machining-services.hub
 *   node scripts/generate-ai-images.mjs --catalog-id <id> --provider zhipu \
 *        --fallback cloudflare
 *   node scripts/generate-ai-images.mjs --prompt "..." --dry-run
 *
 * 环境变量（.env.production 或系统环境）：
 *   CLOUDFLARE_ACCOUNT_ID  - Cloudflare 账户 ID（FLUX.1 Schnell 必需）
 *   CLOUDFLARE_API_TOKEN   - Cloudflare API Token（Workers AI 权限）
 *   ZHIPU_API_KEY          - 智谱 BigModel API Key（备用 provider 必需）
 * ============================================================================
 */

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

import {
  DEFAULT_PROVIDER,
  IMAGE_PROVIDERS,
  getImageProviderConfig,
  listImageProviders,
  signZhipuJwt,
} from '../src/lib/ai-image-provider.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const CATALOG_PATH = path.join(ROOT, 'src', 'content', 'image-catalog.json');
const MANIFEST_PATH = path.join(ROOT, 'data', 'ai-images', 'manifest.json');

// 默认输出目录。刻意与 public/images/hubs/ 隔离 —— hubs/ 走的是
// "webp + png + svg 三件套" 契约（见 memory-bank/image-catalog-workflow.md），
// AI 文生图无法诚实产出 SVG，混入会破坏该契约。
const DEFAULT_OUT_DIR = path.join(ROOT, 'public', 'images', 'ai');

// sharp 输出质量，与 scripts/optimize-images.js / postbuild-images.mjs 保持一致
const WEBP_QUALITY = 82;

// 重试策略
const MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 1500;

/**
 * 图片用途分类 —— 决定 manifest 里的 usage 标签与红线警告。
 *
 *   scene   场景/环境/工艺氛围图。AI 文生图的适用区。
 *   product 产品件近景。AI 无法可靠还原真实孔位/齿形/螺纹/结构，
 *            因此只允许在明确知晓风险时使用，且不得作为产品实拍位。
 */
const USAGE_TYPES = ['scene', 'product'];

// ─── CLI 参数解析 ───────────────────────────────────────────────────────────

function parseArgs(argv) {
  const opts = {
    prompt: null,
    catalogId: null,
    provider: DEFAULT_PROVIDER,
    fallback: null,
    outDir: DEFAULT_OUT_DIR,
    usage: 'scene',
    width: null,
    height: null,
    steps: null,
    seed: null,
    alt: null,
    dryRun: false,
    force: false,
    listProviders: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '--prompt':
        opts.prompt = argv[++i];
        break;
      case '--catalog-id':
        opts.catalogId = argv[++i];
        break;
      case '--provider':
        opts.provider = argv[++i];
        break;
      case '--fallback':
        opts.fallback = argv[++i];
        break;
      case '--out-dir':
        opts.outDir = path.resolve(ROOT, argv[++i]);
        break;
      case '--usage':
        opts.usage = argv[++i];
        break;
      case '--width':
        opts.width = parseInt(argv[++i], 10);
        break;
      case '--height':
        opts.height = parseInt(argv[++i], 10);
        break;
      case '--steps':
        opts.steps = parseInt(argv[++i], 10);
        break;
      case '--seed':
        opts.seed = parseInt(argv[++i], 10);
        break;
      case '--alt':
        opts.alt = argv[++i];
        break;
      case '--dry-run':
        opts.dryRun = true;
        break;
      case '--force':
        opts.force = true;
        break;
      case '--list-providers':
        opts.listProviders = true;
        break;
      case '--help':
      case '-h':
        opts.help = true;
        break;
      default:
        if (arg.startsWith('--')) {
          throw new Error(`Unknown flag: ${arg}`);
        }
    }
  }

  if (!USAGE_TYPES.includes(opts.usage)) {
    throw new Error(
      `Invalid --usage "${opts.usage}". Expected one of: ${USAGE_TYPES.join(', ')}.`,
    );
  }
  if (opts.fallback && !IMAGE_PROVIDERS[opts.fallback]) {
    throw new Error(
      `Unknown --fallback provider "${opts.fallback}". ` +
        `Known providers: ${Object.keys(IMAGE_PROVIDERS).join(', ')}.`,
    );
  }
  if (!opts.provider || !IMAGE_PROVIDERS[opts.provider]) {
    throw new Error(
      `Unknown --provider "${opts.provider}". ` +
        `Known providers: ${Object.keys(IMAGE_PROVIDERS).join(', ')}.`,
    );
  }
  if (!opts.prompt && !opts.catalogId && !opts.help && !opts.listProviders) {
    throw new Error('Either --prompt or --catalog-id is required.');
  }

  return opts;
}


// ─── Catalog 读取（prompt / alt / 尺寸的唯一真源） ─────────────────────────

/**
 * 从 src/content/image-catalog.json 读取单条记录。
 * prompt 绝不复制到脚本里 —— catalog 是唯一真源，避免双源漂移。
 */
function loadCatalogEntry(catalogId) {
  if (!fs.existsSync(CATALOG_PATH)) {
    throw new Error(`[catalog] Not found: ${path.relative(ROOT, CATALOG_PATH)}`);
  }
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8'));
  const entry = (catalog.images || []).find((e) => e.id === catalogId);
  if (!entry) {
    const available = (catalog.images || []).map((e) => e.id).join('\n  ');
    throw new Error(
      `[catalog] No entry with id "${catalogId}".\nAvailable ids:\n  ${available}`,
    );
  }
  return entry;
}

/**
 * 依据 catalog 条目推导输出文件名与相对路径。
 * category/filename 直接来自 catalog，绝不自行拼造目录名。
 */
function deriveOutputPaths(entry, outDir) {
  const category = entry.category;
  const filename = entry.filename;
  const dir = path.join(outDir, category);
  return {
    dir,
    base: filename,
    pngPath: path.join(dir, `${filename}.png`),
    webpPath: path.join(dir, `${filename}.webp`),
    publicPng: `/images/ai/${category}/${filename}.png`,
    publicWebp: `/images/ai/${category}/${filename}.webp`,
  };
}

// ─── Provider 调用 ──────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 判断一个 HTTP 状态是否值得重试。 */
function isRetryableStatus(status) {
  return status === 408 || status === 429 || status >= 500;
}

/**
 * Cloudflare Workers AI — @cf/black-forest-labs/flux-1-schnell
 *
 * FLUX.1 Schnell 的输入 schema 只有 prompt / steps / seed，没有 width/height，
 * 因此输出恒为 512x512。响应是一个信封：{ result: { image: "<base64>" }, success, errors }
 */
async function callCloudflare(config, { prompt, steps, seed }) {
  const body = { prompt, steps: steps ?? config.defaultSteps ?? 4 };
  if (seed !== null && seed !== undefined) body.seed = seed;

  const res = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* 非 JSON 响应（例如网关错误页）*/
  }

  if (!res.ok) {
    // Cloudflare 每日 Neuron 配额耗尽时返回 429
    if (res.status === 429) {
      const err = new Error(
        '[cloudflare] HTTP 429 — daily free Neuron quota exhausted (quota resets 00:00 UTC).',
      );
      err.status = 429;
      err.quotaExhausted = true;
      throw err;
    }
    const detail =
      (json && json.errors && json.errors.map((e) => e.message || e.code).join('; ')) ||
      text.slice(0, 300);
    const err = new Error(`[cloudflare] HTTP ${res.status}: ${detail}`);
    err.status = res.status;
    err.retryable = isRetryableStatus(res.status);
    throw err;
  }

  if (json && json.success === false) {
    const detail = (json.errors || []).map((e) => e.message || e.code).join('; ');
    const err = new Error(`[cloudflare] API returned success=false: ${detail}`);
    err.retryable = false;
    throw err;
  }

  const b64 = json && json.result && json.result.image;
  if (!b64) {
    const err = new Error('[cloudflare] Response contained no image data (result.image missing).');
    err.retryable = false;
    throw err;
  }

  return { buffer: Buffer.from(b64, 'base64'), raw: json };
}


/**
 * 智谱 BigModel — cogview-3-flash
 *
 * POST /api/paas/v4/images/generations
 * 鉴权：若 API Key 形如 `id.secret`，签发 JWT（官方文档的 sign_type=SIGN 方案）。
 * 响应：data[0].url（需下载）或 data[0].b64_json。
 */
async function callZhipu(config, { prompt, size, seed }) {
  const jwt = signZhipuJwt(config.apiKey);
  const token = jwt || config.apiKey;

  const body = {
    model: config.model,
    prompt,
    size,
    response_format: 'url',
  };
  if (seed !== null && seed !== undefined) body.seed = seed;

  const res = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* 非 JSON 响应*/
  }

  if (!res.ok) {
    const detail =
      (json && json.error && (json.error.message || json.error.code)) || text.slice(0, 300);
    const err = new Error(`[zhipu] HTTP ${res.status}: ${detail}`);
    err.status = res.status;
    err.retryable = isRetryableStatus(res.status);
    throw err;
  }

  if (json && json.error) {
    const err = new Error(
      `[zhipu] API error ${json.error.code}: ${json.error.message || 'unknown error'}`,
    );
    err.retryable = false;
    throw err;
  }

  const first = json && json.data && json.data[0];
  if (!first) {
    const err = new Error('[zhipu] Response contained no image data (data[0] missing).');
    err.retryable = false;
    throw err;
  }

  if (first.b64_json) {
    return { buffer: Buffer.from(first.b64_json, 'base64'), raw: json };
  }

  if (first.url) {
    const imgRes = await fetch(first.url);
    if (!imgRes.ok) {
      const err = new Error(`[zhipu] Image download failed: HTTP ${imgRes.status}`);
      err.retryable = isRetryableStatus(imgRes.status);
      throw err;
    }
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    return { buffer, raw: json };
  }

  const err = new Error('[zhipu] Response contained neither url nor b64_json.');
  err.retryable = false;
  throw err;
}

/** 按 provider 分派到具体调用实现。 */
async function callProvider(providerId, config, params) {
  if (providerId === 'cloudflare') return callCloudflare(config, params);
  if (providerId === 'zhipu') return callZhipu(config, params);
  throw new Error(`[provider] No call implementation for "${providerId}".`);
}

// ─── 后处理（sharp） ────────────────────────────────────────────────────────

/**
 * 把 provider 返回的原始字节处理成目标尺寸，并写出 .png + .webp。
 *
 * CF FLUX.1 Schnell 固定输出 512x512，catalog 目标是 1200x800（3:2）。
 * 这里用 fit:'cover' + position:'centre' 做等比裁切后再缩放，避免拉伸变形。
 * 源尺寸与目标不一致时会记录 upscaled:true（诚实标注插值来源）。
 */
async function writeProcessedImages(buffer, { pngPath, webpPath, width, height }) {
  await fsp.mkdir(path.dirname(pngPath), { recursive: true });

  const meta = await sharp(buffer).metadata();
  const sourceSize = `${meta.width}x${meta.height}`;

  const pipeline = sharp(buffer, { failOn: 'none' }).resize({
    width,
    height,
    fit: 'cover',
    position: 'centre',
  });

  const pngBuffer = await pipeline.clone().png({ compressionLevel: 9 }).toBuffer();
  const webpBuffer = await pipeline.clone().webp({ quality: WEBP_QUALITY, effort: 4 }).toBuffer();

  await fsp.writeFile(pngPath, pngBuffer);
  await fsp.writeFile(webpPath, webpBuffer);

  return {
    sourceSize,
    pngBytes: pngBuffer.length,
    webpBytes: webpBuffer.length,
  };
}


// ─── Manifest（闭环存储） ───────────────────────────────────────────────────

async function readManifest() {
  try {
    if (!fs.existsSync(MANIFEST_PATH)) return { version: 1, entries: [] };
    const parsed = JSON.parse(await fsp.readFile(MANIFEST_PATH, 'utf-8'));
    if (!parsed || !Array.isArray(parsed.entries)) return { version: 1, entries: [] };
    return parsed;
  } catch {
    return { version: 1, entries: [] };
  }
}

async function appendManifest(entry) {
  await fsp.mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
  const manifest = await readManifest();
  manifest.entries.push(entry);
  await fsp.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
  return manifest;
}

/**
 * 今日配额估算。
 * Cloudflare 免费额度 = 10,000 Neurons/天，约 43 Neurons/张 → 约 230 张/天。
 * 这里按本地 manifest 的当日生成条数做保守估算，仅用于提醒，不是精确计费。
 */
async function reportQuota(providerId) {
  if (providerId !== 'cloudflare') return null;
  const manifest = await readManifest();
  const today = new Date().toISOString().slice(0, 10);
  const usedToday = manifest.entries.filter(
    (e) => e.provider === 'cloudflare' && String(e.generatedAt || '').startsWith(today),
  ).length;

  const approxLimit = IMAGE_PROVIDERS.cloudflare.freeTier.approxImagesPerDay;
  return {
    usedToday,
    approxLimit,
    neuronsPerDay: IMAGE_PROVIDERS.cloudflare.freeTier.neuronsPerDay,
  };
}

// ─── 生成调用（重试 + fallback 降级） ──────────────────────────────────────

/**
 * 带指数退避的调用：单一 provider，重试可重试错误。
 */
async function attemptWithRetry(providerId, config, params, label) {
  let lastError = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await callProvider(providerId, config, params);
    } catch (err) {
      lastError = err;
      const retryable = err.retryable === true;
      console.error(`   ⚠️  ${label} 尝试 ${attempt}/${MAX_ATTEMPTS} 失败: ${err.message}`);
      if (!retryable || attempt === MAX_ATTEMPTS) break;
      const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1);
      console.error(`   ⏳ ${delay}ms 后重试...`);
      await sleep(delay);
    }
  }
  throw lastError;
}

/**
 * 主 provider → fallback provider 的降级链。
 */
async function generateWithFallback(opts, prompt, size) {
  const chain = [opts.provider];
  if (opts.fallback && opts.fallback !== opts.provider) chain.push(opts.fallback);

  let lastError = null;
  for (const providerId of chain) {
    let config;
    try {
      config = getImageProviderConfig(providerId);
    } catch (err) {
      console.error(`   ⚠️  provider "${providerId}" 不可用: ${err.message}`);
      lastError = err;
      continue;
    }

    const params =
      providerId === 'zhipu'
        ? { prompt, size: `${size.width}x${size.height}`, seed: opts.seed }
        : { prompt, steps: opts.steps, seed: opts.seed };

    try {
      const result = await attemptWithRetry(providerId, config, params, providerId);
      return { ...result, providerId, providerName: config.name, model: config.model };
    } catch (err) {
      lastError = err;
      if (err.quotaExhausted) {
        console.error('   ⛔ 今日免费额度已用尽 —— 停止重试，切换 fallback provider。');
      }
      console.error(`   ❌ provider "${providerId}" 最终失败: ${err.message}`);
    }
  }

  throw lastError || new Error('所有 provider 均失败。');
}

function slugify(text, fallback) {
  const slug = String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return slug || fallback;
}


// ─── 计划输出 ───────────────────────────────────────────────────────────────

function printHelp() {
  console.log(`
AI image generation (Phase 1 MVP)

Usage:
  node scripts/generate-ai-images.mjs --prompt "<prompt>" [options]
  node scripts/generate-ai-images.mjs --catalog-id "<image-catalog id>" [options]

Options:
  --prompt <text>        Explicit English prompt.
  --catalog-id <id>      Read prompt/alt/size from src/content/image-catalog.json.
  --provider <id>        cloudflare (default) | zhipu
  --fallback <id>        Provider to try when the primary fails.
  --out-dir <path>       Output directory (default: public/images/ai).
  --usage <scene|product>  Image purpose label (default: scene).
  --width <px>           Target width  (default: from catalog, else 1200).
  --height <px>          Target height (default: from catalog, else 800).
  --steps <n>            CF FLUX steps (default: 4).
  --seed <n>             Random seed (default: provider-chosen).
  --alt <text>           Alt text recorded in the manifest.
  --force                Overwrite existing files.
  --dry-run              Print the plan without calling any API.
  --list-providers       List supported providers.

Environment (.env.production or shell):
  CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, ZHIPU_API_KEY
`);
}

function printProviders() {
  console.log('\n📋 支持的 provider:\n');
  for (const p of listImageProviders()) {
    console.log(`  ${p.id}`);
    console.log(`    name    : ${p.name}`);
    console.log(`    model   : ${p.model}`);
    console.log(`    auth    : ${p.authEnvVar}${p.accountEnvVar ? ` + ${p.accountEnvVar}` : ''}`);
    console.log(`    notes   : ${p.notes}`);
    console.log('');
  }
}

/**
 * 依据 CLI 选项与 catalog 条目解析出「生成任务」。
 * 返回 null 表示这是一个纯查询型调用（--help / --list-providers）。
 */
function resolveTask(opts) {
  let prompt = opts.prompt;
  let alt = opts.alt || '';
  let width = opts.width;
  let height = opts.height;
  let paths;

  if (opts.catalogId) {
    const entry = loadCatalogEntry(opts.catalogId);
    prompt = prompt || entry.prompt;
    alt = alt || entry.alt || '';
    width = width || entry.width || 1200;
    height = height || entry.height || 800;
    paths = deriveOutputPaths(entry, opts.outDir);
  } else {
    width = width || 1200;
    height = height || 800;
    const base = slugify(prompt, 'ai-image');
    const dir = path.join(opts.outDir, 'adhoc');
    paths = {
      dir,
      base,
      pngPath: path.join(dir, `${base}.png`),
      webpPath: path.join(dir, `${base}.webp`),
      publicPng: `/images/ai/adhoc/${base}.png`,
      publicWebp: `/images/ai/adhoc/${base}.webp`,
    };
  }

  return { prompt, alt, width, height, paths };
}

function printPlan(opts, task) {
  const { prompt, width, height, paths } = task;
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  🎨 AI 图片生成 — Phase 1 MVP');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(
    `  provider    : ${opts.provider}${opts.fallback ? `  (fallback: ${opts.fallback})` : ''}`,
  );
  console.log(
    `  usage       : ${opts.usage}${
      opts.usage === 'product'
        ? '  ⚠️  产品件近景 — AI 无法可靠还原真实孔位/齿形/螺纹'
        : ''
    }`,
  );
  console.log(`  size        : ${width}x${height}`);
  if (opts.steps) console.log(`  steps       : ${opts.steps}`);
  if (opts.seed !== null) console.log(`  seed        : ${opts.seed}`);
  console.log(`  prompt      : ${prompt.length > 110 ? prompt.slice(0, 110) + '…' : prompt}`);
  console.log(`  png         : ${path.relative(ROOT, paths.pngPath)}`);
  console.log(`  webp        : ${path.relative(ROOT, paths.webpPath)}`);
  console.log('');
}


// ─── 主流程 ─────────────────────────────────────────────────────────────────

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help) {
    printHelp();
    return;
  }
  if (opts.listProviders) {
    printProviders();
    return;
  }

  const task = resolveTask(opts);
  printPlan(opts, task);

  if (opts.dryRun) {
    console.log('🔍 [DRY RUN] 不调用任何 API，不写入任何文件。');
    const quota = await reportQuota(opts.provider);
    if (quota) {
      console.log(
        `   今日已生成约 ${quota.usedToday} 张 / 免费额度约 ${quota.approxLimit} 张（${quota.neuronsPerDay} Neurons/天）`,
      );
    }
    console.log('');
    return;
  }

  // ── 配额预检 ──
  const quota = await reportQuota(opts.provider);
  if (quota && quota.usedToday >= quota.approxLimit) {
    console.warn(
      `   ⚠️  今日已生成 ${quota.usedToday} 张，已达免费额度估算上限（约 ${quota.approxLimit} 张）。继续调用可能触发 429。\n`,
    );
  }

  // ── 已存在则跳过 ──
  const { paths } = task;
  if (!opts.force && fs.existsSync(paths.pngPath) && fs.existsSync(paths.webpPath)) {
    console.log('⏭️  文件已存在，跳过（使用 --force 覆盖）。');
    return;
  }

  // ── 生成 ──
  console.log('   🚀 调用生成 API...');
  const result = await generateWithFallback(opts, task.prompt, {
    width: task.width,
    height: task.height,
  });
  console.log(`   ✅ provider="${result.providerId}" model="${result.model}"`);

  // ── 后处理与落盘 ──
  const written = await writeProcessedImages(result.buffer, {
    pngPath: paths.pngPath,
    webpPath: paths.webpPath,
    width: task.width,
    height: task.height,
  });

  // ── Manifest ──
  const upscaled = written.sourceSize !== `${task.width}x${task.height}`;
  const manifestEntry = {
    generatedAt: new Date().toISOString(),
    provider: result.providerId,
    providerName: result.providerName,
    model: result.model,
    catalogId: opts.catalogId || null,
    usage: opts.usage,
    prompt: task.prompt,
    alt: task.alt,
    width: task.width,
    height: task.height,
    sourceSize: written.sourceSize,
    upscaled,
    seed: opts.seed,
    steps: opts.steps,
    png: path.relative(ROOT, paths.pngPath).replace(/\\/g, '/'),
    webp: path.relative(ROOT, paths.webpPath).replace(/\\/g, '/'),
    publicPng: paths.publicPng,
    publicWebp: paths.publicWebp,
    bytes: { png: written.pngBytes, webp: written.webpBytes },
    note:
      opts.usage === 'product'
        ? 'AI-generated. Do NOT present as a real product photograph — AI cannot reliably reproduce holes, gear forms, threads or structural details.'
        : 'AI-generated scene/environment image.',
  };
  await appendManifest(manifestEntry);

  console.log('');
  console.log(
    `   📁 PNG : ${path.relative(ROOT, paths.pngPath)}  (${(written.pngBytes / 1024).toFixed(0)} KB)`,
  );
  console.log(
    `   📁 WebP: ${path.relative(ROOT, paths.webpPath)}  (${(written.webpBytes / 1024).toFixed(0)} KB)`,
  );
  console.log(`   📒 Manifest: ${path.relative(ROOT, MANIFEST_PATH)}`);
  console.log(
    `   ℹ️  源图 ${written.sourceSize} → 目标 ${task.width}x${task.height}${upscaled ? '（已插值放大）' : ''}`,
  );
  console.log('');
}

main().catch((err) => {
  console.error('\n❌ 脚本执行失败:', err.message);
  process.exit(1);
});
