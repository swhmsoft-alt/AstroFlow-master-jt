import json, os

td = 'src/i18n/translations'
en = json.load(open(f'{td}/en.json', 'r', encoding='utf-8'))

# The 4 new keys
keys = {
    'materials.standards.whyChooseUs.astm': en['materials.standards.whyChooseUs.astm'],
    'materials.standards.whyChooseUs.ams': en['materials.standards.whyChooseUs.ams'],
    'materials.standards.whyChooseUs.medical': en['materials.standards.whyChooseUs.medical'],
    'materials.standards.whyChooseUs.additive': en['materials.standards.whyChooseUs.additive'],
}

for fname in ['de.json', 'ja.json', 'fr.json', 'es.json', 'pt.json', 'it.json', 'ko.json', 'nl.json', 'pl.json']:
    fp = os.path.join(td, fname)
    data = json.load(open(fp, 'r', encoding='utf-8'))
    updated = False
    for k, v in keys.items():
        if k not in data or data[k] == v:
            data[k] = v
            updated = True
    json.dump(data, open(fp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    status = 'updated' if updated else 'already exists'
    print(f'{fname}: {status}')
print('Done!')
