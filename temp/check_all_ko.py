import json
en = json.load(open('src/i18n/translations/en.json','r',encoding='utf-8'))
ko = json.load(open('src/i18n/translations/ko.json','r',encoding='utf-8'))
# Check all resource-related keys
untranslated = []
for k in sorted(en):
    if (k.startswith('resources.resourcehubmatrix.card') or 
        k.startswith('resources.engineeringdownloads.row') or 
        k.startswith('resources.technicalfaqaccordion.faq') or
        k.startswith('resources.featuredinsights.whitepaper')):
        if ko.get(k) == en.get(k):
            untranslated.append(k)
print(f'Untranslated in Korean: {len(untranslated)}')
for k in untranslated[:20]:
    print(f'  {k}')
if len(untranslated) > 20:
    print(f'  ... and {len(untranslated)-20} more')
