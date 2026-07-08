import json, os, urllib.request, time

td = 'src/i18n/translations'
api_key = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8'

keys = {
    'resources.engineeringdownloads.colResource': 'Resource',
    'resources.engineeringdownloads.colFormat': 'Format',
    'resources.engineeringdownloads.colSize': 'Size',
    'resources.engineeringdownloads.colAction': 'Action',
    'resources.engineeringdownloads.downloadPrefix': 'Download',
    'resources.engineeringdownloads.footer': 'Files updated Q1 2026 \u00b7 All assets verified',
}

rows = [
    ('CAD Standard Models — Titanium Grade 5 (Ti-6Al-4V)', 'ISO 10303 STEP AP242 native 3D models of common titanium billet, bar, plate, and tube stock geometries for engineering integration.'),
    ('Titanium Property Datasheet — Full Grade Compendium', 'Complete mechanical, thermal, and chemical property datasheet across Grades 1\u201323, including ASTM/ISO cross-reference tables and heat treatment guidelines.'),
    ('2026 Titanium DFM Booklet', 'Definitive design-for-manufacturability reference: minimum wall thickness charts, achievable tolerances per process, surface finish callouts, and anti-galling design rules.'),
    ('Heat Treatment & Stress Relief Parameters', 'Recommended annealing, solution treating, and aging cycles for all wrought titanium grades, with post-treatment mechanical property verification data.'),
    ('Welding Procedure Specification (WPS) — Grade 2 & 5', 'Qualified welding parameters for GTAW (TIG) and PAW of commercially pure and alpha-beta titanium alloys, including pre-weld cleaning and purge gas protocols.'),
]
for i, (name, desc) in enumerate(rows):
    keys[f'resources.engineeringdownloads.row{i}.name'] = name
    keys[f'resources.engineeringdownloads.row{i}.description'] = desc

for lang in ['en','de','ja','fr','es','pt','it','ko','nl','pl']:
    fp = os.path.join(td, lang + '.json')
    data = json.load(open(fp, 'r', encoding='utf-8'))
    for k, v in keys.items():
        if k not in data:
            data[k] = v
    json.dump(data, open(fp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('Keys added to all files')

# Translate ja
data = json.load(open(td + '/ja.json', 'r', encoding='utf-8'))
en = json.load(open(td + '/en.json', 'r', encoding='utf-8'))
source = {k: en[k] for k in keys if data.get(k) == en[k]}
print(f'ja: {len(source)} keys to translate...')
if source:
    body = json.dumps({
        'model': 'deepseek-chat',
        'messages': [
            {'role': 'system', 'content': 'Translate JSON from English to Japanese. These are download table rows for a titanium CNC manufacturing website. Keep keys. Valid JSON only.'},
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
    print(f'  OK: {len(translated)} keys')
print('Done')
