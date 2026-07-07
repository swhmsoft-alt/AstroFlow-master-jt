import json, os

lang_files = ['de.json', 'es.json', 'fr.json', 'it.json', 'ja.json', 'ko.json', 'nl.json', 'pl.json', 'pt.json']
td = 'src/i18n/translations'
keys = {
    'materials.grade.whyChooseTitle': 'Why Choose Us for This Grade',
    'materials.grade.faqSubtitle': 'Common questions from engineers about this titanium grade and our precision machining capabilities.',
}

for fname in lang_files:
    fp = os.path.join(td, fname)
    with open(fp, 'r', encoding='utf-8') as f:
        data = json.load(f)
    data.update(keys)
    with open(fp, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'{fname}: OK')
print('Done!')
