import json
en = json.load(open('src/i18n/translations/en.json','r',encoding='utf-8'))
ko = json.load(open('src/i18n/translations/ko.json','r',encoding='utf-8'))
keys_to_check = [
    'resources.resourcehubmatrix.card0.title',
    'resources.resourcehubmatrix.card0.description',
    'resources.featuredinsights.whitepaper0.title',
    'resources.featuredinsights.whitepaper0.abstract',
    'resources.engineeringdownloads.row0.name',
    'resources.engineeringdownloads.row0.description',
    'resources.technicalfaqaccordion.faq0.question',
    'resources.technicalfaqaccordion.faq0.answer',
    'resources.engineeringdownloads.badge',
    'resources.featuredinsights.badge',
]
for k in keys_to_check:
    en_v = en.get(k, '')
    ko_v = ko.get(k, '')
    status = 'ENGLISH' if ko_v == en_v else 'OK'
    print(f'{k}: {status}')
