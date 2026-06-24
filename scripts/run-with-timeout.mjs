#!/usr/bin/env node
/**
 * Run a command with a timeout.
 * Usage: node scripts/run-with-timeout.mjs <timeout_ms> <command...>
 *
 * If the command times out, exits with code 124 (like the Linux timeout command).
 */
import { spawn } from 'child_process';

const timeout = parseInt(process.argv[2], 10);
const args = process.argv.slice(3);

if (!timeout || args.length === 0) {
  console.error('Usage: node scripts/run-with-timeout.mjs <timeout_ms> <command...>');
  process.exit(1);
}

const cmd = args[0];
const cmdArgs = args.slice(1);

console.log(`\n[run-with-timeout] Running: ${cmd} ${cmdArgs.join(' ')}`);
console.log(`[run-with-timeout] Timeout: ${timeout}ms (${(timeout/1000).toFixed(0)}s)`);
const start = Date.now();

const child = spawn(cmd, cmdArgs, {
  stdio: 'inherit',
  shell: true,
  timeout,
});

const timer = setTimeout(() => {
  console.log(`\n⚠️  COMMAND TIMEOUT after ${(Date.now() - start)/1000}s — killing process...`);
  child.kill('SIGTERM');
  // Force kill after 5 more seconds
  setTimeout(() => {
    try { child.kill('SIGKILL'); } catch(e) {}
  }, 5000);
}, timeout);

child.on('exit', (code, signal) => {
  clearTimeout(timer);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  if (signal === 'SIGTERM' || signal === 'SIGKILL') {
    console.log(`\n[run-with-timeout] Command was KILLED after ${elapsed}s (timeout ${timeout}ms)`);
    process.exit(124);
  }
  console.log(`\n[run-with-timeout] Command completed in ${elapsed}s with exit code ${code}`);
  process.exit(code ?? 0);
});

child.on('error', (err) => {
  clearTimeout(timer);
  console.error(`\n[run-with-timeout] Failed to spawn command: ${err.message}`);
  process.exit(1);
});