import fs from 'fs';

const en = fs.readFileSync('src/i18n/translations/en.json', 'utf-8');
const ja = fs.readFileSync('src/i18n/translations/ja.json', 'utf-8');

const tests = [
  'services.slmprocessbreakdown.badge',
  'services.slmprocessbreakdown.0.title',
  'services.slmprocessbreakdown.0.cap0',
  'services.slmprocessbreakdown.1.title',
  'services.slmprocessbreakdown.2.title',
  'services.slmmechanicaldashboard.badge',
  'services.slmmechanicaldashboard.metric0.label',
  'services.slmmechanicaldashboard.footnote',
  'services.metallurgydefectcontrol.badge',
  'services.metallurgydefectcontrol.0.title',
  'services.metallurgydefectcontrol.1.detail0',
];

tests.forEach(k => {
  console.log('en: ' + k + ' = ' + (en.includes(k) ? 'OK' : 'MISSING') + ' | ja: ' + k + ' = ' + (ja.includes(k) ? 'OK' : 'MISSING'));
});

const c1 = fs.readFileSync('src/components/services/SlmProcessBreakdown.astro', 'utf-8');
console.log('SlmProcessBreakdown badge t(): ' + c1.includes("t('services.slmprocessbreakdown.badge'"));
console.log('SlmProcessBreakdown dynamic title: ' + c1.includes("'.title'"));

const c2 = fs.readFileSync('src/components/services/SlmMechanicalDashboard.astro', 'utf-8');
console.log('SlmMechanicalDashboard badge t(): ' + c2.includes("t('services.slmmechanicaldashboard.badge'"));
console.log('SlmMechanicalDashboard dynamic label: ' + c2.includes("'.label'"));

const c3 = fs.readFileSync('src/components/services/MetallurgyDefectControl.astro', 'utf-8');
console.log('MetallurgyDefectControl badge t(): ' + c3.includes("t('services.metallurgydefectcontrol.badge'"));
console.log('MetallurgyDefectControl dynamic title: ' + c3.includes("'.title'"));

// Check JSON validity
try {
  JSON.parse(en);
  console.log('en.json: VALID');
} catch(e) { console.log('en.json: INVALID - ' + e.message); }
try {
  JSON.parse(ja);
  console.log('ja.json: VALID');
} catch(e) { console.log('ja.json: INVALID - ' + e.message); }