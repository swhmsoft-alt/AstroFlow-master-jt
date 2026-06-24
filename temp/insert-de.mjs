/**
 * Insert de block into src/i18n/ui.ts
 * Usage: node temp/insert-de.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read ui.ts
const uiPath = path.resolve(__dirname, '../src/i18n/ui.ts');
let uiContent = fs.readFileSync(uiPath, 'utf-8');

// Read de block
const deBlockPath = path.resolve(__dirname, 'de-block.txt');
const deBlock = fs.readFileSync(deBlockPath, 'utf-8');

// Step 1: Add de to LANGUAGES
if (!uiContent.includes("de: 'Deutsch'")) {
  uiContent = uiContent.replace(
    "  en: 'English',",
    "  en: 'English',\n  de: 'Deutsch',"
  );
  console.log('✅ Added de: Deutsch to LANGUAGES');
}

// Step 2: Insert de block after the en block's closing `  },`
// Find the last occurrence of `  },` followed by `};` (the UI record closing)
const uiCloseMarker = '\n  },\n';
const uiEndMarker = '};\n';

const closePos = uiContent.lastIndexOf(uiCloseMarker);
if (closePos !== -1) {
  // Insert de block after the close of en block
  const insertPos = closePos + uiCloseMarker.length;
  uiContent = uiContent.slice(0, insertPos) + deBlock.trimStart() + uiContent.slice(insertPos);
  fs.writeFileSync(uiPath, uiContent, 'utf-8');
  console.log('✅ Inserted de block into src/i18n/ui.ts');
} else {
  console.error('❌ Could not find insertion point in ui.ts');
  process.exit(1);
}