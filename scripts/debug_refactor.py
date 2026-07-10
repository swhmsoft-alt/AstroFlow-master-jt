import json, os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load keys
with open(os.path.join(BASE, 'src', 'i18n', 'translations', 'en.json'), 'r', encoding='utf-8') as f:
    en = json.load(f)

# Check my keys
print("=== Checking keys ===")
for k in ['cap.mfg.s1.badge', 'cap.mfg.p1.title', 'cap.mfg.spec.badge',
          'cap.eng.s1.badge', 'cap.cap.s1.badge', 'cap.qual.s1.badge',
          'cap.insp.s1.badge', 'cap.trc.s1.badge', 'cap.cert.s1.badge']:
    if k in en:
        print(f'  {k}: [{en[k][:80]}]')
    else:
        print(f'  {k}: NOT FOUND in en.json!')

# Read a file
fp = os.path.join(BASE, 'src', 'components', 'capabilities', 'ManufacturingPage.astro')
with open(fp, 'r', encoding='utf-8') as f:
    content = f.read()

print("\n=== Checking text matching ===")
tests = [
    'Titanium CNC Machining Processes',
    '5-Axis CNC Milling', 
    'Technical Data Sheet',
    'Engineering FAQ',
]

for text in tests:
    found = text in content
    if found:
        idx = content.index(text)
        before = content[max(0,idx-3):idx]
        after = content[idx+len(text):idx+len(text)+3]
        print(f'  [{text}]: FOUND at {idx}, before=[{before}], after=[{after}]')
    else:
        print(f'  [{text}]: NOT FOUND')
        
        # Try to debug: check if it exists with different encoding
        for enc in ['utf-8', 'latin-1', 'cp1252']:
            with open(fp, 'r', encoding=enc) as f:
                c2 = f.read()
            if text in c2:
                print(f'    Found with encoding {enc}!')
                break
