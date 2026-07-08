import json
en = json.load(open('src/i18n/translations/en.json','r',encoding='utf-8'))
keys = ['materials.standards.whyChooseUs.astm', 'materials.standards.whyChooseUs.ams']
for fname in ['de.json','ja.json','fr.json','es.json','pt.json','it.json','ko.json','nl.json','pl.json']:
    data = json.load(open('src/i18n/translations/'+fname,'r',encoding='utf-8'))
    en_val = en[keys[0]]
    data_val = data.get(keys[0], '')
    is_en = data_val == en_val
    preview = data_val[:60] if data_val else 'EMPTY'
    print(f'{fname}: {"=EN" if is_en else "TRANSLATED"} → {preview}...')
