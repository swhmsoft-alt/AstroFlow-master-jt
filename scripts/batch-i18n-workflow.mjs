/**
 * batch-i18n-workflow.mjs
 *
 * Batch i18n internationalization workflow for ProcessSpectrum & KnowHow components.
 *
 * Usage:
 *   node scripts/batch-i18n-workflow.mjs --dry-run --file AdditiveProcessSpectrum.astro
 *   node scripts/batch-i18n-workflow.mjs --generate --batch 2
 *   node scripts/batch-i18n-workflow.mjs --patch --batch 2
 *   node scripts/batch-i18n-workflow.mjs --translate --lang de --batch 2
 *
 * Modes:
 *   --dry-run      Extract keys and print to console only (no file changes)
 *   --generate     Extract keys and append to en.json + de.json
 *   --patch        Modify .astro files to replace hardcoded text with t() calls
 *   --translate    Call DeepSeek to translate de.json keys
 *
 * Options:
 *   --file <name>  Single file to process (for dry-run testing)
 *   --batch <N>    Batch number 2-8 (uses predefined file lists)
 *   --lang <code>  Target language for translation (default: de)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const COMPONENTS_DIR = path.resolve(ROOT, 'src/components/services');
const TRANSLATIONS_DIR = path.resolve(ROOT, 'src/i18n/translations');

// ============================================================
// BATCH FILE LISTS
// ============================================================

const BATCHES = {
  2: [
    'AdditiveProcessSpectrum.astro',
    'CncProcessSpectrum.astro',
    'CustomComponentSpectrum.astro',
    'ExtrusionProcessSpectrum.astro',
    'FabProcessSpectrum.astro',
  ],
  3: [
    'ForgingProcessSpectrum.astro',
    'HeavyProcessSpectrum.astro',
    'LaserProcessSpectrum.astro',
    'MarkingProcessSpectrum.astro',
    'PackagingProcessSpectrum.astro',
  ],
  4: [
    'PassivationSpectrum.astro',
    'PrepProcessSpectrum.astro',
    'SurfaceProcessSpectrum.astro',
    'TexturingProcessSpectrum.astro',
    'TurnMillSpectrum.astro',
    'WeldingAssemblySpectrum.astro',
  ],
  5: [
    'AdditiveQualityKnowHow.astro',
    'BrittleGallingControlKnowHow.astro',
    'CamSimulationKnowHow.astro',
    'CustomComponentsKnowHow.astro',
    'DieGallingLubricationKnowHow.astro',
  ],
  6: [
    'GallingColorVariationKnowHow.astro',
    'GallingOsseointegrationKnowHow.astro',
    'HotFormingStressKnowHow.astro',
    'HybridPostProcessing.astro',
    'HydrogenEmbrittlementAcidControlKnowHow.astro',
  ],
  7: [
    'InterBatchRepeatability.astro',
    'MetallurgyDefectControl.astro',
    'MetallurgyGrainFlowKnowHow.astro',
    'OxideSlagMitigation.astro',
    'ReactiveWeldingKnowHow.astro',
  ],
  8: [
    'SizingHardeningTraceabilityKnowHow.astro',
    'SmearingEmbeddingControlKnowHow.astro',
    'SmearingWarehouseInterlockKnowHow.astro',
    'TaperStriationKnowHow.astro',
    'ThermalStressContrastKnowHow.astro',
    'TitaniumEngineeringKnowHow.astro',
    'TurnMillKnowHow.astro',
    'WireEdmKnowHow.astro',
  ],
};

// ============================================================
// COMPONENT TYPE DETECTION & KEY PREFIX
// ============================================================

/**
 * Detect whether a component is ProcessSpectrum or KnowHow type
 * by analyzing its data interface fields.
 * Returns 'processspectrum' | 'knowhow' | null
 */
function detectComponentType(content) {
  if (content.includes('problem:') && content.includes('solution:') && content.includes('details:')) {
    return 'knowhow';
  }
  if (content.includes('capabilities:') && (content.includes('title:') && content.includes('description:'))) {
    return 'processspectrum';
  }
  return null;
}

/**
 * Convert filename to key prefix (services.xxx format)
 * e.g. "CncProcessSpectrum.astro" → "services.cncprocessspectrum"
 */
function getKeyPrefix(filename) {
  const name = filename.replace(/\.astro$/i, '');
  return 'services.' + name.toLowerCase();
}

/**
 * Extract data array identifier name from component
 * e.g. "const processes: Process[] = [" → "processes"
 */
function getArrayName(content) {
  const match = content.match(/const\s+(\w+)\s*:\s*\w+\[\]\s*=\s*\[/);
  return match ? match[1] : null;
}

// ============================================================
// DATA EXTRACTION
// ============================================================

/**
 * Parse a .astro file and extract all data items from the main array.
 * Returns array of objects with extracted fields.
 */
function parseComponentData(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  const type = detectComponentType(content);

  // Find the array definition
  const arrayMatch = content.match(/const\s+\w+\s*:\s*\w+\[\]\s*=\s*\[([\s\S]*?)\];\s*\n\s*import/);
  if (!arrayMatch) {
    console.warn(`  ⚠️  Could not find data array in ${path.basename(filepath)}`);
    return null;
  }

  const arrayContent = arrayMatch[1];
  const items = parseArrayItems(arrayContent);
  return { type, items, arrayContent };
}

/**
 * Parse items from array content by tracking brace depth.
 */
function parseArrayItems(arrayContent) {
  const items = [];
  let depth = 0;
  let current = '';
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < arrayContent.length; i++) {
    const ch = arrayContent[i];

    if (inString) {
      current += ch;
      if (ch === '\\' && i + 1 < arrayContent.length) {
        current += arrayContent[++i];
      } else if (ch === stringChar) {
        inString = false;
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      stringChar = ch;
      current += ch;
      continue;
    }

    if (ch === '{') {
      depth++;
      if (depth === 1) {
        current = '';
      } else {
        current += ch;
      }
      continue;
    }

    if (ch === '}') {
      depth--;
      if (depth === 0) {
        const item = extractFields(current);
        if (item) items.push(item);
        current = '';
      } else {
        current += ch;
      }
      continue;
    }

    if (depth >= 1) {
      current += ch;
    }
  }

  return items;
}

/**
 * Extract individual fields from a single object string.
 */
function extractFields(objStr) {
  const item = {};
  const fields = ['title', 'subtitle', 'description', 'problem', 'solution', 'icon'];

  for (const field of fields) {
    const regex = new RegExp(`${field}:\\s*"((?:[^"\\\\]|\\\\.)*)"`);
    const match = objStr.match(regex);
    if (match) item[field] = match[1];
  }

  // Extract arrays: capabilities[] or details[]
  const capsMatch = objStr.match(/capabilities:\s*\[([\s\S]*?)\]/);
  if (capsMatch) {
    item.capabilities = [];
    const capRegex = /"((?:[^"\\\\]|\\\\.)*)"/g;
    let m;
    while ((m = capRegex.exec(capsMatch[1])) !== null) {
      item.capabilities.push(m[1]);
    }
  }

  const detailsMatch = objStr.match(/details:\s*\[([\s\S]*?)\]/);
  if (detailsMatch) {
    item.details = [];
    const detRegex = /"((?:[^"\\\\]|\\\\.)*)"/g;
    let m;
    while ((m = detRegex.exec(detailsMatch[1])) !== null) {
      item.details.push(m[1]);
    }
  }

  return Object.keys(item).length > 0 ? item : null;
}

// ============================================================
// KEY GENERATION
// ============================================================

/**
 * Generate EN keys from extracted data items.
 */
function generateKeys(filename, items) {
  const prefix = getKeyPrefix(filename);
  const keys = {};

  items.forEach((item, idx) => {
    const base = `${prefix}.${idx}`;

    if (item.title) keys[`${base}.title`] = item.title;
    if (item.subtitle) keys[`${base}.subtitle`] = item.subtitle;
    if (item.description) keys[`${base}.desc`] = item.description;
    if (item.problem) keys[`${base}.problem`] = item.problem;
    if (item.solution) keys[`${base}.solution`] = item.solution;

    if (item.capabilities) {
      item.capabilities.forEach((cap, ci) => {
        keys[`${base}.cap${ci}`] = cap;
      });
    }

    if (item.details) {
      item.details.forEach((detail, di) => {
        keys[`${base}.detail${di}`] = detail;
      });
    }
  });

  return keys;
}

/**
 * Generate component key-to-template mapping for later patching.
 */
function generatePatchMap(filename, items) {
  const prefix = getKeyPrefix(filename);
  const arrayName = getArrayName(fs.readFileSync(path.join(COMPONENTS_DIR, filename), 'utf-8'));
  if (!arrayName) return null;

  const patchMap = {};

  items.forEach((item, idx) => {
    const base = `${prefix}.${idx}`;

    // Simple string fields (those that can be looked up by index in template)
    const fields = [
      { name: 'title', isArray: false },
      { name: 'subtitle', isArray: false },
      { name: 'desc', isArray: false },
      { name: 'problem', isArray: false },
      { name: 'solution', isArray: false },
      { name: 'capabilities', isArray: true },
      { name: 'details', isArray: true },
    ];

    for (const field of fields) {
      if (item[field.name]) {
        if (field.isArray) {
          patchMap[`${field.name}`] = {
            type: 'array',
            count: item[field.name].length,
            tBase: `${base}.${field.name === 'capabilities' ? 'cap' : 'detail'}`,
          };
        } else {
          const originalValue = item[field.name];
          patchMap[originalValue] = {
            type: 'string',
            tCall: `t('${base}.${field.name}')`,
            field: field.name,
          };
        }
      }
    }
  });

  return patchMap;
}

// ============================================================
// DEEPSEEK TRANSLATION
// ============================================================

/**
 * German technical translation glossary for industry terms.
 */
const DE_GLOSSARY = {
  // Terms that should NOT be translated
  'Osseointegration': 'Osseointegration',
  'HIP': 'HIP',
  'SLM': 'SLM',
  'DMLS': 'DMLS',
  'DFM': 'DFM',
  'CAD': 'CAD',
  'CAM': 'CAM',
  'SPC': 'SPC',
  'CMM': 'CMM',
  'NDT': 'NDT',
  'OES': 'OES',
  'PMI': 'PMI',
  'MTR': 'MTR',
  'GD&T': 'GD&T',
  'CAPA': 'CAPA',
  'FAIR': 'FAIR',
  'FMEA': 'FMEA',
  'Cpk': 'Cpk',
  'Ra': 'Ra',
  'Rz': 'Rz',
  'Rq': 'Rq',
  'Rmax': 'Rmax',

  // Terms with specific German translations
  'Galling': 'Fressen',
  'Hydrogen Embrittlement': 'Wasserstoffversprödung',
  'Smearing': 'Verschmierung',
  'Embrittlement': 'Versprödung',
  'Passivation': 'Passivierung',
  'Anodizing': 'Eloxieren',
  'Pickling': 'Beizen',
  'Forging': 'Schmieden',
  'Extrusion': 'Strangpressen',
  'Sintering': 'Sintern',
  'Cytotoxicity': 'Zytotoxizität',
  'Traceability': 'Rückverfolgbarkeit',
  'Tolerance': 'Toleranz',
  'Fixture': 'Spannvorrichtung',
  'Workpiece': 'Werkstück',
  'Machining': 'Bearbeitung',
  'Heat treatment': 'Wärmebehandlung',
  'Surface finish': 'Oberflächengüte',
  'Thin-wall': 'Dünnwand',
  'Toolpath': 'Werkzeugbahn',
  'Cooling channel': 'Kühlkanal',
  'Layer thickness': 'Schichtdicke',
  'Build chamber': 'Baukammer',
  'Base plate': 'Bauplatte',
  'Support structure': 'Stützstruktur',
  'Weld pool': 'Schmelzbad',
  'Heat affected zone': 'Wärmeeinflusszone',
  'Stress relief': 'Spannungsarmglühen',
  'Hot Isostatic Pressing': 'Heißisostatisches Pressen',
  'Mechanical property': 'mechanische Eigenschaft',
  'Tensile strength': 'Zugfestigkeit',
  'Yield strength': 'Streckgrenze',
  'Elongation': 'Dehnung',
  'Fatigue resistance': 'Ermüdungsbeständigkeit',
  'Corrosion resistance': 'Korrosionsbeständigkeit',
  'Chemical composition': 'chemische Zusammensetzung',
  'Particle size': 'Partikelgröße',
  'Powder bed': 'Pulverbett',
  'Inert gas': 'Schutzgas',
  'Argon': 'Argon',
  'Vacuum': 'Vakuum',
  'Cleanroom': 'Reinraum',
  'Hardness': 'Härte',
  'Ductility': 'Duktilität',
  'Porosity': 'Porosität',
  'Inclusion': 'Einschluss',
  'Crack': 'Riss',
  'Delamination': 'Delamination',
  'Distortion': 'Verzug',
  'Warpage': 'Verwerfung',
  'Shrinkage': 'Schrumpfung',
  'Residual stress': 'Eigenspannung',
  'Thermal gradient': 'Temperaturgradient',
  'Solidification': 'Erstarrung',
  'Melting': 'Schmelzen',
  'Fusion': 'Verschmelzung',
};

/**
 * Translate JSON keys using DeepSeek API.
 * Returns object with translated key-value pairs.
 */
async function translateWithDeepSeek(keys, targetLang, glossary = DE_GLOSSARY) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.error('❌ Missing DEEPSEEK_API_KEY environment variable');
    console.error('   Set it with: set DEEPSEEK_API_KEY=your_key_here');
    process.exit(1);
  }

  const langNames = {
    de: 'German (Deutsch)',
    ja: 'Japanese',
    fr: 'French',
    es: 'Spanish',
    pt: 'Portuguese',
    it: 'Italian',
    ko: 'Korean',
    nl: 'Dutch',
    pl: 'Polish',
  };

  const langName = langNames[targetLang] || targetLang;

  // Build glossary prompt
  const glossaryEntries = Object.entries(glossary)
    .filter(([en, de]) => en !== de)
    .map(([en, de]) => `  "${en}" → "${de}"`)
    .join('\n');

  const systemPrompt = `You are a technical translator for industrial manufacturing and metallurgy.

Translate the following JSON key-value pairs into ${langName}. Follow these rules:
1. Keep ALL JSON keys unchanged (the part before the colon)
2. Translate ONLY the values (the part in quotes after the colon)
3. Keep the JSON structure intact - output ONLY valid JSON, no explanations
4. Use formal technical tone appropriate for B2B industrial engineering content
5. Do NOT translate measurement units (mm, µm, °C, MPa, %, etc.)
6. Do NOT translate standard numbers (ISO 9001, ASTM F136, AS9100D, etc.)
7. Do NOT translate material grades (Ti-6Al-4V, Grade 5, etc.)
8. Do NOT translate company/trademark names (Mastercam, ZEISS, Mitutoyo, etc.)

Technical glossary for ${langName} (use these translations for consistency):
${glossaryEntries}

Output ONLY the translated JSON object, no additional text.`;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify(keys, null, 2) },
        ],
        temperature: 0.3,
        max_tokens: 16000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`DeepSeek API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const translatedText = data.choices[0].message.content.trim();

    // Extract JSON from response - handle potential markdown wrapping
    let jsonStr = translatedText;
    const jsonMatch = translatedText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const translated = JSON.parse(jsonStr);
    return translated;
  } catch (error) {
    console.error(`  ⚠️  DeepSeek API call failed: ${error.message}`);
    console.error('  → Using English placeholders instead (marked with [MISSING_de])');
    const placeholder = {};
    for (const key of Object.keys(keys)) {
      placeholder[key] = `[MISSING_${targetLang}] ${keys[key]}`;
    }
    return placeholder;
  }
}

// ============================================================
// JSON FILE HELPERS
// ============================================================

/**
 * Read existing translation JSON file.
 */
function readTranslationFile(lang) {
  const filepath = path.join(TRANSLATIONS_DIR, `${lang}.json`);
  if (fs.existsSync(filepath)) {
    return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  }
  return {};
}

/**
 * Append keys to a translation JSON file. Does NOT overwrite existing keys.
 */
function appendToTranslationFile(lang, newKeys) {
  const filepath = path.join(TRANSLATIONS_DIR, `${lang}.json`);
  const existing = readTranslationFile(lang);
  let added = 0;

  for (const [key, value] of Object.entries(newKeys)) {
    if (!(key in existing)) {
      existing[key] = value;
      added++;
    }
  }

  fs.writeFileSync(filepath, JSON.stringify(existing, null, 2) + '\n', 'utf-8');
  return added;
}

// ============================================================
// COMPONENT PATCHING
// ============================================================

/**
 * Patch a single .astro file: replace hardcoded data items with t() calls.
 *
 * Strategy:
 *  1. Remove translatable string values from the data array (keep icon/structural)
 *  2. Replace template references {proc.title} with {t('key')} etc.
 *  3. Replace array field references {cap} / {detail} with t() calls
 */
function patchComponent(filepath, items) {
  const filename = path.basename(filepath);
  let content = fs.readFileSync(filepath, 'utf-8');
  const prefix = getKeyPrefix(filename);
  const type = detectComponentType(content);
  const arrayName = getArrayName(content);

  if (!arrayName) {
    console.error(`  ❌ Could not determine array name in ${filename}`);
    return false;
  }

  console.log(`  🛠  Patching ${filename} (type: ${type}, array: ${arrayName})`);

  // ── Step 1: Replace the data array ──
  // Find the array definition
  const arrayMatch = content.match(new RegExp(
    `const\\s+${arrayName}\\s*:\\s*\\w+\\[\\]\\s*=\\s*\\[([\\s\\S]*?)\\];\\s*\\n\\s*import`
  ));
  if (!arrayMatch) {
    console.error(`  ❌ Could not find data array for ${arrayName} in ${filename}`);
    return false;
  }

  const originalArrayContent = arrayMatch[1];

  // Build new array content — strip all translatable strings, keep icon and structure
  const newArrayParts = [];

  items.forEach((item, idx) => {
    const base = `${prefix}.${idx}`;
    const parts = [];

    if (type === 'processspectrum') {
      // ProcessSpectrum: title, subtitle, description, capabilities[], icon
      parts.push(`    title: "",`);
      // t() calls will be in template
      parts.push(`    subtitle: "",`);
      parts.push(`    description: "",`);
      if (item.capabilities) {
        parts.push(`    capabilities: [`);
        item.capabilities.forEach((_, ci) => {
          parts.push(`      "",`);
        });
        parts.push(`    ],`);
      }
    } else if (type === 'knowhow') {
      // KnowHow: title, problem, solution, details[], icon
      parts.push(`    title: "",`);
      parts.push(`    problem: "",`);
      parts.push(`    solution: "",`);
      if (item.details) {
        parts.push(`    details: [`);
        item.details.forEach((_, di) => {
          parts.push(`      "",`);
        });
        parts.push(`    ],`);
      }
    }

    // Preserve icon
    if (item.icon) {
      parts.push(`    icon: "${item.icon.replace(/"/g, '\\"')}",`);
    }

    newArrayParts.push(`  {\n${parts.join('\n')}\n  }`);
  });

  const newArrayStr = newArrayParts.join(',\n');
  const oldArrayStr = arrayMatch[0];

  // Find the exact array region end
  const arrayEndRegex = new RegExp(
    `const\\s+${arrayName}\\s*:\\s*\\w+\\[\\]\\s*=\\s*\\[[\\s\\S]*?\\];\\s*\\n\\s*import`
  );
  const replacement = `const ${arrayName}: ${type === 'processspectrum' ? 'AdditiveProcess' : 'EngineeringFocus'}[] = [\n${newArrayStr}\n];\nimport`;
  content = content.replace(arrayEndRegex, replacement);

  // ── Step 2: Replace template references ──
  // Pattern: {proc.title} → {t('services.xxx.0.title')}
  // Pattern: {proc.subtitle} → {t('services.xxx.0.subtitle')}
  // Pattern: {proc.description} → {t('services.xxx.0.desc')}
  // Pattern: {focus.title} → {t('services.xxx.0.title')}
  // Pattern: {focus.problem} → {t('services.xxx.0.problem')}
  // Pattern: {focus.solution} → {t('services.xxx.0.solution')}
  // Pattern: inside .map((item) => ...) -> need to replace with index-aware t()

  // For simple fields on the iteration variable, we need a smarter approach.
  // The template iterates with .map((proc) => ... or .map((focus) => ...
  // We need to track the loop variable and item index.

  // Strategy: wrap the .map() callback to pass index, then use t()
  // Replace {proc.title} with {t(`services.xxx.\${i}.title`)} where i is the index

  // First, add the t function import is already there, but let's make sure data fields are empty strings.
  // The approach: modify .map((item) => to .map((item, i) => for index
  // Then replace {item.title} with {t(`prefix.${i}.title`)}
  // Then replace {item.subtitle} with {t(`prefix.${i}.subtitle`)}
  // etc.
  // Then for capabilities: {cap} inside .map((cap, ci) => needs to become {t(`prefix.${i}.cap${ci}`)}

  // Dynamically detect the iteration variable from .map((xxx) => patterns
  // This handles different naming conventions across components
  const mapMatch = content.match(/\.map\(\((\w+)\)\s*=>/);
  const iterVar = mapMatch ? mapMatch[1] : 'proc';
  const iterVar2 = arrayName; // The array name is the direct reference variable

  // Add index parameter: .map((xxx) → .map((xxx, i)
  content = content.replace(
    new RegExp(`\\.map\\((${iterVar})\\)`),
    `.map(($1, i)`
  );

  // For capabilities inside .map((cap) → .map((cap, ci)
  content = content.replace(
    /\.map\(\(cap\)\s*=>/g,
    `.map((cap, ci) =>`
  );

  // For details inside .map((detail) → .map((detail, di)
  content = content.replace(
    /\.map\(\(detail\)\s*=>/g,
    `.map((detail, di) =>`
  );

  // Replace item references with t() calls using dynamic detection
  // First, find all unique field references like {xxx.title}, {xxx.problem} etc.
  const iterFieldRegex = new RegExp(`\\{${iterVar}\\.(\\w+)\\}`, 'g');
  let fieldMatch;
  const refsToReplace = new Set();
  while ((fieldMatch = iterFieldRegex.exec(content)) !== null) {
    refsToReplace.add(fieldMatch[1]);
  }

  // For each unique field reference, replace with t() call using the first item's key as template
  for (const field of refsToReplace) {
    // Determine the key suffix for this field
    // For capabilities/details arrays inside map, they're handled separately
    const keyMap = {
      'title': 'title',
      'subtitle': 'subtitle',
      'description': 'desc',
      'desc': 'desc',
      'problem': 'problem',
      'solution': 'solution',
    };

    const keySuffix = keyMap[field];
    if (!keySuffix) continue; // Skip fields like icon

    // Use the first item's prefix as the template base (the .${idx} part will be replaced with ${i})
    const base0 = `${prefix}.0`;
    const replacement = `{t(\`${base0.replace('.0', '.${i}')}.${keySuffix}\`)}`;
    const refRegex = new RegExp(`\\{${iterVar}\\.${field}\\}`, 'g');
    content = content.replace(refRegex, replacement);
  }

  // Handle capabilities array references
  if (items[0] && items[0].capabilities) {
    // Replace {cap} with dynamic t() call
    const base0 = `${prefix}.0`;
    content = content.replace(
      /\{cap\}/g,
      `{t(\`${base0.replace('.0', '.${i}')}.cap${ci}\`)}`
    );
  }

  // Handle details array references
  if (items[0] && items[0].details) {
    const base0 = `${prefix}.0`;
    content = content.replace(
      /\{detail\}/g,
      `{t(\`${base0.replace('.0', '.${i}')}.detail${di}\`)}`
    );
  }

  // ── Step 3: Handle item[0]/item[1] special patterns ──
  // Pattern: {processes[0].title} → {t('services.xxx.0.title')}
  items.forEach((item, idx) => {
    const base = `${prefix}.${idx}`;
    const keyMap = {
      'title': 'title',
      'subtitle': 'subtitle',
      'description': 'desc',
      'problem': 'problem',
      'solution': 'solution',
    };

    for (const [field, keySuffix] of Object.entries(keyMap)) {
      // Check if this field exists in any item (we use items[0] as reference since all items have same structure)
      if (items[0][field]) {
        const directRefRegex = new RegExp(`\\{${iterVar2}\\[${idx}\\]\\.${field}\\}`, 'g');
        content = content.replace(directRefRegex, `{t('${base}.${keySuffix}')}`);
      }
    }

    // Handle capabilities for direct references like {processes[0].capabilities[0]}
    if (items[0].capabilities) {
      items[0].capabilities.forEach((_, ci) => {
        const directCapRegex = new RegExp(`\\{${iterVar2}\\[${idx}\\]\\.capabilities\\[${ci}\\]\\}`, 'g');
        content = content.replace(directCapRegex, `{t('${base}.cap${ci}')}`);
      });
    }
  });

  // Write patched file
  fs.writeFileSync(filepath, content, 'utf-8');
  console.log(`  ✅ ${filename} patched successfully`);
  return true;
}

/**
 * Process a single file: generate the replacement map for t() calls.
 */
function analyzeComponentPatches(filepath, items) {
  const filename = path.basename(filepath);
  const content = fs.readFileSync(filepath, 'utf-8');
  const prefix = getKeyPrefix(filename);
  const lines = content.split('\n');

  // Find the array definition lines (between 'const X = [' and '];')
  let arrayStartLine = -1;
  let arrayEndLine = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/const\s+\w+\s*:\s*\w+\[\]\s*=\s*\[/)) {
      arrayStartLine = i;
    }
    if (arrayStartLine >= 0 && lines[i].trim() === '];' && i > arrayStartLine) {
      arrayEndLine = i;
      break;
    }
  }

  return {
    filename,
    prefix,
    arrayStartLine,
    arrayEndLine,
    itemCount: items.length,
    items,
  };
}

// ============================================================
// REPORTING
// ============================================================

function printBatchReport(results) {
  console.log('\n' + '='.repeat(70));
  console.log('📊 BATCH EXTRACTION REPORT');
  console.log('='.repeat(70));

  let totalKeys = 0;
  let totalItems = 0;

  for (const result of results) {
    const keys = result.keys;
    totalKeys += Object.keys(keys).length;
    totalItems += result.items.length;

    console.log(`\n📄 ${result.filename} (${result.type})`);
    console.log(`   Items: ${result.items.length}`);
    console.log(`   Keys generated: ${Object.keys(keys).length}`);
    console.log(`   Key prefix: ${result.prefix}`);

    // Show first item's keys as sample
    const sampleKeys = Object.keys(keys).filter(k => k.startsWith(`${result.prefix}.0`));
    console.log(`   Sample keys (item 0):`);
    for (const sk of sampleKeys.slice(0, 4)) {
      console.log(`     ${sk}: "${keys[sk]}"`);
    }
    if (sampleKeys.length > 4) {
      console.log(`     ... and ${sampleKeys.length - 4} more`);
    }
  }

  console.log('\n' + '-'.repeat(70));
  console.log(`📈 Total components: ${results.length}`);
  console.log(`📈 Total data items: ${totalItems}`);
  console.log(`📈 Total keys: ${totalKeys}`);
  console.log('='.repeat(70));
}

// ============================================================
// MAIN
// ============================================================

function usage() {
  console.log(`
Usage: node scripts/batch-i18n-workflow.mjs [options]

Modes:
  --dry-run                       Extract keys and print report only (no file changes)
  --generate                      Extract keys and append to en.json + de.json
  --patch                         Modify .astro files to replace hardcoded text with t()
  --translate                     Translate de.json keys using DeepSeek

Options:
  --file <filename.astro>         Single file to process
  --batch <2-8>                   Batch number to process
  --lang <code>                   Target language for translation (default: de)
  --no-glossary                   Skip glossary in translation prompt

Examples:
  node scripts/batch-i18n-workflow.mjs --dry-run --file AdditiveProcessSpectrum.astro
  node scripts/batch-i18n-workflow.mjs --generate --batch 2
  node scripts/batch-i18n-workflow.mjs --patch --batch 2
  node scripts/batch-i18n-workflow.mjs --translate --lang de --batch 2
`);
}

async function main() {
  const args = process.argv.slice(2);

  const mode = args.includes('--dry-run') ? 'dry-run'
    : args.includes('--generate') ? 'generate'
    : args.includes('--patch') ? 'patch'
    : args.includes('--translate') ? 'translate'
    : 'help';

  if (mode === 'help') {
    usage();
    return;
  }

  // Determine files to process
  let files = [];

  const fileIdx = args.indexOf('--file');
  if (fileIdx >= 0 && fileIdx + 1 < args.length) {
    files = [args[fileIdx + 1]];
  }

  const batchIdx = args.indexOf('--batch');
  if (batchIdx >= 0 && batchIdx + 1 < args.length) {
    const batchNum = parseInt(args[batchIdx + 1]);
    if (BATCHES[batchNum]) {
      files = BATCHES[batchNum];
    } else {
      console.error(`❌ Invalid batch number: ${batchNum}. Valid: 2-8`);
      process.exit(1);
    }
  }

  if (files.length === 0) {
    console.error('❌ No files specified. Use --file or --batch.');
    usage();
    process.exit(1);
  }

  // Determine language for translate mode
  const langIdx = args.indexOf('--lang');
  const targetLang = langIdx >= 0 && langIdx + 1 < args.length ? args[langIdx + 1] : 'de';
  const useGlossary = !args.includes('--no-glossary');

  console.log(`\n🔧 Mode: ${mode}`);
  console.log(`📁 Files (${files.length}): ${files.join(', ')}`);
  if (mode === 'translate') console.log(`🌐 Target language: ${targetLang}`);

  const results = [];

  for (const file of files) {
    const filepath = path.join(COMPONENTS_DIR, file);

    if (!fs.existsSync(filepath)) {
      console.warn(`  ⚠️  File not found: ${file}`);
      continue;
    }

    console.log(`\n📄 Processing: ${file}`);

    const parsed = parseComponentData(filepath);
    if (!parsed || !parsed.items || parsed.items.length === 0) {
      console.warn(`  ⚠️  No data items found in ${file}`);
      continue;
    }

    const keys = generateKeys(file, parsed.items);
    const prefix = getKeyPrefix(file);

    results.push({
      filename: file,
      type: parsed.type,
      items: parsed.items,
      keys,
      prefix,
    });

    console.log(`  Type: ${parsed.type}`);
    console.log(`  Items: ${parsed.items.length}`);
    console.log(`  Keys: ${Object.keys(keys).length}`);
  }

  // === DRY-RUN: Just report ===
  if (mode === 'dry-run') {
    printBatchReport(results);

    // Output the full EN JSON keys
    console.log('\n\n=== EN.JSON KEYS TO ADD ===\n');
    for (const result of results) {
      console.log(`// ${result.filename}`);
      for (const [key, value] of Object.entries(result.keys)) {
        console.log(`  "${key}": "${value.replace(/"/g, '\\"')}",`);
      }
      console.log('');
    }

    // Output patch analysis
    console.log('\n=== COMPONENT PATCH ANALYSIS ===\n');
    for (const result of results) {
      console.log(`// ${result.filename}`);
      const filepath = path.join(COMPONENTS_DIR, result.filename);
      const analysis = analyzeComponentPatches(filepath, result.items);

      console.log(`// Array starts at line ${analysis.arrayStartLine + 1}, ends at line ${analysis.arrayEndLine + 1}`);
      console.log(`// Data array: ${analysis.itemCount} items`);
      console.log(`// Key prefix: ${analysis.prefix}`);

      // Per-item analysis
      result.items.forEach((item, idx) => {
        console.log(`// Item ${idx}:`);
        if (item.title) console.log(`//   {item.title} → {t('${analysis.prefix}.${idx}.title')}`);
        if (item.subtitle) console.log(`//   {item.subtitle} → {t('${analysis.prefix}.${idx}.subtitle')}`);
        if (item.description) console.log(`//   {item.description} → {t('${analysis.prefix}.${idx}.desc')}`);
        if (item.problem) console.log(`//   {item.problem} → {t('${analysis.prefix}.${idx}.problem')}`);
        if (item.solution) console.log(`//   {item.solution} → {t('${analysis.prefix}.${idx}.solution')}`);
        if (item.capabilities) {
          item.capabilities.forEach((_, ci) => {
            console.log(`//   {cap} (capabilities[${ci}]) → {t('${analysis.prefix}.${idx}.cap${ci}')}`);
          });
        }
        if (item.details) {
          item.details.forEach((_, di) => {
            console.log(`//   {detail} (details[${di}]) → {t('${analysis.prefix}.${idx}.detail${di}')}`);
          });
        }
      });
      console.log('');
    }

    return;
  }

  // === GENERATE: Append to en.json only ===
  // en is the root language — it must be manually written/verified.
  // de.json is manually authored; other languages are script-translated.
  if (mode === 'generate') {
    // Collect all new keys
    const allNewEnKeys = {};
    for (const result of results) {
      Object.assign(allNewEnKeys, result.keys);
    }

    const enAdded = appendToTranslationFile('en', allNewEnKeys);
    console.log(`\n✅ en.json: ${enAdded} keys added (EN — root language)`);
    console.log('   ⚠️  de.json NOT auto-generated. German translation must be authored manually.');
    console.log('\nDone! Please review the added keys before patching components.');
    return;
  }

  // === PATCH: Modify .astro files ===
  if (mode === 'patch') {
    for (const result of results) {
      const filepath = path.join(COMPONENTS_DIR, result.filename);
      patchComponent(filepath, result.items);
    }
    console.log('\n✅ Patching complete.');
  }

  // === TRANSLATE: Translate de.json using DeepSeek ===
  if (mode === 'translate') {
    const allNewKeys = {};
    for (const result of results) {
      Object.assign(allNewKeys, result.keys);
    }

    console.log(`\n🌐 Translating ${Object.keys(allNewKeys).length} keys to ${targetLang}...`);
    const translatedKeys = await translateWithDeepSeek(allNewKeys, targetLang, useGlossary ? DE_GLOSSARY : {});

    const added = appendToTranslationFile(targetLang, translatedKeys);
    console.log(`✅ ${targetLang}.json: ${added} keys added/updated`);
  }
}

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});