import json
en = json.load(open('src/i18n/translations/en.json','r',encoding='utf-8'))
keys = ['materials.titaniumstandards.techSpecsTitle','materials.titaniumstandards.faqTitle','materials.titaniumstandards.materialCompliance','materials.grade.whyChooseTitle']
for fname in ['pt.json','it.json','ko.json','nl.json','pl.json']:
    data = json.load(open('src/i18n/translations/'+fname,'r',encoding='utf-8'))
    translated = sum(1 for k in keys if data.get(k) != en.get(k))
    print(f'{fname}: {translated}/{len(keys)} translated')
    for k in keys:
        if data[k] != en[k]:
            print(f'  {k}: {data[k][:60]}')
