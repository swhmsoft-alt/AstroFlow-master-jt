import fs from 'fs';

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

const jaKeys = {
  'equipment.list.hero.title': 'CNC加工設備一覧',
  'equipment.list.hero.highlight': '全設備仕様書',
  'equipment.list.hero.badge': '製造設備仕様書',
  'equipment.list.hero.subtitle': '5軸マシニングセンタ、複合旋盤、CMM測定機、熱処理炉、自動パレットシステムまで、チタンCNC加工施設の全設備仕様書を網羅しています。',
  'equipment.list.column.equipment': '設備名',
  'equipment.list.column.category': 'カテゴリ',
  'equipment.list.column.specification': '主要仕様',
  'equipment.list.column.details': '詳細',
  'equipment.list.viewSpecs': '仕様を見る',
  'equipment.list.note': '「仕様を見る」をクリックして、詳細な設備仕様、規格、用途、代替案をご確認ください。'
};

// Update en.json
let en = JSON.parse(fs.readFileSync('./src/i18n/translations/en.json', 'utf8'));
Object.keys(listKeys).forEach(k => { en[k] = listKeys[k]; });
fs.writeFileSync('./src/i18n/translations/en.json', JSON.stringify(en, null, 2), 'utf8');
console.log('en.json updated with', Object.keys(listKeys).length, 'list keys');

// Update ja.json
let ja = JSON.parse(fs.readFileSync('./src/i18n/translations/ja.json', 'utf8'));
Object.keys(jaKeys).forEach(k => { ja[k] = jaKeys[k]; });
fs.writeFileSync('./src/i18n/translations/ja.json', JSON.stringify(ja, null, 2), 'utf8');
console.log('ja.json updated with', Object.keys(jaKeys).length, 'list keys');