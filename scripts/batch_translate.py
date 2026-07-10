#!/usr/bin/env python3
"""Batch translate all capability keys to 9 languages."""
import json, time, os, sys

sys.stdout.reconfigure(encoding='utf-8')
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRANS = os.path.join(BASE, 'src', 'i18n', 'translations')

# Load English
with open(os.path.join(TRANS, 'en.json'), 'r', encoding='utf-8') as f:
    en = json.load(f)

# Get all capability keys
cap_keys = {k: v for k, v in en.items() if k.startswith('cap.')}

# Try different translators
from deep_translator import GoogleTranslator

for lang_code, lang_name in [('de','German'),('ja','Japanese'),('fr','French')]:
    print(f'\n=== {lang_name} ({lang_code}) ===')
    lang_path = os.path.join(TRANS, f'{lang_code}.json')
    with open(lang_path, 'r', encoding='utf-8') as f:
        lang_data = json.load(f)
    
    # Find untranslated
    todo = [(k, v) for k, v in cap_keys.items() 
            if k in lang_data and lang_data[k] == v and len(v) > 3]
    print(f'  {len(todo)} to translate')
    
    if not todo:
        continue
    
    try:
        translator = GoogleTranslator(source='en', target=lang_code)
        done = 0
        for key, text in todo[:50]:  # 50 per batch
            try:
                if len(text) > 4500:
                    continue
                lang_data[key] = translator.translate(text)
                done += 1
                if done % 10 == 0:
                    print(f'    {done}/{len(todo)}')
                time.sleep(0.3)
            except:
                time.sleep(2)
        
        with open(lang_path, 'w', encoding='utf-8') as f:
            json.dump(lang_data, f, ensure_ascii=False, indent=2)
        print(f'  {done} translated')
    except Exception as e:
        print(f'  ERROR: {e}')

print('\nFirst batch done! (de, ja, fr)')
