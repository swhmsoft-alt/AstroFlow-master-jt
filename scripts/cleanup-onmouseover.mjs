// scripts/cleanup-onmouseover.mjs — T1-P0+ (2026-10-16) v6
// Strategy: match each onmouseover/onmouseout attribute independently.
// The class is determined by the onmouseover pattern. If onmouseover
// matches, the onmouseout attribute (if any) on the same line is also
// removed (best-effort: matches onmouseout="..." up to the closing quote).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');

const P = 'this\\.style\\.';
const PATTERNS = [
  { name: 'hover-link',
    on: P + "color='var\\(--theme-primary\\)'; this\\.style\\.opacity='1'" },
  { name: 'hover-link-bg',
    on: P + "color='var\\(--theme-primary\\)'; this\\.style\\.opacity='1'; this\\.style\\.backgroundColor='color-mix\\(in srgb, var\\(--theme-primary\\) \\d+%, transparent\\)'" },
  { name: 'hover-link-triple',
    on: P + "color='var\\(--theme-primary\\)'; this\\.style\\.borderColor='var\\(--theme-primary\\)'; this\\.style\\.(background|backgroundColor)='color-mix\\(in srgb, var\\(--theme-primary\\) \\d+%, transparent\\)'" },
  { name: 'hover-color-only',
    on: P + "color='var\\(--theme-primary\\)'" },
  { name: 'hover-opacity-only',
    on: P + "opacity='0\\.8'" },
  { name: 'hover-bg-soft',
    on: P + "backgroundColor='color-mix\\(in srgb, var\\(--theme-primary\\) 4%, transparent\\)'" },
  { name: 'hover-bg-shorthand',
    on: P + "background='color-mix\\(in srgb, var\\(--theme-primary\\) \\d+%, transparent\\)'" },
  { name: 'hover-card',
    on: P + "borderColor='var\\(--theme-primary\\)'; this\\.style\\.boxShadow='0 0 30px color-mix\\(in srgb, var\\(--theme-primary\\) \\d+%, transparent\\)'" },
  { name: 'hover-card-strong',
    on: P + "borderColor='var\\(--theme-primary\\)'; this\\.style\\.boxShadow='0 0 40px color-mix\\(in srgb, var\\(--theme-primary\\) \\d+%, transparent\\)'" },
  { name: 'hover-card-soft',
    on: P + "borderColor='var\\(--theme-primary\\)'; this\\.style\\.backgroundColor='color-mix\\(in srgb, var\\(--theme-primary\\) \\d+%, var\\(--theme-bg\\)\\)'" },
  { name: 'hover-card-soft-tint',
    on: P + "borderColor='var\\(--theme-primary\\)'; this\\.style\\.backgroundColor='color-mix\\(in srgb, var\\(--theme-primary\\) \\d+%, transparent\\)'" },
  { name: 'hover-cta',
    on: P + "backgroundColor='color-mix\\(in srgb, var\\(--theme-primary\\) 80%, black\\)'; this\\.style\\.boxShadow='0 0 20px color-mix\\(in srgb, var\\(--theme-primary\\) \\d+%, transparent\\)'" },
  { name: 'hover-cta-strong',
    on: P + "backgroundColor='color-mix\\(in srgb, var\\(--theme-primary\\) 85%, black\\)'; this\\.style\\.boxShadow='0 0 25px color-mix\\(in srgb, var\\(--theme-primary\\) \\d+%, transparent\\)'" },
  { name: 'hover-cta-secondary',
    on: P + "borderColor='var\\(--theme-primary\\)'; this\\.style\\.color='var\\(--theme-primary\\)'" },
  { name: 'hover-cta-tertiary',
    on: P + "borderColor='var\\(--theme-accent\\)'; this\\.style\\.color='var\\(--theme-accent\\)'" },
  { name: 'hover-icon',
    on: P + "backgroundColor='var\\(--theme-primary\\)'; this\\.style\\.color='var\\(--theme-text\\)'; this\\.style\\.opacity='1'" },
  { name: 'hover-item',
    on: P + "backgroundColor='color-mix\\(in srgb, var\\(--theme-primary\\) 8%, var\\(--theme-bg\\)\\)'" },
  { name: 'hover-lift',
    on: P + "transform='translateY\\(-1px\\)'; this\\.style\\.boxShadow='0 6px 18px color-mix\\(in srgb, var\\(--theme-primary\\) \\d+%, transparent\\)'" },
  { name: 'hover-stage-arrow',
    on: P + "borderWidth='40px 40px 0 0'; this\\.style\\.opacity='1'" },
  { name: 'hover-cta-lift',
    on: P + "opacity='0\\.9'; this\\.style\\.boxShadow='0 0 \\d+px color-mix\\(in srgb, var\\(--theme-primary\\) \\d+%, transparent\\)'" },
  { name: 'hover-cta-lift-translate',
    on: P + "opacity='0\\.9'; this\\.style\\.boxShadow='0 0 \\d+px color-mix\\(in srgb, var\\(--theme-primary\\) \\d+%, transparent\\)'; this\\.style\\.transform='translateY\\(-\\d+px\\)'" },
  { name: 'hover-card-lift-3px',
    on: P + "borderColor='color-mix\\(in srgb, var\\(--theme-primary\\) 35%, transparent\\)'; this\\.style\\.transform='translateY\\(-3px\\)'" },
  { name: 'hover-card-lift-4px',
    on: P + "borderColor='color-mix\\(in srgb, var\\(--theme-primary\\) 45%, transparent\\)'; this\\.style\\.transform='translateY\\(-4px\\)'; this\\.style\\.boxShadow='0 0 \\d+px color-mix\\(in srgb, var\\(--theme-primary\\) \\d+%, transparent\\)'" },
  { name: 'hover-card-lift-50',
    on: P + "borderColor='color-mix\\(in srgb, var\\(--theme-primary\\) 50%, transparent\\)'; this\\.style\\.transform='translateY\\(-4px\\)'" },
  { name: 'hover-cta-lift-2px',
    on: P + "boxShadow='0 0 60px color-mix\\(in srgb, var\\(--theme-primary\\) 50%, transparent\\)'; this\\.style\\.transform='translateY\\(-2px\\)'" },
  { name: 'hover-blog-card',
    on: P + "color='var\\(--theme-primary\\)'; this\\.style\\.borderColor='var\\(--theme-primary\\)'; this\\.style\\.background='color-mix\\(in srgb, var\\(--theme-primary\\) \\d+%, transparent\\)'" },
  { name: 'hover-template-var',
    on: P + "borderColor='\\{color\\}'; this\\.style\\.color='\\{color\\}'" },
  { name: 'hover-template-var-2',
    on: P + "borderColor='\\{area\\.highlightColor\\}'; this\\.style\\.boxShadow='0 0 30px color-mix\\(in srgb, var\\(--theme-primary\\) \\d+%, transparent\\)'" },
  { name: 'hover-template-var-3',
    on: P + "borderColor='\\{group\\.accentColor\\}'; this\\.style\\.boxShadow='0 0 30px color-mix\\(in srgb, \\{group\\.accentColor\\} \\d+%, transparent\\)'" },
  { name: 'hover-cta-large-glow',
    on: P + "boxShadow='0 8px 40px color-mix\\(in srgb, var\\(--theme-primary\\) 50%, transparent\\)'" },
  { name: 'hover-cta-50-30',
    on: P + "backgroundColor='color-mix\\(in srgb, var\\(--theme-primary\\) 50%, black\\)'; this\\.style\\.boxShadow='0 0 30px color-mix\\(in srgb, var\\(--theme-primary\\) 50%, transparent\\)'" },
  { name: 'hover-cta-80-30',
    on: P + "backgroundColor='color-mix\\(in srgb, var\\(--theme-primary\\) 80%, black\\)'; this\\.style\\.boxShadow='0 0 30px color-mix\\(in srgb, var\\(--theme-primary\\) \\d+%, transparent\\)'" },
  { name: 'hover-card-25',
    on: P + "borderColor='var\\(--theme-primary\\)'; this\\.style\\.boxShadow='0 0 25px color-mix\\(in srgb, var\\(--theme-primary\\) 15%, transparent\\)'" },
  { name: 'hover-card-30-6',
    on: P + "borderColor='var\\(--theme-primary\\)'; this\\.style\\.boxShadow='0 0 30px color-mix\\(in srgb, var\\(--theme-primary\\) \\d+%, transparent\\)'" },
  { name: 'hover-card-20-6',
    on: P + "borderColor='var\\(--theme-primary\\)'; this\\.style\\.boxShadow='0 0 20px color-mix\\(in srgb, var\\(--theme-primary\\) 6%, transparent\\)'" },
  { name: 'hover-card-24-8',
    on: P + "borderColor='var\\(--theme-primary\\)'; this\\.style\\.boxShadow='0 0 24px color-mix\\(in srgb, var\\(--theme-primary\\) 8%, transparent\\)'" },
  { name: 'hover-card-border-only',
    on: P + "borderColor='var\\(--theme-primary\\)'" },
  { name: 'hover-bg-5',
    on: P + "backgroundColor='color-mix\\(in srgb, var\\(--theme-primary\\) 5%, transparent\\)'" },
  { name: 'hover-bg-6',
    on: P + "backgroundColor='color-mix\\(in srgb, var\\(--theme-primary\\) 6%, transparent\\)'" },
  { name: 'hover-bg-surface',
    on: P + "backgroundColor='var\\(--theme-surface\\)'" },
  { name: 'hover-color-70-white',
    on: P + "color='color-mix\\(in srgb, var\\(--theme-primary\\) 70%, white\\)'" },
  { name: 'hover-border-text-50',
    on: P + "borderColor='color-mix\\(in srgb, var\\(--theme-text\\) 50%, transparent\\)'" },
  { name: 'hover-bg-80-black',
    on: P + "background='color-mix\\(in srgb, var\\(--theme-primary\\) 80%, black\\)'" },
  { name: 'hover-stage-arrow-32',
    on: P + "borderWidth='32px 32px 0 0'; this\\.style\\.opacity='1'" },
  { name: 'hover-translate-x',
    on: P + "opacity='1'; this\\.style\\.transform='translateX\\(\\d+px\\)'" },
  { name: 'hover-card-accent',
    on: P + "borderColor='var\\(--theme-accent\\)'; this\\.style\\.boxShadow='0 0 30px color-mix\\(in srgb, var\\(--theme-accent\\) \\d+%, transparent\\)'" },
  { name: 'hover-template-accent',
    on: P + "borderColor='\\{cert\\.accentColor\\}'; this\\.style\\.boxShadow='0 0 30px color-mix\\(in srgb, var\\(--theme-accent\\) \\d+%, transparent\\)'" },
  { name: 'hover-cta-80-50',
    on: P + "backgroundColor='color-mix\\(in srgb, var\\(--theme-primary\\) 80%, black\\)'; this\\.style\\.boxShadow='0 0 30px color-mix\\(in srgb, var\\(--theme-primary\\) 50%, transparent\\)'" },
  { name: 'hover-bg-8',
    on: P + "backgroundColor='color-mix\\(in srgb, var\\(--theme-primary\\) 8%, transparent\\)'; this\\.style\\.borderColor='var\\(--theme-primary\\)'" },
  { name: 'hover-bg-10',
    on: P + "backgroundColor='color-mix\\(in srgb, var\\(--theme-primary\\) 10%, transparent\\)'" },
  { name: 'hover-card-30-8',
    on: P + "borderColor='var\\(--theme-primary\\)'; this\\.style\\.boxShadow='0 0 30px color-mix\\(in srgb, var\\(--theme-primary\\) 8%, transparent\\)'" },
  { name: 'hover-card-3prop',
    on: P + "borderColor='color-mix\\(in srgb, var\\(--theme-primary\\) 45%, transparent\\)'; this\\.style\\.transform='translateY\\(-4px\\)'; this\\.style\\.boxShadow='0 0 \\d+px color-mix\\(in srgb, var\\(--theme-primary\\) \\d+%, transparent\\)'" },
  { name: 'hover-cta-80-50-tx',
    on: P + "backgroundColor='color-mix\\(in srgb, var\\(--theme-primary\\) 80%, black\\)'; this\\.style\\.boxShadow='0 0 30px color-mix\\(in srgb, var\\(--theme-primary\\) 50%, transparent\\)'; this\\.style\\.transform='translateY\\(-2px\\)'" },
  { name: 'hover-card-30-8',
    on: P + "borderColor='var\\(--theme-primary\\)'; this\\.style\\.boxShadow='0 0 30px color-mix\\(in srgb, var\\(--theme-primary\\) 8%, transparent\\)'" },
  { name: 'hover-card-3prop-lift',
    on: P + "borderColor='var\\(--theme-primary\\)'; this\\.style\\.boxShadow='0 0 30px color-mix\\(in srgb, var\\(--theme-primary\\) 8%, transparent\\)'; this\\.style\\.transform='translateY\\(-\\d+px\\)'" },
  { name: 'hover-card-3prop-45',
    on: P + "borderColor='color-mix\\(in srgb, var\\(--theme-primary\\) 45%, transparent\\)'; this\\.style\\.transform='translateY\\(-4px\\)'; this\\.style\\.boxShadow='0 12px 32px color-mix\\(in srgb, var\\(--theme-primary\\) 18%, transparent\\)'" },
];

// Pre-compile all patterns
const COMPILED = PATTERNS.map(p => ({
  name: p.name,
  re: new RegExp('onmouseover="' + p.on + '"', 'g'),
}));

function addClassToTag(src, matchIndex, className) {
  const before = src.slice(0, matchIndex);
  const lastOpenLt = before.lastIndexOf('<');
  if (lastOpenLt < 0) return src;
  const tagStart = lastOpenLt + 1;
  if (src[tagStart] === '!' || src[tagStart] === '/') return src;
  let i = lastOpenLt + 1;
  let inAttr = false;
  let attrQuote = null;
  while (i < src.length) {
    const ch = src[i];
    if (inAttr) {
      if (ch === attrQuote && src[i - 1] !== '\\') inAttr = false;
    } else {
      if (ch === '"' || ch === "'") {
        inAttr = true; attrQuote = ch;
      } else if (ch === '>') break;
    }
    i++;
  }
  if (i >= src.length) return src;
  const tagEnd = i;
  const tagText = src.slice(lastOpenLt, tagEnd + 1);
  if (tagText.endsWith('/>')) return src;
  if (new RegExp('\\b' + className + '\\b').test(tagText)) return src;
  const classAttrMatch = tagText.match(/\bclass\s*=\s*"([^"]*)"/);
  let newTagText;
  if (classAttrMatch) {
    const existing = classAttrMatch[1];
    const newClasses = (existing + ' ' + className).trim();
    newTagText = tagText.replace(/\bclass\s*=\s*"([^"]*)"/, 'class="' + newClasses + '"');
  } else {
    const tagOpenMatch = tagText.match(/^<([a-zA-Z][a-zA-Z0-9]*)/);
    if (!tagOpenMatch) return src;
    const tagNameEnd = lastOpenLt + 1 + tagOpenMatch[0].length;
    newTagText = tagText.slice(0, tagNameEnd) + ' class="' + className + '"' + tagText.slice(tagNameEnd);
  }
  return src.slice(0, lastOpenLt) + newTagText + src.slice(tagEnd + 1);
}

let totalFiles = 0;
let totalReplacements = 0;
const unclassifiedByFile = {};
const unclassifiedExamples = {};

function processFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf-8');
  const orig = src;
  const fileReplacements = {};
  for (const pattern of COMPILED) {
    const re = new RegExp(pattern.re.source, 'g');
    let count = 0;
    let safety = 0;
    while (safety < 5000) {
      const match = re.exec(src);
      if (!match) break;
      const matchStart = match.index;
      const matchEnd = matchStart + match[0].length;
      // Remove the matched onmouseover attribute
      src = src.slice(0, matchStart) + src.slice(matchEnd);
      // After removal, scan forward for the onmouseout="..." attribute
      // (it may be on the same line or next line). Look in a 500-char window.
      const window = src.slice(matchStart, matchStart + 500);
      const onMouseOutMatch = window.match(/onmouseout="[^"]*"/);
      if (onMouseOutMatch) {
        const outStart = matchStart + onMouseOutMatch.index;
        const outEnd = outStart + onMouseOutMatch[0].length;
        // Remove onmouseout="..." (keep surrounding whitespace)
        src = src.slice(0, outStart) + src.slice(outEnd);
        // Clean up any leading whitespace before onmouseout that was on the same line
        // (leave newline + indentation as-is)
      }
      // Re-add class
      src = addClassToTag(src, matchStart, pattern.name);
      count++;
      safety++;
      re.lastIndex = matchStart;
    }
    if (count > 0) {
      fileReplacements[pattern.name] = (fileReplacements[pattern.name] || 0) + count;
      totalReplacements += count;
    }
  }
  const remaining = src.match(/onmouseover="[^"]*"/g) || [];
  if (remaining.length > 0) {
    unclassifiedByFile[filePath] = remaining.length;
    unclassifiedExamples[filePath] = remaining.slice(0, 3);
  }
  if (src !== orig) {
    fs.writeFileSync(filePath, src, 'utf-8');
    totalFiles++;
    return fileReplacements;
  }
  return null;
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.astro', '.git'].includes(entry.name)) continue;
      walk(full);
    } else if (entry.isFile() && entry.name.endsWith('.astro')) {
      const result = processFile(full);
      if (result) {
        const rel = path.relative(ROOT, full);
        const summary = Object.entries(result).map(([k, v]) => k + '=' + v).join(', ');
        console.log('  ' + rel + ': ' + summary);
      }
    }
  }
}

console.log('Cleaning up onmouseover attributes in src/**/*.astro ...\n');
walk(SRC);

console.log('\n------- Summary -------');
console.log('  Files modified:      ' + totalFiles);
console.log('  Total replacements: ' + totalReplacements);
if (Object.keys(unclassifiedByFile).length > 0) {
  console.log('\n  Unclassified onmouseover remaining in ' + Object.keys(unclassifiedByFile).length + ' files:');
  for (const [file, count] of Object.entries(unclassifiedByFile)) {
    const rel = path.relative(ROOT, file);
    console.log('    ' + rel + ': ' + count);
    if (unclassifiedExamples[file]) {
      for (const ex of unclassifiedExamples[file]) {
        console.log('      ' + ex.substring(0, 140));
      }
    }
  }
}
