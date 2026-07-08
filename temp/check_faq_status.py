import json

td = 'src/i18n/translations'
en = json.load(open(td + '/en.json', 'r', encoding='utf-8'))
keys = ['materials.standards.faq.astm.q0', 'materials.standards.faq.medical.q0',
        'materials.standards.faq.additive.q0', 'materials.standards.faq.ams.q0']

for fname in ['de','ja','fr','es','pt','it','ko','nl','pl']:
    data = json.load(open(td + '/' + fname + '.json', 'r', encoding='utf-8'))
    all_translated = True
    for k in keys:
        en_val = en[k][:20]
        data_val = data.get(k, '')[:20]
        if data_val == en_val:
            all_translated = False
            print(f'{fname}: {k} = ENGLISH')
    if all_translated:
        preview = data.get(keys[0], '')[:50]
        print(f'{fname}: ALL TRANSLATED -> {preview}')
