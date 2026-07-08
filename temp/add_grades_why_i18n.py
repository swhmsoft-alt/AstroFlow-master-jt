import json, os, re

td = 'src/i18n/translations'
with open('src/data/titanium-grades.ts','r',encoding='utf-8') as f:
    c = f.read()
d = c.find('export const GRADE_DATA')

# Extract each grade entry's whyChooseUs
grades = ['grade-1','grade-2','grade-3','grade-4','grade-4-eli','grade-5','grade-6','grade-9','grade-19','grade-21','grade-23','grade-6242','ti-5553']

keys = {}
for g in grades:
    i = c.find(f'"{g}"', d)
    if i == -1:
        print(f'{g}: NOT FOUND')
        continue
    j = c.find('\n  "', i+len(g)+5)
    section = c[i:j]
    m = re.search(r'whyChooseUs:\s*"((?:[^"\\]|\\.)*)"', section)
    if m:
        text = m.group(1)
        k = f'materials.grades.{g}.whyChooseUs'
        keys[k] = text
        print(f'{g}: extracted ({len(text)} chars)')
    else:
        print(f'{g}: whyChooseUs not found')

print(f'\nTotal: {len(keys)} keys')

# Add to en.json
fp = os.path.join(td, 'en.json')
with open(fp, 'r', encoding='utf-8') as f:
    en = json.load(f)
en.update(keys)
with open(fp, 'w', encoding='utf-8') as f:
    json.dump(en, f, ensure_ascii=False, indent=2)
print('Added to en.json')

# Add to all language files
for fname in ['de.json','ja.json','fr.json','es.json','pt.json','it.json','ko.json','nl.json','pl.json']:
    fp = os.path.join(td, fname)
    data = json.load(open(fp, 'r', encoding='utf-8'))
    for k in keys:
        if k not in data:
            data[k] = keys[k]
    json.dump(data, open(fp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f'{fname}: added keys')
print('Done!')
