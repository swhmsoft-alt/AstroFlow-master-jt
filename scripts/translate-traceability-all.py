"""Translate all 31 traceability s-keys to 9 languages (one at a time)"""
import json, re, urllib.request, sys, time

DIR = 'src/i18n/translations'
LANG_NAMES = {'de':'German','ja':'Japanese','fr':'French','es':'Spanish',
               'pt':'Portuguese','it':'Italian','ko':'Korean','nl':'Dutch','pl':'Polish'}
API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8'

with open(f'{DIR}/en.json', 'r', encoding='utf-8') as f:
    en = json.load(f)
en_sk = sorted([k for k in en if k.startswith('cap.traceabilitypage.s')])

# Process languages one by one
for lang, lang_name in sorted(LANG_NAMES.items()):
    with open(f'{DIR}/{lang}.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    missing = {k: en[k] for k in en_sk if k not in data}
    if not missing:
        print(f'{lang}: all present')
        continue
    
    print(f'{lang} ({lang_name}): {len(missing)} missing')
    keys = list(missing.keys())
    BATCH = 8
    
    for i in range(0, len(keys), BATCH):
        batch = {k: missing[k] for k in keys[i:i+BATCH]}
        print(f'  batch {i//BATCH+1}/{(len(keys)+BATCH-1)//BATCH}...', end=' ')
        sys.stdout.flush()
        
        payload = json.dumps({
            'model': 'deepseek-chat',
            'messages': [
                {'role': 'system', 'content': f'Professional {lang_name} translator for industrial content. Keep CMM, OES, SPC, FPI, UT, NDT, MTR, CoC, FAIR, DFARS, AS9102, AS9100, ASME, ASTM, ISO, EN, Nadcap, GD&T, ZEISS, CONTURA, OGP, SPECTROMAXx, Mitutoyo, ERP, RoHS, REACH, MIL-STD, UDI exactly as-is. Return ONLY valid JSON.'},
                {'role': 'user', 'content': f'Translate to {lang_name}. Return JSON with SAME keys:\n{json.dumps(batch, ensure_ascii=False)}'}
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
            print(f'got {len(t)} keys ✅')
        else:
            print('no JSON ⚠')
    
    sorted_data = dict(sorted(data.items()))
    with open(f'{DIR}/{lang}.json', 'w', encoding='utf-8') as f:
        json.dump(sorted_data, f, ensure_ascii=False, indent=2)
    
    time.sleep(0.3)

print('\nAll done!')
