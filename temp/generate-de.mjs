/**
 * Generate German (de) translation block from temp/en-keys.json
 * Usage: node temp/generate-de.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const enPath = path.resolve(__dirname, 'en-keys.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
const keys = Object.keys(en);

// ── Translation rules ──────────────────────────────────────────
// Pattern-based replacements (applied in order)
const patterns = [
  // Submit patterns
  [/^Submit for /, 'Einreichen für '],
  [/^Submit Your /, 'Ihre '],
  [/^Submit /, 'Einreichen: '],

  // Dashboard patterns
  [/Specifications Dashboard/g, 'Spezifikationen-Dashboard'],
  [/\bMachine Dashboard\b/g, 'Maschinen-Dashboard'],
  [/\bPerformance Dashboard\b/g, 'Leistungs-Dashboard'],
  [/\bCapacity Dashboard\b/g, 'Kapazitäts-Dashboard'],
  [/\bThroughput Dashboard\b/g, 'Durchsatz-Dashboard'],
  [/\bDashboard\b/g, 'Dashboard'],

  // Common terms
  [/\bReview\b/g, 'Prüfung'],
  [/\bEvaluation\b/g, 'Bewertung'],
  [/\bAssessment\b/g, 'Bewertung'],
  [/\bUpload\b/g, 'Hochladen'],
  [/\bQuote\b/g, 'Angebot'],
  [/\bChallenge\b/g, 'Herausforderung'],
  [/\bSolution\b/g, 'Lösung'],
  [/\bKnow-How\b/g, 'Know-how'],
  [/\bEngineering\b/g, 'Technik'],
  [/\bQuality\b/g, 'Qualität'],
  [/\bService[s]?\b/g, 'Dienstleistungen'],
  [/\bSupport\b/g, 'Support'],
  [/\bLearn more\b/g, 'Mehr erfahren'],
  [/\bRead More\b/g, 'Weiterlesen'],
  [/\bContact\b/g, 'Kontakt'],
  [/\bHome\b/g, 'Startseite'],
  [/\bProducts\b/g, 'Produkte'],
  [/\bMaterials\b/g, 'Materialien'],
  [/\bResources\b/g, 'Ressourcen'],
  [/\bCapabilities\b/g, 'Fähigkeiten'],
  [/\bIndustries\b/g, 'Branchen'],
  [/\bApplications\b/g, 'Anwendungen'],
  [/\bSpecifications\b/g, 'Spezifikationen'],
  [/\bCertifications?\b/g, 'Zertifizierung'],
  [/\bTraceability\b/g, 'Rückverfolgbarkeit'],
  [/\bInspection\b/g, 'Prüfung'],
  [/\bTesting\b/g, 'Testen'],
  [/\bFabrication\b/g, 'Fertigung'],
  [/\bMachining\b/g, 'Bearbeitung'],
  [/\bManufacturing\b/g, 'Fertigung'],
  [/\bPrecision\b/g, 'Präzision'],
  [/\bCustom\b/g, 'Kundenspezifisch'],
  [/\bSolutions?\b/g, 'Lösungen'],
  [/\bFeatures\b/g, 'Funktionen'],
  [/\bDocumentation\b/g, 'Dokumentation'],
  [/\bDownload\b/g, 'Herunterladen'],
  [/\bSearch\b/g, 'Suche'],
  [/\bSubscribe\b/g, 'Abonnieren'],
  [/\bPrivacy Policy\b/g, 'Datenschutzrichtlinie'],
  [/\bTerms of Service\b/g, 'Nutzungsbedingungen'],
  [/\bCookie Policy\b/g, 'Cookie-Richtlinie'],
  [/\bBack to\b/g, 'Zurück zu'],
  [/\bView All\b/g, 'Alle anzeigen'],
  [/\bView Details\b/g, 'Details anzeigen'],
  [/\bFeatured\b/g, 'Empfohlen'],
  [/\bExplore\b/g, 'Erkunden'],
  [/\bGet Started\b/g, 'Loslegen'],
  [/\bServices\b/g, 'Dienstleistungen'],
  [/\bNewsletter\b/g, 'Newsletter'],
];

/**
 * Translate a string using pattern-based rules + fallback
 */
function translate(enText) {
  let t = enText;
  for (const [pattern, replacement] of patterns) {
    t = t.replace(pattern, replacement);
  }
  return t;
}

// ── Group keys by prefix ───────────────────────────────────────
const groups = {};
for (const k of keys) {
  const prefix = k.split('.')[0];
  if (!groups[prefix]) groups[prefix] = [];
  groups[prefix].push(k);
}

// ── Generate block ─────────────────────────────────────────────
let block = '\n  de: {\n';

const sortedPrefixes = Object.keys(groups).sort();
for (const prefix of sortedPrefixes) {
  const groupKeys = groups[prefix];
  block += `\n    /* ── ${prefix} ── */\n`;
  for (const k of groupKeys) {
    const enText = en[k];
    const deText = translate(enText);
    // Escape single quotes
    const escaped = deText.replace(/'/g, "\\'");
    block += `    '${k}': '${escaped}',\n`;
  }
}

block += '\n  },\n';

// ── Write output ───────────────────────────────────────────────
const outPath = path.resolve(__dirname, 'de-block.txt');
fs.writeFileSync(outPath, block, 'utf-8');

console.log(`✅ Generated German translations for ${keys.length} keys → temp/de-block.txt`);
console.log(`   Block size: ${(Buffer.byteLength(block) / 1024).toFixed(1)} KB`);