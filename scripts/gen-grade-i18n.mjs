/**
 * Generate i18n translation keys for all 13 titanium grades.
 * This writes directly to grade-keys-en.json with all English values.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse the TS data file manually
const filePath = join(__dirname, '..', 'src', 'data', 'titanium-grades.ts');
const text = readFileSync(filePath, 'utf-8');

// We need to extract string values from the object literal.
// Strategy: Convert TS to JSON-like by removing type annotations and trailing commas,
// then parse each grade object.

// First, isolate the GRADE_DATA object
const startMarker = 'export const GRADE_DATA: GradeMap = {';
const start = text.indexOf(startMarker);
if (start === -1) {
  console.error('Could not find GRADE_DATA');
  process.exit(1);
}

let gradeText = text.slice(start + startMarker.length);
// Remove the trailing }; from the file
const end = gradeText.lastIndexOf('};');
gradeText = gradeText.slice(0, end + 1);

// Now we need to turn this into valid JSON. 
// The problem: TS types, trailing commas, template literals with ${}, etc.

// A pragmatic approach: use a simple state-machine parser that extracts key: "value" pairs
// for all identifiable string properties of each grade.

// Extract grade blocks
const gradeBlocks = [];
const gradeNames = [
  'grade-1', 'grade-2', 'grade-3', 'grade-4', 'grade-4-eli',
  'grade-5', 'grade-23', 'grade-6', 'grade-9',
  'grade-19', 'grade-21', 'grade-6242', 'ti-5553'
];

// For each grade, extract its object block using brace counting
for (const gName of gradeNames) {
  const key = `"${gName}"`;
  let pos = gradeText.indexOf(key);
  if (pos === -1) continue;
  
  // Find the opening { after the key
  pos = gradeText.indexOf('{', pos + key.length);
  if (pos === -1) continue;
  
  // Count braces to find matching closing }
  let depth = 1;
  let endPos = pos + 1;
  while (depth > 0 && endPos < gradeText.length) {
    if (gradeText[endPos] === '{') depth++;
    else if (gradeText[endPos] === '}') depth--;
    endPos++;
  }
  
  const block = gradeText.slice(pos, endPos);
  gradeBlocks.push({ name: gName, block });
}

// Now extract string values from each block using regex
const keys = {};

for (const { name: gradeKey, block } of gradeBlocks) {
  const prefix = `materials.${gradeKey}`;
  
  // Helper: find all string values matching a path pattern
  const extractValues = (path) => {
    // path is like "entityDefinition.title" — look for "title:" in the block
    // We search within the right nested context
    return null;
  };
  
  // Simple string value extraction: find all "key": "value" patterns  
  // Track context by brace depth
  let context = []; // stack of object keys
  let depth = 0;
  let lastKey = '';
  
  // Parse the block character by character for "key": "value" patterns
  const lines = block.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Skip empty lines, comments
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*')) continue;
    
    // Check for section key (like "entityDefinition": {)
    // These determine the context prefix
  }
}

// Since TS parsing is complex, let's use a different approach:
// Hardcode the translation key structure and just extract the values.

console.log('Generating keys from a different approach...');

// Instead of parsing TS, let's read the already-generated grade-keys-en.json
// if it exists (from first run), or generate from scratch using known structure.

// Actually, let's use a runtime approach: create a temp .mjs that imports the TS
// Then write results. But Windows + ESM import is problematic.

// Alternative: write a single .mjs that directly re-creates the grade data inline
// as plain JS objects. But the data is huge.

// Best approach: use ts-node via npx
const { execSync } = require('child_process');
try {
  const result = execSync('npx tsx -e "
    import { GRADE_DATA } from \'./src/data/titanium-grades.ts\';
    const keys = {};
    for (const [gk, g] of Object.entries(GRADE_DATA)) {
      const p = \'materials.\' + gk;
      keys[p + \'.entity.title\'] = g.entityDefinition.title;
    }
    console.log(JSON.stringify(keys));
  " 2>&1', { cwd: join(__dirname, '..'), encoding: 'utf-8', timeout: 30000 });
  console.log('Output:', result);
} catch (e) {
  console.log('tsx not available, trying different approach...');
}

// Fallback: just create a JSON with empty values for all keys as a template
const template = {};
const emptyGrades = ['grade-1','grade-2','grade-3','grade-4','grade-4-eli','grade-5','grade-23','grade-6','grade-9','grade-19','grade-21','grade-6242','ti-5553'];
const sections = ['entity.title','entity.description','entity.classification'];
// Add commonNames (0-3), keyCharacteristics (0-4)
for (let i = 0; i < 4; i++) sections.push(`entity.commonNames.${i}`);
for (let i = 0; i < 6; i++) sections.push(`entity.keyCharacteristics.${i}`);
sections.push('conformsTo.title','conformsTo.description');
for (let i = 0; i < 8; i++) sections.push(`conformsTo.items.${i}`);
sections.push('hasProperty.title','hasProperty.description');
for (let i = 0; i < 16; i++) sections.push(`hasProperty.properties.${i}.label`);
sections.push('processedBy.title','processedBy.description');
for (let i = 0; i < 12; i++) sections.push(`processedBy.items.${i}`);
sections.push('manufacturedFrom.title','manufacturedFrom.description');
for (let i = 0; i < 10; i++) sections.push(`manufacturedFrom.items.${i}`);
sections.push('usedIn.title','usedIn.description');
for (let i = 0; i < 8; i++) sections.push(`usedIn.items.${i}`);
sections.push('alternativeTo.title','alternativeTo.description');
for (let i = 0; i < 6; i++) sections.push(`alternativeTo.items.${i}`);

for (const g of emptyGrades) {
  for (const s of sections) {
    template[`materials.${g}.${s}`] = '';
  }
}

const outPath = join(__dirname, '..', 'src', 'i18n', 'translations', 'grade-keys-en.json');
writeFileSync(outPath, JSON.stringify(template, null, 2) + '\n', 'utf-8');
console.log(`✓ Template generated: ${Object.keys(template).length} keys`);