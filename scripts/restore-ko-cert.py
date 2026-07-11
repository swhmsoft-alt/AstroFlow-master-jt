"""Add ALL missing cap.certificationspage.* keys to ko.json"""
import json, re, urllib.request, sys

with open('src/i18n/translations/en.json', 'r', encoding='utf-8') as f:
    en = json.load(f)
with open('src/i18n/translations/ko.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

missing = {k: en[k] for k in sorted(en) if k.startswith('cap.certificationspage.') and k not in data}
print(f'ko.json: {len(missing)} missing keys')

if not missing:
    print('All present')
    sys.exit(0)

keys = list(missing.keys())
BATCH = 10
for i in range(0, len(keys), BATCH):
    batch = dict(list(missing.items())[i:i+BATCH])
    print(f'  batch {i//BATCH+1}/{(len(keys)+BATCH-1)//BATCH} ({len(batch)} keys)...')
    
    payload = json.dumps({
        'model': 'deepseek-chat',
        'messages': [
            {'role': 'system', 'content': 'Professional Korean translator for industrial/manufacturing content. Keep CMM, OES, SPC, FPI, UT, NDT, MTR, CoC, FAIR, DFARS, AS9102, AS9100, ASME, ASTM, ISO, EN, Nadcap, GD&T, ERP, RoHS, REACH, MIL-STD, UDI, SGS, TUV, BSI, CAPA, FMEA exactly as-is. Return ONLY valid JSON.'},
            {'role': 'user', 'content': f'Translate to Korean. Return JSON with SAME keys:\n{json.dumps(batch, ensure_ascii=False)}'}
        ],
        'temperature': 0.3,
    }).encode()
    
    req = urllib.request.Request('https://api.deepseek.com/v1/chat/completions', data=payload,
        headers={'Content-Type': 'application/json', 'Authorization': 'Bearer sk-b187f5cf84c74f9aac8bd04b7fd0d2f8'})
    resp = json.loads(urllib.request.urlopen(req).read())
    content = resp['choices'][0]['message']['content'].strip()
    m = re.search(r'\{[\s\S]*\}', content)
    if m:
        t = json.loads(m.group())
        for k, v in t.items():
            data[k] = v
        print(f'    got {len(t)}')

sorted_data = dict(sorted(data.items()))
with open('src/i18n/translations/ko.json', 'w', encoding='utf-8') as f:
    json.dump(sorted_data, f, ensure_ascii=False, indent=2)
print(f'  saved ({len(sorted_data)} total)')
