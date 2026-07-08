import json, os

td = 'src/i18n/translations'
keys = {
    'blog.hero.title': 'Our',
    'blog.hero.highlight': 'Blog',
    'blog.hero.badge': 'Insights & Updates',
    'blog.hero.subtitle': 'Technical insights, manufacturing knowledge, and industry perspectives from the BOZE CNC Ti engineering team.',
    'blog.hero.description': 'Expert insights on CNC machining, titanium manufacturing, material science, and industry best practices. Stay informed with the latest from BOZE CNC Ti.',
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
