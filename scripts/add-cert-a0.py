import json
with open('src/i18n/translations/en.json', 'r', encoding='utf-8') as f: d = json.load(f)
d['cap.certificationspage.s4.a0'] = 'BOZE CNC operates under three internationally recognized quality management certifications: AS9100 Rev D (aerospace and defense), ISO 13485:2016 (medical devices), and ISO 9001:2015 (general manufacturing). Each certification is maintained through annual surveillance audits conducted by accredited third-party registrars. Our AS9100D scope specifically covers precision 5-axis CNC machining of titanium alloys for aerospace structural and propulsion applications.'
with open('src/i18n/translations/en.json', 'w', encoding='utf-8') as f: json.dump(d, f, ensure_ascii=False, indent=2)
print('Added s4.a0')
print(f'Total cert s-keys: {len([k for k in d if k.startswith(\"cap.certificationspage.s\")])}')
