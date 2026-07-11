import json
with open('src/i18n/translations/en.json', 'r', encoding='utf-8') as f: d = json.load(f)

# Fix S3 subtitle (matches actual component text)
d['cap.certificationspage.s3.subtitle'] = 'Certification is not a static badge \u2014 it is a dynamic, continuously verified system. Our compliance framework is tested quarterly internally and validated annually by independent third-party registrars.'

# Add phase descriptions (from actual component)
d['cap.certificationspage.s3.phase1_desc'] = 'Our certified internal quality auditors conduct scheduled cross-departmental reviews every quarter to ensure total adherence to AS9100D and ISO 13485 operational clauses. Any non-conformities are logged, tracked, and resolved through our CAPA system before they can impact production quality.'
d['cap.certificationspage.s3.phase2_desc'] = 'Leading international registrars (SGS, T\u00dcV S\u00dcD, BSI) perform rigorous on-site surveillance audits annually. Auditors verify tool calibration logs, material traceability data, process control documentation, and employee competency records against the relevant standard\u2019s clause requirements.'
d['cap.certificationspage.s3.phase3_desc'] = 'Any process variance \u2014 whether identified internally or during registrar audits \u2014 triggers our formal Corrective and Preventive Action (CAPA) workflow. Root-cause analysis (5-Why, Fishbone, FMEA) is applied to determine systemic causes, and engineering protocols, toolpath strategies, or inspection plans are updated accordingly.'

with open('src/i18n/translations/en.json', 'w', encoding='utf-8') as f: json.dump(d, f, ensure_ascii=False, indent=2)
print('Fixed en.json')
sk = [k for k in d if k.startswith('cap.certificationspage.s')]
print(f'Total cert s-keys: {len(sk)}')
