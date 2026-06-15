/**
 * 🔧 构建后修复脚本 v7 — 修复 Windows 绝对路径
 * 
 * 修复 1️⃣ entry.mjs — 替换 client/server 路径为动态 URL
 * 修复 2️⃣ manifest_*.mjs — 
 *   - hrefRoot → 设为 "/"（浏览器用，不能是 file:// 路径）
 *   - cacheDir, outDir, srcDir, publicDir → 设为 file:// 动态路径（Node.js 文件系统用）
 *   - sessionConfig.options.base → 替换原始 JSON 中的 Windows 路径
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const distServer = join(process.cwd(), 'dist', 'server');

const REL_ROOT = "new URL('../../', import.meta.url).href.replace(/\\/$/, '')";
const REL_SERVER = "new URL('../', import.meta.url).href.replace(/\\/$/, '') + '/'";

let count = 0;

/* ═══════ 1. entry.mjs ═══════ */
const ep = join(distServer, 'entry.mjs');
let data = readFileSync(ep, 'utf-8');
if (data.includes('file:///')) {
  data = data.replace(/"client":\s*"file:\/\/\/[^"]+"/, `"client": ${REL_SERVER}`);
  data = data.replace(/"server":\s*"file:\/\/\/[^"]+"/, `"server": ${REL_SERVER}`);
  writeFileSync(ep, data, 'utf-8');
  console.log('✅ entry.mjs');
  count++;
}

/* ═══════ 2. manifest_*.mjs ═══════ */
for (const f of readdirSync(distServer).filter(f => f.startsWith('manifest_') && f.endsWith('.mjs'))) {
  const fp = join(distServer, f);
  let c = readFileSync(fp, 'utf-8');
  if (!c.includes('file:///C:')) { console.log(`ℹ️ ${f} 无需修复`); continue; }

  // 添加 ROOT_URL 变量定义
  const header = `const ROOT_URL = ${REL_ROOT};\n\n`;
  c = c.replace(/^/, header);

  // 修复 manifest 对象属性（在 deserializeManifest() 之后）
  // 注意：hrefRoot 是浏览器用的 URL 路径，必须设为 "/" 而不是 file:// 路径
  const fileSystemFields = ['cacheDir', 'outDir', 'srcDir', 'publicDir', 'buildClientDir', 'buildServerDir'];
  
  let newLines = `\n// 修复硬编码的 Windows 路径为动态路径\n`;
  
  // hrefRoot 是浏览器用的基础路径，必须保留为 "/" 
  newLines += `manifest.hrefRoot = "/";\n`;
  
  // 其他路径是给 Node.js 文件系统用的，使用 file:// 动态路径
  const subPaths = {
    'cacheDir': 'node_modules/.astro/',
    'outDir': 'dist/',
    'srcDir': 'src/',
    'publicDir': 'public/',
    'buildClientDir': 'dist/client/',
    'buildServerDir': 'dist/server/'
  };
  
  for (const field of fileSystemFields) {
    newLines += `manifest.${field} = ROOT_URL + "/" + "${subPaths[field]}";\n`;
  }

  // 修复原始 JSON 中的 sessionConfig.options.base (Windows 路径)
  c = c.replace(/"base":"[^"]+node_modules\\.astro\\sessions"/, `"base":"node_modules/.astro/sessions"`);
  
  // 在 export { manifest } 之前插入补丁代码
  c = c.replace('export { manifest };', `${newLines}\nexport { manifest };`);

  writeFileSync(fp, c, 'utf-8');
  console.log(`✅ ${f}`);
  count++;
}

console.log(`🎉 修复 ${count} 个文件`);
