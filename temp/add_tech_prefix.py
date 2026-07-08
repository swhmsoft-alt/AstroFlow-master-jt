import json, os, urllib.request, time

td = 'src/i18n/translations'
api_key = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8'

# Add key to all files first
for fname in ['en.json','de.json','ja.json','fr.json','es.json','pt.json','it.json','ko.json','nl.json','pl.json']:
    fp = os.path.join(td, fname)
    data = json.load(open(fp, 'r', encoding='utf-8'))
    if 'home.tech.titlePrefix' not in data:
        data['home.tech.titlePrefix'] = 'Engineering'
    json.dump(data, open(fp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('Keys added')

# Translate to non-English languages
en = json.load(open(td + '/en.json', 'r', encoding='utf-8'))
source = {'home.tech.titlePrefix': 'Engineering'}

for lang in ['de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl']:
    data = json.load(open(td + '/' + lang + '.json', 'r', encoding='utf-8'))
    if data.get('home.tech.titlePrefix') != 'Engineering':
        print(f'{lang}: already translated')
        continue
    body = json.dumps({
        'model': 'deepseek-chat',
        'messages': [
            {'role': 'system', 'content': f'Translate this single word from English to {lang}. Return ONLY the translated word. No punctuation, no quotes.'},
            {'role': 'user', 'content': 'Engineering'},
        ],
        'temperature': 0.1,
    }).encode('utf-8')
    req = urllib.request.Request('https://api.deepseek.com/v1/chat/completions', data=body,
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {api_key}'})
    try:
        resp = urllib.request.urlopen(req, timeout=30)
        txt = resp.read().decode('utf-8')
        result = json.loads(txt)
        trans = result['choices'][0]['message']['content'].strip().strip('"').strip("'")
        data['home.tech.titlePrefix'] = trans
        json.dump(data, open(td + '/' + lang + '.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
        print(f'{lang}: {trans}')
    except Exception as e:
        print(f'{lang}: ERROR: {str(e)[:60]}')
    time.sleep(1)
print('Done!')
