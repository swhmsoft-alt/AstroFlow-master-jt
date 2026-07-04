/**
 * Extract all translatable strings from titanium-grades.ts
 * and generate the i18n JSON keys for en.json (English source of truth).
 *
 * Reads the TS file and evaluates it to extract translatable text.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Instead of dynamic import (broken on Windows), we read the TS file
// and extract the grade keys from the literal object structure.
// The TS file exports GRADE_DATA as a const object, so we eval it.
const gradesPath = join(__dirname, '..', 'src', 'data', 'titanium-grades.ts');
let content = readFileSync(gradesPath, 'utf-8');

// Strip TypeScript type annotations and export to get plain JS
// Remove type imports and interfaces
content = content.replace(/import.*?;?\n/g, '');
// Remove export keyword before const
content = content.replace(/export (const|interface|type)/g, '$1');
// Remove type annotations like : string, : string[], etc.
content = content.replace(/:\s*(string|number|boolean|string\[\]|GradeData|GradeMap|GradeSection|GradePropertiesSection|GradeProperty)(\s*[=;,\)\]])/g, '$2');
// Remove type annotations on properties
content = content.replace(/:\s*(string|number|boolean)(?=\s*[,;\n\)\]])/g, '');
// Remove interface definitions
content = content.replace(/interface\s+\w+\s*\{[^}]*\}/g, '');

// Now evaluate and get GRADE_DATA
let GRADE_DATA;
try {
  // Wrap in a function to get the const
  const fn = new Function(`"use strict"; ${content}; return GRADE_DATA;`);
  GRADE_DATA = fn();
} catch (e) {
  console.error('Failed to evaluate:', e.message);
  process.exit(1);
}

const keys = {};

for (const [gradeKey, grade] of Object.entries(GRADE_DATA)) {
  const prefix = `materials.${gradeKey}`;

  // entityDefinition
  keys[`${prefix}.entity.title`] = grade.entityDefinition.title;
  keys[`${prefix}.entity.description`] = grade.entityDefinition.description;
  keys[`${prefix}.entity.classification`] = grade.entityDefinition.classification;
  grade.entityDefinition.commonNames.forEach((name, i) => {
    keys[`${prefix}.entity.commonNames.${i}`] = name;
  });
  grade.entityDefinition.keyCharacteristics.forEach((char, i) => {
    keys[`${prefix}.entity.keyCharacteristics.${i}`] = char;
  });

  // conformsTo
  keys[`${prefix}.conformsTo.title`] = grade.conformsTo.title;
  keys[`${prefix}.conformsTo.description`] = grade.conformsTo.description;
  grade.conformsTo.items.forEach((item, i) => {
    keys[`${prefix}.conformsTo.items.${i}`] = item;
  });

  // hasProperty
  keys[`${prefix}.hasProperty.title`] = grade.hasProperty.title;
  keys[`${prefix}.hasProperty.description`] = grade.hasProperty.description;
  grade.hasProperty.properties.forEach((prop, i) => {
    keys[`${prefix}.hasProperty.properties.${i}.label`] = prop.label;
  });

  // processedBy
  keys[`${prefix}.processedBy.title`] = grade.processedBy.title;
  keys[`${prefix}.processedBy.description`] = grade.processedBy.description;
  grade.processedBy.items.forEach((item, i) => {
    keys[`${prefix}.processedBy.items.${i}`] = item;
  });

  // manufacturedFrom
  keys[`${prefix}.manufacturedFrom.title`] = grade.manufacturedFrom.title;
  keys[`${prefix}.manufacturedFrom.description`] = grade.manufacturedFrom.description;
  grade.manufacturedFrom.items.forEach((item, i) => {
    keys[`${prefix}.manufacturedFrom.items.${i}`] = item;
  });

  // usedIn
  keys[`${prefix}.usedIn.title`] = grade.usedIn.title;
  keys[`${prefix}.usedIn.description`] = grade.usedIn.description;
  grade.usedIn.items.forEach((item, i) => {
    keys[`${prefix}.usedIn.items.${i}`] = item;
  });

  // alternativeTo
  keys[`${prefix}.alternativeTo.title`] = grade.alternativeTo.title;
  keys[`${prefix}.alternativeTo.description`] = grade.alternativeTo.description;
  grade.alternativeTo.items.forEach((item, i) => {
    keys[`${prefix}.alternativeTo.items.${i}`] = item;
  });
}

// Output as JSON
const outputPath = join(__dirname, '..', 'src', 'i18n', 'translations', 'grade-keys-en.json');
writeFileSync(outputPath, JSON.stringify(keys, null, 2) + '\n', 'utf-8');
console.log(`✓ Generated ${Object.keys(keys).length} translation keys → grade-keys-en.json`);

// Per-grade stats
const perGrade = {};
for (const key of Object.keys(keys)) {
  const grade = key.split('.')[1];
  perGrade[grade] = (perGrade[grade] || 0) + 1;
}
for (const [g, count] of Object.entries(perGrade)) {
  console.log(`  ${g}: ${count} keys`);
}