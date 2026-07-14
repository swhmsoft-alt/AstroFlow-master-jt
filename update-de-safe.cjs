const fs = require('fs');
const path = 'src/i18n/translations/de.json';

// Step 1: Verify original file is valid JSON
const original = fs.readFileSync(path, 'utf8');
try {
  JSON.parse(original);
  console.log('ORIGINAL FILE: VALID JSON');
} catch(e) {
  console.log('ORIGINAL FILE: INVALID -', e.message.substring(0, 100));
  process.exit(1);
}

// Step 2: Find the exact lines containing the keys
const lines = original.split('\n');
let found = 0;
const replacements = {
  'industries.uav.lightweight.card1.title': '"industries.uav.lightweight.card1.title": "Dünnwandtaschenfräsen &amp; Gewichtsreduktion"',
  'industries.uav.lightweight.card1.subtitle': '"industries.uav.lightweight.card1.subtitle": "5-Achsen-CNC · Grade 5 Ti-6Al-4V · 0,5 mm Wände"',
  'industries.uav.lightweight.card1.desc': '"industries.uav.lightweight.card1.desc": "UAV-Nutzlastkomponenten erfordern das höchste Festigkeits-Gewichts-Verhältnis. Unsere 5-Achsen-Fräszentren führen tiefe Dünnwandtaschenstrategien in Grade 5 Titan aus – entfernen über 35 % des Rohmaterialgewichts unter Beibehaltung der strukturellen Integrität. Adaptive trochoidale Werkzeugbahnen gewährleisten stabiles Fräsen bei Wandstärken bis zu 0,5 mm und verhindern Rattern sowie Kaltverfestigung an dünnen Merkmalen."'
};

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (const [key, replacement] of Object.entries(replacements)) {
    if (line.includes('"' + key + '"')) {
      console.log(`Line ${i+1}: Found "${key}"`);
      console.log(`  OLD: ${line.trim().substring(0, 80)}...`);
      console.log(`  NEW: ${replacement.substring(0, 80)}...`);
      lines[i] = '  ' + replacement + ',';
      found++;
    }
  }
}

console.log(`\n${found} replacements found and applied`);

// Step 3: Verify the result is still valid JSON
const result = lines.join('\n');
try {
  JSON.parse(result);
  console.log('RESULT FILE: VALID JSON');
} catch(e) {
  console.log('RESULT FILE: INVALID -', e.message.substring(0, 200));
  process.exit(1);
}

// Step 4: Write back
fs.writeFileSync(path, result, 'utf8');
console.log('FILE WRITTEN SUCCESSFULLY');
