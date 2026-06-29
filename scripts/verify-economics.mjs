import fs from 'fs';

const ja = fs.readFileSync('src/i18n/translations/ja.json', 'utf-8');
const es = fs.readFileSync('src/i18n/translations/es.json', 'utf-8');

try { JSON.parse(ja); console.log('ja: VALID'); } catch(e) { console.log('ja: INVALID - ' + e.message); }
try { JSON.parse(es); console.log('es: VALID'); } catch(e) { console.log('es: INVALID - ' + e.message); }

const c = fs.readFileSync('src/components/services/AdditiveEconomicsPillars.astro', 'utf-8');
console.log('Component has t() badge: ' + c.includes("t('services.additiveeconomicspillars.badge'"));
console.log('Component has dynamic title: ' + c.includes("'.title'"));
console.log('ja has badge key: ' + ja.includes('services.additiveeconomicspillars.badge'));
console.log('ja has subtitle key: ' + ja.includes('services.additiveeconomicspillars.subtitle'));
console.log('ja has 0.title key: ' + ja.includes('services.additiveeconomicspillars.0.title'));
console.log('ja has 2.highlight3 key: ' + ja.includes('services.additiveeconomicspillars.2.highlight3'));