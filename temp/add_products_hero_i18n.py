import json, os

td = 'src/i18n/translations'
keys = {
    'products.hero.title': 'Precision',
    'products.hero.highlight': 'Products',
    'products.hero.badge': 'Manufacturing Catalog',
    'products.hero.subtitle': 'Browse our catalog of precision machined titanium components, from standard parts to custom-engineered solutions.',
    'products.hero.description': 'Browse our catalog of precision CNC machined titanium components. Custom manufacturing available for aerospace, medical, and industrial applications.',
}

for fname in ['en.json','de.json','ja.json','fr.json','es.json','pt.json','it.json','ko.json','nl.json','pl.json']:
    fp = os.path.join(td, fname)
    data = json.load(open(fp, 'r', encoding='utf-8'))
    for k, v in keys.items():
        if k not in data:
            data[k] = v
    json.dump(data, open(fp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f'{fname}: done')
print('Done!')
