/**
 * Generate grade i18n keys for en.json
 * Reads the TS data file via simple text parsing
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'titanium-grades.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Strip TypeScript to make it valid JS for evaluation
// Remove import lines
content = content.replace(/^import .*$/gm, '');
// Remove export keyword
content = content.replace(/\bexport\b/g, '');
// Remove interface blocks
content = content.replace(/interface\s+\w+\s*\{[\s\S]*?^\}/gm, '');
// Remove type annotations
content = content.replace(/:\s*(string|number|boolean|string\[\]|GradeMap|GradeData|GradeSection|GradePropertiesSection|GradeProperty)\s*/g, ' ');
// Fix double spaces
content = content.replace(/  +/g, ' ');
// Fix  { { patterns  
content = content.replace(/\{\s*\{/g, '{');
content = content.replace(/\}\s*\}/g, '}');

try {
  eval(content);
  
  const keys = {};
  for (const [gk, g] of Object.entries(GRADE_DATA)) {
    const p = 'materials.' + gk;
    keys[p + '.entity.title'] = g.entityDefinition.title;
    keys[p + '.entity.description'] = g.entityDefinition.description;
    keys[p + '.entity.classification'] = g.entityDefinition.classification;
    g.entityDefinition.commonNames.forEach((v, i) => { keys[p + '.entity.commonNames.' + i] = v; });
    g.entityDefinition.keyCharacteristics.forEach((v, i) => { keys[p + '.entity.keyCharacteristics.' + i] = v; });
    keys[p + '.conformsTo.title'] = g.conformsTo.title;
    keys[p + '.conformsTo.description'] = g.conformsTo.description;
    g.conformsTo.items.forEach((v, i) => { keys[p + '.conformsTo.items.' + i] = v; });
    keys[p + '.hasProperty.title'] = g.hasProperty.title;
    keys[p + '.hasProperty.description'] = g.hasProperty.description;
    g.hasProperty.properties.forEach((v, i) => { keys[p + '.hasProperty.properties.' + i + '.label'] = v.label; });
    keys[p + '.processedBy.title'] = g.processedBy.title;
    keys[p + '.processedBy.description'] = g.processedBy.description;
    g.processedBy.items.forEach((v, i) => { keys[p + '.processedBy.items.' + i] = v; });
    keys[p + '.manufacturedFrom.title'] = g.manufacturedFrom.title;
    keys[p + '.manufacturedFrom.description'] = g.manufacturedFrom.description;
    g.manufacturedFrom.items.forEach((v, i) => { keys[p + '.manufacturedFrom.items.' + i] = v; });
    keys[p + '.usedIn.title'] = g.usedIn.title;
    keys[p + '.usedIn.description'] = g.usedIn.description;
    g.usedIn.items.forEach((v, i) => { keys[p + '.usedIn.items.' + i] = v; });
    keys[p + '.alternativeTo.title'] = g.alternativeTo.title;
    keys[p + '.alternativeTo.description'] = g.alternativeTo.description;
    g.alternativeTo.items.forEach((v, i) => { keys[p + '.alternativeTo.items.' + i] = v; });
  }
  
  const outPath = path.join(__dirname, '..', 'src', 'i18n', 'translations', 'grade-keys-en.json');
  fs.writeFileSync(outPath, JSON.stringify(keys, null, 2) + '\n', 'utf-8');
  console.log('✓ Generated ' + Object.keys(keys).length + ' keys → grade-keys-en.json');
} catch (e) {
  console.error('Parse error:', e.message);
  process.exit(1);
}