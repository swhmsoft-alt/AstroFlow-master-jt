import json, os, time, urllib.request

td = 'src/i18n/translations'
api_key = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8'
api_url = 'https://api.deepseek.com/v1/chat/completions'

en = json.load(open(os.path.join(td, 'en.json'), 'r', encoding='utf-8'))

keys = [k for k in en if k.startswith('materials.industries.')]
source = {k: en[k] for k in keys}
print(f'Found {len(keys)} industry keys')

langs = ['de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl']
lang_names = {'de':'German', 'ja':'Japanese', 'fr':'French', 'es':'Spanish',
              'pt':'Portuguese', 'it':'Italian', 'ko':'Korean', 'nl':'Dutch', 'pl':'Polish'}

for lang in langs:
    fp = os.path.join(td, f'{lang}.json')
    data = json.load(open(fp, 'r', encoding='utf-8'))
    needs = {k: v for k, v in source.items() if data.get(k) == v}
    if not needs:
        print(f'{lang}: already translated')
        continue
    print(f'{lang} ({lang_names[lang]}): {len(needs)} keys...')
    body = json.dumps({
        'model': 'deepseek-chat',
        'messages': [
            {'role': 'system', 'content': f'You are a professional {lang_names[lang]} translator. Translate JSON values. Keep keys unchanged. Return ONLY valid JSON.'},
            {'role': 'user', 'content': json.dumps(needs, indent=2, ensure_ascii=False)},
        ],
        'temperature': 0.1,
    }).encode('utf-8')
    req = urllib.request.Request(api_url, data=body,
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {api_key}'})
    try:
        resp = urllib.request.urlopen(req, timeout=120)
        txt = resp.read().decode('utf-8')
        result = json.loads(txt)
        content = result['choices'][0]['message']['content']
        if '```' in content:
            content = content.split('```')[1]
            if content.startswith('json'): content = content[4:]
        translated = json.loads(content.strip())
        for k, v in translated.items():
            if k in data and v: data[k] = v
        json.dump(data, open(fp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
        print(f'  OK: {len(translated)} keys')
    except Exception as e:
        print(f'  ERROR: {str(e)[:120]}')
    time.sleep(1)
print('Done!')
