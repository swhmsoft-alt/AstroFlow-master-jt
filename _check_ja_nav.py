import json
with open('src/i18n/translations/ja.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

keys = [
    'nav.industries',
    'nav.industries.industriesServed',
    'nav.industries.aerospace',
    'nav.industries.medical',
    'nav.industries.uavDrones',
    'nav.industries.aiInfrastructure',
    'nav.industries.marine',
    'nav.industries.semiconductor',
    'nav.industries.energy',
    'nav.industries.industrialEquipment',
]
for k in keys:
    print(f'{k}: {data.get(k, "MISSING")}')
