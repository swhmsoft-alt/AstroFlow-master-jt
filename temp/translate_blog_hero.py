import json, os, urllib.request, time

td = 'src/i18n/translations'
api_key = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8'

en = json.load(open(td + '/en.json', 'r', encoding='utf-8'))
keys = ['blog.hero.title', 'blog.hero.highlight', 'blog.hero.badge', 'blog.hero.subtitle', 'blog.hero.description']
source = {k: en[k] for k in keys}

for lang in ['de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl']:
    data = json.load(open(td + '/' + lang + '.json', 'r', encoding='utf-8'))
    needs = {k: v for k, v in source.items() if data.get(k) == v}
    if not needs:
        print(f'{lang}: already translated')
        continue
    body = json.dumps({
        'model': 'deepseek-chat',
        'messages': [
            {'role': 'system', 'content': f'Translate JSON values from English to {lang}. Keep keys. Return valid JSON.'},
            {'role': 'user', 'content': json.dumps(needs, indent=2, ensure_ascii=False)},
        ],
        'temperature': 0.1,
    }).encode('utf-8')
    req = urllib.request.Request('https://api.deepseek.com/v1/chat/completions', data=body,
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {api_key}'})
    try:
        resp = urllib.request.urlopen(req, timeout=60)
        txt = resp.read().decode('utf-8')
        result = json.loads(txt)
        content = result['choices'][0]['message']['content']
        if '```' in content: content = content.split('```')[1].replace('json','')
        translated = json.loads(content.strip())
        for k, v in translated.items():
            if k in data and v: data[k] = v
        json.dump(data, open(td + '/' + lang + '.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
        print(f'{lang}: {len(translated)} keys')
    except Exception as e:
        print(f'{lang}: ERROR: {str(e)[:80]}')
    time.sleep(1)
print('Done!')
