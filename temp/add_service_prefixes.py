import json, os, urllib.request, time

td = 'src/i18n/translations'
api_key = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8'

keys = {
    'services.cncprocessspectrum.titlePrefix': 'Our',
    'services.cncprocessspectrum.titleHighlight': 'CNC Process Spectrum',
    'services.cnctechnicaldashboard.titlePrefix': 'Machining',
    'services.cnctechnicaldashboard.titleHighlight': 'Capability Dashboard',
    'services.titaniumengineeringknowhow.titlePrefix': 'Mastering',
    'services.titaniumengineeringknowhow.titleHighlight': 'Titanium\'s Hard Bones',
    'services.cncdedicatedcta.titlePrefix': 'Ready for Precision \u2014',
}

for lang in ['en','de','ja','fr','es','pt','it','ko','nl','pl']:
    fp = os.path.join(td, lang + '.json')
    data = json.load(open(fp, 'r', encoding='utf-8'))
    for k, v in keys.items():
        if k not in data:
            data[k] = v
    json.dump(data, open(fp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('Keys added to all files')

# Translate Japanese
data = json.load(open(td + '/ja.json', 'r', encoding='utf-8'))
en = json.load(open(td + '/en.json', 'r', encoding='utf-8'))
source = {k: en[k] for k in keys if data.get(k) == en[k]}
if source:
    body = json.dumps({
        'model': 'deepseek-chat',
        'messages': [
            {'role': 'system', 'content': 'Translate JSON from English to Japanese. These are section titles for a CNC manufacturing website. Keep keys. Valid JSON.'},
            {'role': 'user', 'content': json.dumps(source, indent=2, ensure_ascii=False)},
        ],
        'temperature': 0.1,
    }).encode('utf-8')
    req = urllib.request.Request('https://api.deepseek.com/v1/chat/completions', data=body,
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {api_key}'})
    resp = urllib.request.urlopen(req, timeout=60)
    txt = resp.read().decode('utf-8')
    result = json.loads(txt)
    content = result['choices'][0]['message']['content']
    if '```' in content: content = content.split('```')[1].replace('json','')
    translated = json.loads(content.strip())
    for k, v in translated.items():
        if k in data and v: data[k] = v
    json.dump(data, open(td + '/ja.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f'ja: {len(translated)} keys')
print('Done')
