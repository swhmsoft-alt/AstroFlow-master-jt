import json, os, urllib.request

td = 'src/i18n/translations'
api_key = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8'
keys = [f'resources.resourcehubmatrix.card{i}.title' for i in range(6)] + [f'resources.resourcehubmatrix.card{i}.description' for i in range(6)]

data = json.load(open(td + '/ja.json', 'r', encoding='utf-8'))
en = json.load(open(td + '/en.json', 'r', encoding='utf-8'))
source = {k: en[k] for k in keys if data.get(k) == en[k]}
print(f'Need to translate: {len(source)} keys')

if source:
    body = json.dumps({
        'model': 'deepseek-chat',
        'messages': [
            {'role': 'system', 'content': 'Translate JSON from English to Japanese. These are resource category cards for a titanium CNC manufacturing website. Keep keys. Valid JSON only.'},
            {'role': 'user', 'content': json.dumps(source, indent=2, ensure_ascii=False)},
        ],
        'temperature': 0.1,
    }).encode('utf-8')
    req = urllib.request.Request('https://api.deepseek.com/v1/chat/completions', data=body,
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {api_key}'})
    resp = urllib.request.urlopen(req, timeout=120)
    txt = resp.read().decode('utf-8')
    result = json.loads(txt)
    content = result['choices'][0]['message']['content']
    if '```' in content: content = content.split('```')[1].replace('json','')
    translated = json.loads(content.strip())
    for k, v in translated.items():
        if k in data and v: data[k] = v
    json.dump(data, open(td + '/ja.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f'Translated: {len(translated)} keys')
else:
    print('Already translated')
print('Done')
