import json, os, urllib.request, time

td = 'src/i18n/translations'
api_key = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8'
key = 'resources.resourcehubmatrix.explorePrefix'
value = 'Explore'

for lang in ['en','de','ja','fr','es','pt','it','ko','nl','pl']:
    fp = os.path.join(td, lang + '.json')
    data = json.load(open(fp, 'r', encoding='utf-8'))
    if key not in data:
        data[key] = value
    json.dump(data, open(fp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('Key added to all files')

lang_list = [('de','German'),('ja','Japanese'),('fr','French'),('es','Spanish'),('pt','Portuguese'),('it','Italian'),('ko','Korean'),('nl','Dutch'),('pl','Polish')]
for lang, lname in lang_list:
    data = json.load(open(td + '/' + lang + '.json', 'r', encoding='utf-8'))
    if data[key] != value:
        print(f'{lang}: already translated')
        continue
    body = json.dumps({
        'model': 'deepseek-chat',
        'messages': [
            {'role': 'system', 'content': f'Translate the word from English to {lname}. Return only the translated word. No punctuation.'},
            {'role': 'user', 'content': 'Explore'}
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
        data[key] = trans
        json.dump(data, open(td + '/' + lang + '.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
        print(f'{lang}: {trans}')
    except Exception as e:
        print(f'{lang}: ERROR {str(e)[:60]}')
    time.sleep(0.5)
print('Done')
