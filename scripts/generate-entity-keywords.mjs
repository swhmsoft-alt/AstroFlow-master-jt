/**
 * generate-entity-keywords.mjs
 *
 * 读取 entity-keywords.mjs（结构化、带注释的锚文本映射表）
 * 转换为 astro.config.mjs 需要的 keywordMap 格式。
 *
 * 运行方式: node scripts/generate-entity-keywords.mjs
 * 编辑方式: 修改 entity-keywords.mjs 中的条目，然后运行此脚本
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

  // 动态导入 entity-keywords.mjs
  async function loadKeywords() {
    const mod = await import(pathToFileURL(path.join(ROOT, 'entity-keywords.mjs')).href);
    return mod.ALL_LANGS;
  }

function build(ALL_LANGS) {
  const keywordMap = {};
  const seen = new Set();

  for (const [lang, entries] of Object.entries(ALL_LANGS)) {
    for (const [keyword, urlPath] of entries) {
      const key = `${keyword.toLowerCase().trim()}::${lang}`;
      if (seen.has(key) || !keyword || keyword.length < 1) continue;
      seen.add(key);

      const href = lang === 'en' ? urlPath : `/${lang}${urlPath}`;
      keywordMap[keyword.trim()] = { href };
    }
  }

  return keywordMap;
}

async function write(keywordMap) {
  const fp = path.join(ROOT, 'astro.config.mjs');
  let c = fs.readFileSync(fp, 'utf-8');

  const json = JSON.stringify(keywordMap, null, 2);
  const body = json.split('\n').slice(1, -1).map(l => `        ${l}`).join('\n');

  const m = c.match(/keywordMap:\s*\{/);
  if (!m) { console.error('ERROR: keywordMap not found in astro.config.mjs'); process.exit(1); }
  const s = m.index; let d = 0, e = s;
  while (e < c.length) { if (c[e]==='{') d++; if (c[e]==='}') { d--; if (d===0) break; } e++; }

  fs.writeFileSync(fp, c.slice(0,s) + `keywordMap: {\n${body}\n      }` + c.slice(e+1), 'utf-8');
  console.log('✓ Updated astro.config.mjs');
}

async function main() {
  console.log('=== 实体锚文本映射表 → astro.config.mjs ===\n');

  const ALL_LANGS = await loadKeywords();
  const keywordMap = build(ALL_LANGS);

  // 统计
  const byLang = {};
  for (const [k, meta] of Object.entries(keywordMap)) {
    const l = meta.href.match(/^\/([a-z]{2})\//)?.[1] || 'en';
    byLang[l] = (byLang[l] || 0) + 1;
  }

  console.log(`总计: ${Object.keys(keywordMap).length} 个锚文本`);
  console.log('各语言分布:');
  for (const lang of ['en','de','ja','fr','es','pt','it','ko','nl','pl']) {
    console.log(`  ${lang}: ${byLang[lang] || 0}`);
  }

  console.log('\nEN 样本:');
  let n = 0;
  for (const [kw, meta] of Object.entries(keywordMap)) {
    if (!meta.href.match(/^\/(de|ja|fr|es|pt|it|ko|nl|pl)\//) && n < 8) {
      console.log(`  "${kw}" → ${meta.href}`);
      n++;
    }
  }

  console.log('\nJA 样本:');
  n = 0;
  for (const [kw, meta] of Object.entries(keywordMap)) {
    if (meta.href.startsWith('/ja/') && n < 5) {
      console.log(`  "${kw}" → ${meta.href}`);
      n++;
    }
  }

  await write(keywordMap);
  console.log('\n✅ 完成。');
  console.log('  修改 entity-keywords.mjs → 运行此脚本 → astro.config.mjs 自动更新');
}

main().catch(console.error);