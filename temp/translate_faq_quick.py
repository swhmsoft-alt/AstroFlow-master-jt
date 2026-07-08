import json, os, time, urllib.request

td = 'src/i18n/translations'
api_key = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8'
api_url = 'https://api.deepseek.com/v1/chat/completions'

en = json.load(open(os.path.join(td, 'en.json'), 'r', encoding='utf-8'))

# Just translate FAQ keys
keys = []
for cat in ['astm', 'medical', 'additive', 'ams']:
    for i in range(3):
        keys.append(f'materials.standards.faq.{cat}.q{i}')
        keys.append(f'materials.standards.faq.{cat}.a{i}')

source = {k: en[k] for k in keys}

lang = 'de'
fp = os.path.join(td, f'{lang}.json')
data = json.load(open(fp, 'r', encoding='utf-8'))

needs = {k: v for k, v in source.items() if data.get(k) == v}
print(f'{lang}: {len(needs)} untranslated')

if needs:
    body = json.dumps({
        'model': 'deepseek-chat',
        'messages': [
            {'role': 'system', 'content': 'You are a professional German translator for industrial content. Translate JSON values. Keep keys. Return ONLY valid JSON.'},
            {'role': 'user', 'content': json.dumps(needs, indent=2, ensure_ascii=False)},
        ],
        'temperature': 0.1,
    }).encode('utf-8')
    req = urllib.request.Request(api_url, data=body,
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {api_key}'})
    resp = urllib.request.urlopen(req, timeout=120)
    txt = resp.read().decode('utf-8')
    result = json.loads(txt)
    content = result['choices'][0]['message']['content']
    if '```' in content:
        content = content.split('```')[1]
        if content.startswith('json'):
            content = content[4:]
    translated = json.loads(content.strip())
    for k, v in translated.items():
        if k in keys and v:
            data[k] = v
    json.dump(data, open(fp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f'Translated {len(translated)} keys')
else:
    print('Already translated')

# Verify
de = json.load(open(fp, 'r', encoding='utf-8'))
first_key = keys[0]
print(f'  {first_key} = {de.get(first_key, "MISSING")[:50]}...')
