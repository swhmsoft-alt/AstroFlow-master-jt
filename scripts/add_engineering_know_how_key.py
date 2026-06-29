import json
import os

translations_dir = 'src/i18n/translations'

# Translations for "Engineering Know-How" in each language
translations = {
    'fr.json': ('Notre solution', 'Notre solution', 'Savoir-Faire Technique', 'Ingénierie Know-How'),
    'es.json': ('Nuestra Solución', 'Nuestra Solución', '', 'Ingeniería Know-How'),
    'pt.json': ('Nossa Solução', 'Nossa Solução', '', 'Engenharia Know-How'),
    'it.json': ('La Nostra Soluzione', 'La Nostra Soluzione', '', 'Ingegneria Know-How'),
    'ko.json': ('당사의 솔루션', '당사의 솔루션', '엔지니어링 지식', '엔지니어링 노하우'),
    'nl.json': ('Onze Oplossing', 'Onze Oplossing', 'Technische Kennis', 'Technische Know-How'),
    'pl.json': ('Nasze rozwiązanie', 'Nasze rozwiązanie', 'Wiedza inżynierska', 'Inżynieria Know-How'),
}

base_key = 'services.gallingcolorvariationknowhow.engineering_know_how'

for filename in sorted(os.listdir(translations_dir)):
    if filename == 'en.json' or filename == 'ja.json' or filename == 'de.json':
        continue  # Already done
    
    filepath = os.path.join(translations_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    data = json.loads(content)
    
    # Check if key already exists
    if base_key in data:
        print(f"{filename}: key already exists, skipping")
        continue
    
    # Find the insertion point: after solution_6 and before the next key
    keys = list(data.keys())
    for i, key in enumerate(keys):
        if key == 'services.gallingcolorvariationknowhow.solution_6':
            # We need the next key after solution_6
            next_key = keys[i + 1] if i + 1 < len(keys) else None
            
            # Build the replacement text
            old_line = f'  "{key}": "{data[key]}",'
            
            if filename in translations:
                trans = translations[filename]
                if filename in ('fr.json', 'es.json', 'pt.json', 'it.json', 'nl.json', 'pl.json'):
                    eng_know_how = trans[3]
                elif filename == 'ko.json':
                    eng_know_how = trans[3]
                else:
                    eng_know_how = 'Engineering Know-How'
            else:
                eng_know_how = 'Engineering Know-How'
            
            new_line = f'  "{key}": "{data[key]}",\n  "{base_key}": "{eng_know_how}",'
            content = content.replace(old_line, new_line)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"{filename}: added key")
            break

print("Done!")