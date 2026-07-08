import json
en = json.load(open('src/i18n/translations/en.json','r',encoding='utf-8'))
data = json.load(open('src/i18n/translations/ja.json','r',encoding='utf-8'))
keys = [k for k in en if k.startswith('materials.grades.grade-1.faq.')]
for k in sorted(keys):
    en_v = en[k]
    jp_v = data.get(k, '')
    status = 'EQUALS_EN' if jp_v == en_v else 'TRANSLATED'
    short_key = k.split('.')[-1]
    print(short_key + ': ' + status)
