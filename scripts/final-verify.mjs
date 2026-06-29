import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const translationsDir = join(__dirname, '..', 'src', 'i18n', 'translations');
const componentsDir = join(__dirname, '..', 'src', 'components', 'services');

const en = JSON.parse(readFileSync(join(translationsDir, 'en.json'), 'utf-8'));
const ja = JSON.parse(readFileSync(join(translationsDir, 'ja.json'), 'utf-8'));

const prefixes = [
  'services.surfaceprocessspectrum',
  'services.surfacespecsdashboard',
  'services.gallingosseointegrationknowhow',
  'services.anodizingclassifications',
  'services.anodizingspecsdashboard',
  'services.passivationspectrum',
  'services.passivationspecsdashboard',
  'services.texturingprocessspectrum',
  'services.texturingspecsdashboard',
  'services.smearingembeddingcontrolknowhow',
  'services.hydrogenembrittlementacidcontrolknowhow'
];

console.log('=== CHECK 1: Key count match between EN and JA ===');
let totalIssues = 0;
for (const prefix of prefixes) {
  const enKeys = Object.keys(en).filter(k => k.startsWith(prefix));
  const jaKeys = Object.keys(ja).filter(k => k.startsWith(prefix));
  
  if (enKeys.length !== jaKeys.length) {
    console.log(`  MISMATCH ${prefix}: EN=${enKeys.length} JA=${jaKeys.length}`);
    totalIssues++;
    
    const missingInJa = enKeys.filter(k => !jaKeys.includes(k));
    if (missingInJa.length > 0) {
      missingInJa.forEach(k => console.log(`    Missing in JA: ${k} = ${en[k].substring(0, 60)}`));
    }
    
    const extraInJa = jaKeys.filter(k => !enKeys.includes(k));
    if (extraInJa.length > 0) {
      extraInJa.forEach(k => console.log(`    Extra in JA: ${k}`));
    }
  } else {
    console.log(`  OK ${prefix}: ${enKeys.length} keys`);
  }
}

console.log('\n=== CHECK 2: JA translation quality ===');
for (const prefix of prefixes) {
  const jaKeys = Object.keys(ja).filter(k => k.startsWith(prefix));
  jaKeys.forEach(k => {
    const v = ja[k];
    const enV = en[k];
    // Check if JA value is still English (no CJK characters)
    const hasCJK = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(v);
    if (!hasCJK && v === enV && enV && enV.length > 5) {
      console.log(`  WARNING: JA value equals EN for ${k}`);
      console.log(`    EN: ${enV.substring(0, 80)}`);
      totalIssues++;
    }
  });
}

console.log('\n=== CHECK 3: Component file t() references ===');
const components = [
  'SurfaceProcessSpectrum', 'SurfaceSpecsDashboard', 'GallingOsseointegrationKnowHow',
  'AnodizingClassifications', 'AnodizingSpecsDashboard',
  'PassivationSpectrum', 'PassivationSpecsDashboard',
  'TexturingProcessSpectrum', 'TexturingSpecsDashboard',
  'SmearingEmbeddingControlKnowHow', 'HydrogenEmbrittlementAcidControlKnowHow'
];

for (const comp of components) {
  const content = readFileSync(join(componentsDir, comp + '.astro'), 'utf-8');
  
  // Extract all t() calls from the file
  const tCalls = content.match(/t\(['`][^'`]+['`]\)/g) || [];
  const usedKeys = tCalls.map(t => t.replace(/t\(['`]([^'`]+)['`]\)/, '$1'));
  
  // Check each key exists in en.json
  const missingKeys = usedKeys.filter(k => !en[k]);
  if (missingKeys.length > 0) {
    console.log(`  MISSING KEYS in ${comp}:`);
    missingKeys.forEach(k => console.log(`    ${k}`));
    totalIssues++;
  } else {
    console.log(`  OK ${comp}: ${usedKeys.length} t() calls all valid`);
  }
  
  // Check for any hardcoded English in section/subtitle position
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    // Look for text outside t() calls that looks like English content
    if (trimmed.match(/^[A-Z][a-zA-Z\s,]+[a-z][a-zA-Z\s,.]*$/) && 
        trimmed.length > 30 && 
        !trimmed.includes('{') && 
        !trimmed.includes('<') &&
        !trimmed.includes('//') &&
        !trimmed.includes('import') &&
        !trimmed.includes('background') &&
        !trimmed.includes('stroke') &&
        !trimmed.includes('fill') &&
        !trimmed.includes('clip') &&
        !trimmed.includes('Linear') &&
        !trimmed.includes('Transparent')) {
      console.log(`  POSSIBLE HARDCODED in ${comp} L${i+1}: ${trimmed.substring(0, 100)}`);
      totalIssues++;
    }
  }
}

if (totalIssues === 0) {
  console.log('\n✅ ALL CHECKS PASSED! All translations are complete and correct.');
} else {
  console.log(`\n❌ Found ${totalIssues} issues that need attention.`);
}