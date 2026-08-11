/**
 * keywords-sync.mjs
 * ================================================================
 * 【Step 3】从关键词主库派生生成 entity-keywords.mjs。
 *
 * 数据流：
 *   data/keywords/main-db.json (唯一权威源)
 *     → repository.exportAllLangs()  (仅 status==='mapped' 且有 targetUrl/anchorText)
 *     → 生成 entity-keywords.mjs (与现有格式完全一致)
 *     → 再运行 generate-entity-keywords.mjs 写回 astro.config.mjs
 *
 * 目的：让关键词库成为唯一权威源，同时保证现有
 *   generate-entity-keywords.mjs → rehype 内链 链路无感切换。
 *
 * 用法：
 *   node scripts/keywords-sync.mjs
 * ================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exportAllLangs, MAIN_DB_REL } from '../src/lib/keywords/repository.mjs';

const ROOT = process.cwd();
const OUT_FILE = path.join(ROOT, 'entity-keywords.mjs');

/** 语言展示名（用于注释头） */
const LANG_LABEL = {
  en: '英语 (English) — 默认语言，URL 无前缀',
  de: '德语 (Deutsch)',
  ja: '日语 (日本語)',
  fr: '法语 (Français)',
  es: '西班牙语 (Español)',
  pt: '葡萄牙语 (Português)',
  it: '意大利语 (Italiano)',
  ko: '韩语 (한국어)',
  nl: '荷兰语 (Nederlands)',
  pl: '波兰语 (Polski)',
  ru: '俄语 (Русский)',
  ar: '阿拉伯语 (العربية)',
};

/** 分组注释标签（按首段关键词的语义，粗略划分） */
const GROUP_HINTS = [
  [/Comprehensive Titanium Manufacturing/i, '首页'],
  [/CNC|Milling|Turning|EDM|Industrial Components/i, 'CNC 加工 (CNC Machining)'],
  [/Additive|3D Printing|SLM|Rapid Prototyping|Low-Volume/i, '增材制造 (Additive Manufacturing)'],
  [/Laser Cutting|Waterjet|Welding|Fabrication/i, '钣金加工 (Fabrication)'],
  [/Forging|Extrusion|Raw Material|Forming/i, '成型与重型制造 (Forming & Heavy Manufacturing)'],
  [/Surface Treatment|Anodizing|Passivation|Polishing|Sandblasting/i, '表面处理 (Surface Treatment)'],
];

function groupLabel(kw) {
  for (const [re, label] of GROUP_HINTS) {
    if (re.test(kw)) return label;
  }
  return '其他 (Other)';
}

function buildFileContent(map) {
  const lines = [];
  lines.push('/**');
  lines.push(' * 实体锚文本映射表 (Entity Anchor Keyword Map) — 由关键词库自动生成');
  lines.push(' * ================================================================');
  lines.push(` * 本文件由 scripts/keywords-sync.mjs 从主库 ${MAIN_DB_REL} 派生生成。`);
  lines.push(' * 请勿直接手工编辑：修改主库后运行 `node scripts/keywords-sync.mjs`。');
  lines.push(' *');
  lines.push(' * 用途: 定义全站内链的锚文本 → 目标URL映射。');
  lines.push(' *       英语页面无语言前缀，其他语言自动加 /{lang}/ 前缀。');
  lines.push(' * ================================================================');
  lines.push(' */');
  lines.push('');

  const langOrder = ['en', 'de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl', 'ru', 'ar'];

  for (const lang of langOrder) {
    const anchors = map[lang];
    if (!anchors || Object.keys(anchors).length === 0) continue;

    lines.push('// ================================================================');
    lines.push(`// ${LANG_LABEL[lang] || lang}`);
    lines.push('// ================================================================');
    lines.push(`export const ${lang} = [`);

    // 按分组注释输出（保持可读性）
    let lastGroup = null;
    const entries = Object.entries(anchors);
    for (const [anchor, url] of entries) {
      const group = groupLabel(anchor);
      if (group !== lastGroup) {
        lines.push('');
        lines.push(`  // ── ${group} ──`);
        lastGroup = group;
      }
      lines.push(`  ['${anchor.replace(/'/g, "\\'")}',  '${url}'],`);
    }

    lines.push('];');
    lines.push('');
  }

  lines.push('// 导出汇总（供脚本使用）');
  lines.push('export const ALL_LANGS = { en, de, ja, fr, es, pt, it, ko, nl, pl };');
  lines.push('');

  return lines.join('\n');
}

function main() {
  console.log('=== [Step 3] 关键词主库 → entity-keywords.mjs ===\n');

  const map = exportAllLangs();
  const total = Object.values(map).reduce((sum, anchors) => sum + Object.keys(anchors).length, 0);
  console.log(`导出 mapped 锚文本总数: ${total}`);
  for (const [lang, anchors] of Object.entries(map)) {
    console.log(`  ${lang}: ${Object.keys(anchors).length}`);
  }

  const content = buildFileContent(map);
  fs.writeFileSync(OUT_FILE, content, 'utf-8');
  console.log(`\n✅ 已生成 ${OUT_FILE} (${content.split('\n').length} 行)`);
  console.log('\n下一步运行: node scripts/generate-entity-keywords.mjs  →  astro.config.mjs');
}

main();
