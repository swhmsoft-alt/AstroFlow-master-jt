import fs from 'fs';

const langFiles = ['de.json', 'fr.json', 'es.json', 'pt.json', 'ko.json', 'nl.json', 'pl.json', 'it.json'];

const listKeys = {
  'equipment.list.hero.title': 'CNC Manufacturing Equipment Inventory',
  'equipment.list.hero.highlight': 'Complete Equipment Specification Sheets',
  'equipment.list.hero.badge': 'Manufacturing Equipment Specification Sheet',
  'equipment.list.hero.subtitle': 'Comprehensive equipment specification sheets for our complete titanium CNC manufacturing facility — from 5-axis machining centers and multi-tasking turn-mill machines to CMM inspection, heat treatment, and automated pallet systems.',
  'equipment.list.column.equipment': 'Equipment',
  'equipment.list.column.category': 'Category',
  'equipment.list.column.specification': 'Key Specification',
  'equipment.list.column.details': 'Details',
  'equipment.list.viewSpecs': 'View Specs',
  'equipment.list.note': 'Click "View Specs" for detailed equipment specifications, standards, applications, and alternatives.'
};

langFiles.forEach(file => {
  const path = `./src/i18n/translations/${file}`;
  let data = JSON.parse(fs.readFileSync(path, 'utf8'));
  Object.keys(listKeys).forEach(k => {
    if (!(k in data)) {
      data[k] = listKeys[k];
    }
  });
  fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
  console.log(`${file}: added missing list keys`);
});
console.log('Done!');