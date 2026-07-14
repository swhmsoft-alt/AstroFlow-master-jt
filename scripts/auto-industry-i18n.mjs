import fs from 'fs';
const COMP_DIR = 'c:/Users/Administrator/Desktop/AstroFlow-master-jt/src/components/industries';
const EN_FILE = 'c:/Users/Administrator/Desktop/AstroFlow-master-jt/src/i18n/translations/en.json';

const SECTION_MAP = {
  'aioptoelectronicsection': 'optoelectronic',
  'ailiquidcoolingsection': 'liquidcooling',
  'aimetrologysection': 'metrology',
  'aicompliancesection': 'compliance',
  'marinesubseasection': 'subsea',
  'marinecorrosionsection': 'corrosion',
  'marinevalidationsection': 'validation',
  'marinecompliancesection': 'compliance',
  'semiuhvsection': 'uhv',
  'semimicrodrillsection': 'microdrill',
  'semicleanroomsection': 'cleanroom',
  'semicompliancesection': 'compliance',
  'energyhydrogensection': 'hydrogen',
  'energynuclearsection': 'nuclear',
  'energyfatiguesection': 'fatigue',
  'energycompliancesection': 'compliance',
  'indeqsonotrodesection': 'sonotrode',
  'indeqflowcontrolsection': 'flowcontrol',
  'indeqstressreliefsection': 'stressrelief',
  'indeqcompliancesection': 'compliance',
};

const DIR_MAP = { 'ai':'ai-infrastructure', 'marine':'marine', 'semi':'semiconductor', 'energy':'energy', 'indeq':'industrial-equipment' };
const prefix = process.argv[2];
const p = prefix;
const dir = DIR_MAP[prefix];
const en = JSON.parse(fs.readFileSync(EN_FILE, 'utf8'));
const compDir = COMP_DIR + '/' + dir;
const files = fs.readdirSync(compDir).filter(f => f.endsWith('.astro'));
let totalKeys = 0;

for (const file of files) {
  const fp = compDir + '/' + file;
  let content = fs.readFileSync(fp, 'utf8');
  const baseName = file.replace('.astro', '').toLowerCase();
  const section = SECTION_MAP[baseName] || baseName;
  if (section === 'cta') continue;

  // Badge text
  const badgeM = content.match(/<svg[^>]*>[\s\S]*?<\/svg>\s*\n\s+([A-Z][A-Za-z0-9\s,/&;()-]{5,80})\s*\n/);
  if (badgeM) {
    const key = 'industries.' + p + '.' + section + '.badge';
    if (!en[key]) { en[key] = badgeM[1].trim(); totalKeys++; }
    content = content.replace(badgeM[1].trim(), "{t('" + key + "')}");
  }

  // Span title
  const spM = content.match(/<span style="color: var\(--theme-primary\);">([^<]+)<\/span>/);
  if (spM) {
    const key = 'industries.' + p + '.' + section + '.title.main';
    if (!en[key]) { en[key] = spM[1].trim(); totalKeys++; }
    content = content.replace(spM[0], "<span style=\"color: var(--theme-primary);\">{t('" + key + "')}</span>");
  }

  // Description paragraph
  const descM = content.match(/<p class="text-xl[^"]*"[^>]*>\s*\n\s+([^<]{20,500}?)\s*\n\s+<\/p>/);
  if (descM && !content.includes("{t('industries.")) {
    const key = 'industries.' + p + '.' + section + '.desc';
    const v = descM[1].replace(/&amp;/g, '&').replace(/&#x2014;/g, '—').trim();
    if (!en[key]) { en[key] = v; totalKeys++; }
    content = content.replace(descM[1].trim(), "{t('" + key + "')}");
  }

  // Add t() import
  if (!content.includes("import { getLangFromUrl")) {
    content = content.replace('---\n', "---\nimport { getLangFromUrl, useTranslations } from '../../../i18n/utils';\nconst lang = getLangFromUrl(Astro.url);\nconst t = useTranslations(lang);\n");
  }

  fs.writeFileSync(fp, content, 'utf8');
  console.log('  ' + file);
}

const sorted = {};
Object.keys(en).sort().forEach(k => { sorted[k] = en[k]; });
fs.writeFileSync(EN_FILE, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
console.log('\n' + prefix + ': ' + totalKeys + ' new keys added');
