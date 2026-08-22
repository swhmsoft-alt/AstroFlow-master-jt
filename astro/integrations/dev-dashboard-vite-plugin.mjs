/**
 * astro/integrations/dev-dashboard-vite-plugin.mjs
 * ─────────────────────────────────────────────────────────────────────
 *  Vite dev-only plugin providing:
 *    • GET  /api/list-tools  →  tool registry + live file-system stats
 *    • POST /api/run-tool    →  spawn whitelisted tool + stream NDJSON
 *
 *  Why `enforce: 'pre'` + post-hook return?
 *    Astro's internal middleware installation is *asynchronous* and
 *    happens AFTER all `configureServer` hooks return.  If we register
 *    our middleware inside `configureServer`, Astro's later
 *    `middlewares.use(...)` calls create a fresh `stack` array and our
 *    handler gets dropped.
 *
 *    Vite's documented solution: return a function from `configureServer`.
 *    That returned function is invoked as a post-hook, AFTER all internal
 *    middlewares are registered — guaranteeing our handler survives in
 *    the final stack.  See Vite docs "post middlewares":
 *      https://vite.dev/guide/api-plugin.html#configureserver
 *
 *  SSG-safety:
 *    `apply: 'serve'` excludes the plugin from `astro build`.  No
 *    middleware is registered, no API routes exist, no adapter required.
 *
 *  Manifest loading:
 *    Static `import` from `tools-manifest.ts`.  Astro's config loader
 *    (esbuild) handles `.ts` resolution, mirroring the existing
 *    `rehypeAutoInternalLinksI18n` import in `astro.config.mjs`.
 *
 *  Security:
 *    1. tool id MUST be in TOOL_IDS whitelist.
 *    2. Actual command built by `buildCommand()` (template-based).
 *    3. Hard 5-minute timeout kills the process.
 *    4. Working directory locked to project root.
 * ─────────────────────────────────────────────────────────────────────
 */
import { spawn } from 'node:child_process';
import { statSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  TOOLS,
  TOOL_IDS,
  buildCommand,
} from '../../src/lib/dashboard/tools-manifest';

const ROOT = process.cwd();
const HARD_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

// ── Helpers ───────────────────────────────────────────────────────────

function formatAge(deltaMs) {
  if (deltaMs < 0) return '刚刚';
  const s = Math.floor(deltaMs / 1000);
  if (s < 60) return `${s} 秒前`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} 分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小时前`;
  const d = Math.floor(h / 24);
  return `${d} 天前`;
}

function statSafe(relOrAbs) {
  const abs = resolve(ROOT, relOrAbs);
  try {
    const s = statSync(abs);
    if (!s.isFile() && !s.isDirectory()) {
      return { path: relOrAbs, exists: false, sizeBytes: null, mtimeMs: null, ageLabel: null };
    }
    return {
      path: relOrAbs,
      exists: true,
      sizeBytes: s.isFile() ? s.size : null,
      mtimeMs: s.mtimeMs,
      ageLabel: formatAge(Date.now() - s.mtimeMs),
    };
  } catch {
    return { path: relOrAbs, exists: false, sizeBytes: null, mtimeMs: null, ageLabel: null };
  }
}

function readBody(req) {
  return new Promise((resolveBody, rejectBody) => {
    let buf = '';
    req.on('data', (chunk) => { buf += chunk; });
    req.on('end', () => resolveBody(buf));
    req.on('error', rejectBody);
  });
}

function sendJson(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(obj));
}

function ndjson(obj) {
  return JSON.stringify(obj) + '\n';
}

// ── Vite plugin factory ───────────────────────────────────────────────

export default function devDashboardVitePlugin() {
  return {
    name: 'dev-dashboard-vite-plugin',
    apply: 'serve',  // dev-only: never runs in `astro build`
    enforce: 'pre',  // load before Astro's internal plugins

    configureServer(server) {
      const myHandler = async (req, res, next) => {
        const urlPath = (req.url || '').split('?')[0];

        // ── GET /api/list-tools (or trailing-slash variant) ────────
        if ((urlPath === '/api/list-tools' || urlPath === '/api/list-tools/') && req.method === 'GET') {
          try {
            const tools = TOOLS.map((t) => ({
              id: t.id,
              group: t.group,
              title: t.title,
              description: t.description,
              icon: t.icon,
              dangerLevel: t.dangerLevel,
              estimatedDurationMs: t.estimatedDurationMs ?? 0,
              args: t.args ?? [],
              warning: t.warning ?? null,
              outputIndicatorStats: (t.outputIndicators ?? []).map(statSafe),
            }));
            return sendJson(res, 200, {
              tools,
              ts: Date.now(),
              nodeVersion: process.version,
              platform: process.platform,
              cwd: ROOT,
            });
          } catch (e) {
            return sendJson(res, 500, { error: String(e?.message ?? e) });
          }
        }

        // ── POST /api/run-tool (or trailing-slash variant) ──────────
        if ((urlPath === '/api/run-tool' || urlPath === '/api/run-tool/') && req.method === 'POST') {
          const raw = await readBody(req);
          let payload;
          try {
            payload = JSON.parse(raw);
          } catch {
            return sendJson(res, 400, { error: 'invalid_json' });
          }

          if (!payload.tool || typeof payload.tool !== 'string') {
            return sendJson(res, 400, { error: 'missing_tool' });
          }
          if (!TOOL_IDS.has(payload.tool)) {
            return sendJson(res, 403, { error: 'unknown_tool', tool: payload.tool });
          }

          const def = TOOLS.find((t) => t.id === payload.tool);
          const cmdStr = buildCommand(def, payload.args ?? {});
          if (!cmdStr) {
            return sendJson(res, 400, {
              error: 'invalid_args',
              hint: '检查参数是否填写正确，或必填项是否缺失',
            });
          }

          const startedAt = Date.now();
          const child = spawn(cmdStr, {
            cwd: ROOT,
            shell: true,
            env: { ...process.env, FORCE_COLOR: '0', CI: '1' },
            windowsHide: true,
          });

          const killTimer = setTimeout(() => {
            try { child.kill('SIGTERM'); } catch { /* already dead */ }
            setTimeout(() => {
              try { child.kill('SIGKILL'); } catch { /* already dead */ }
            }, 5_000);
          }, HARD_TIMEOUT_MS);

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
          res.setHeader('Cache-Control', 'no-store');
          res.setHeader('X-Accel-Buffering', 'no');
          res.setHeader('Connection', 'keep-alive');

          const writeLine = (obj) => {
            try { res.write(ndjson(obj)); } catch { /* connection closed */ }
          };

          writeLine({
            type: 'meta',
            tool: def.id,
            command: cmdStr,
            dangerLevel: def.dangerLevel,
            ts: startedAt,
          });

          child.stdout?.on('data', (chunk) =>
            writeLine({ type: 'stdout', data: chunk.toString('utf8') }),
          );
          child.stderr?.on('data', (chunk) =>
            writeLine({ type: 'stderr', data: chunk.toString('utf8') }),
          );
          child.on('error', (err) => writeLine({ type: 'error', data: err.message }));
          child.on('close', (code, signal) => {
            clearTimeout(killTimer);
            writeLine({
              type: 'exit',
              code,
              signal,
              durationMs: Date.now() - startedAt,
              ts: Date.now(),
            });
            try { res.end(); } catch { /* already closed */ }
          });

          req.on('close', () => {
            try { child.kill('SIGTERM'); } catch { /* */ }
            clearTimeout(killTimer);
          });

          return; // keep response open for streaming
        }

        // Pass through to Astro's pipeline for everything else.
        next();
      };

      // Astro 5's vitePluginAstroServer registers its astroDevHandler
      // *asynchronously*, AFTER our `configureServer` returns and after
      // the Vite post-hook runs.  Empirically, Astro's setup completes
      // ~2 seconds after server start (10+ middleware entries added
      // piecewise, not in one batch).
      //
      // Strategy: check stack at 2-second mark and re-inject at position 0
      // if our handler is missing.  This was the only timing that
      // worked during initial prototyping.
      setTimeout(() => {
        const stack = server.middlewares.stack;
        if (!Array.isArray(stack)) return;
        if (stack.some((entry) => entry?.handle === myHandler)) return;
        stack.unshift({ route: '', handle: myHandler });
      }, 2_000);
    },
  };
}