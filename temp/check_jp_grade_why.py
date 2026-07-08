import json
td = 'src/i18n/translations'
ja = json.load(open(td + '/ja.json', 'r', encoding='utf-8'))
en = json.load(open(td + '/en.json', 'r', encoding='utf-8'))
keys = [k for k in en if k.startswith('materials.grades.') and k.endswith('whyChooseUs')]
all_ok = True
for k in keys:
    jv = ja.get(k, '')
    ev = en.get(k, '')
    if jv == ev or jv == '':
        print(f'MISSING: {k}')
        all_ok = False
if all_ok:
    print(f'All grade whyChooseUs keys translated to Japanese!')
    print(f'Sample: {ja[keys[0]][:60]}')
