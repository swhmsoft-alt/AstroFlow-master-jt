import json
with open('src/i18n/translations/en.json', 'r', encoding='utf-8') as f: d = json.load(f)
d['cap.traceabilitypage.s1.badge'] = 'Digital Chain of Custody'
d['cap.traceabilitypage.s1.title_prefix'] = 'The Unbroken Chain:'
d['cap.traceabilitypage.s2.badge'] = 'Compliance & Regulatory Alignment'
d['cap.traceabilitypage.s2.title_prefix'] = 'Global Material'
d['cap.traceabilitypage.s3.badge'] = 'Long-Term Data Archival'
d['cap.traceabilitypage.s3.title_prefix'] = 'Post-Project Accountability &'
d['cap.traceabilitypage.s4.badge'] = 'Traceability & Compliance FAQ'
d['cap.traceabilitypage.s4.title_prefix'] = 'Procurement Compliance'
with open('src/i18n/translations/en.json', 'w', encoding='utf-8') as f: json.dump(d, f, ensure_ascii=False, indent=2)
print('8 header keys added')
# Count all s-keys
sk = [k for k in d if k.startswith('cap.traceabilitypage.s') and not k.startswith('cap.traceabilitypage.sa')]
print(f'Total traceability s-keys: {len(sk)}')
