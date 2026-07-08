import json, os, urllib.request, time

td = 'src/i18n/translations'
api_key = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8'
en = json.load(open(td + '/en.json', 'r', encoding='utf-8'))

# Just translate Korean FAQ + matrix + downloads
# These are the 12 FAQ keys 
faq_keys = [f'resources.technicalfaqaccordion.faq{i}.{f}' for i in range(6) for f in ['question','answer']]
# 6 card keys (titles only - descriptions are long)
card_keys = [f'resources.resourcehubmatrix.card{i}.title' for i in range(6)]
# 5 download row names
dl_keys = [f'resources.engineeringdownloads.row{i}.name' for i in range(5)]
# Footer
misc_keys = ['resources.engineeringdownloads.downloadPrefix', 'resources.engineeringdownloads.footer']

all_need = faq_keys + card_keys + dl_keys + misc_keys

for lang, lname in [('ko','Korean')]:
    data = json.load(open(td + '/' + lang + '.json', 'r', encoding='utf-8'))
    source = {k: en[k] for k in all_need if data.get(k) == en[k]}
    print(f'{lang}: {len(source)} keys need translation')
    if not source:
        print('Already translated!')
        continue
    body = json.dumps({
        'model': 'deepseek-chat',
        'messages': [
            {'role': 'system', 'content': f'Translate JSON from English to {lname}. These are FAQ, card titles, and download names for a titanium CNC manufacturing website. Keep HTML tags like <strong>. Keep keys. Valid JSON only.'},
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
        print(f'OK: {len(translated)} keys')
    except Exception as e:
        print(f'ERROR: {str(e)[:100]}')
print('Done')
