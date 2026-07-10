#!/usr/bin/env python3
"""
translate-capabilities.py
Translate all 302 capability translation keys to 9 languages.
"""
import json, os, time, sys
from deep_translator import GoogleTranslator

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRANS_DIR = os.path.join(BASE, 'src', 'i18n', 'translations')

TARGET_LANGS = {
    'de': 'german', 'ja': 'japanese', 'fr': 'french', 'es': 'spanish',
    'pt': 'portuguese', 'it': 'italian', 'ko': 'korean', 'nl': 'dutch', 'pl': 'polish'
}

# Get all capability keys from en.json
with open(os.path.join(TRANS_DIR, 'en.json'), 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Filter capability keys
cap_keys = {k: v for k, v in en_data.items() if k.startswith('cap.')}
print(f"Found {len(cap_keys)} capability keys to translate")

for lang_code, lang_name in TARGET_LANGS.items():
    print(f"\n--- Translating to {lang_name} ({lang_code}) ---")
    
    lang_path = os.path.join(TRANS_DIR, f'{lang_code}.json')
    with open(lang_path, 'r', encoding='utf-8') as f:
        lang_data = json.load(f)
    
    # Find keys that still have English text
    to_translate = {}
    for key, en_text in cap_keys.items():
        if key in lang_data and lang_data[key] == en_text and len(en_text) > 3:
            to_translate[key] = en_text
    
    print(f"  {len(to_translate)} keys to translate")
    
    if not to_translate:
        print(f"  Already translated!")
        continue
    
    # Batch translate
    try:
        translator = GoogleTranslator(source='en', target=lang_code)
        success = 0
        skip = 0
        
        for key, text in to_translate.items():
            if len(text) > 4500:
                print(f"  [SKIP] {key}: too long ({len(text)} chars)")
                skip += 1
                continue
            
            # Handle special characters
            clean_text = text.replace('\u2014', '-').replace('\u2013', '-') \
                             .replace('\u00b1', '+/-').replace('\u00d7', 'x') \
                             .replace('\u00f8', 'dia').replace('\u2264', '<=') \
                             .replace('\u2265', '>=').replace('\u201c', '"') \
                             .replace('\u201d', '"').replace('\u2019', "'") \
                             .replace('\u03bcm', 'um')
            
            try:
                translated = translator.translate(clean_text)
                # Restore special characters
                translated = translated.replace('+/-', '\u00b1').replace('x', '\u00d7') \
                                       .replace('dia', '\u00f8').replace('<=', '\u2264') \
                                       .replace('>=', '\u2265').replace('um', '\u03bcm')
                lang_data[key] = translated
                success += 1
                if success % 10 == 0:
                    print(f"  ... {success}/{len(to_translate)}")
                time.sleep(0.25)  # Rate limit
            except Exception as e:
                print(f"  [ERR] {key}: {str(e)[:60]}")
                time.sleep(2)
        
        # Write back
        with open(lang_path, 'w', encoding='utf-8') as f:
            json.dump(lang_data, f, ensure_ascii=False, indent=2)
        print(f"  Done! {success} translated, {skip} skipped")
        
    except Exception as e:
        print(f"  [FATAL] {e}")
    
    time.sleep(3)  # Delay between languages

print(f"\n{'='*60}")
print(f"Translation complete!")
print(f"{'='*60}")
