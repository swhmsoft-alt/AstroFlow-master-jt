/**
 * scripts/build-detached.mjs
 *
 * Detached production build runner.
 *
 * WHY THIS EXISTS
 * ---------------
 * Under the VS Code / Cline terminal integration on this machine, every new
 * foreground command closes the current terminal and tears down its process
 * tree. A build launched with `Start-Process`, `npm run build &`, or Node's
 * `child_process.spawn(..., { detached: true })` is therefore killed
 * mid-flight the moment the next command is issued. Three consecutive build
 * attempts were lost this way before switching to Windows Task Scheduler.
 *
 * Windows Task Scheduler starts the build under the Task Scheduler service,
 * which is NOT a descendant of the terminal's process tree — so the build
 * survives subsequent terminal commands. `schtasks` is used because it needs
 * no elevated privileges and leaves no persistent task definition behind.
 *
 * On non-Windows platforms there is no such constraint, so the script runs the
 * build in the foreground and behaves like a plain wrapper.
 *
 * Usage:
 *   node scripts/build-detached.mjs                        # npm run build
 *   node scripts/build-detached.mjs --command "npx astro build"
 *   node scripts/build-detached.mjs --timeout 30           # minutes
 *
 * IMPORTANT — HOW TO INVOKE IT FROM AN AGENT TERMINAL
 * --------------------------------------------------
 * This script detaches the BUILD, but the script itself still runs inside the
 * caller's process tree. If your terminal tears down its process tree on every
 * new foreground command (VS Code / Cline does this), the script dies before
 * its build finishes, and no log or exit-code file is produced.
 *
 * Launch the script through the same Task Scheduler mechanism, so BOTH the
 * script and the build survive:
 *
 *   schtasks /Create /TN AstroBuild /TR "<repo>\run-build.cmd" /SC ONCE /ST 23:59 /F
 *   schtasks /Run /TN AstroBuild
 *
 * where run-build.cmd contains:
 *
 *   @echo off
 *   cd /d "<repo>"
 *   node scripts\build-detached.mjs > build-detached-run.log 2>&1
 *
 * From a normal shell (no process-tree teardown) a plain
 * `node scripts/build-detached.mjs` is sufficient.
 *
 * Artifacts (all gitignored):
 *   build.log           stdout
 *   build.err.log       stderr
 *   build.exitcode.txt  build exit code
 */
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');

// ── Arguments ───────────────────────────────────────────────
const args = process.argv.slice(2);
const argValue = (flag, fallback) => {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

const COMMAND = argValue('--command', 'npm run build');
const TIMEOUT_MIN = Number(argValue('--timeout', '30'));
const IS_WIN = process.platform === 'win32';

// ── Paths ───────────────────────────────────────────────────
const LOG = join(ROOT, 'build.log');
const ERR_LOG = join(ROOT, 'build.err.log');
const EXIT_FILE = join(ROOT, 'build.exitcode.txt');
const WRAPPER = join(ROOT, '_build-detached.cmd');
const TASK_NAME = 'AstroFlowDetachedBuild';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function rmIfExists(p) {
  try {
    if (existsSync(p)) unlinkSync(p);
  } catch {
    /* best effort */
  }
}

function tail(file, n) {
  if (!existsSync(file)) return '(no output)';
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  return lines.slice(-n).join('\n');
}

/**
 * Windows scheduled-task runner.
 * The build lives under the Task Scheduler service, so it is immune to the
 * terminal's process-tree teardown.
 */
async function runWindows() {
  rmIfExists(LOG);
  rmIfExists(ERR_LOG);
  rmIfExists(EXIT_FILE);

  // Wrapper batch file — `schtasks /TR` has a 261-character limit, which a
  // `powershell -EncodedCommand` payload exceeds; a file path does not.
  writeFileSync(
    WRAPPER,
    [
      '@echo off',
      `cd /d "${ROOT}"`,
      `call ${COMMAND} > "${LOG}" 2> "${ERR_LOG}"`,
      `>"${EXIT_FILE}" echo %ERRORLEVEL%`,
      'exit /b %ERRORLEVEL%',
      '',
    ].join('\r\n'),
    'utf8',
  );

  const schtasks = (...a) => execFileSync('schtasks.exe', a, { encoding: 'utf8' });

  // Remove any task left over from a previous interrupted run.
  try {
    schtasks('/Delete', '/TN', TASK_NAME, '/F');
  } catch {
    /* nothing to delete */
  }

  // /ST must be a future wall-clock time; the task is started explicitly
  // with /Run, so this value only has to be valid.
  const start = new Date(Date.now() + 2 * 60 * 1000);
  const st = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`;

  schtasks(
    '/Create',
    '/TN',
    TASK_NAME,
    '/TR',
    `"${WRAPPER}"`,
    '/SC',
    'ONCE',
    '/ST',
    st,
    '/F',
  );
  schtasks('/Run', '/TN', TASK_NAME);
  console.log(`[build-detached] scheduled task "${TASK_NAME}" started (timeout ${TIMEOUT_MIN} min)`);
  console.log(`[build-detached] command: ${COMMAND}`);

  // Poll for the exit-code file written by the wrapper.
  const deadline = Date.now() + TIMEOUT_MIN * 60 * 1000;
  let code = null;
  while (Date.now() < deadline) {
    await sleep(3000);
    if (existsSync(EXIT_FILE)) {
      code = readFileSync(EXIT_FILE, 'utf8').trim();
      break;
    }
  }

  // Always clean up the scheduled task and the wrapper.
  try {
    schtasks('/Delete', '/TN', TASK_NAME, '/F');
  } catch {
    /* already gone */
  }
  rmIfExists(WRAPPER);

  if (code === null) {
    console.error(`[build-detached] TIMEOUT after ${TIMEOUT_MIN} min — build did not report completion.`);
    console.error('--- build.log (tail) ---');
    console.error(tail(LOG, 30));
    process.exit(1);
  }

  console.log('--- build.log (tail) ---');
  console.log(tail(LOG, 30));
  const err = existsSync(ERR_LOG) ? readFileSync(ERR_LOG, 'utf8').trim() : '';
  if (err) {
    console.log('--- build.err.log (tail) ---');
    console.log(tail(ERR_LOG, 30));
  }

  const exitCode = Number(code) || 0;
  console.log(`[build-detached] build finished with exit code ${exitCode}`);
  process.exit(exitCode);
}

/**
 * Non-Windows: no terminal-teardown constraint, so build in the foreground.
 */
function runPosix() {
  console.log(`[build-detached] ${COMMAND}`);
  const child = spawn(COMMAND, { cwd: ROOT, stdio: 'inherit', shell: true });
  child.on('exit', (code) => process.exit(code ?? 1));
}

if (IS_WIN) {
  runWindows().catch((err) => {
    console.error('[build-detached] failed:', err.message);
    process.exit(1);
  });
} else {
  runPosix();
}
