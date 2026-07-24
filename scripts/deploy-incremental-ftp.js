/**
 * scripts/deploy-incremental-ftp.js
 *
 * 增量 FTP 部署脚本 - 只上传新增或变更的文件。
 * 对比本地 manifest 仅同步有差异的文件。
 *
 * 用法: node scripts/deploy-incremental-ftp.js
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";
import { Client } from "basic-ftp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.production");
const LOCAL_ROOT = resolve(__dirname, "..", "dist");
const MANIFEST_PATH = join(LOCAL_ROOT, ".deploy-manifest.json");

function loadEnv(p) {
  const content = readFileSync(p, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const t = line.trim(); if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf("="); if (eq === -1) continue;
    env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
  }
  return env;
}

function scanLocal(dir, basePath) {
  const entries = [];
  const items = readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const full = join(dir, item.name);
    const rel = basePath ? basePath + "/" + item.name : item.name;
    if (item.isDirectory()) { entries.push(...scanLocal(full, rel)); }
    else if (item.isFile() && item.name !== ".deploy-manifest.json") {
      const s = statSync(full);
      entries.push({ path: rel.replace(/\\/g, "/"), size: s.size, mtimeMs: s.mtimeMs });
    }
  }
  return entries;
}

function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) return {};
  try { return JSON.parse(readFileSync(MANIFEST_PATH, "utf-8")); } catch(e) { return {}; }
}

function saveManifest(m) {
  writeFileSync(MANIFEST_PATH, JSON.stringify(m, null, 2), "utf-8");
}

async function deploy() {
  const env = loadEnv(envPath);
  const HOST = env.PRODUCTION_FTP_HOST;
  const USER = env.PRODUCTION_FTP_USER;
  const PASS = env.PRODUCTION_FTP_PASSWORD;
  const REMOTE_ROOT = env.PRODUCTION_SERVER_PATH || "/";

  if (!existsSync(LOCAL_ROOT)) {
    console.error("dist/ not found. Run build first.");
    process.exit(1);
  }

  console.log("Scanning local files...");
  const localFiles = scanLocal(LOCAL_ROOT);
  console.log("  " + localFiles.length + " local files");

  const oldManifest = loadManifest();
  console.log("  Last deploy: " + Object.keys(oldManifest).length + " files");

  const toUpload = [];
  for (const f of localFiles) {
    const old = oldManifest[f.path];
    if (!old) { toUpload.push(f); }
    else if (old.size !== f.size || Math.abs(old.mtimeMs - f.mtimeMs) > 1000) { toUpload.push(f); }
  }

  const currentPaths = new Set(localFiles.map(f => f.path));
  const toDelete = Object.keys(oldManifest).filter(p => !currentPaths.has(p));

  console.log("  + New/Changed: " + toUpload.length + " files");
  console.log("  - To delete: " + toDelete.length + " files");

  if (toUpload.length === 0 && toDelete.length === 0) {
    console.log("No changes, skipping deploy.");
    return;
  }

  const client = new Client();
  client.ftp.verbose = false;

  try {
    console.log("Connecting to " + HOST + "...");
    await client.access({ host: HOST, user: USER, password: PASS, port: 21, secure: false });
    await client.send("AUTH", "TLS");
    await client.send("PBSZ", "0");
    await client.send("PROT", "P");
    console.log("Connected.");
    await client.cd(REMOTE_ROOT);

    if (toUpload.length > 0) {
      console.log("Uploading " + toUpload.length + " files...");
      let done = 0;
      for (const f of toUpload) {
        const localPath = join(LOCAL_ROOT, f.path);
        const remoteDir = dirname(f.path).replace(/\\/g, "/");
        if (remoteDir !== ".") await client.ensureDir(remoteDir);
        await client.uploadFrom(localPath, f.path);
        done++;
        if (done % 50 === 0 || done === toUpload.length) {
          const pct = Math.round(done / toUpload.length * 100);
          console.log("  " + done + "/" + toUpload.length + " (" + pct + "%)");
        }
      }
    }

    if (toDelete.length > 0) {
      console.log("Deleting " + toDelete.length + " remote files...");
      let deleted = 0;
      for (const p of toDelete) {
        try { await client.remove(p); deleted++; } catch(e) {}
      }
      console.log("  Deleted " + deleted + " files");
    }

    const newManifest = {};
    for (const f of localFiles) newManifest[f.path] = { size: f.size, mtimeMs: f.mtimeMs };
    saveManifest(newManifest);
    console.log("Manifest updated.");
    console.log("Deploy complete!");
  } catch (err) {
    console.error("Deploy failed:", err.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
