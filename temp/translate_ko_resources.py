import json, os, urllib.request, time

td = 'src/i18n/translations'
api_key = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8'

# Collect all keys that might be untranslated
en = json.load(open(td + '/en.json', 'r', encoding='utf-8'))
all_resource_keys = [k for k in en if k.startswith('resources.resourcehubmatrix.card') or 
                     k.startswith('resources.engineeringdownloads.row') or 
                     k.startswith('resources.technicalfaqaccordion.faq')]
print(f'Total resource data keys: {len(all_resource_keys)}')

# Do one language at a time
for lang, lname in [('ko','Korean'), ('de','German'), ('fr','French'), ('es','Spanish'), 
                     ('pt','Portuguese'), ('it','Italian'), ('nl','Dutch'), ('pl','Polish')]:
    data = json.load(open(td + '/' + lang + '.json', 'r', encoding='utf-8'))
    source = {k: en[k] for k in all_resource_keys if data.get(k) == en[k]}
    if not source:
        print(f'{lang}: already translated')
        continue
    print(f'{lang}: {len(source)} keys...')
    body = json.dumps({
        'model': 'deepseek-chat',
        'messages': [
            {'role': 'system', 'content': f'Translate JSON values from English to {lname}. These are for a titanium CNC manufacturing website. Keep HTML tags like <strong>. Keep keys. Valid JSON only.'},
            {'role': 'user', 'content': json.dumps(source, indent=2, ensure_ascii=False)},
        ],
        'temperature': 0.1,
    }).encode('utf-8')
    req = urllib.request.Request('https://api.deepseek.com/v1/chat/completions', data=body,
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {api_key}'})
    try:
        resp = urllib.request.urlopen(req, timeout=120)
        txt = resp.read().decode('utf-8')
        result = json.loads(txt)
        content = result['choices'][0]['message']['content']
        if '```' in content: content = content.split('```')[1].replace('json','')
        translated = json.loads(content.strip())
        for k, v in translated.items():
            if k in data and v: data[k] = v
        json.dump(data, open(td + '/' + lang + '.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
        print(f'  OK: {len(translated)} keys')
    except Exception as e:
        print(f'  ERROR: {str(e)[:100]}')
    time.sleep(1)
print('Done!')
