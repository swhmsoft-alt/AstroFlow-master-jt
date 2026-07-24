const fs = require("fs");
const script = [
"/**",
" * scripts/deploy-incremental-ftp.js",
" *",
" * 增量 FTP 部署脚本 - 只上传新增或变更的文件。",
" * 对比本地 manifest 仅同步有差异的文件。",
" *",
" * 用法: node scripts/deploy-incremental-ftp.js",
" */",
"",
'import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "fs";',
'import { resolve, dirname, join } from "path";',
'import { fileURLToPath } from "url";',
'import { Client } from "basic-ftp";',
"",
'const __dirname = dirname(fileURLToPath(import.meta.url));',
'const envPath = resolve(__dirname, "..", ".env.production");',
'const LOCAL_ROOT = resolve(__dirname, "..", "dist");',
'const MANIFEST_PATH = join(LOCAL_ROOT, ".deploy-manifest.json");',
];
script.push("");
fs.writeFileSync("scripts/deploy-incremental-ftp.js", script.join("\n"), "utf-8");
console.log("Part 1 written");
