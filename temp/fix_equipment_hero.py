import json, os

td = 'src/i18n/translations'

updates = {
    'equipment.list.hero.title': 'CNC Manufacturing Equipment',
    'equipment.list.hero.highlight': 'Specification Sheets',
}

for lang in ['en','de','ja','fr','es','pt','it','ko','nl','pl']:
    fp = os.path.join(td, lang + '.json')
    data = json.load(open(fp, 'r', encoding='utf-8'))
    for k, v in updates.items():
        data[k] = v
    json.dump(data, open(fp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('Updated all language files')
