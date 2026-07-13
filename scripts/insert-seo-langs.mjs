/**
 * insert-seo-langs.mjs
 *
 * Safely inserts `ru` and `ar` fields into every title/description block
 * in src/config/seo.ts. Uses English text as placeholder.
 * Only inserts if the field doesn't already exist.
 *
 * Usage: node scripts/insert-seo-langs.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEO_FILE = path.resolve(__dirname, '../src/config/seo.ts');

const LANG_CODES = ['ru', 'ar'];

function insertFields(content) {
  let result = content;

  for (const lang of LANG_CODES) {
    // Match title: { ... } or description: { ... } blocks
    const blockRegex = /(?:(title|description)\s*:\s*\{)([\s\S]*?)\n    \}/g;
    let match;
    const blocks = [];

    while ((match = blockRegex.exec(result)) !== null) {
      blocks.push({
        start: match.index,
        end: match.index + match[0].length,
        type: match[1],
        body: match[2],
      });
    }

    // Process in reverse order so positions don't shift
    for (let i = blocks.length - 1; i >= 0; i--) {
      const b = blocks[i];

      // Check if this lang already exists
      if (b.body.includes(`${lang}:`)) continue;

      // Split body into lines, preserving leading whitespace
      const bodyMatch = b.body.match(/^\n(\s*)/);
      const firstIndent = bodyMatch ? bodyMatch[1] : '';
      const bodyLines = b.body.trim().split('\n');
      // Restore the first line's indentation
      if (bodyLines.length > 0 && firstIndent) {
        bodyLines[0] = firstIndent + bodyLines[0].trimStart();
      }
      
      // Find the last language line
      let lastLangLine = -1;
      for (let li = bodyLines.length - 1; li >= 0; li--) {
        if (/^\s+\w+\s*:/.test(bodyLines[li])) {
          lastLangLine = li;
          break;
        }
      }
      if (lastLangLine === -1) continue;

      // Extract English text
      const enMatch = b.body.match(/\ben\s*:\s*'((?:[^'\\]|\\.)*)'/);
      const enText = enMatch ? enMatch[1].replace(/\\'/g, "'") : '';

      // Insert new lang line after the last language line
      const indent = bodyLines[lastLangLine].match(/^\s*/)[0];
      const needsComma = !bodyLines[lastLangLine].trimEnd().endsWith(',');
      if (needsComma) bodyLines[lastLangLine] = bodyLines[lastLangLine].trimEnd() + ',';

      const escapedText = enText.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      const newLine = `${indent}${lang}: '${escapedText}',`;
      bodyLines.splice(lastLangLine + 1, 0, newLine);

      // Reconstruct
      const newBody = '\n' + bodyLines.join('\n');
      const newFullBlock = `    ${b.type}: {${newBody}\n    }`;

      result = result.substring(0, b.start) + newFullBlock + result.substring(b.end);
    }
  }

  return result;
}

const content = fs.readFileSync(SEO_FILE, 'utf-8');
const updated = insertFields(content);
fs.writeFileSync(SEO_FILE, updated, 'utf-8');

const ruCount = (updated.match(/\bru\s*:/g) || []).length;
const arCount = (updated.match(/\bar\s*:/g) || []).length;
console.log(`Inserted: ru ${ruCount} places, ar ${arCount} places`);
console.log('Done.');
