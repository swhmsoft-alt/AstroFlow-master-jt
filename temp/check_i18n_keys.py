import json, os

td = 'src/i18n/translations'

# Load only en.json to get the expected keys
en = json.load(open(f'{td}/en.json', 'r', encoding='utf-8'))
keys = [k for k in en if k.startswith('materials.titaniumstandards.techSpec') or 
        k.startswith('materials.titaniumstandards.cncNarrative') or 
        k.startswith('materials.titaniumstandards.whyChoose') or 
        k.startswith('materials.titaniumstandards.faq') or
        k.startswith('materials.titaniumstandards.materialCompliance') or
        k.startswith('materials.titaniumstandards.complianceDesc') or
        k.startswith('materials.titaniumstandards.supportedGrades') or
        k.startswith('materials.titaniumstandards.availableForms') or
        k.startswith('materials.titaniumstandards.cncTitle') or
        k.startswith('materials.titaniumstandards.qualityTitle') or
        k.startswith('materials.titaniumstandards.qualityDesc') or
        k.startswith('materials.titaniumstandards.industriesTitle') or
        k.startswith('materials.titaniumstandards.relatedSpecs') or
        k.startswith('materials.titaniumstandards.backToStandards') or
        k.startswith('materials.titaniumstandards.cta') or
        k.startswith('materials.titaniumstandards.trust') or
        k.startswith('materials.titaniumstandards.achievable') or
        k.startswith('materials.grade.')]

print(f'Total new keys to check: {len(keys)}')
for k in keys:
    en_val = en[k]
    print(f'  {k}: {repr(en_val[:80]) if len(en_val)>80 else repr(en_val)}')

print()

for fname in sorted(os.listdir(td)):
    if fname == 'en.json' or not fname.endswith('.json'):
        continue
    data = json.load(open(f'{td}/{fname}', 'r', encoding='utf-8'))
    missing = [k for k in keys if k not in data]
    if missing:
        print(f'{fname}: MISSING {len(missing)} keys')
        for m in missing:
            print(f'  - {m}')
    else:
        print(f'{fname}: ✅ All {len(keys)} keys present')
