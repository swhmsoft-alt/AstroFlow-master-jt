import json, os, urllib.request

td = 'src/i18n/translations'
api_key = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8'

keys = [
    'resources.featuredinsights.whitepaper0.title',
    'resources.featuredinsights.whitepaper0.abstract',
    'resources.featuredinsights.whitepaper1.title',
    'resources.featuredinsights.whitepaper1.abstract',
    'resources.featuredinsights.whitepaper2.title',
    'resources.featuredinsights.whitepaper2.abstract',
]

# Translate ja
data = json.load(open(td + '/ja.json', 'r', encoding='utf-8'))
en = json.load(open(td + '/en.json', 'r', encoding='utf-8'))
source = {k: en[k] for k in keys if data.get(k) == en[k]}
if source:
    body = json.dumps({
        'model': 'deepseek-chat',
        'messages': [
            {'role': 'system', 'content': 'Translate JSON from English to Japanese. These are whitepaper titles/abstracts for a titanium CNC manufacturing company. Keep keys. Return valid JSON.'},
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
    print(f'ja: {len(translated)} keys OK')
else:
    print('ja: already translated')
print('Done')
