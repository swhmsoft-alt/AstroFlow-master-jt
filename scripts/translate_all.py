#!/usr/bin/env python3
"""Translate ALL remaining untranslated capability keys for ALL 9 languages."""
import json, os, time, sys
from deep_translator import GoogleTranslator

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRANS = os.path.join(BASE, 'src', 'i18n', 'translations')

with open(os.path.join(TRANS, 'en.json'), 'r', encoding='utf-8') as f:
    en = json.load(f)

cap_keys = {k: v for k, v in en.items() if k.startswith('cap.') and len(v) > 3}
target_langs = {'de': 'german', 'ja': 'japanese', 'fr': 'french', 'es': 'spanish',
                'pt': 'portuguese', 'it': 'italian', 'ko': 'korean', 'nl': 'dutch', 'pl': 'polish'}

for lang_code in target_langs:
    lang_path = os.path.join(TRANS, f'{lang_code}.json')
    with open(lang_path, 'r', encoding='utf-8') as f:
        lang_data = json.load(f)
    
    todo = {k: v for k, v in cap_keys.items() if k in lang_data and lang_data[k] == v and len(v) > 3}
    print(f'{lang_code}: {len(todo)} to translate')
    
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
            if done % 25 == 0:
                print(f'  {lang_code}: {done}/{len(todo)}')
                with open(lang_path, 'w', encoding='utf-8') as f:
                    json.dump(lang_data, f, ensure_ascii=False, indent=2)
            time.sleep(0.25)
        except:
            time.sleep(2)
    
    with open(lang_path, 'w', encoding='utf-8') as f:
        json.dump(lang_data, f, ensure_ascii=False, indent=2)
    print(f'  {lang_code}: DONE ({done} translated)')

print('\nALL TRANSLATIONS COMPLETE!')
