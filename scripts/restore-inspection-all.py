"""
Restore ALL missing cap.inspectionpage.s* keys for all 9 languages.
Handles each language individually, translating only what's missing.
No git operations, no full builds.
"""
import json, os, time, re

DIR = 'src/i18n/translations'
LANG_NAMES = {'de':'German','ja':'Japanese','fr':'French','es':'Spanish',
               'pt':'Portuguese','it':'Italian','ko':'Korean','nl':'Dutch','pl':'Polish'}

API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8'
API_URL = 'https://api.deepseek.com/v1/chat/completions'

def translate_batch(texts, lang_name):
    keys = list(texts.keys())
    result = {}
    BATCH = 8
    for i in range(0, len(keys), BATCH):
        batch = {k: texts[k] for k in keys[i:i+BATCH]}
        print(f'    Batch {i//BATCH+1}/{(len(keys)+BATCH-1)//BATCH} ({len(batch)} keys)...')
        
        payload = {
            'model': 'deepseek-chat',
            'messages': [
                {'role': 'system', 'content': f'Professional {lang_name} translator for industrial/manufacturing content. Keep technical terms like CMM, OES, SPC, FPI, UT, NDT, MTR, CoC, FAIR, AS9102, ASME, ASTM, ISO, EN, Nadcap, GD&T, ZEISS, CONTURA, OGP, SPECTROMAXx, Mitutoyo, Olympus, OmniScan exactly as-is. Return ONLY valid JSON.'},
                {'role': 'user', 'content': f'Translate to {lang_name}. Return JSON with SAME keys:\n{json.dumps(batch, indent=2, ensure_ascii=False)}'}
            ],
            'temperature': 0.3,
        }
        
        import urllib.request
        req = urllib.request.Request(API_URL, data=json.dumps(payload).encode(), headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {API_KEY}'
        })
        resp = urllib.request.urlopen(req)
        data = json.loads(resp.read())
        content = data['choices'][0]['message']['content'].strip()
        m = re.search(r'\{[\s\S]*\}', content)
        if m:
            result.update(json.loads(m.group()))
        else:
            print(f'    ⚠ No JSON in batch response')
    return result

def main():
    with open(os.path.join(DIR, 'en.json'), 'r', encoding='utf-8') as f:
        en = json.load(f)
    
    all_s_keys = sorted([k for k in en.keys() if k.startswith('cap.inspectionpage.s')])
    print(f'Total inspection s-keys in en.json: {len(all_s_keys)}')
    
    for lang_code, lang_name in sorted(LANG_NAMES.items()):
        fp = os.path.join(DIR, f'{lang_code}.json')
        with open(fp, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        missing = {k: en[k] for k in all_s_keys if k not in data}
        if not missing:
            print(f'{lang_code}: ✅ All present')
            continue
        
        print(f'{lang_code}: Translating {len(missing)} keys to {lang_name}...')
        translated = translate_batch(missing, lang_name)
        
        added = 0
        for k, v in translated.items():
            if k not in data:
                data[k] = v
                added += 1
        
        # Write back
        sorted_data = dict(sorted(data.items()))
        with open(fp, 'w', encoding='utf-8') as f:
            json.dump(sorted_data, f, ensure_ascii=False, indent=2)
        print(f'  ✅ {added} keys added to {lang_code}.json')
        
        # Small delay between languages
        time.sleep(0.5)
    
    print('\n🎉 All done!')

if __name__ == '__main__':
    main()
