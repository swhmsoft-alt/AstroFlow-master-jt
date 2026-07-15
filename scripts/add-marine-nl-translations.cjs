const fs = require('fs'), path = require('path');
const nlPath = path.join(__dirname, '..', 'src', 'i18n', 'translations', 'nl.json');
const nl = JSON.parse(fs.readFileSync(nlPath, 'utf8'));

const t = {
  "industries.marine.marinectasection.badge": "Start uw maritieme project",
  "industries.marine.marinectasection.title.main": "Maritieme en onderzeese titanium CNC-bewerking?",
  "industries.marine.page.description": "Precisie-CNC-bewerking voor onderzeese behuizingen van titanium Grade 2/12, maritieme bevestigingen en oceanografische sensorcomponenten.",
  "industries.marine.page.productCategory": "Maritieme componenten",
  "industries.marine.page.productName": "Onderzeese behuizingen, drukvatten, maritieme bevestigingen en klepblokken",
  "industries.marine.page.serviceCategory": "Maritieme techniek",
  "industries.marine.page.serviceName": "Maritieme en onderzeese titanium CNC-bewerkingsdiensten",
  "industries.marine.page.title": "Maritieme en onderzeese titanium CNC-bewerking | Anticorrosietechniek",
  "industries.marine.subsea.badge": "Onderzeese drukvatten",
  "industries.marine.subsea.title.main": "Meerassig CNC-frezen",
  "industries.marine.validation.badge": "Validatie en testen",
  "industries.marine.validation.title.main": "CMM dimensionale validatie",
};

let added = 0;
for (const [k, v] of Object.entries(t)) { if (!(k in nl)) { nl[k] = v; added++; } }
const sorted = {};
Object.keys(nl).sort().forEach(k => { sorted[k] = nl[k]; });
fs.writeFileSync(nlPath, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
console.log(`Added: ${added} keys, Total marine: ${Object.keys(sorted).filter(k => k.startsWith('industries.marine.')).length}`);
