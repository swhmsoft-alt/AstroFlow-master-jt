import json
en = json.load(open('src/i18n/translations/en.json','r',encoding='utf-8'))
ja = json.load(open('src/i18n/translations/ja.json','r',encoding='utf-8'))
for k in sorted(en):
    if k.startswith('materials.industries.'):
        en_val = en[k]
        ja_val = ja.get(k, 'MISSING')
        key_short = k.split('.')[-1]
        is_en = ja_val == en_val
        status = '=EN' if is_en else 'OK'
        print(f'{key_short:30s} | EN: {en_val:25s} | JA: {ja_val[:30]:30s} [{status}]')
