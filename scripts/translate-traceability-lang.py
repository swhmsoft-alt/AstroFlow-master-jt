"""Translate traceability s-keys for ONE language"""
import json, re, urllib.request, sys

LANG = sys.argv[1]
LANG_NAMES = {'ja':'Japanese','fr':'French','pt':'Portuguese','it':'Italian','ko':'Korean','nl':'Dutch','pl':'Polish'}
LANG_NAME = LANG_NAMES[LANG]
API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8'

with open('src/i18n/translations/en.json', 'r', encoding='utf-8') as f:
    en = json.load(f)
en_sk = sorted([k for k in en if k.startswith('cap.traceabilitypage.s')])

with open(f'src/i18n/translations/{LANG}.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

missing = {k: en[k] for k in en_sk if k not in data}
if not missing:
    print(f'{LANG}: all present')
    sys.exit(0)

print(f'{LANG} ({LANG_NAME}): {len(missing)} missing')
keys = list(missing.keys())

BATCH = 8
for i in range(0, len(keys), BATCH):
    batch = {k: missing[k] for k in keys[i:i+BATCH]}
    print(f'  batch {i//BATCH+1}/{(len(keys)+BATCH-1)//BATCH} ({len(batch)} keys)...', end=' ')
    sys.stdout.flush()
    
    payload = json.dumps({
        'model': 'deepseek-chat',
        'messages': [
            {'role': 'system', 'content': f'Professional {LANG_NAME} translator for industrial content. Keep CMM, OES, SPC, FPI, UT, NDT, MTR, CoC, FAIR, DFARS, AS9102, AS9100, ASME, ASTM, ISO, EN, Nadcap, GD&T, ERP, RoHS, REACH, MIL-STD, UDI exactly as-is. Return ONLY valid JSON.'},
            {'role': 'user', 'content': f'Translate to {LANG_NAME}. Return JSON with SAME keys:\n{json.dumps(batch, ensure_ascii=False)}'}
        ],
        'temperature': 0.3,
    }).encode()
    
    req = urllib.request.Request('https://api.deepseek.com/v1/chat/completions', data=payload,
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {API_KEY}'})
    resp = json.loads(urllib.request.urlopen(req).read())
    content = resp['choices'][0]['message']['content'].strip()
    m = re.search(r'\{[\s\S]*\}', content)
    if m:
        t = json.loads(m.group())
        for k, v in t.items():
            data[k] = v
        print(f'got {len(t)}')
    else:
        print('no JSON ⚠')

sorted_data = dict(sorted(data.items()))
with open(f'src/i18n/translations/{LANG}.json', 'w', encoding='utf-8') as f:
    json.dump(sorted_data, f, ensure_ascii=False, indent=2)
print(f'✅ {LANG}.json saved')
