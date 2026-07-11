import json
with open('src/i18n/translations/en.json', 'r', encoding='utf-8') as f:
    d = json.load(f)
d['equipment.cta.title'] = 'Need a {name} for Your Project?'
d['equipment.cta.description'] = 'Contact our engineering team today for a free consultation and competitive quote.'
d['equipment.cta.btnQuote'] = 'Request Quote'
d['equipment.cta.btnCapabilities'] = 'View Capabilities'
with open('src/i18n/translations/en.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, ensure_ascii=False, indent=2)
print('Added 4 keys')
