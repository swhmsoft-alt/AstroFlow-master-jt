/**
 * sync-translations.mjs
 * 
 * 为指定语言生成初始翻译文件（基于 en.json 的键，值与 en 相同作为占位符），
 * 并更新 src/i18n/ui.ts 以导入和注册新语言。
 * 
 * 用法：
 *   node scripts/sync-translations.mjs <langCode1> <langCode2> ...
 *   例如：node scripts/sync-translations.mjs zh ja fr es
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const TRANSLATIONS_DIR = join(ROOT, 'src/i18n/translations');
const UI_TS_PATH = join(ROOT, 'src/i18n/ui.ts');

// 语言名称映射
const LANG_NAMES = {
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  fr: 'Français',
  es: 'Español',
  pt: 'Português',
  ru: 'Русский',
  ar: 'العربية',
  it: 'Italiano',
  nl: 'Nederlands',
  pl: 'Polski',
  tr: 'Türkçe',
  vi: 'Tiếng Việt',
  th: 'ไทย',
  hi: 'हिन्दी',
  ms: 'Bahasa Melayu',
};

// 从命令行参数获取语言代码
const newLangs = process.argv.slice(2).filter(l => l !== 'en' && l !== 'de');

if (newLangs.length === 0) {
  console.log('用法: node scripts/sync-translations.mjs <langCode1> <langCode2> ...');
  console.log('示例: node scripts/sync-translations.mjs zh ja fr es pt ru ko ar');
  process.exit(0);
}

// 读取 en.json 作为模板
const enPath = join(TRANSLATIONS_DIR, 'en.json');
const en = JSON.parse(readFileSync(enPath, 'utf-8'));
const keys = Object.keys(en);

console.log(`Loaded ${keys.length} keys from en.json\n`);

// 为每种语言生成翻译文件
for (const lang of newLangs) {
  const langPath = join(TRANSLATIONS_DIR, `${lang}.json`);
  
  if (existsSync(langPath)) {
    // 如果文件已存在，只添加缺失的键
    const existing = JSON.parse(readFileSync(langPath, 'utf-8'));
    let added = 0;
    for (const key of keys) {
      if (existing[key] === undefined) {
        existing[key] = en[key]; // 使用英文作为占位符
        added++;
      }
    }
    writeFileSync(langPath, JSON.stringify(existing, null, 2) + '\n', 'utf-8');
    console.log(`✓ ${lang}.json updated (${Object.keys(existing).length} keys, +${added} new)`);
  } else {
    // 创建新文件，使用英文作为占位符
    const content = {};
    for (const key of keys) {
      content[key] = en[key];
    }
    writeFileSync(langPath, JSON.stringify(content, null, 2) + '\n', 'utf-8');
    console.log(`✓ ${lang}.json created (${keys.length} keys, all placeholder)`);
  }
}

// 更新 ui.ts
let uiContent = readFileSync(UI_TS_PATH, 'utf-8');
let modified = false;

// 添加 import 语句
for (const lang of newLangs) {
  const importLine = `import ${lang} from './translations/${lang}.json';`;
  if (!uiContent.includes(importLine)) {
    // 在最后一个 import 之后插入
    const lastImportIndex = uiContent.lastIndexOf("import ");
    const afterLastImport = uiContent.indexOf('\n', lastImportIndex);
    uiContent = uiContent.slice(0, afterLastImport + 1) + importLine + '\n' + uiContent.slice(afterLastImport + 1);
    modified = true;
    console.log(`  + import added for '${lang}'`);
  }
}

// 更新 LANGUAGES 对象
for (const lang of newLangs) {
  const langName = LANG_NAMES[lang] || lang;
  const langEntry = `  ${lang}: '${langName}',`;
  if (!uiContent.includes(`  ${lang}:`)) {
    // 在 'de' 条目之后插入（或最后一个 LANGUAGES 条目）
    const langsMatch = uiContent.match(/export const LANGUAGES: Record<string, string> = \{[\s\S]*?\};/);
    if (langsMatch) {
      const block = langsMatch[0];
      const insertPos = block.lastIndexOf('\n');
      const newBlock = block.slice(0, insertPos) + '\n' + langEntry + block.slice(insertPos);
      uiContent = uiContent.replace(block, newBlock);
      modified = true;
      console.log(`  + LANGUAGES entry added for '${lang}'`);
    }
  }
}

// 更新 UI 导出
for (const lang of newLangs) {
  if (!uiContent.includes(`UI: Record<Lang, Record<string, string>>`)) {
    // 如果 UI 声明不是直接列举所有语言，需要更复杂的处理
    const uiMatch = uiContent.match(/export const UI: Record<Lang, Record<string, string>> = \{[\s\S]*?\};/);
    if (uiMatch) {
      const block = uiMatch[0];
      const langEntry = `  ${lang},`;
      if (!block.includes(`  ${lang},`)) {
        const insertPos = block.lastIndexOf('\n');
        const newBlock = block.slice(0, insertPos) + '\n' + langEntry + block.slice(insertPos);
        uiContent = uiContent.replace(block, newBlock);
        modified = true;
        console.log(`  + UI entry added for '${lang}'`);
      }
    }
  }
}

if (modified) {
  writeFileSync(UI_TS_PATH, uiContent, 'utf-8');
  console.log(`\n✓ src/i18n/ui.ts updated`);
} else {
  console.log(`\n- src/i18n/ui.ts unchanged`);
}

console.log('\nDone! Next steps:');
console.log(`  1. Translate the placeholder values in each new .json file`);
console.log(`  2. Run "npm run build" to verify`);