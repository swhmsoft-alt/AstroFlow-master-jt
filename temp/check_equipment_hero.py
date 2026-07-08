import json
en = json.load(open('src/i18n/translations/en.json','r',encoding='utf-8'))
keys = ['equipment.list.hero.title','equipment.list.hero.highlight','equipment.list.hero.badge','equipment.list.hero.subtitle']
for k in keys:
    print(f'{k}: {en.get(k)}')
