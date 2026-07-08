import json
en = json.load(open('src/i18n/translations/en.json','r',encoding='utf-8'))
ko = json.load(open('src/i18n/translations/ko.json','r',encoding='utf-8'))
specific = [
    'resources.resourcehubmatrix.card0.description',
    'resources.resourcehubmatrix.card1.description',
    'resources.resourcehubmatrix.card2.description',
    'resources.resourcehubmatrix.card3.description',
    'resources.resourcehubmatrix.card4.description',
    'resources.resourcehubmatrix.card5.description',
    'resources.engineeringdownloads.row0.description',
    'resources.engineeringdownloads.row1.description',
    'resources.engineeringdownloads.row2.description',
    'resources.engineeringdownloads.row3.description',
    'resources.engineeringdownloads.row4.description',
]
for k in specific:
    en_v = en.get(k, '')
    ko_v = ko.get(k, '')
    status = 'ENGLISH' if ko_v == en_v else 'OK'
    print(f'{k}: {status}')
    if ko_v != en_v:
        print(f'  KO: {ko_v[:60]}...')
