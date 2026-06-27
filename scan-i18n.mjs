#!/usr/bin/env node
/**
 * scan-i18n.mjs
 * Astro 项目硬编码字符串扫描器
 * 用法: node scan-i18n.mjs [src目录路径] [选项]
 *
 * 选项:
 *   --out <file>   输出 JSON 报告（默认只打印到终端）
 *   --min <n>      最短字符数才报告（默认 3）
 *   --ignore <pat> 额外忽略的正则（可多次）
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ──────────────────────────────────────────────
// 配置
// ──────────────────────────────────────────────
const SRC_DIR   = process.argv[2] || './src';
const MIN_LEN   = Number(getArg('--min') ?? 3);
const OUT_FILE  = getArg('--out');
const EXTS      = ['.astro', '.tsx', '.jsx', '.ts', '.js', '.vue', '.svelte'];

// 这些字符串模式不报告（正则）
const IGNORE_PATTERNS = [
  // 已经在 t() / i18n 函数里的 key
  /\bt\s*\(\s*['"`]/,
  // import 语句
  /^import\s/,
  // 纯技术字符串
  /^[a-z0-9_\-\.\/:#@]+$/i,           // 路径/class名/ID
  /^\s*\/\//,                           // 注释行
  /class[:=]/,                          // class属性
  /href\s*=/,                           // href
  /src\s*=/,                            // src
  /^\d+(\.\d+)?(px|rem|em|%|ms|s)?$/,  // 纯数值
  /^#[0-9a-f]{3,8}$/i,                 // 颜色值
  /^(true|false|null|undefined)$/,
  /^(en|de|ja|fr|es|pt|it|ko|nl|pl)$/,// 语言代码
  // 用户自定义忽略
  ...getAllArgs('--ignore').map(p => new RegExp(p)),
];

// 这些文件/目录跳过
const SKIP_DIRS  = ['node_modules', '.git', 'dist', '.astro', 'public'];
const SKIP_FILES = ['ui.ts', 'ui.js', 'utils.ts', 'i18n.ts'];

// ──────────────────────────────────────────────
// 颜色输出
// ──────────────────────────────────────────────
const c = {
  red:    s => `\x1b[31m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  green:  s => `\x1b[32m${s}\x1b[0m`,
  cyan:   s => `\x1b[36m${s}\x1b[0m`,
  bold:   s => `\x1b[1m${s}\x1b[0m`,
  dim:    s => `\x1b[2m${s}\x1b[0m`,
  reset:  s => `\x1b[0m${s}`,
};

// ──────────────────────────────────────────────
// 提取规则：匹配模板里的字符串字面量
// ──────────────────────────────────────────────
const EXTRACT_RULES = [
  // Astro/JSX 模板里的纯文本节点（>文字内容<）
  {
    name: 'JSX_TEXT',
    // 匹配 >...< 之间含字母的内容，排除纯空白和只有符号
    regex: />\s*([A-Za-z][^<>{}\n]{2,200}?)\s*</g,
    group: 1,
    context: 'template-text',
  },
  // 属性里的字符串：placeholder="..." title="..." alt="..." aria-label="..."
  {
    name: 'ATTR_STRING',
    regex: /(?:placeholder|title|alt|aria-label|aria-description|label|value|content)\s*=\s*["']([^"']{3,200})["']/g,
    group: 1,
    context: 'attribute',
  },
  // JS/TS 里的字符串赋值（不在 t() 里）
  {
    name: 'JS_STRING',
    regex: /(?:text|label|title|description|heading|badge|cta|message|content)\s*[:=]\s*["'`]([^"'`\n]{3,200})["'`]/gi,
    group: 1,
    context: 'js-assignment',
  },
];

// ──────────────────────────────────────────────
// 已翻译判断：检测字符串所在行是否已用了 t()
// ──────────────────────────────────────────────
function isAlreadyTranslated(line) {
  return /\bt\s*\(/.test(line) ||
         /useTranslations/.test(line) ||
         /getLangFromUrl/.test(line) ||
         /Astro\.locals\.t/.test(line);
}

function shouldIgnore(str) {
  str = str.trim();
  if (str.length < MIN_LEN) return true;
  if (!/[A-Za-z]/.test(str)) return true;  // 无字母
  return IGNORE_PATTERNS.some(p => {
    if (typeof p === 'string') return str.includes(p);
    return p.test(str);
  });
}

// ──────────────────────────────────────────────
// 扫描单个文件
// ──────────────────────────────────────────────
function scanFile(filePath) {
  const raw  = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split('\n');
  const hits  = [];

  // 判断是否在 frontmatter (---) 区域内
  let inFrontmatter = false;
  let frontmatterCount = 0;

  // 判断是否在注释里
  let inBlockComment = false;

  for (let lineNo = 0; lineNo < lines.length; lineNo++) {
    const line = lines[lineNo];
    const trimmed = line.trim();

    // Astro frontmatter 边界
    if (trimmed === '---') {
      frontmatterCount++;
      inFrontmatter = frontmatterCount === 1;
      if (frontmatterCount === 2) inFrontmatter = false;
      continue;
    }

    // 跳过注释
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;
    if (trimmed.includes('/*')) { inBlockComment = true; }
    if (inBlockComment) {
      if (trimmed.includes('*/')) inBlockComment = false;
      continue;
    }

    // 已经有翻译函数的行跳过
    if (isAlreadyTranslated(line)) continue;

    // 对每条规则扫描
    for (const rule of EXTRACT_RULES) {
      rule.regex.lastIndex = 0;
      let match;
      while ((match = rule.regex.exec(line)) !== null) {
        const str = match[rule.group].trim();
        if (shouldIgnore(str)) continue;

        hits.push({
          line:    lineNo + 1,
          col:     match.index + 1,
          rule:    rule.name,
          context: rule.context,
          text:    str,
          raw:     trimmed.slice(0, 120),
        });
      }
    }
  }

  return hits;
}

// ──────────────────────────────────────────────
// 递归遍历目录
// ──────────────────────────────────────────────
function walkDir(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (SKIP_DIRS.includes(entry.name)) continue;
      walkDir(fullPath, results);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (!EXTS.includes(ext)) continue;
      if (SKIP_FILES.includes(entry.name)) continue;
      results.push(fullPath);
    }
  }
  return results;
}

// ──────────────────────────────────────────────
// 建议 translation key
// ──────────────────────────────────────────────
function suggestKey(filePath, text) {
  // 从文件路径推断命名空间
  const parts = filePath.replace(/\\/g, '/').split('/');
  const fileName = path.basename(filePath, path.extname(filePath));

  // 常见组件目录 → 命名空间前缀
  let ns = 'ui';
  if (parts.includes('sections'))   ns = 'section';
  if (parts.includes('components')) ns = 'comp';
  if (parts.includes('pages'))      ns = 'page';
  if (parts.includes('layouts'))    ns = 'layout';

  // 从文件名推断
  const fileSlug = fileName
    .replace(/([A-Z])/g, '_$1').toLowerCase()
    .replace(/^_/, '').replace(/-/g, '_');

  // 从文字内容推断 key
  const textSlug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 30);

  return `${ns}.${fileSlug}.${textSlug}`;
}

// ──────────────────────────────────────────────
// 生成报告
// ──────────────────────────────────────────────
function generateReport(allResults) {
  const totalFiles   = allResults.length;
  const totalHits    = allResults.reduce((s, r) => s + r.hits.length, 0);
  const affectedFiles = allResults.filter(r => r.hits.length > 0);

  // 按优先级排序（命中数多的在前）
  affectedFiles.sort((a, b) => b.hits.length - a.hits.length);

  return { totalFiles, totalHits, affectedFiles };
}

// ──────────────────────────────────────────────
// 打印彩色终端报告
// ──────────────────────────────────────────────
function printReport(report, srcDir) {
  const { totalFiles, totalHits, affectedFiles } = report;

  console.log('\n' + c.bold('━'.repeat(70)));
  console.log(c.bold(c.cyan('  🔍 Astro i18n 硬编码字符串扫描报告')));
  console.log(c.bold('━'.repeat(70)));
  console.log(`  扫描目录: ${c.cyan(srcDir)}`);
  console.log(`  扫描文件: ${c.yellow(totalFiles + ' 个')}`);
  console.log(`  发现问题: ${totalHits > 0 ? c.red(totalHits + ' 处硬编码字符串') : c.green('0 处，全部已翻译！')}`);
  console.log(`  影响文件: ${c.yellow(affectedFiles.length + ' 个')}`);
  console.log(c.bold('━'.repeat(70)) + '\n');

  if (affectedFiles.length === 0) {
    console.log(c.green('  ✅ 未发现硬编码字符串，所有文本均已接入翻译系统！'));
    return;
  }

  // 按文件打印
  for (const fileResult of affectedFiles) {
    const relPath = path.relative(process.cwd(), fileResult.path);
    console.log(c.bold(c.yellow(`\n📄 ${relPath}`)) + c.dim(` (${fileResult.hits.length} 处)`));
    console.log('─'.repeat(65));

    for (const hit of fileResult.hits) {
      const sugKey = suggestKey(fileResult.path, hit.text);
      console.log(
        `  ${c.dim('L' + String(hit.lineNo).padEnd(4))}` +
        `${c.red('●')} ${c.bold('"' + hit.text.slice(0, 60) + (hit.text.length > 60 ? '...' : '') + '"')}`
      );
      console.log(`       ${c.dim('规则:')} ${hit.rule.padEnd(14)} ${c.dim('位置:')} ${hit.context}`);
      console.log(`       ${c.dim('建议key:')} ${c.cyan(sugKey)}`);
      console.log(`       ${c.dim('原行:')} ${hit.rawLine.slice(0, 80)}`);
      console.log();
    }
  }

  // 生成 Cline 提示词
  console.log(c.bold('━'.repeat(70)));
  console.log(c.bold(c.green('\n📋 自动生成的 Cline 提示词（直接复制给 AI）：\n')));
  console.log(c.bold('─'.repeat(70)));

  const fileList = affectedFiles
    .map(f => {
      const relPath = path.relative(process.cwd(), f.path);
      const samples = f.hits.slice(0, 3).map(h => `"${h.text.slice(0, 40)}"`).join(', ');
      return `- ${relPath} (${f.hits.length}处: ${samples}${f.hits.length > 3 ? '...' : ''})`;
    })
    .join('\n');

  const uniqueTexts = [...new Set(
    affectedFiles.flatMap(f => f.hits.map(h => h.text))
  )].slice(0, 20);

  const prompt = `
请修复以下 Astro 组件中的硬编码字符串，将它们全部接入 i18n 翻译系统。

【需要修改的文件】
${fileList}

【修改规则】
1. 把所有硬编码的可见文字移入 src/i18n/ui.ts 的翻译字典
2. 在组件顶部 frontmatter 中调用 getLangFromUrl + useTranslations
3. 模板里的硬编码字符串替换为 {t('对应.key')}
4. 每个 key 必须在 en/de/ja/fr/es/pt/it/ko/nl/pl 全部10种语言里补充翻译
5. Section 的 badge 小标签、卡片标题、列表 <li> 里的文字都要处理

【发现的硬编码文字样本】
${uniqueTexts.map(t => `- "${t}"`).join('\n')}

【不要修改】
- src/i18n/ui.ts 中已有的 key（只追加新 key）
- import 语句、class 名、href 链接
- 数字、单位、技术规格值（如 ±0.005mm、AS9100D）

请按文件逐个处理，每处理完一个文件说明修改了哪些 key。
`.trim();

  console.log(prompt);
  console.log(c.bold('\n' + '─'.repeat(70)));
}

// ──────────────────────────────────────────────
// 工具函数
// ──────────────────────────────────────────────
function getArg(flag) {
  const idx = process.argv.indexOf(flag);
  return idx !== -1 ? process.argv[idx + 1] : null;
}

function getAllArgs(flag) {
  const result = [];
  for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === flag && process.argv[i + 1]) {
      result.push(process.argv[i + 1]);
    }
  }
  return result;
}

// ──────────────────────────────────────────────
// 主程序
// ──────────────────────────────────────────────
function main() {
  const srcDir = path.resolve(SRC_DIR);
  console.log(c.dim(`\n扫描中: ${srcDir} ...`));

  const files = walkDir(srcDir);
  const allResults = [];

  for (const filePath of files) {
    try {
      const hits = scanFile(filePath);
      if (hits.length > 0) {
        allResults.push({
          path: filePath,
          hits: hits.map(h => ({
            lineNo:  h.line,
            col:     h.col,
            rule:    h.rule,
            context: h.context,
            text:    h.text,
            rawLine: h.raw,
            suggestedKey: suggestKey(filePath, h.text),
          })),
        });
      }
    } catch (e) {
      console.error(c.red(`  ⚠ 读取失败: ${filePath}: ${e.message}`));
    }
  }

  const report = generateReport([
    ...allResults,
    // 没命中的文件也计入总数
    ...files
      .filter(f => !allResults.find(r => r.path === f))
      .map(f => ({ path: f, hits: [] })),
  ]);

  printReport(report, srcDir);

  // 输出 JSON
  if (OUT_FILE) {
    const json = {
      scannedAt: new Date().toISOString(),
      srcDir,
      summary: {
        totalFiles: report.totalFiles,
        totalHits: report.totalHits,
        affectedFiles: report.affectedFiles.length,
      },
      files: report.affectedFiles.map(f => ({
        path: path.relative(process.cwd(), f.path),
        hitCount: f.hits.length,
        hits: f.hits,
      })),
    };
    fs.writeFileSync(OUT_FILE, JSON.stringify(json, null, 2), 'utf8');
    console.log(c.green(`\n✅ JSON 报告已写入: ${OUT_FILE}`));
  }

  // 退出码：有问题返回 1，方便 CI 使用
  process.exit(report.totalHits > 0 ? 1 : 0);
}

main();
