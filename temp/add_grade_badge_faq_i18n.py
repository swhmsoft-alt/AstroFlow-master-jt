import json, os, re

td = 'src/i18n/translations'

# Add badge keys
badge_keys = {
    'materials.grade.badges.entityDefinition': 'Entity Definition',
    'materials.grade.badges.classification': 'Classification',
    'materials.grade.badges.uns': 'UNS Number',
    'materials.grade.badges.commonNames': 'Common Names',
    'materials.grade.badges.keyCharacteristics': 'Key Characteristics',
    'materials.grade.badges.applicableStandards': 'Applicable Standards',
    'materials.grade.badges.materialProperties': 'Material Properties',
    'materials.grade.badges.processingMethods': 'Processing Methods',
    'materials.grade.badges.typicalProducts': 'Typical Products',
    'materials.grade.badges.industries': 'Industries',
    'materials.grade.badges.alternativeMaterials': 'Alternative Materials',
}

# Extract FAQ texts from grade data
with open('src/data/titanium-grades.ts','r',encoding='utf-8') as f:
    c = f.read()
d = c.find('export const GRADE_DATA')

grades = ['grade-1','grade-2','grade-3','grade-4','grade-4-eli','grade-5','grade-6',
          'grade-9','grade-19','grade-21','grade-23','grade-6242','ti-5553']

faq_keys = {}
for g in grades:
    i = c.find(f'"{g}"', d)
    j = c.find('\n  "', i+len(g)+5)
    section = c[i:j]
    # Find faqs array
    m = re.search(r'faqs:\s*\[(.+?)\]', section, re.DOTALL)
    if m:
        faqs_text = m.group(1)
        qs = re.findall(r'question:\s*"([^"]+)"', faqs_text)
        ans = re.findall(r'answer:\s*"([^"]+)"', faqs_text)
        for idx, (q, a) in enumerate(zip(qs, ans)):
            faq_keys[f'materials.grades.{g}.faq.{idx}.question'] = q
            faq_keys[f'materials.grades.{g}.faq.{idx}.answer'] = a

all_keys = {**badge_keys, **faq_keys}
print(f'Total keys: {len(all_keys)} (badges: {len(badge_keys)}, FAQ: {len(faq_keys)})')

# Add to en.json
fp = os.path.join(td, 'en.json')
with open(fp, 'r', encoding='utf-8') as f:
    en = json.load(f)
en.update(all_keys)
with open(fp, 'w', encoding='utf-8') as f:
    json.dump(en, f, ensure_ascii=False, indent=2)
print('Added to en.json')

# Add to all language files
for fname in ['de.json','ja.json','fr.json','es.json','pt.json','it.json','ko.json','nl.json','pl.json']:
    fp = os.path.join(td, fname)
    data = json.load(open(fp, 'r', encoding='utf-8'))
    for k in all_keys:
        if k not in data:
            data[k] = all_keys[k]
    json.dump(data, open(fp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f'{fname}: added keys')
print('Done!')
