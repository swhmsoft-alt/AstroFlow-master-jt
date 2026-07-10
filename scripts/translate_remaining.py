#!/usr/bin/env python3
"""Translate remaining untranslated capability keys for ja, fr, pl."""
import json, os, time
from deep_translator import GoogleTranslator

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRANS = os.path.join(BASE, 'src', 'i18n', 'translations')

with open(os.path.join(TRANS, 'en.json'), 'r', encoding='utf-8') as f:
    en = json.load(f)

new_prefixes = ('cap.mfg', 'cap.eng', 'cap.cap', 'cap.qual', 'cap.insp', 'cap.trc', 'cap.cert')
new_keys = {k: v for k, v in en.items() if k.startswith(new_prefixes) and len(v) > 3}

for lang_code in ['ja', 'fr', 'pl']:
    lang_path = os.path.join(TRANS, f'{lang_code}.json')
    with open(lang_path, 'r', encoding='utf-8') as f:
        lang_data = json.load(f)
    
    todo = {k: v for k, v in new_keys.items() if k in lang_data and lang_data[k] == v and len(v) > 3}
    print(f'{lang_code}: {len(todo)} remaining')
    
    if not todo:
        continue
    
    translator = GoogleTranslator(source='en', target=lang_code)
    done = 0
    for key, text in todo.items():
        if len(text) > 4500:
            continue
        try:
            lang_data[key] = translator.translate(text)
            done += 1
            if done % 20 == 0:
                print(f'  {done}/{len(todo)}')
                with open(lang_path, 'w', encoding='utf-8') as f:
                    json.dump(lang_data, f, ensure_ascii=False, indent=2)
            time.sleep(0.3)
        except:
            time.sleep(2)
    
    with open(lang_path, 'w', encoding='utf-8') as f:
        json.dump(lang_data, f, ensure_ascii=False, indent=2)
    print(f'  {lang_code}: {done} translated')

print('\nAll remaining translations complete!')
